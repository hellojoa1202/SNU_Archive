// node --test sampler.test.cjs — the eta-family must reproduce the forward marginals when exact.
const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('./model.js');
const S = require('./sampler.js');

test('runs are reproducible, and the ODE ignores the noise seed', () => {
  const a = S.run({ T: 1, eta: 1, steps: 32, count: 64, noiseSeed: 1 });
  const b = S.run({ T: 1, eta: 1, steps: 32, count: 64, noiseSeed: 1 });
  const c = S.run({ T: 1, eta: 1, steps: 32, count: 64, noiseSeed: 2 });
  assert.deepEqual(Array.from(a.xs), Array.from(b.xs));
  assert.notDeepEqual(Array.from(a.xs), Array.from(c.xs));
  const d = S.run({ T: 1, eta: 0, steps: 32, count: 64, noiseSeed: 1 });
  const e = S.run({ T: 1, eta: 0, steps: 32, count: 64, noiseSeed: 2 });
  assert.deepEqual(Array.from(d.xs), Array.from(e.xs));
});

test('exact starts have the second moment of p_T', () => {
  const T = 0.8;
  const { xs, ys } = S.starts(60000, T, true, 9);
  let s = 0;
  for (let n = 0; n < xs.length; n++) s += xs[n] * xs[n] + ys[n] * ys[n];
  const expected = M.secondMoment() + 2 * M.G * M.G * T;
  assert.ok(Math.abs(s / xs.length - expected) < 0.03, `${s / xs.length} vs ${expected}`);
});

test('with everything exact, every eta reproduces the intermediate and final marginals', () => {
  for (const eta of [0, 0.5, 1]) {
    const r = S.run({ T: 1, eta, steps: 512, count: 3000, exactStart: true, snapshots: 4 });
    for (const frame of r.frames) {
      const ks = S.ksX(frame.xs, frame.t);
      assert.ok(ks < 0.045, `eta=${eta}, t=${frame.t.toFixed(2)}: KS ${ks.toFixed(3)}`);
    }
    const floor = S.slotError(S.exactDraws(3000).xs, S.exactDraws(3000).ys).tv;
    const tv = S.slotError(r.xs, r.ys).tv;
    assert.ok(tv < floor + 0.05, `eta=${eta}: slot TV ${tv.toFixed(3)} vs floor ${floor.toFixed(3)}`);
  }
});

test('a constant score bias shifts the final mean in its own direction', () => {
  const plain = S.run({ T: 1, eta: 0, steps: 128, count: 800 });
  const biased = S.run({ T: 1, eta: 0, steps: 128, count: 800, error: { bias: [1, 0], smooth: 0 } });
  const [mx0] = S.mean(plain.xs, plain.ys);
  const [mx1, my1] = S.mean(biased.xs, biased.ys);
  assert.ok(mx1 - mx0 > 0.1, `shift ${mx1 - mx0}`);
  assert.ok(Math.abs(my1) < 0.05);
});

test('score smoothing widens the final spread', () => {
  const sharp = S.run({ T: 1, eta: 0, steps: 128, count: 800 });
  const blurred = S.run({ T: 1, eta: 0, steps: 128, count: 800, error: { bias: [0, 0], smooth: 0.05 } });
  assert.ok(S.spread(blurred.xs, blurred.ys) > 1.5 * S.spread(sharp.xs, sharp.ys));
});

test('Heun costs two field evaluations per step; stochastic runs use Euler–Maruyama', () => {
  assert.equal(S.run({ eta: 0, steps: 10, count: 4 }).nfe, 20);
  assert.equal(S.run({ eta: 0, steps: 10, count: 4, solver: 'euler' }).nfe, 10);
  assert.equal(S.run({ eta: 1, steps: 10, count: 4 }).method, 'em');
  assert.throws(() => S.run({ eta: 0, steps: 0, count: 4 }), RangeError);
  assert.throws(() => S.run({ eta: -1, steps: 4, count: 4 }), RangeError);
  assert.throws(() => S.run({ eta: 1, steps: 4, count: 4, solver: 'heun' }), RangeError);
});
