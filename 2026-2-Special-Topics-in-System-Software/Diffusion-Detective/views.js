/* views.js — drawing only. Three painters share one coordinate window:
 *   BoardView : the plane in either lens (puzzle board / landscape), pieces, paths, arrows
 *   BarsView  : slot frequencies against the exact slot masses
 *   Plot      : small line plots (optionally logarithmic axes)
 * Nothing here computes a sample; see model.js and sampler.js. */
(function (root) {
  'use strict';
  const M = root.BoardModel;
  const INK = '#17283e';
  const MUTED = '#6a7a8a';
  const BLUE = '#5c80a8';
  const RED = '#ad4b53';
  const GRID = '#e3e8ee';

  function dpr() { return Math.min(window.devicePixelRatio || 1, 2); }

  /** Size the backing store to the CSS box and return a 2D context in CSS pixels. */
  function prepare(canvas) {
    const r = canvas.getBoundingClientRect();
    const d = dpr();
    const w = Math.max(1, Math.round(r.width));
    const h = Math.max(1, Math.round(r.height));
    if (canvas.width !== Math.round(w * d) || canvas.height !== Math.round(h * d)) {
      canvas.width = Math.round(w * d);
      canvas.height = Math.round(h * d);
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(d, 0, 0, d, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    return { ctx, w, h };
  }

  function text(ctx, s, x, y, { color = MUTED, size = 10, align = 'left', baseline = 'alphabetic', weight = '' } = {}) {
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans KR", Arial, sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillText(s, x, y);
  }

  /* ------------------------------------------------------------------ BoardView */
  const WINDOW = { x0: -1.15, x1: 1.15, y0: -0.85, y1: 0.85 };
  const RASTER = { nx: 184, ny: 136 };
  const photo = new Image();
  photo.src = new URL('assets/board-photo.jpg', document.currentScript.src).href;
  photo.onload = () => window.dispatchEvent(new Event('boardphotoload'));

  let rasterCache = { key: null, canvas: null, contours: null };

  /** World -> pixel mapping that keeps the aspect ratio and centres the window. */
  function frameOf(canvas) {
    const f = prepare(canvas);
    const sx = f.w / (WINDOW.x1 - WINDOW.x0);
    const sy = f.h / (WINDOW.y1 - WINDOW.y0);
    const s = Math.min(sx, sy);
    const ox = (f.w - s * (WINDOW.x1 - WINDOW.x0)) / 2;
    const oy = (f.h - s * (WINDOW.y1 - WINDOW.y0)) / 2;
    f.scale = s;
    f.map = (x, y) => [ox + (x - WINDOW.x0) * s, oy + (WINDOW.y1 - y) * s];
    f.unmap = (px, py) => [WINDOW.x0 + (px - ox) / s, WINDOW.y1 - (py - oy) / s];
    return f;
  }

  function ramp(u) {
    // 0 = valley floor (dark blue-gray), 1 = high ground (near white)
    const stops = [[0, [52, 80, 118]], [0.45, [150, 172, 198]], [1, [247, 249, 251]]];
    let a = stops[0];
    let b = stops[stops.length - 1];
    for (let i = 0; i + 1 < stops.length; i++) if (u >= stops[i][0] && u <= stops[i + 1][0]) { a = stops[i]; b = stops[i + 1]; break; }
    const w = (u - a[0]) / (b[0] - a[0] || 1);
    return a[1].map((c, i) => Math.round(c + (b[1][i] - c) * w));
  }

  /** Raster of U_t = -log p_t over the window, cached per time. */
  function landscapeRaster(t) {
    const key = t.toFixed(4);
    if (rasterCache.key === key) return rasterCache;
    const { nx, ny } = RASTER;
    const values = new Float64Array(nx * ny);
    let min = Infinity;
    for (let j = 0; j < ny; j++) {
      const y = WINDOW.y1 - (j + 0.5) / ny * (WINDOW.y1 - WINDOW.y0);
      for (let i = 0; i < nx; i++) {
        const x = WINDOW.x0 + (i + 0.5) / nx * (WINDOW.x1 - WINDOW.x0);
        const u = -M.logDensity(x, y, t);
        values[j * nx + i] = u;
        if (u < min) min = u;
      }
    }
    const RANGE = 5; // nats above the deepest valley that still receive a distinct shade
    const off = document.createElement('canvas');
    off.width = nx;
    off.height = ny;
    const octx = off.getContext('2d');
    const img = octx.createImageData(nx, ny);
    for (let p = 0; p < nx * ny; p++) {
      const u = Math.min(1, (values[p] - min) / RANGE);
      const [r, g, b] = ramp(u);
      img.data[4 * p] = r; img.data[4 * p + 1] = g; img.data[4 * p + 2] = b; img.data[4 * p + 3] = 255;
    }
    octx.putImageData(img, 0, 0);
    // contour lines at fixed heights above the floor (marching squares on the raster)
    const contours = [];
    for (const level of [0.5, 1, 2, 3, 4].map((v) => min + v)) {
      for (let j = 0; j + 1 < ny; j++) for (let i = 0; i + 1 < nx; i++) {
        const v = [values[j * nx + i], values[j * nx + i + 1], values[(j + 1) * nx + i + 1], values[(j + 1) * nx + i]];
        const px = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]];
        const cross = [];
        for (let a = 0; a < 4; a++) {
          const b = (a + 1) % 4;
          if ((v[a] >= level) === (v[b] >= level)) continue;
          const u = (level - v[a]) / (v[b] - v[a]);
          cross.push([px[a][0] + u * (px[b][0] - px[a][0]) + 0.5, px[a][1] + u * (px[b][1] - px[a][1]) + 0.5]);
        }
        for (let a = 0; a + 1 < cross.length; a += 2) contours.push([cross[a], cross[a + 1]]);
      }
    }
    rasterCache = { key, canvas: off, contours };
    return rasterCache;
  }

  /** How visible a slot still is at time t: density contrast centre vs. mid-edge, relative to t = 0. */
  function slotContrast(t) {
    const k = 27; // an interior slot; the others differ by less than the eye can tell
    const [cx, cy] = M.centers[k];
    const c = (tt) => 1 - M.density(cx + M.CELL / 2, cy, tt) / M.density(cx, cy, tt);
    return Math.max(0, Math.min(1, c(t) / c(0)));
  }

  function drawLandscape(f, t) {
    const { canvas, contours } = landscapeRaster(t);
    const [x0, y0] = f.map(WINDOW.x0, WINDOW.y1);
    const [x1, y1] = f.map(WINDOW.x1, WINDOW.y0);
    f.ctx.imageSmoothingEnabled = true;
    f.ctx.drawImage(canvas, x0, y0, x1 - x0, y1 - y0);
    const sx = (x1 - x0) / RASTER.nx;
    const sy = (y1 - y0) / RASTER.ny;
    f.ctx.strokeStyle = 'rgba(255,255,255,.45)';
    f.ctx.lineWidth = 0.8;
    f.ctx.beginPath();
    for (const [a, b] of contours) {
      f.ctx.moveTo(x0 + a[0] * sx, y0 + a[1] * sy);
      f.ctx.lineTo(x0 + b[0] * sx, y0 + b[1] * sy);
    }
    f.ctx.stroke();
    // the board outline, so that the two lenses can be compared
    const [bx0, by0] = f.map(M.board.left, M.board.top);
    const [bx1, by1] = f.map(M.board.right, M.board.bottom);
    f.ctx.strokeStyle = 'rgba(23,40,62,.35)';
    f.ctx.setLineDash([3, 3]);
    f.ctx.strokeRect(bx0, by0, bx1 - bx0, by1 - by0);
    f.ctx.setLineDash([]);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /**
   * The puzzle lens. `reveal[k]` in [0,1] sets how much of tile k is shown; when it is
   * omitted every tile is shown with the current slot contrast, so the picture fades
   * exactly as the wells blur. `wellAlpha` scales the slot outlines the same way.
   */
  function drawBoard(f, t, { reveal = null } = {}) {
    const ctx = f.ctx;
    const contrast = slotContrast(t);
    const [bx0, by0] = f.map(M.board.left, M.board.top);
    const [bx1, by1] = f.map(M.board.right, M.board.bottom);
    ctx.save();
    ctx.shadowColor = 'rgba(23,40,62,.10)';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#fbfcfd';
    ctx.fillRect(bx0, by0, bx1 - bx0, by1 - by0);
    ctx.restore();
    ctx.strokeStyle = '#cfd8e2';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx0 + 0.5, by0 + 0.5, bx1 - bx0 - 1, by1 - by0 - 1);
    const cell = M.CELL * f.scale;
    const tileW = photo.naturalWidth / M.COLUMNS;
    const tileH = photo.naturalHeight / M.ROWS;
    for (let k = 0; k < M.K; k++) {
      const i = k % M.COLUMNS;
      const j = Math.floor(k / M.COLUMNS);
      const [x, y] = f.map(M.board.left + i * M.CELL, M.board.top - j * M.CELL);
      const alpha = reveal ? reveal[k] : contrast;
      if (photo.naturalWidth && alpha > 0) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, alpha);
        // photo row 0 is the top of the picture; slot row 0 is the bottom of the board
        ctx.drawImage(photo, i * tileW, (M.ROWS - 1 - j) * tileH, tileW, tileH, x, y, cell, cell);
        ctx.restore();
      }
      ctx.save();
      ctx.globalAlpha = 0.25 + 0.75 * contrast;
      ctx.strokeStyle = '#8c9bab';
      ctx.lineWidth = 0.8;
      roundRect(ctx, x + cell * 0.08, y + cell * 0.08, cell * 0.84, cell * 0.84, cell * 0.12);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawPaths(f, paths, { color = 'rgba(23,40,62,.28)', upto = Infinity, width = 0.9 } = {}) {
    const ctx = f.ctx;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    for (const path of paths) {
      const n = Math.min(path.length, upto);
      for (let i = 0; i < n; i++) {
        const [px, py] = f.map(path[i][0], path[i][1]);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
  }

  const MAX_DRAWN = 700; // metrics use every piece; the board shows at most this many

  function drawPieces(f, xs, ys, { lens = 'puzzle', colors = null, color = BLUE, size = 2.2 } = {}) {
    const ctx = f.ctx;
    const count = Math.min(xs.length, MAX_DRAWN);
    if (lens === 'puzzle') {
      const side = Math.max(3, M.CELL * f.scale * (count > 300 ? 0.17 : 0.26));
      ctx.lineWidth = 0.6;
      for (let n = 0; n < count; n++) {
        const [px, py] = f.map(xs[n], ys[n]);
        ctx.fillStyle = colors ? colors[n] : 'rgba(255,255,255,.92)';
        ctx.strokeStyle = colors ? 'rgba(255,255,255,.7)' : 'rgba(23,40,62,.45)';
        roundRect(ctx, px - side / 2, py - side / 2, side, side, side * 0.22);
        ctx.fill();
        ctx.stroke();
      }
    } else {
      for (let n = 0; n < count; n++) {
        const [px, py] = f.map(xs[n], ys[n]);
        ctx.fillStyle = colors ? colors[n] : color;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,.8)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
    return count;
  }

  /** Score arrows on a coarse grid; `error` selects the perturbed field. */
  function drawArrows(f, t, { error = null, color = 'rgba(23,40,62,.55)', spacing = 0.16, gain = 0.045, maxLen = 0.13 } = {}) {
    const ctx = f.ctx;
    const s = [0, 0];
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1;
    for (let y = WINDOW.y0 + spacing / 2; y < WINDOW.y1; y += spacing) {
      for (let x = WINDOW.x0 + spacing / 2; x < WINDOW.x1; x += spacing) {
        if (error) M.perturbedScore(x, y, t, error, s); else M.score(x, y, t, s);
        let vx = s[0] * gain;
        let vy = s[1] * gain;
        const l = Math.hypot(vx, vy);
        if (l > maxLen) { vx *= maxLen / l; vy *= maxLen / l; }
        const [ax, ay] = f.map(x, y);
        const [bx, by] = f.map(x + vx, y + vy);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
        const ang = Math.atan2(by - ay, bx - ax);
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx - 4 * Math.cos(ang - 0.45), by - 4 * Math.sin(ang - 0.45));
        ctx.lineTo(bx - 4 * Math.cos(ang + 0.45), by - 4 * Math.sin(ang + 0.45));
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  /** Colour each piece by where it started: hue from the angle, lightness from the radius. */
  function startColors(xs, ys) {
    const out = new Array(xs.length);
    for (let n = 0; n < xs.length; n++) {
      const hue = (Math.atan2(ys[n], xs[n]) * 180 / Math.PI + 360) % 360;
      const r = Math.hypot(xs[n], ys[n]);
      const light = 38 + 34 * Math.min(1, r / 2.2);
      out[n] = `hsl(${hue.toFixed(0)} 55% ${light.toFixed(0)}%)`;
    }
    return out;
  }

  /** One call that paints a whole scene in the chosen lens. */
  function drawScene(canvas, { lens, t, xs = null, ys = null, colors = null, paths = null, arrows = false, error = null, reveal = null, pathsUpto = Infinity, label = null }) {
    const f = frameOf(canvas);
    if (lens === 'landscape') drawLandscape(f, t); else drawBoard(f, t, { reveal });
    if (arrows) drawArrows(f, t, { error, color: lens === 'landscape' ? 'rgba(255,255,255,.75)' : 'rgba(23,40,62,.5)' });
    if (paths) drawPaths(f, paths, { upto: pathsUpto, color: lens === 'landscape' ? 'rgba(255,255,255,.55)' : 'rgba(23,40,62,.25)' });
    let shown = 0;
    if (xs) shown = drawPieces(f, xs, ys, { lens, colors });
    if (label) text(f.ctx, label + (xs && shown < xs.length ? `  ·  ${shown} / ${xs.length}` : ''), 12, 18, { color: lens === 'landscape' ? '#fff' : INK, size: 11 });
    return f;
  }

  /* ------------------------------------------------------------------- BarsView */
  /** 48 slot frequencies as bars, the exact slot masses as a dark step line. */
  function drawBars(canvas, frequencies, masses, { labelLeft = '', labelRight = '', highlight = -1 } = {}) {
    const f = prepare(canvas);
    const ctx = f.ctx;
    const left = 34;
    const right = f.w - 10;
    const top = 16;
    const bottom = f.h - 20;
    const K = frequencies.length;
    let max = 0;
    for (let k = 0; k < K; k++) max = Math.max(max, frequencies[k], masses[k]);
    max *= 1.2;
    const bw = (right - left) / K;
    const y = (v) => bottom - v / max * (bottom - top);
    ctx.strokeStyle = GRID;
    for (const frac of [0.5, 1]) {
      const v = frac * max;
      ctx.beginPath(); ctx.moveTo(left, y(v)); ctx.lineTo(right, y(v)); ctx.stroke();
      text(ctx, (100 * v).toFixed(1) + '%', left - 4, y(v) + 3, { align: 'right', size: 9 });
    }
    for (let k = 0; k < K; k++) {
      ctx.fillStyle = k === highlight ? RED : 'rgba(92,128,168,.65)';
      ctx.fillRect(left + k * bw + 1, y(frequencies[k]), Math.max(1, bw - 2), bottom - y(frequencies[k]));
    }
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let k = 0; k < K; k++) {
      ctx.moveTo(left + k * bw, y(masses[k]));
      ctx.lineTo(left + (k + 1) * bw, y(masses[k]));
    }
    ctx.stroke();
    ctx.strokeStyle = '#c3ccd6';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(left, bottom + 0.5); ctx.lineTo(right, bottom + 0.5); ctx.stroke();
    text(ctx, labelLeft, left, f.h - 6, { size: 9 });
    text(ctx, labelRight, right, f.h - 6, { size: 9, align: 'right' });
  }

  /* ----------------------------------------------------------------------- Plot */
  /**
   * series: [{ points: [[x,y],...], color, dash, label, width, marker }]
   * options: xlog, ylog, xlabel, ylabel, xrange, yrange, hlines: [{y,label,color}], vline: x
   */
  function drawPlot(canvas, series, o = {}) {
    const f = prepare(canvas);
    const ctx = f.ctx;
    const left = o.marginLeft || 44;
    const right = f.w - 12;
    const top = 14;
    const bottom = f.h - 26;
    const fx = o.xlog ? Math.log10 : (v) => v;
    const fy = o.ylog ? Math.log10 : (v) => v;
    let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity;
    for (const s of series) for (const [x, y] of s.points) {
      if (!isFinite(fx(x)) || !isFinite(fy(y))) continue;
      xmin = Math.min(xmin, fx(x)); xmax = Math.max(xmax, fx(x));
      ymin = Math.min(ymin, fy(y)); ymax = Math.max(ymax, fy(y));
    }
    for (const h of o.hlines || []) { ymin = Math.min(ymin, fy(h.y)); ymax = Math.max(ymax, fy(h.y)); }
    if (o.xrange) { xmin = fx(o.xrange[0]); xmax = fx(o.xrange[1]); }
    if (o.yrange) { ymin = fy(o.yrange[0]); ymax = fy(o.yrange[1]); }
    if (!(xmax > xmin)) { xmin -= 1; xmax += 1; }
    if (!(ymax > ymin)) { ymin -= 1; ymax += 1; }
    if (!o.yrange) { const pad = (ymax - ymin) * 0.08; ymin -= o.ylog ? pad : (ymin >= 0 && ymin < pad ? ymin : pad); ymax += pad; }
    const X = (x) => left + (fx(x) - xmin) / (xmax - xmin) * (right - left);
    const Y = (y) => bottom - (fy(y) - ymin) / (ymax - ymin) * (bottom - top);
    // ticks
    const ticks = (lo, hi, log) => {
      if (log) { const out = []; for (let e = Math.ceil(lo); e <= Math.floor(hi); e++) out.push(10 ** e); if (out.length < 2) { for (let e = Math.floor(lo); e <= Math.ceil(hi); e++) for (const m of [1, 2, 5]) { const v = m * 10 ** e; if (Math.log10(v) >= lo && Math.log10(v) <= hi) out.push(v); } } return out; }
      const span = hi - lo; const step = 10 ** Math.floor(Math.log10(span)) * (span / 10 ** Math.floor(Math.log10(span)) > 5 ? 1 : span / 10 ** Math.floor(Math.log10(span)) > 2 ? 0.5 : 0.2);
      const out = []; for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(10)); return out;
    };
    const fmt = (v) => (Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 1 ? +v.toFixed(2) + '' : Math.abs(v) >= 0.01 ? +v.toFixed(3) + '' : v.toExponential(0));
    ctx.strokeStyle = GRID;
    ctx.lineWidth = 1;
    for (const v of ticks(ymin, ymax, o.ylog)) { const yy = Y(v); if (yy < top - 1 || yy > bottom + 1) continue; ctx.beginPath(); ctx.moveTo(left, yy); ctx.lineTo(right, yy); ctx.stroke(); text(ctx, fmt(v), left - 5, yy + 3, { align: 'right', size: 9 }); }
    for (const v of ticks(xmin, xmax, o.xlog)) { const xx = X(v); if (xx < left - 1 || xx > right + 1) continue; ctx.beginPath(); ctx.moveTo(xx, top); ctx.lineTo(xx, bottom); ctx.stroke(); text(ctx, fmt(v), xx, bottom + 13, { align: 'center', size: 9 }); }
    ctx.strokeStyle = '#c3ccd6';
    ctx.strokeRect(left + 0.5, top + 0.5, right - left - 1, bottom - top - 1);
    for (const h of o.hlines || []) {
      ctx.strokeStyle = h.color || '#9aa8b6'; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(left, Y(h.y)); ctx.lineTo(right, Y(h.y)); ctx.stroke(); ctx.setLineDash([]);
      if (h.label) text(ctx, h.label, right - 4, Y(h.y) - 4, { align: 'right', size: 9, color: h.color || MUTED });
    }
    if (o.vline !== undefined && isFinite(fx(o.vline))) { ctx.strokeStyle = RED; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(X(o.vline), top); ctx.lineTo(X(o.vline), bottom); ctx.stroke(); ctx.setLineDash([]); }
    ctx.save();
    ctx.beginPath(); ctx.rect(left, top, right - left, bottom - top); ctx.clip();
    for (const s of series) {
      ctx.strokeStyle = s.color || BLUE; ctx.fillStyle = s.color || BLUE; ctx.lineWidth = s.width || 1.6; ctx.setLineDash(s.dash || []);
      if (s.fill) {
        ctx.beginPath();
        s.points.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y))));
        ctx.lineTo(X(s.points[s.points.length - 1][0]), bottom); ctx.lineTo(X(s.points[0][0]), bottom); ctx.closePath();
        ctx.globalAlpha = 0.18; ctx.fill(); ctx.globalAlpha = 1;
      }
      ctx.beginPath();
      let pen = false;
      for (const [x, y] of s.points) { if (!isFinite(fx(x)) || !isFinite(fy(y))) { pen = false; continue; } if (pen) ctx.lineTo(X(x), Y(y)); else ctx.moveTo(X(x), Y(y)); pen = true; }
      ctx.stroke();
      ctx.setLineDash([]);
      if (s.marker) for (const [x, y] of s.points) { if (!isFinite(fx(x)) || !isFinite(fy(y))) continue; ctx.beginPath(); ctx.arc(X(x), Y(y), 2.6, 0, 2 * Math.PI); ctx.fill(); }
    }
    ctx.restore();
    let ly = top + 12;
    for (const s of series) if (s.label) { text(ctx, s.label, left + 8, ly, { color: s.color || BLUE, size: 10 }); ly += 13; }
    if (o.xlabel) text(ctx, o.xlabel, right, f.h - 4, { align: 'right', size: 9 });
    if (o.ylabel) text(ctx, o.ylabel, left + 4, top - 4, { size: 9 });
    return { X, Y, left, right, top, bottom };
  }

  root.BoardView = { WINDOW, MAX_DRAWN, frameOf, drawScene, drawLandscape, drawBoard, drawPieces, drawPaths, drawArrows, startColors, slotContrast, photoLoaded: () => photo.naturalWidth > 0, colors: { INK, MUTED, BLUE, RED } };
  root.BarsView = { draw: drawBars };
  root.Plot = { draw: drawPlot, prepare, text };
})(globalThis);
