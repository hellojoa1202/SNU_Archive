/* sampler.js — the eta-family of generative processes, run on the toy model.
 *
 * Lecture 3 writes one line of samplers that all share the forward marginals:
 *   dx = [ f - (1 + eta^2)/2 g^2 grad log p_t ] dt + eta g dw,  run from t = T down to 0.
 * eta = 1 is the reverse-time SDE, eta = 0 the probability flow ODE. With f = 0 and
 * g = 1 a backward step of size h reads
 *   x <- x + (1 + eta^2)/2 * s(x, t) * h + eta * sqrt(h) * z.
 *
 * Three substitutions turn the exact statement into a sampler, and they are the
 * knobs of this module:
 *   1. the start: N(0, T I) in place of p_T          (opts.exactStart = false)
 *   2. the score: perturbedScore in place of score  (opts.error = {bias, smooth})
 *   3. the grid:  Euler–Maruyama / Euler / Heun with opts.steps steps.
 */
(function (root) {
  'use strict';

  const M = typeof module !== 'undefined' && module.exports ? require('./model.js') : root.BoardModel;

  /** Deterministic generator (sfc32) so that every panel can replay the same noise. */
  function rng(seed) {
    let a = 0x9e3779b9 ^ (seed >>> 0);
    let b = 0x243f6a88 + Math.imul(seed >>> 0, 0x85ebca6b);
    let c = 0xb7e15162 ^ Math.imul(seed >>> 0, 0xc2b2ae35);
    let d = 1;
    const next = () => {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
      let t = (a + b) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      d = (d + 1) | 0;
      t = (t + d) | 0;
      c = (c + t) | 0;
      return ((t >>> 0) + 0.5) / 4294967296;
    };
    for (let i = 0; i < 12; i++) next(); // warm up
    return next;
  }

  function normalPair(r) {
    const u = Math.sqrt(-2 * Math.log(r()));
    const a = 2 * Math.PI * r();
    return [u * Math.cos(a), u * Math.sin(a)];
  }

  /**
   * Initial points of the generation run.
   *   exact : draw from p_T itself (pick a slot, add N(0, (tau^2 + T) I))
   *   prior : draw from N(0, T I), the Gaussian that sampling uses for p_T
   */
  function starts(count, T, exact, seed) {
    const r = rng(seed);
    const xs = new Float64Array(count);
    const ys = new Float64Array(count);
    const sd = Math.sqrt(exact ? M.variance(T) : M.G * M.G * T);
    for (let n = 0; n < count; n++) {
      const [z1, z2] = normalPair(r);
      // The first K points are the tracked pieces: with an exact start, piece k is
      // drawn from component k, so its tile is also its true origin. Afterwards the
      // component is drawn at random, as the mixture requires.
      const k = exact ? (n < M.K ? n : Math.floor(r() * M.K)) : -1;
      if (exact) {
        xs[n] = M.centers[k][0] + sd * z1;
        ys[n] = M.centers[k][1] + sd * z2;
      } else {
        xs[n] = sd * z1;
        ys[n] = sd * z2;
      }
    }
    return { xs, ys };
  }

  /** Brownian paths of the 48 pieces under the forward process dx = dw, for the shaking scene. */
  function shakePaths(steps = 160, seed = 3) {
    const r = rng(seed);
    const h = 1 / steps;
    return M.centers.map(([x, y]) => {
      const path = [[x, y]];
      for (let k = 0; k < steps; k++) { const [z1, z2] = normalPair(r); x += Math.sqrt(h) * z1; y += Math.sqrt(h) * z2; path.push([x, y]); }
      return path;
    });
  }

  /**
   * Integrate the eta-family backward from T to 0.
   * Returns final positions, the start positions, and the full path of the first
   * `opts.trackPaths` particles (for drawing).
   */
  function run(opts) {
    const {
      T = 1, eta = 1, steps = 128, solver = 'auto', count = 1024,
      startSeed = 11, noiseSeed = 23, exactStart = true,
      error = { bias: [0, 0], smooth: 0 }, trackPaths = 0, snapshots = 0,
    } = opts;
    if (!(steps >= 1) || !Number.isInteger(steps)) throw new RangeError('steps must be a positive integer');
    if (!(T > 0)) throw new RangeError('T must be positive');
    if (!(eta >= 0)) throw new RangeError('eta must be non-negative');

    // eta > 0 is a stochastic equation: only Euler–Maruyama is offered. eta = 0 is an
    // ODE and may use Euler or Heun; 'auto' means Euler–Maruyama / Heun respectively.
    if (!['auto', 'em', 'euler', 'heun'].includes(solver)) throw new RangeError('unknown solver ' + solver);
    if (eta > 0 && solver !== 'auto' && solver !== 'em') throw new RangeError('a stochastic run (eta > 0) only offers Euler–Maruyama');
    if (eta === 0 && solver === 'em') throw new RangeError('Euler–Maruyama needs eta > 0');
    const method = eta > 0 ? 'em' : (solver === 'auto' ? 'heun' : solver);

    const start = starts(count, T, exactStart, startSeed);
    const xs = Float64Array.from(start.xs);
    const ys = Float64Array.from(start.ys);
    const r = rng(noiseSeed);
    const h = T / steps;
    const drift = (1 + eta * eta) / 2 * M.G * M.G;
    const noise = eta * M.G * Math.sqrt(h);
    const s = [0, 0];
    const s2 = [0, 0];

    const paths = [];
    for (let n = 0; n < trackPaths && n < count; n++) paths.push([[xs[n], ys[n]]]);
    // Snapshots are taken on a cubic grid of times, t_j = T (1 - j/J)^3, so that the
    // final sharpening near t = 0 gets as many frames as the long featureless approach.
    const frames = [];
    const targets = [];
    for (let j = 1; j <= snapshots; j++) targets.push(T * Math.pow(1 - j / snapshots, 3));
    let nextTarget = 0;
    if (snapshots > 0) frames.push({ t: T, xs: Float64Array.from(xs), ys: Float64Array.from(ys) });

    for (let k = 0; k < steps; k++) {
      const t = T - k * h;
      for (let n = 0; n < count; n++) {
        M.perturbedScore(xs[n], ys[n], t, error, s);
        if (method === 'heun') {
          const px = xs[n] + h * drift * s[0];
          const py = ys[n] + h * drift * s[1];
          M.perturbedScore(px, py, t - h, error, s2);
          xs[n] += h * drift * (s[0] + s2[0]) / 2;
          ys[n] += h * drift * (s[1] + s2[1]) / 2;
        } else {
          xs[n] += h * drift * s[0];
          ys[n] += h * drift * s[1];
          if (method === 'em') {
            const [z1, z2] = normalPair(r);
            xs[n] += noise * z1;
            ys[n] += noise * z2;
          }
        }
        if (n < paths.length) paths[n].push([xs[n], ys[n]]);
      }
      const reached = Math.max(0, t - h);
      while (nextTarget < targets.length && (reached <= targets[nextTarget] + 1e-12 || k === steps - 1)) {
        frames.push({ t: reached, xs: Float64Array.from(xs), ys: Float64Array.from(ys) });
        nextTarget++;
      }
    }
    return {
      xs, ys, startXs: start.xs, startYs: start.ys, paths, frames,
      method, nfe: method === 'heun' ? 2 * steps : steps, h,
    };
  }

  /** Empirical slot frequencies: the fraction of points nearest to each slot. */
  function slotFrequencies(xs, ys) {
    const f = new Float64Array(M.K);
    for (let n = 0; n < xs.length; n++) f[M.slotOf(xs[n], ys[n])] += 1 / xs.length;
    return f;
  }

  /** Total variation between slot frequencies and the exact slot masses of p_t. */
  function slotError(xs, ys, t = 0) {
    const f = slotFrequencies(xs, ys);
    const m = M.slotMasses(t);
    let tv = 0;
    for (let k = 0; k < M.K; k++) tv += Math.abs(f[k] - m[k]);
    return { tv: tv / 2, frequencies: f, masses: m };
  }

  /** Root-mean-square distance from each point to the center of its nearest slot. */
  function spread(xs, ys) {
    let sum = 0;
    for (let i = 0; i < xs.length; i++) {
      const k = M.slotOf(xs[i], ys[i]);
      const dx = xs[i] - M.centers[k][0];
      const dy = ys[i] - M.centers[k][1];
      sum += dx * dx + dy * dy;
    }
    return Math.sqrt(sum / xs.length);
  }

  /** Kolmogorov–Smirnov distance between the empirical x-marginal and the exact one at time t. */
  function ksX(xs, t = 0) {
    const sorted = Float64Array.from(xs).sort();
    let d = 0;
    const n = sorted.length;
    for (let i = 0; i < n; i++) {
      const c = M.marginalCDF(sorted[i], t);
      d = Math.max(d, Math.abs(i / n - c), Math.abs((i + 1) / n - c));
    }
    return d;
  }

  /** Exact draws from p_0 with the same count: the floor every metric has at finite sample size. */
  function exactDraws(count, seed = 5) {
    return starts(count, 0, true, seed);
  }

  /** The spread of p_0 itself, from 20 000 exact draws (memoised). */
  let exactSpreadValue = null;
  function exactSpread() {
    if (exactSpreadValue === null) { const d = exactDraws(20000, 5); exactSpreadValue = spread(d.xs, d.ys); }
    return exactSpreadValue;
  }

  /** Mean of the final positions, used to read off a bias-induced shift. */
  function mean(xs, ys) {
    let mx = 0;
    let my = 0;
    for (let n = 0; n < xs.length; n++) { mx += xs[n]; my += ys[n]; }
    return [mx / xs.length, my / ys.length];
  }

  const api = { rng, starts, shakePaths, run, slotFrequencies, slotError, spread, ksX, exactDraws, exactSpread, mean };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BoardSampler = api;
})(globalThis);
