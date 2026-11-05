// node --test model.test.cjs — checks the closed forms against quadrature and finite differences.
const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('./model.js');

function integrate2D(f, half, n) {
  const h = 2 * half / n;
  let s = 0;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) s += f(-half + (i + 0.5) * h, -half + (j + 0.5) * h);
  return s * h * h;
}

test('the marginal density integrates to one at several times', () => {
  for (const t of [0, 0.3, 1.5]) {
    const mass = integrate2D((x, y) => M.density(x, y, t), 4.5 * Math.sqrt(M.variance(t)) + 1, 260);
    assert.ok(Math.abs(mass - 1) < 2e-3, `t=${t}: mass ${mass}`);
  }
});

test('the score is the gradient of the log-density', () => {
  const out = [0, 0];
  const eps = 1e-5;
  for (const [x, y, t] of [[0.1, -0.2, 0.05], [0.7, 0.4, 0.4], [-1.3, 0.9, 1.2]]) {
    M.score(x, y, t, out);
    const gx = (M.logDensity(x + eps, y, t) - M.logDensity(x - eps, y, t)) / (2 * eps);
    const gy = (M.logDensity(x, y + eps, t) - M.logDensity(x, y - eps, t)) / (2 * eps);
    assert.ok(Math.abs(out[0] - gx) < 1e-4 * (1 + Math.abs(gx)), `x-component at (${x},${y},${t})`);
    assert.ok(Math.abs(out[1] - gy) < 1e-4 * (1 + Math.abs(gy)), `y-component at (${x},${y},${t})`);
  }
});

test('the marginals solve the heat equation d_t p = (1/2) g^2 Laplacian p', () => {
  const dt = 1e-4;
  const dx = 1e-3;
  for (const [x, y, t] of [[0.05, 0.1, 0.2], [0.5, -0.3, 0.6], [0.11, 0.11, 0.02]]) {
    const lhs = (M.density(x, y, t + dt) - M.density(x, y, t - dt)) / (2 * dt);
    const lap = (M.density(x + dx, y, t) + M.density(x - dx, y, t) + M.density(x, y + dx, t) + M.density(x, y - dx, t) - 4 * M.density(x, y, t)) / (dx * dx);
    const rhs = 0.5 * M.G * M.G * lap;
    assert.ok(Math.abs(lhs - rhs) < 2e-2 * (1 + Math.abs(rhs)), `at (${x},${y},${t}): ${lhs} vs ${rhs}`);
  }
});

test('slot masses form a probability vector and are uniform on the data', () => {
  for (const t of [0, 0.1, 2]) {
    const m = M.slotMasses(t);
    const total = m.reduce((a, b) => a + b, 0);
    assert.ok(Math.abs(total - 1) < 1e-9, `t=${t}: total ${total}`);
  }
  const m0 = M.slotMasses(0);
  for (const v of m0) assert.ok(Math.abs(v - 1 / M.K) < 1e-3, `uniform at t=0, got ${v}`);
});

test('slot masses agree with Monte Carlo slot frequencies of exact draws', () => {
  const S = require('./sampler.js');
  const { xs, ys } = S.starts(40000, 0.5, true, 3);
  const f = S.slotFrequencies(xs, ys);
  const m = M.slotMasses(0.5);
  let tv = 0;
  for (let k = 0; k < M.K; k++) tv += Math.abs(f[k] - m[k]);
  assert.ok(tv / 2 < 0.02, `total variation ${tv / 2}`);
});

test('the lecture KL bound dominates the numerical KL and both fall with T', () => {
  let previous = Infinity;
  for (const T of [0.25, 0.5, 1, 2, 4]) {
    const kl = M.klNumeric(T, 120);
    assert.ok(kl >= 0, `KL must be non-negative, got ${kl}`);
    assert.ok(kl <= M.klBound(T), `T=${T}: numeric ${kl} exceeds bound ${M.klBound(T)}`);
    assert.ok(kl < previous, `KL should decrease in T`);
    previous = kl;
  }
});

test('x-marginal CDF is the integral of the x-marginal density', () => {
  const t = 0.3;
  const eps = 1e-4;
  for (const x of [-0.5, 0, 0.8]) {
    const slope = (M.marginalCDF(x + eps, t) - M.marginalCDF(x - eps, t)) / (2 * eps);
    assert.ok(Math.abs(slope - M.marginalX(x, t)) < 1e-3, `at x=${x}`);
  }
  assert.ok(M.marginalCDF(-50, t) < 1e-9 && M.marginalCDF(50, t) > 1 - 1e-9);
});

test('perturbed score: smoothing reads a later time, bias adds a constant', () => {
  const a = [0, 0];
  const b = [0, 0];
  M.perturbedScore(0.3, -0.1, 0.2, { smooth: 0.05, bias: [0.4, -0.2] }, a);
  M.score(0.3, -0.1, 0.25, b);
  assert.ok(Math.abs(a[0] - (b[0] + 0.4)) < 1e-12 && Math.abs(a[1] - (b[1] - 0.2)) < 1e-12);
  M.perturbedScore(0.3, -0.1, 0.2, {}, a);
  M.score(0.3, -0.1, 0.2, b);
  assert.deepEqual(a, b);
});
