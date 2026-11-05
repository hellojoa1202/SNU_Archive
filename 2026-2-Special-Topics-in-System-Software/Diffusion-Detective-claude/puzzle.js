/* puzzle.js — the drawing surface shared by every scene.
 * One coordinate window, jigsaw-shaped pieces that carry tiles of the photograph,
 * outline-only density contours, dots for samples, and a small bar chart.
 * Nothing in here computes a sample (see model.js / sampler.js). */
(function (root) {
  'use strict';
  const M = root.BoardModel;
  const BLUE = '#6085ad';
  const RED = '#ae4c54';
  const INK = '#17283e';
  const MUTED = '#6b7e91';

  const WINDOW = { x0: -1.15, x1: 1.15, y0: -0.85, y1: 0.85 };

  const photo = new Image();
  photo.src = new URL('assets/board-photo.jpg', document.currentScript.src).href;
  photo.onload = () => window.dispatchEvent(new Event('puzzlephotoload'));

  /* ---- jigsaw outlines: one Path2D per piece, centred on the piece, in world units */
  const paths = Array.from({ length: M.K }, (_, i) => {
    const w = M.CELL;
    const x = i % M.COLUMNS;
    const y = Math.floor(i / M.COLUMNS);
    const p = new Path2D();
    const sign = (n) => (n % 2 ? 1 : -1);
    // tab direction of each side; neighbours get the opposite sign so the pieces interlock
    const sides = [y ? -sign(i - 8 + 331) : 0, x < 7 ? sign(i + 17) : 0, y < 5 ? sign(i + 331) : 0, x ? -sign(i - 1 + 17) : 0];
    p.moveTo(-w / 2, -w / 2);
    function edge(ax, ay, bx, by, s) {
      if (!s) { p.lineTo(bx, by); return; }
      const dx = bx - ax;
      const dy = by - ay;
      const len = Math.hypot(dx, dy);
      const d = 0.046 * s;
      const q = (u, v) => [ax + u * dx + dy / len * v * d, ay + u * dy - dx / len * v * d];
      p.lineTo(...q(0.35, 0));
      p.bezierCurveTo(...q(0.46, 0), ...q(0.31, 1), ...q(0.5, 1));
      p.bezierCurveTo(...q(0.69, 1), ...q(0.54, 0), ...q(0.65, 0));
      p.lineTo(bx, by);
    }
    edge(-w / 2, -w / 2, w / 2, -w / 2, sides[0]);
    edge(w / 2, -w / 2, w / 2, w / 2, sides[1]);
    edge(w / 2, w / 2, -w / 2, w / 2, sides[2]);
    edge(-w / 2, w / 2, -w / 2, -w / 2, sides[3]);
    p.closePath();
    return p;
  });

  /** Size the canvas, clear it white, and return a frame whose context is in world units (y up). */
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

  /** Pointer event -> world coordinates. */
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

  /** Screen-space text, written at a world position. */
  function text(f, label, p, color = MUTED, size = 10, align = 'left') {
    const { c, scale, d } = f;
    c.save();
    c.setTransform(d, 0, 0, d, 0, 0);
    const px = f.w / 2 + p[0] * scale;
    const py = f.h / 2 - p[1] * scale;
    c.fillStyle = color;
    c.font = `${size}px -apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans KR',Arial,sans-serif`;
    c.textAlign = align;
    c.textBaseline = 'middle';
    c.fillText(label, px, py);
    c.restore();
  }

  /** The empty board: a faint frame and the 48 slot outlines, dimmed by `alpha`. */
  function board(f, alpha = 1) {
    const { c, scale } = f;
    c.save();
    c.globalAlpha = alpha;
    c.strokeStyle = '#d9e2ea';
    c.lineWidth = 0.8 / scale;
    c.strokeRect(M.board.left, M.board.bottom, M.board.right - M.board.left, M.board.top - M.board.bottom);
    c.strokeStyle = '#e4eaf0';
    c.lineWidth = 0.6 / scale;
    for (const [x, y] of M.centers) c.strokeRect(x - M.CELL / 2, y - M.CELL / 2, M.CELL, M.CELL);
    c.restore();
  }

  /** Jigsaw piece k, carrying tile k of the photograph, drawn at position `pos`. */
  function piece(f, k, pos, alpha = 1, selected = false) {
    const { c, scale } = f;
    const [sx, sy] = M.centers[k];
    c.save();
    c.globalAlpha = Math.max(0, Math.min(1, alpha));
    c.translate(pos[0], pos[1]);
    c.fillStyle = '#fff';
    c.fill(paths[k]);
    if (photo.naturalWidth) {
      c.save();
      c.clip(paths[k]);
      // the photograph covers the whole board; tile k is the part under slot k
      c.scale(1, -1);
      c.drawImage(photo, 0, 0, photo.naturalWidth, photo.naturalHeight, M.board.left - sx, -(M.board.top - sy), M.board.right - M.board.left, M.board.top - M.board.bottom);
      c.restore();
    }
    c.strokeStyle = selected ? RED : 'rgba(255,255,255,.9)';
    c.lineWidth = (selected ? 2.2 : 0.7) / scale;
    c.stroke(paths[k]);
    if (!selected) { c.strokeStyle = 'rgba(23,40,62,.18)'; c.lineWidth = 0.5 / scale; c.stroke(paths[k]); }
    c.restore();
  }

  /** The 48 pieces at the given positions (array of [x, y]); `alpha` is one number or an array. */
  function pieces(f, positions, alpha = 1, selected = -1) {
    for (let k = 0; k < M.K; k++) piece(f, k, positions[k], Array.isArray(alpha) ? alpha[k] : alpha, k === selected);
  }

  /* ---- outline-only density contours (marching squares on a cached grid) */
  let contourKey = '';
  let contourLines = [];
  function contours(f, t, levels = [0.1, 0.25, 0.45, 0.7, 0.9]) {
    const key = t.toFixed(4) + ':' + levels.length;
    if (key !== contourKey) {
      contourKey = key;
      const nx = 92;
      const ny = 68;
      const vals = new Float64Array((nx + 1) * (ny + 1));
      let max = 0;
      const X = (i) => WINDOW.x0 + i / nx * (WINDOW.x1 - WINDOW.x0);
      const Y = (j) => WINDOW.y0 + j / ny * (WINDOW.y1 - WINDOW.y0);
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
    const { c, scale } = f;
    const colors = ['#d5e4e2', '#b9d3cf', '#93bdb7', '#6ca59d', '#4a8b83'];
    c.save();
    c.lineWidth = 0.9 / scale;
    contourLines.forEach((segs, i) => {
      c.strokeStyle = colors[i] || colors[colors.length - 1];
      c.beginPath();
      for (const [a, b] of segs) { c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); }
      c.stroke();
    });
    c.restore();
  }

  /** Score arrows on a coarse grid (exact, or perturbed when `error` is given). */
  function arrows(f, t, error = null, color = 'rgba(23,40,62,.45)') {
    const s = [0, 0];
    const spacing = 0.16;
    const gain = 0.045;
    const maxLen = 0.12;
    for (let y = WINDOW.y0 + spacing / 2; y < WINDOW.y1; y += spacing) {
      for (let x = WINDOW.x0 + spacing / 2; x < WINDOW.x1; x += spacing) {
        if (error) M.perturbedScore(x, y, t, error, s); else M.score(x, y, t, s);
        let vx = s[0] * gain;
        let vy = s[1] * gain;
        const l = Math.hypot(vx, vy);
        if (l > maxLen) { vx *= maxLen / l; vy *= maxLen / l; }
        if (l < 1e-6) continue;
        const end = [x + vx, y + vy];
        line(f, [[x, y], end], color, 1);
        const a = Math.atan2(vy, vx);
        const r = 4 / f.scale;
        line(f, [[end[0] - r * Math.cos(a - 0.5), end[1] - r * Math.sin(a - 0.5)], end, [end[0] - r * Math.cos(a + 0.5), end[1] - r * Math.sin(a + 0.5)]], color, 1);
      }
    }
  }

  /** Sample dots; at most `max` are drawn (metrics always use every sample). */
  function dots(f, xs, ys, { color = BLUE, colors = null, r = 2, max = 600 } = {}) {
    const n = Math.min(xs.length, max);
    for (let i = 0; i < n; i++) dot(f, [xs[i], ys[i]], colors ? colors[i] : color, r, 'rgba(255,255,255,.85)');
    return n;
  }

  /** Colour by starting position: hue from the angle, lightness from the radius. */
  function startColors(xs, ys) {
    const out = new Array(xs.length);
    for (let n = 0; n < xs.length; n++) {
      const hue = (Math.atan2(ys[n], xs[n]) * 180 / Math.PI + 360) % 360;
      const light = 40 + 30 * Math.min(1, Math.hypot(xs[n], ys[n]) / 2.2);
      out[n] = `hsl(${hue.toFixed(0)} 52% ${light.toFixed(0)}%)`;
    }
    return out;
  }

  /** How visible a slot still is at time t (density contrast centre vs. mid-edge, relative to t = 0). */
  function slotContrast(t) {
    const [cx, cy] = M.centers[27];
    const c = (tt) => 1 - M.density(cx + M.CELL / 2, cy, tt) / M.density(cx, cy, tt);
    return Math.max(0, Math.min(1, c(t) / c(0)));
  }

  /* ---- small charts (screen space) */
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

  /** Slot frequencies (bars) against exact slot masses (step line). */
  function bars(canvas, frequencies, masses, labels = {}) {
    const { c, w, h } = chartFrame(canvas);
    const left = 36;
    const right = w - 10;
    const top = 14;
    const bottom = h - 22;
    let max = 0;
    for (let k = 0; k < frequencies.length; k++) max = Math.max(max, frequencies[k], masses[k]);
    max *= 1.2;
    const bw = (right - left) / frequencies.length;
    const Y = (v) => bottom - v / max * (bottom - top);
    c.strokeStyle = '#e5ebf1';
    c.fillStyle = '#7b8b9b';
    c.textAlign = 'right';
    for (const frac of [0.5, 1]) { c.beginPath(); c.moveTo(left, Y(frac * max)); c.lineTo(right, Y(frac * max)); c.stroke(); c.fillText((100 * frac * max).toFixed(1) + '%', left - 4, Y(frac * max) + 3); }
    for (let k = 0; k < frequencies.length; k++) { c.fillStyle = 'rgba(96,133,173,.6)'; c.fillRect(left + k * bw + 1, Y(frequencies[k]), Math.max(1, bw - 2), bottom - Y(frequencies[k])); }
    c.strokeStyle = INK;
    c.lineWidth = 1.2;
    c.beginPath();
    for (let k = 0; k < masses.length; k++) { c.moveTo(left + k * bw, Y(masses[k])); c.lineTo(left + (k + 1) * bw, Y(masses[k])); }
    c.stroke();
    c.strokeStyle = '#c9d3dd';
    c.lineWidth = 1;
    c.beginPath(); c.moveTo(left, bottom + 0.5); c.lineTo(right, bottom + 0.5); c.stroke();
    c.fillStyle = '#7b8b9b';
    c.textAlign = 'left';
    if (labels.left) c.fillText(labels.left, left, h - 7);
    c.textAlign = 'right';
    if (labels.right) c.fillText(labels.right, right, h - 7);
  }

  /** Generic line plot. series: [{points, color, dash, label, marker, fill}], o: {xlog, ylog, xlabel, ylabel, xrange, yrange, hline:{y,label}, vline} */
  function plot(canvas, series, o = {}) {
    const { c, w, h } = chartFrame(canvas);
    const left = o.marginLeft || 42;
    const right = w - 12;
    const top = 14;
    const bottom = h - 24;
    const fx = o.xlog ? Math.log10 : (v) => v;
    const fy = o.ylog ? Math.log10 : (v) => v;
    let xmin = Infinity; let xmax = -Infinity; let ymin = Infinity; let ymax = -Infinity;
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
    c.strokeStyle = '#e5ebf1';
    c.lineWidth = 1;
    c.fillStyle = '#7b8b9b';
    for (const v of ticks(ymin, ymax, o.ylog)) { const yy = Y(v); if (yy < top - 1 || yy > bottom + 1) continue; c.beginPath(); c.moveTo(left, yy); c.lineTo(right, yy); c.stroke(); c.textAlign = 'right'; c.fillText(fmt(v), left - 5, yy + 3); }
    for (const v of ticks(xmin, xmax, o.xlog)) { const xx = X(v); if (xx < left - 1 || xx > right + 1) continue; c.beginPath(); c.moveTo(xx, top); c.lineTo(xx, bottom); c.stroke(); c.textAlign = 'center'; c.fillText(fmt(v), xx, bottom + 13); }
    c.strokeStyle = '#c9d3dd';
    c.strokeRect(left + 0.5, top + 0.5, right - left - 1, bottom - top - 1);
    if (o.hline) { c.strokeStyle = '#9aa8b6'; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(left, Y(o.hline.y)); c.lineTo(right, Y(o.hline.y)); c.stroke(); c.setLineDash([]); if (o.hline.label) { c.fillStyle = '#8a98a8'; c.textAlign = 'right'; c.fillText(o.hline.label, right - 4, Y(o.hline.y) - 4); } }
    if (o.vline !== undefined) { c.strokeStyle = RED; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(o.vline), top); c.lineTo(X(o.vline), bottom); c.stroke(); c.setLineDash([]); }
    c.save();
    c.beginPath(); c.rect(left, top, right - left, bottom - top); c.clip();
    for (const s of series) {
      c.strokeStyle = s.color || BLUE; c.fillStyle = s.color || BLUE; c.lineWidth = s.width || 1.6; c.setLineDash(s.dash || []);
      if (s.fill && s.points.length) { c.beginPath(); s.points.forEach(([x, y], i) => (i ? c.lineTo(X(x), Y(y)) : c.moveTo(X(x), Y(y)))); c.lineTo(X(s.points[s.points.length - 1][0]), bottom); c.lineTo(X(s.points[0][0]), bottom); c.closePath(); c.globalAlpha = 0.14; c.fill(); c.globalAlpha = 1; }
      c.beginPath();
      let pen = false;
      for (const [x, y] of s.points) { if (!isFinite(fx(x)) || !isFinite(fy(y))) { pen = false; continue; } if (pen) c.lineTo(X(x), Y(y)); else c.moveTo(X(x), Y(y)); pen = true; }
      c.stroke();
      c.setLineDash([]);
      if (s.marker) for (const [x, y] of s.points) { if (!isFinite(fx(x)) || !isFinite(fy(y))) continue; c.beginPath(); c.arc(X(x), Y(y), 2.5, 0, 2 * Math.PI); c.fill(); }
    }
    c.restore();
    let ly = top + 12;
    c.textAlign = 'left';
    for (const s of series) if (s.label) { c.fillStyle = s.color || BLUE; c.fillText(s.label, left + 8, ly); ly += 13; }
    c.fillStyle = '#7b8b9b';
    if (o.xlabel) { c.textAlign = 'right'; c.fillText(o.xlabel, right, h - 5); }
    if (o.ylabel) { c.textAlign = 'left'; c.fillText(o.ylabel, left + 4, top - 4); }
  }

  root.Puzzle = { WINDOW, frame, point, line, dot, text, board, piece, pieces, contours, arrows, dots, startColors, slotContrast, bars, plot, BLUE, RED, INK, MUTED, get photoLoaded() { return photo.naturalWidth > 0; } };
})(globalThis);
