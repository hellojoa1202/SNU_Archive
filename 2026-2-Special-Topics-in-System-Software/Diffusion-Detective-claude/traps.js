/* traps.js — drawing only. One coordinate window; the light field p_t as soft
 * intensity contours, the 48 trap sites, particles as dots, trails, force arrows,
 * and two small charts. Nothing in here computes a sample (model.js / sampler.js). */
(function (root) {
  'use strict';
  const M = root.BoardModel;
  const BLUE = '#6085ad';
  const RED = '#ae4c54';
  const INK = '#17283e';
  const MUTED = '#6b7e91';
  const WINDOW = { x0: -1.15, x1: 1.15, y0: -0.85, y1: 0.85 };

  /** Size the canvas, clear it white and return a frame whose context is in world units (y up). */
  function frame(canvas) {
    const r = canvas.getBoundingClientRect();
    const d = Math.min(devicePixelRatio || 1, 2);
    const W = Math.round(r.width * d);
    const H = Math.round(r.height * d);
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    const c = canvas.getContext('2d');
    const scale = Math.min((r.width - 16) / (WINDOW.x1 - WINDOW.x0), (r.height - 16) / (WINDOW.y1 - WINDOW.y0));
    c.setTransform(d, 0, 0, d, 0, 0);
    c.fillStyle = '#fff';
    c.fillRect(0, 0, r.width, r.height);
    c.translate(r.width / 2, r.height / 2);
    c.scale(scale, -scale);
    return { c, scale, w: r.width, h: r.height, d };
  }

  function point(canvas, e) {
    const r = canvas.getBoundingClientRect();
    const scale = Math.min((r.width - 16) / (WINDOW.x1 - WINDOW.x0), (r.height - 16) / (WINDOW.y1 - WINDOW.y0));
    return [(e.clientX - r.left - r.width / 2) / scale, -(e.clientY - r.top - r.height / 2) / scale];
  }

  function line(f, points, color = BLUE, width = 1, dash = []) {
    const { c, scale } = f;
    c.save();
    c.strokeStyle = color;
    c.lineWidth = width / scale;
    c.setLineDash(dash.map((v) => v / scale));
    c.beginPath();
    points.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])));
    c.stroke();
    c.restore();
  }

  function dot(f, p, color = BLUE, r = 2.2, stroke = null) {
    const { c, scale } = f;
    c.fillStyle = color;
    c.beginPath();
    c.arc(p[0], p[1], r / scale, 0, Math.PI * 2);
    c.fill();
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = 0.8 / scale; c.stroke(); }
  }

  function text(f, label, p, color = MUTED, size = 10, align = 'left') {
    const { c, scale, d } = f;
    c.save();
    c.setTransform(d, 0, 0, d, 0, 0);
    c.fillStyle = color;
    c.font = `${size}px -apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans KR',Arial,sans-serif`;
    c.textAlign = align;
    c.textBaseline = 'middle';
    c.fillText(label, f.w / 2 + p[0] * scale, f.h / 2 - p[1] * scale);
    c.restore();
  }

  /** The 48 trap sites as small crosses; `alpha` fades them. */
  function sites(f, alpha = 1) {
    const { c, scale } = f;
    const s = 0.02;
    c.save();
    c.globalAlpha = alpha;
    c.strokeStyle = '#9fb0c2';
    c.lineWidth = 0.8 / scale;
    c.beginPath();
    for (const [x, y] of M.centers) { c.moveTo(x - s, y); c.lineTo(x + s, y); c.moveTo(x, y - s); c.lineTo(x, y + s); }
    c.stroke();
    c.restore();
  }

  /* ---- intensity contours: outline lines plus a faint fill of the brightest band */
  let contourKey = '';
  let contourLines = [];
  let brightCells = [];
  const LEVELS = [0.08, 0.2, 0.4, 0.65, 0.88];
  function contours(f, t, intensity = 1) {
    const key = t.toFixed(4);
    if (key !== contourKey) {
      contourKey = key;
      const nx = 96;
      const ny = 72;
      const vals = new Float64Array((nx + 1) * (ny + 1));
      let max = 0;
      const X = (i) => WINDOW.x0 + i / nx * (WINDOW.x1 - WINDOW.x0);
      const Y = (j) => WINDOW.y0 + j / ny * (WINDOW.y1 - WINDOW.y0);
      for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) { const v = M.density(X(i), Y(j), t); vals[j * (nx + 1) + i] = v; if (v > max) max = v; }
      contourLines = LEVELS.map((frac) => {
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
      brightCells = [];
      const level = max * LEVELS[2];
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const v = (vals[j * (nx + 1) + i] + vals[j * (nx + 1) + i + 1] + vals[(j + 1) * (nx + 1) + i + 1] + vals[(j + 1) * (nx + 1) + i]) / 4;
        if (v >= level) brightCells.push([X(i), Y(j), X(i + 1) - X(i), Y(j + 1) - Y(j), Math.min(1, (v - level) / (max - level + 1e-12))]);
      }
    }
    const { c, scale } = f;
    c.save();
    // soft glow where the light is brightest
    for (const [x, y, w, h, a] of brightCells) { c.fillStyle = `rgba(96,133,173,${(0.05 + 0.13 * a) * intensity})`; c.fillRect(x, y, w + 0.002, h + 0.002); }
    const colors = ['#dde6ee', '#c6d5e2', '#a9bfd3', '#86a5c2', '#6085ad'];
    c.lineWidth = 0.9 / scale;
    c.globalAlpha = intensity;
    contourLines.forEach((segs, i) => {
      c.strokeStyle = colors[i];
      c.beginPath();
      for (const [a, b] of segs) { c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); }
      c.stroke();
    });
    c.restore();
  }

  /** Force arrows on a coarse grid: the exact score, or the perturbed one when `error` is given. */
  function arrows(f, t, error = null, color = 'rgba(23,40,62,.45)') {
    const s = [0, 0];
    const spacing = 0.16;
    const gain = 0.045;
    const maxLen = 0.12;
    for (let y = WINDOW.y0 + spacing / 2; y < WINDOW.y1; y += spacing) for (let x = WINDOW.x0 + spacing / 2; x < WINDOW.x1; x += spacing) {
      if (error) M.perturbedScore(x, y, t, error, s); else M.score(x, y, t, s);
      let vx = s[0] * gain;
      let vy = s[1] * gain;
      const l = Math.hypot(vx, vy);
      if (l < 1e-6) continue;
      if (l > maxLen) { vx *= maxLen / l; vy *= maxLen / l; }
      const end = [x + vx, y + vy];
      line(f, [[x, y], end], color, 1);
      const a = Math.atan2(vy, vx);
      const r = 4 / f.scale;
      line(f, [[end[0] - r * Math.cos(a - 0.5), end[1] - r * Math.sin(a - 0.5)], end, [end[0] - r * Math.cos(a + 0.5), end[1] - r * Math.sin(a + 0.5)]], color, 1);
    }
  }

  /** Particle dots; at most `max` are drawn, metrics always use every sample. */
  function dots(f, xs, ys, { color = BLUE, colors = null, r = 2, max = 600 } = {}) {
    const n = Math.min(xs.length, max);
    for (let i = 0; i < n; i++) dot(f, [xs[i], ys[i]], colors ? colors[i] : color, r, 'rgba(255,255,255,.85)');
    return n;
  }

  function startColors(xs, ys) {
    const out = new Array(xs.length);
    for (let n = 0; n < xs.length; n++) {
      const hue = (Math.atan2(ys[n], xs[n]) * 180 / Math.PI + 360) % 360;
      const light = 40 + 30 * Math.min(1, Math.hypot(xs[n], ys[n]) / 2.2);
      out[n] = `hsl(${hue.toFixed(0)} 52% ${light.toFixed(0)}%)`;
    }
    return out;
  }

  /** How distinct a trap still is at time t: intensity contrast centre vs. mid-way to the neighbour, relative to t = 0. */
  function trapContrast(t) {
    const [cx, cy] = M.centers[27];
    const c = (tt) => 1 - M.density(cx + M.CELL / 2, cy, tt) / M.density(cx, cy, tt);
    return Math.max(0, Math.min(1, c(t) / c(0)));
  }

  /* ---- charts in screen space */
  function chartFrame(canvas) {
    const r = canvas.getBoundingClientRect();
    const d = Math.min(devicePixelRatio || 1, 2);
    const W = Math.round(r.width * d);
    const H = Math.round(r.height * d);
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    const c = canvas.getContext('2d');
    c.setTransform(d, 0, 0, d, 0, 0);
    c.fillStyle = '#fff';
    c.fillRect(0, 0, r.width, r.height);
    c.font = '10px -apple-system,BlinkMacSystemFont,Arial,sans-serif';
    return { c, w: r.width, h: r.height };
  }

  function bars(canvas, frequencies, masses, labels = {}) {
    const { c, w, h } = chartFrame(canvas);
    const left = 36; const right = w - 10; const top = 14; const bottom = h - 22;
    let max = 0;
    for (let k = 0; k < frequencies.length; k++) max = Math.max(max, frequencies[k], masses[k]);
    max *= 1.2;
    const bw = (right - left) / frequencies.length;
    const Y = (v) => bottom - v / max * (bottom - top);
    c.strokeStyle = '#e5ebf1'; c.fillStyle = '#7b8b9b'; c.textAlign = 'right';
    for (const frac of [0.5, 1]) { c.beginPath(); c.moveTo(left, Y(frac * max)); c.lineTo(right, Y(frac * max)); c.stroke(); c.fillText((100 * frac * max).toFixed(1) + '%', left - 4, Y(frac * max) + 3); }
    for (let k = 0; k < frequencies.length; k++) { c.fillStyle = 'rgba(96,133,173,.6)'; c.fillRect(left + k * bw + 1, Y(frequencies[k]), Math.max(1, bw - 2), bottom - Y(frequencies[k])); }
    c.strokeStyle = INK; c.lineWidth = 1.2; c.beginPath();
    for (let k = 0; k < masses.length; k++) { c.moveTo(left + k * bw, Y(masses[k])); c.lineTo(left + (k + 1) * bw, Y(masses[k])); }
    c.stroke();
    c.strokeStyle = '#c9d3dd'; c.lineWidth = 1; c.beginPath(); c.moveTo(left, bottom + 0.5); c.lineTo(right, bottom + 0.5); c.stroke();
    c.fillStyle = '#7b8b9b'; c.textAlign = 'left'; if (labels.left) c.fillText(labels.left, left, h - 7);
  }

  function plot(canvas, series, o = {}) {
    const { c, w, h } = chartFrame(canvas);
    const left = o.marginLeft || 42; const right = w - 12; const top = 14; const bottom = h - 24;
    const fx = o.xlog ? Math.log10 : (v) => v;
    const fy = o.ylog ? Math.log10 : (v) => v;
    let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity;
    for (const s of series) for (const [x, y] of s.points) { if (!isFinite(fx(x)) || !isFinite(fy(y))) continue; xmin = Math.min(xmin, fx(x)); xmax = Math.max(xmax, fx(x)); ymin = Math.min(ymin, fy(y)); ymax = Math.max(ymax, fy(y)); }
    if (o.hline) { ymin = Math.min(ymin, fy(o.hline.y)); ymax = Math.max(ymax, fy(o.hline.y)); }
    if (o.xrange) { xmin = fx(o.xrange[0]); xmax = fx(o.xrange[1]); }
    if (o.yrange) { ymin = fy(o.yrange[0]); ymax = fy(o.yrange[1]); }
    if (!(xmax > xmin)) { xmin -= 1; xmax += 1; }
    if (!(ymax > ymin)) { ymin -= 1; ymax += 1; }
    if (!o.yrange) { const pad = (ymax - ymin) * 0.1; ymin -= (!o.ylog && ymin >= 0 && ymin < pad) ? ymin : pad; ymax += pad; }
    const X = (x) => left + (fx(x) - xmin) / (xmax - xmin) * (right - left);
    const Y = (y) => bottom - (fy(y) - ymin) / (ymax - ymin) * (bottom - top);
    const ticks = (lo, hi, log) => {
      if (log) { const out = []; for (let e = Math.floor(lo); e <= Math.ceil(hi); e++) for (const m of (Math.ceil(hi) - Math.floor(lo) > 2 ? [1] : [1, 2, 5])) { const v = m * 10 ** e; if (Math.log10(v) >= lo - 1e-9 && Math.log10(v) <= hi + 1e-9) out.push(v); } return out; }
      const span = hi - lo; const mag = 10 ** Math.floor(Math.log10(span)); const n = span / mag; const step = mag * (n > 5 ? 1 : n > 2 ? 0.5 : 0.2);
      const out = []; for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(10)); return out;
    };
    const fmt = (v) => (Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 1 ? String(+v.toFixed(2)) : Math.abs(v) >= 0.01 ? String(+v.toFixed(3)) : v.toExponential(0));
    c.strokeStyle = '#e5ebf1'; c.lineWidth = 1; c.fillStyle = '#7b8b9b';
    for (const v of ticks(ymin, ymax, o.ylog)) { const yy = Y(v); if (yy < top - 1 || yy > bottom + 1) continue; c.beginPath(); c.moveTo(left, yy); c.lineTo(right, yy); c.stroke(); c.textAlign = 'right'; c.fillText(fmt(v), left - 5, yy + 3); }
    for (const v of ticks(xmin, xmax, o.xlog)) { const xx = X(v); if (xx < left - 1 || xx > right + 1) continue; c.beginPath(); c.moveTo(xx, top); c.lineTo(xx, bottom); c.stroke(); c.textAlign = 'center'; c.fillText(fmt(v), xx, bottom + 13); }
    c.strokeStyle = '#c9d3dd'; c.strokeRect(left + 0.5, top + 0.5, right - left - 1, bottom - top - 1);
    if (o.hline) { c.strokeStyle = '#9aa8b6'; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(left, Y(o.hline.y)); c.lineTo(right, Y(o.hline.y)); c.stroke(); c.setLineDash([]); if (o.hline.label) { c.fillStyle = '#8a98a8'; c.textAlign = 'right'; c.fillText(o.hline.label, right - 4, Y(o.hline.y) - 4); } }
    if (o.vline !== undefined) { c.strokeStyle = RED; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(o.vline), top); c.lineTo(X(o.vline), bottom); c.stroke(); c.setLineDash([]); }
    c.save(); c.beginPath(); c.rect(left, top, right - left, bottom - top); c.clip();
    for (const s of series) {
      c.strokeStyle = s.color || BLUE; c.fillStyle = s.color || BLUE; c.lineWidth = s.width || 1.6; c.setLineDash(s.dash || []);
      if (s.fill && s.points.length) { c.beginPath(); s.points.forEach(([x, y], i) => (i ? c.lineTo(X(x), Y(y)) : c.moveTo(X(x), Y(y)))); c.lineTo(X(s.points[s.points.length - 1][0]), bottom); c.lineTo(X(s.points[0][0]), bottom); c.closePath(); c.globalAlpha = 0.14; c.fill(); c.globalAlpha = 1; }
      c.beginPath(); let pen = false;
      for (const [x, y] of s.points) { if (!isFinite(fx(x)) || !isFinite(fy(y))) { pen = false; continue; } if (pen) c.lineTo(X(x), Y(y)); else c.moveTo(X(x), Y(y)); pen = true; }
      c.stroke(); c.setLineDash([]);
      if (s.marker) for (const [x, y] of s.points) { if (!isFinite(fx(x)) || !isFinite(fy(y))) continue; c.beginPath(); c.arc(X(x), Y(y), 2.5, 0, 2 * Math.PI); c.fill(); }
    }
    c.restore();
    let ly = top + 12; c.textAlign = 'left';
    for (const s of series) if (s.label) { c.fillStyle = s.color || BLUE; c.fillText(s.label, left + 8, ly); ly += 13; }
    c.fillStyle = '#7b8b9b';
    if (o.xlabel) { c.textAlign = 'right'; c.fillText(o.xlabel, right, h - 5); }
    if (o.ylabel) { c.textAlign = 'left'; c.fillText(o.ylabel, left + 4, top - 4); }
  }

  root.Traps = { WINDOW, frame, point, line, dot, text, sites, contours, arrows, dots, startColors, trapContrast, bars, plot, BLUE, RED, INK, MUTED };
})(globalThis);
