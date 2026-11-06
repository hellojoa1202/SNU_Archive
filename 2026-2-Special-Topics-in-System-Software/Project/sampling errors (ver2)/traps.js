/* traps.js — drawing only, in the style of the original site: boxed plot areas with
 * light ticks, thin gray density contours, small dots, step histograms against a
 * dashed analytic curve. Nothing in here computes a sample (model.js / sampler.js). */
(function (root) {
  'use strict';
  const M = root.BoardModel;
  const BLUE = '#5076a6';
  const RED = '#ae4c54';
  const INK = '#17283e';
  const MUTED = '#6b7e91';
  const GRID = '#e5e9ee';
  const FONT = '10px -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans KR",Arial,sans-serif';

  /** Backing store sized to the CSS box; returns a context in CSS pixels. */
  function prepare(canvas) {
    const r = canvas.getBoundingClientRect();
    const d = Math.min(devicePixelRatio || 1, 2);
    const W = Math.round(r.width * d);
    const H = Math.round(r.height * d);
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    const c = canvas.getContext('2d');
    c.setTransform(d, 0, 0, d, 0, 0);
    c.fillStyle = '#fff';
    c.fillRect(0, 0, r.width, r.height);
    c.font = FONT;
    return { c, w: r.width, h: r.height };
  }

  /* ------------------------------------------------------------ scene frame */
  /** A boxed plot area in world coordinates with light tick labels, like the original scenes. */
  function frame(canvas, xlim = [-1.4, 1.4], ylim = [-1.05, 1.05]) {
    const f = prepare(canvas);
    const l = 34;
    const t = 14;
    const w = f.w - 48;
    const h = f.h - 42;
    const map = (x, y) => [l + (x - xlim[0]) / (xlim[1] - xlim[0]) * w, t + h - (y - ylim[0]) / (ylim[1] - ylim[0]) * h];
    const unmap = (px, py) => [xlim[0] + (px - l) / w * (xlim[1] - xlim[0]), ylim[0] + (t + h - py) / h * (ylim[1] - ylim[0])];
    const c = f.c;
    c.strokeStyle = GRID;
    c.lineWidth = 1;
    c.strokeRect(l + 0.5, t + 0.5, w, h);
    c.fillStyle = '#7e8b98';
    for (let i = 0; i <= 4; i++) {
      const x = xlim[0] + (xlim[1] - xlim[0]) * i / 4;
      const y = ylim[0] + (ylim[1] - ylim[0]) * i / 4;
      c.textAlign = 'center';
      c.fillText(x.toFixed(1), map(x, 0)[0], t + h + 15);
      c.textAlign = 'right';
      c.fillText(y.toFixed(1), l - 5, map(0, y)[1] + 3);
    }
    c.save();
    c.beginPath();
    c.rect(l, t, w, h);
    c.clip();
    return Object.assign(f, { map, unmap, l, t, w, h, xlim, ylim, scale: w / (xlim[1] - xlim[0]), end: () => c.restore() });
  }

  function point(canvas, e, xlim = [-1.4, 1.4], ylim = [-1.05, 1.05]) {
    const r = canvas.getBoundingClientRect();
    const l = 34; const t = 14; const w = r.width - 48; const h = r.height - 42;
    return [xlim[0] + (e.clientX - r.left - l) / w * (xlim[1] - xlim[0]), ylim[0] + (t + h - (e.clientY - r.top)) / h * (ylim[1] - ylim[0])];
  }

  function line(f, points, color = BLUE, width = 1, dash = []) {
    const c = f.c;
    c.save();
    c.strokeStyle = color;
    c.lineWidth = width;
    c.setLineDash(dash);
    c.beginPath();
    points.forEach((p, i) => { const q = f.map(p[0], p[1]); if (i) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); });
    c.stroke();
    c.restore();
  }

  function dot(f, p, color = BLUE, r = 2) {
    const q = f.map(p[0], p[1]);
    f.c.fillStyle = color;
    f.c.beginPath();
    f.c.arc(q[0], q[1], r, 0, Math.PI * 2);
    f.c.fill();
  }

  /* ---- thin gray density contours (marching squares on a cached grid) */
  let contourKey = '';
  let contourLines = [];
  function contours(f, t, levels = [0.15, 0.4, 0.7]) {
    const key = `${t.toFixed(4)}:${f.xlim}:${f.ylim}`;
    if (key !== contourKey) {
      contourKey = key;
      const nx = 96; const ny = 72;
      const vals = new Float64Array((nx + 1) * (ny + 1));
      let max = 0;
      const X = (i) => f.xlim[0] + i / nx * (f.xlim[1] - f.xlim[0]);
      const Y = (j) => f.ylim[0] + j / ny * (f.ylim[1] - f.ylim[0]);
      for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) { const v = M.density(X(i), Y(j), t); vals[j * (nx + 1) + i] = v; if (v > max) max = v; }
      contourLines = levels.map((frac) => {
        const level = max * frac;
        const segs = [];
        for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
          const pos = [[X(i), Y(j)], [X(i + 1), Y(j)], [X(i + 1), Y(j + 1)], [X(i), Y(j + 1)]];
          const v = [vals[j * (nx + 1) + i], vals[j * (nx + 1) + i + 1], vals[(j + 1) * (nx + 1) + i + 1], vals[(j + 1) * (nx + 1) + i]];
          const cross = [];
          for (let a = 0; a < 4; a++) {
            const b = (a + 1) % 4;
            if ((v[a] >= level) === (v[b] >= level)) continue;
            const u = (level - v[a]) / (v[b] - v[a]);
            cross.push([pos[a][0] + u * (pos[b][0] - pos[a][0]), pos[a][1] + u * (pos[b][1] - pos[a][1])]);
          }
          for (let a = 0; a + 1 < cross.length; a += 2) segs.push([cross[a], cross[a + 1]]);
        }
        return segs;
      });
    }
    const c = f.c;
    c.save();
    c.strokeStyle = '#d3dbe3';
    c.lineWidth = 0.9;
    c.beginPath();
    for (const segs of contourLines) for (const [a, b] of segs) { const p = f.map(a[0], a[1]); const q = f.map(b[0], b[1]); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); }
    c.stroke();
    c.restore();
  }

  /** Force arrows on a coarse grid; `error` selects the perturbed field. */
  function arrows(f, t, error = null, color = 'rgba(23,40,62,.4)') {
    const s = [0, 0];
    const spacing = 0.18; const gain = 0.05; const maxLen = 0.13;
    for (let y = f.ylim[0] + spacing / 2; y < f.ylim[1]; y += spacing) for (let x = f.xlim[0] + spacing / 2; x < f.xlim[1]; x += spacing) {
      if (error) M.perturbedScore(x, y, t, error, s); else M.score(x, y, t, s);
      let vx = s[0] * gain; let vy = s[1] * gain;
      const l = Math.hypot(vx, vy);
      if (l < 1e-6) continue;
      if (l > maxLen) { vx *= maxLen / l; vy *= maxLen / l; }
      const a = [x, y]; const b = [x + vx, y + vy];
      line(f, [a, b], color, 1);
      const pa = f.map(b[0], b[1]); const ang = Math.atan2(-(vy), vx);
      const c = f.c; c.strokeStyle = color; c.beginPath(); c.moveTo(pa[0] - 4 * Math.cos(ang - 0.5), pa[1] - 4 * Math.sin(ang - 0.5)); c.lineTo(pa[0], pa[1]); c.lineTo(pa[0] - 4 * Math.cos(ang + 0.5), pa[1] - 4 * Math.sin(ang + 0.5)); c.stroke();
    }
  }

  function dots(f, xs, ys, { color = BLUE, colors = null, r = 1.8, max = 600, offset = 0 } = {}) {
    const n = Math.min(xs.length, max);
    for (let i = offset; i < n; i++) dot(f, [xs[i], ys[i]], colors ? colors[i] : color, r);
    return n;
  }

  function startColors(xs, ys) {
    const out = new Array(xs.length);
    for (let n = 0; n < xs.length; n++) {
      const hue = (Math.atan2(ys[n], xs[n]) * 180 / Math.PI + 360) % 360;
      out[n] = `hsl(${hue.toFixed(0)} 45% 48%)`;
    }
    return out;
  }

  function trapContrast(t) {
    const [cx, cy] = M.centers[27];
    const c = (tt) => 1 - M.density(cx + M.CELL / 2, cy, tt) / M.density(cx, cy, tt);
    return Math.max(0, Math.min(1, c(t) / c(0)));
  }

  /* ---------------------------------------------------- projection chart */
  /** Step histograms of x against the analytic x-marginal (dashed), like the original. */
  function projection(canvas, groups, t, lo = -1.5, hi = 1.5, labels = {}) {
    const bins = hi - lo < 4 ? 72 : 40;
    const bw = (hi - lo) / bins;
    const hist = (xs) => { const n = new Array(bins).fill(0); for (const x of xs) { const i = Math.floor((x - lo) / bw); if (i >= 0 && i < bins) n[i]++; } return n.map((v) => v / xs.length / bw); };
    const ref = []; for (let i = 0; i <= 180; i++) { const x = lo + (hi - lo) * i / 180; ref.push([x, M.marginalX(x, t)]); }
    const hs = groups.map((g) => hist(g.xs));
    const max = Math.max(...hs.flat(), ...ref.map((p) => p[1])) * 1.25;
    const f = prepare(canvas);
    const l = 34; const top = 14; const w = f.w - 48; const h = f.h - 42;
    const X = (x) => l + (x - lo) / (hi - lo) * w;
    const Y = (y) => top + h - y / max * h;
    const c = f.c;
    c.strokeStyle = GRID; c.lineWidth = 1; c.fillStyle = '#7e8b98';
    for (let i = 0; i <= 4; i++) { const y = max * i / 4; c.beginPath(); c.moveTo(l, Y(y)); c.lineTo(l + w, Y(y)); c.stroke(); c.textAlign = 'right'; c.fillText(y.toFixed(1), l - 5, Y(y) + 3); const x = lo + (hi - lo) * i / 4; c.textAlign = 'center'; c.fillText(x.toFixed(1), X(x), top + h + 15); }
    c.strokeRect(l + 0.5, top + 0.5, w, h);
    hs.forEach((hh, gi) => { c.strokeStyle = groups[gi].color; c.lineWidth = 1.3; c.beginPath(); for (let i = 0; i < bins; i++) { const y = Y(hh[i]); if (i === 0) c.moveTo(X(lo), y); c.lineTo(X(lo + i * bw), y); c.lineTo(X(lo + (i + 1) * bw), y); } c.stroke(); });
    c.strokeStyle = '#263746'; c.lineWidth = 1.3; c.setLineDash([4, 3]); c.beginPath(); ref.forEach(([x, y], i) => (i ? c.lineTo(X(x), Y(y)) : c.moveTo(X(x), Y(y)))); c.stroke(); c.setLineDash([]);
    let ly = top + 14; c.textAlign = 'left';
    for (const g of groups) if (g.label) { c.fillStyle = g.color; c.fillText(g.label, l + 6, ly); ly += 14; }
    if (labels.ref) { c.fillStyle = '#263746'; c.fillText(labels.ref, l + 6, ly); }
    c.fillStyle = '#7e8b98'; c.textAlign = 'right'; c.fillText(labels.x || 'x', f.w - 12, f.h - 5);
  }

  /* ----------------------------------------------------------- line plot */
  function plot(canvas, series, o = {}) {
    const f = prepare(canvas);
    const l = o.marginLeft || 40; const right = f.w - 14; const top = 14; const bottom = f.h - 26;
    const fx = o.xlog ? Math.log10 : (v) => v;
    const fy = o.ylog ? Math.log10 : (v) => v;
    let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity;
    for (const s of series) for (const [x, y] of s.points) { if (!isFinite(fx(x)) || !isFinite(fy(y))) continue; xmin = Math.min(xmin, fx(x)); xmax = Math.max(xmax, fx(x)); ymin = Math.min(ymin, fy(y)); ymax = Math.max(ymax, fy(y)); }
    if (o.hline) { ymin = Math.min(ymin, fy(o.hline.y)); ymax = Math.max(ymax, fy(o.hline.y)); }
    if (o.xrange) { xmin = fx(o.xrange[0]); xmax = fx(o.xrange[1]); }
    if (o.yrange) { ymin = fy(o.yrange[0]); ymax = fy(o.yrange[1]); }
    if (!(xmax > xmin)) { xmin -= 1; xmax += 1; }
    if (!(ymax > ymin)) { ymin -= 1; ymax += 1; }
    if (!o.yrange) { const pad = (ymax - ymin) * 0.12; ymin -= (!o.ylog && ymin >= 0 && ymin < pad) ? ymin : pad; ymax += pad; }
    const X = (x) => l + (fx(x) - xmin) / (xmax - xmin) * (right - l);
    const Y = (y) => bottom - (fy(y) - ymin) / (ymax - ymin) * (bottom - top);
    const c = f.c;
    const fmt = (v) => (Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 1 ? String(+v.toFixed(2)) : Math.abs(v) >= 0.01 ? String(+v.toFixed(3)) : v.toExponential(0));
    const nice = (lo, hi) => { const span = hi - lo; const mag = 10 ** Math.floor(Math.log10(span / 3)); const n = span / 3 / mag; const step = mag * (n >= 5 ? 5 : n >= 2 ? 2 : 1); const out = []; for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(10)); return out; };
    const yticks = o.ylog ? (() => { const out = []; for (let e = Math.floor(ymin); e <= Math.ceil(ymax); e++) if (e >= ymin - 1e-9 && e <= ymax + 1e-9) out.push(10 ** e); return out; })() : nice(ymin, ymax);
    const xticks = o.xticks || (o.xlog ? (() => { const out = []; for (let e = Math.floor(xmin); e <= Math.ceil(xmax); e++) for (const m of [1, 2, 5]) { const v = m * 10 ** e; if (Math.log10(v) >= xmin - 1e-9 && Math.log10(v) <= xmax + 1e-9) out.push(v); } return out; })() : [0, 1, 2, 3, 4].map((i) => xmin + (xmax - xmin) * i / 4));
    c.strokeStyle = GRID; c.lineWidth = 1; c.fillStyle = '#7e8b98';
    for (const v of yticks) { c.beginPath(); c.moveTo(l, Y(v)); c.lineTo(right, Y(v)); c.stroke(); c.textAlign = 'right'; c.fillText(fmt(v), l - 5, Y(v) + 3); }
    c.textAlign = 'center';
    for (const v of xticks) c.fillText(fmt(v), X(v), bottom + 14);
    c.strokeRect(l + 0.5, top + 0.5, right - l, bottom - top);
    if (o.hline) { c.strokeStyle = '#9aa8b6'; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(l, Y(o.hline.y)); c.lineTo(right, Y(o.hline.y)); c.stroke(); c.setLineDash([]); if (o.hline.label) { c.fillStyle = '#8a98a8'; c.textAlign = 'right'; c.fillText(o.hline.label, right - 4, Y(o.hline.y) - 4); } }
    if (o.vline !== undefined) { c.strokeStyle = '#c3ccd6'; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(o.vline), top); c.lineTo(X(o.vline), bottom); c.stroke(); c.setLineDash([]); }
    c.save(); c.beginPath(); c.rect(l, top, right - l, bottom - top); c.clip();
    for (const s of series) {
      c.strokeStyle = s.color || BLUE; c.fillStyle = s.color || BLUE; c.lineWidth = s.width || 1.5; c.setLineDash(s.dash || []);
      c.beginPath(); let pen = false;
      for (const [x, y] of s.points) { if (!isFinite(fx(x)) || !isFinite(fy(y))) { pen = false; continue; } if (pen) c.lineTo(X(x), Y(y)); else c.moveTo(X(x), Y(y)); pen = true; }
      c.stroke(); c.setLineDash([]);
      if (s.marker) for (const [x, y] of s.points) { if (!isFinite(fx(x)) || !isFinite(fy(y))) continue; c.beginPath(); c.arc(X(x), Y(y), 2.3, 0, 2 * Math.PI); c.fill(); }
    }
    c.restore();
    let ly = top + 14; c.textAlign = 'left';
    for (const s of series) if (s.label) { c.fillStyle = s.color || BLUE; c.fillText(s.label, l + 6, ly); ly += 14; }
    c.fillStyle = '#7e8b98';
    if (o.xlabel) { c.textAlign = 'right'; c.fillText(o.xlabel, right, f.h - 5); }
  }

  root.Traps = { frame, point, line, dot, contours, arrows, dots, startColors, trapContrast, projection, plot, BLUE, RED, INK, MUTED };
})(globalThis);
