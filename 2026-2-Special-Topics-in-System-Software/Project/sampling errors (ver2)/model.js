/* model.js — the analytic toy behind every panel.
 *
 * Data distribution: an equal-weight mixture of K = 48 isotropic Gaussians whose
 * centers sit on an 8 x 6 grid (the slots of the puzzle board). Forward process:
 * the variance-exploding SDE dx = g dw with g = 1, so the perturbation kernel is
 * N(x0, t I) and the marginal p_t is the same mixture with variance tau^2 + t.
 * Everything below — density, score, log-density, KL to the Gaussian prior, exact
 * slot masses — is evaluated in closed form or by quadrature. No network is used.
 *
 * Time convention: the diffusion clock. t = 0 is data, t = T is the noisy end.
 */
(function (root) {
  'use strict';

  const COLUMNS = 8;
  const ROWS = 6;
  const CELL = 0.22;      // slot pitch; the board spans [-0.88, 0.88] x [-0.66, 0.66]
  const TAU = 0.06;       // within-slot standard deviation of the data
  const G = 1;            // diffusion coefficient of dx = g dw

  const centers = [];
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLUMNS; i++) {
      centers.push([(i - (COLUMNS - 1) / 2) * CELL, (j - (ROWS - 1) / 2) * CELL]);
    }
  }
  const K = centers.length;
  const cx = Float64Array.from(centers, (c) => c[0]);
  const cy = Float64Array.from(centers, (c) => c[1]);
  const board = {
    left: -COLUMNS * CELL / 2, right: COLUMNS * CELL / 2,
    bottom: -ROWS * CELL / 2, top: ROWS * CELL / 2,
  };

  /** Variance of each mixture component at diffusion time t. */
  function variance(t) {
    return TAU * TAU + G * G * t;
  }

  /** Signal-to-noise ratio of the forward process at time t (lecture 3, SNR = E^2 / P). */
  function snr(t) {
    return 1 / (G * G * t);
  }

  /** Posterior weights w_k(x,t) of the components given x, plus the shared log-normaliser. */
  function responsibilities(x, y, t, out) {
    const v = variance(t);
    let top = -Infinity;
    for (let k = 0; k < K; k++) {
      const dx = x - cx[k];
      const dy = y - cy[k];
      out[k] = -(dx * dx + dy * dy) / (2 * v);
      if (out[k] > top) top = out[k];
    }
    let z = 0;
    for (let k = 0; k < K; k++) {
      out[k] = Math.exp(out[k] - top);
      z += out[k];
    }
    for (let k = 0; k < K; k++) out[k] /= z;
    return { top, z, v };
  }

  const scratch = new Float64Array(K);

  /** Marginal density p_t(x). */
  function density(x, y, t) {
    const { top, z, v } = responsibilities(x, y, t, scratch);
    return Math.exp(top) * z / (K * 2 * Math.PI * v);
  }

  /** log p_t(x), evaluated stably. */
  function logDensity(x, y, t) {
    const { top, z, v } = responsibilities(x, y, t, scratch);
    return top + Math.log(z) - Math.log(K * 2 * Math.PI * v);
  }

  /** Exact score: grad log p_t(x) = sum_k w_k (mu_k - x) / v. Written into `out` = [sx, sy]. */
  function score(x, y, t, out) {
    const { v } = responsibilities(x, y, t, scratch);
    let sx = 0;
    let sy = 0;
    for (let k = 0; k < K; k++) {
      sx += scratch[k] * (cx[k] - x);
      sy += scratch[k] * (cy[k] - y);
    }
    out[0] = sx / v;
    out[1] = sy / v;
    return out;
  }

  /**
   * The score a sampler is given. `error.smooth` evaluates the score of p_{t+delta}
   * instead of p_t (a map blurrier than the board); `error.bias` adds a constant
   * vector (a tilted board). Both are zero for the exact score.
   */
  function perturbedScore(x, y, t, error, out) {
    score(x, y, t + (error.smooth || 0), out);
    if (error.bias) {
      out[0] += error.bias[0];
      out[1] += error.bias[1];
    }
    return out;
  }

  /** Mean squared norm of a data point, E||x0||^2 = mean ||mu_k||^2 + 2 tau^2. */
  function secondMoment() {
    let s = 0;
    for (let k = 0; k < K; k++) s += cx[k] * cx[k] + cy[k] * cy[k];
    return s / K + 2 * TAU * TAU;
  }

  /** Lecture 3's bound: KL(p_T || N(0, P(T) I)) <= (1/2) SNR(T) E||x0||^2, with P(T) = g^2 T. */
  function klBound(T) {
    return 0.5 * snr(T) * secondMoment();
  }

  /** KL(p_T || N(0, g^2 T I)) by midpoint quadrature on a square grid. */
  function klNumeric(T, n = 140) {
    const pv = G * G * T;
    const half = 4.2 * Math.sqrt(variance(T) + 0.55);
    const h = 2 * half / n;
    let kl = 0;
    for (let j = 0; j < n; j++) {
      const y = -half + (j + 0.5) * h;
      for (let i = 0; i < n; i++) {
        const x = -half + (i + 0.5) * h;
        const lp = logDensity(x, y, T);
        const lq = -(x * x + y * y) / (2 * pv) - Math.log(2 * Math.PI * pv);
        kl += Math.exp(lp) * (lp - lq);
      }
    }
    return kl * h * h;
  }

  /** Standard normal CDF (Abramowitz–Stegun 7.1.26, absolute error below 1e-7). */
  function normalCDF(z) {
    const a = Math.abs(z) / Math.SQRT2;
    const t = 1 / (1 + 0.3275911 * a);
    const poly = ((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592;
    const erf = 1 - poly * t * Math.exp(-a * a);
    return 0.5 * (1 + (z < 0 ? -erf : erf));
  }

  /**
   * Index of the slot nearest to (x, y). The slots partition the whole plane: the
   * outer row and column extend to infinity, so a point far off the board still
   * belongs to the nearest edge slot. Nothing is ever "outside".
   */
  function slotOf(x, y) {
    const i = Math.min(COLUMNS - 1, Math.max(0, Math.floor((x - board.left) / CELL)));
    const j = Math.min(ROWS - 1, Math.max(0, Math.floor((y - board.bottom) / CELL)));
    return j * COLUMNS + i;
  }

  /**
   * Exact probability mass of p_t in each slot cell. Because the components are
   * isotropic, the integral over a cell factorises into two normal CDF differences;
   * the outer cells use -infinity / +infinity as their outer edge.
   */
  function slotMasses(t) {
    const s = Math.sqrt(variance(t));
    const masses = new Float64Array(K);
    const edgeX = (i) => (i <= 0 ? -Infinity : i >= COLUMNS ? Infinity : board.left + i * CELL);
    const edgeY = (j) => (j <= 0 ? -Infinity : j >= ROWS ? Infinity : board.bottom + j * CELL);
    for (let k = 0; k < K; k++) {
      const i = k % COLUMNS;
      const j = Math.floor(k / COLUMNS);
      let m = 0;
      for (let c = 0; c < K; c++) {
        const px = normalCDF((edgeX(i + 1) - cx[c]) / s) - normalCDF((edgeX(i) - cx[c]) / s);
        const py = normalCDF((edgeY(j + 1) - cy[c]) / s) - normalCDF((edgeY(j) - cy[c]) / s);
        m += px * py;
      }
      masses[k] = m / K;
    }
    return masses;
  }

  /** x-marginal density of p_t (the mixture is isotropic, so it is one-dimensional in closed form). */
  function marginalX(x, t) {
    const v = variance(t);
    let s = 0;
    for (let k = 0; k < K; k++) {
      const d = x - cx[k];
      s += Math.exp(-d * d / (2 * v));
    }
    return s / (K * Math.sqrt(2 * Math.PI * v));
  }

  /** x-marginal CDF of p_t. */
  function marginalCDF(x, t) {
    const s = Math.sqrt(variance(t));
    let c = 0;
    for (let k = 0; k < K; k++) c += normalCDF((x - cx[k]) / s);
    return c / K;
  }

  const api = {
    K, COLUMNS, ROWS, CELL, TAU, G, centers, board,
    variance, snr, density, logDensity, score, perturbedScore,
    secondMoment, klBound, klNumeric, normalCDF, slotOf, slotMasses,
    marginalX, marginalCDF,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BoardModel = api;
})(globalThis);
