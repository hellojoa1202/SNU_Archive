// node make-sweeps.cjs — writes sweeps.json with the numbers section 4 shows first.
const fs = require('node:fs');
const path = require('node:path');
const B = require('./budget.js');
const out = {};
const t0 = Date.now();
for (const kind of Object.keys(B.SWEEP)) {
  out[kind] = { 0: [], 1: [] };
  for (const eta of [0, 1]) {
    for (const value of B.SWEEP[kind].values) {
      const r = B.runOnce(kind, value, eta);
      out[kind][eta].push(r);
      console.log(kind.padEnd(7), 'eta', eta, 'x', String(value).padEnd(6), 'tv', r.tv.toFixed(3), 'spread', r.spread.toFixed(3), 'ks', r.ks.toFixed(3));
    }
  }
}
out.meta = { count: B.COUNT, generated: new Date().toISOString().slice(0, 10), seconds: Math.round((Date.now() - t0) / 1000) };
fs.writeFileSync(path.join(__dirname, 'sweeps.json'), JSON.stringify(out));
console.log('wrote sweeps.json in', out.meta.seconds, 's');
