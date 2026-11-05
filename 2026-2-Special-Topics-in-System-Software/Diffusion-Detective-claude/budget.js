/* budget.js — the sweeps of section 4, shared by the browser (app.js) and by
 * make-sweeps.cjs, which stores the same numbers in sweeps.json so that the page
 * can show them before the visitor recomputes them. One knob per sweep; the other
 * two substitutions stay switched off. N = 2048 pieces per point. */
(function (root) {
  'use strict';
  const S = typeof module !== 'undefined' && module.exports ? require('./sampler.js') : root.BoardSampler;

  const SWEEP = {
    T: { values: [0.25, 0.35, 0.5, 0.7, 1, 1.4, 2, 2.8, 4], h: 1 / 128 },
    bias: { values: [0, 0.25, 0.5, 0.75, 1, 1.5, 2] },
    smooth: { values: [0, 0.002, 0.005, 0.01, 0.02, 0.03, 0.05, 0.07, 0.1] },
    nfe: { values: [8, 16, 32, 64, 128, 256, 512] },
  };
  const COUNT = 2048;

  /** Options of one run: the knob `kind` set to `value`, everything else exact. */
  function options(kind, value, eta) {
    const base = { eta, count: COUNT, exactStart: true, T: 1, solver: 'auto' };
    if (kind === 'T') return { ...base, T: value, exactStart: false, steps: Math.max(1, Math.round(value / SWEEP.T.h)) };
    if (kind === 'bias') return { ...base, steps: 128, error: { bias: [value, 0], smooth: 0 } };
    if (kind === 'smooth') return { ...base, steps: 128, error: { bias: [0, 0], smooth: value } };
    if (kind === 'nfe') return { ...base, steps: eta > 0 ? value : value / 2 };
    throw new RangeError('unknown sweep ' + kind);
  }

  function runOnce(kind, value, eta) {
    const run = S.run(options(kind, value, eta));
    return { x: value, tv: S.slotError(run.xs, run.ys).tv, spread: S.spread(run.xs, run.ys) / S.exactSpread(), ks: S.ksX(run.xs) };
  }

  function total() { return Object.values(SWEEP).reduce((s, k) => s + 2 * k.values.length, 0); }

  const api = { SWEEP, COUNT, options, runOnce, total };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BoardBudget = api;
})(globalThis);
