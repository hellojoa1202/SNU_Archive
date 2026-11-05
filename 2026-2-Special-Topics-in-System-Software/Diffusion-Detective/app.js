/* app.js — wires the controls to the model, the sampler and the painters.
 * Sections:
 *   1  board    forward process, time slider, lens
 *   2  family   eta-family with exact ingredients, colours by start
 *   3  lab      the three substitutions, plus 3.1 prior / 3.2 score / 3.3 grid figures
 *   4  budget   sweeps (precomputed sweeps.json, recomputable here)
 * Shared state that survives language and lens changes lives in `shared`. */
(function () {
  'use strict';
  const M = window.BoardModel;
  const S = window.BoardSampler;
  const V = window.BoardView;
  const Bars = window.BarsView;
  const Plot = window.Plot;
  const T = window.BoardText;
  const EQ = window.BoardEquations;
  const B = window.BoardBudget;
  const $ = (id) => document.getElementById(id);
  const tr = (en, ko) => T.tr(en, ko);
  const txt = (key) => T.text(key);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BLUE = V.colors.BLUE;
  const RED = V.colors.RED;

  const shared = { lens: 'puzzle' };
  const FLOOR_N = {}; // finite-sample floors per N, computed once

  function floors(N) {
    if (!FLOOR_N[N]) {
      const d = S.exactDraws(N);
      FLOOR_N[N] = { tv: S.slotError(d.xs, d.ys).tv, spread: S.spread(d.xs, d.ys), ks: S.ksX(d.xs) };
    }
    return FLOOR_N[N];
  }
  const EXACT_SPREAD = () => S.exactSpread(); // the spread of p_0 itself, from 20 000 exact draws

  /* ------------------------------------------------------------ equations */
  function renderEquations() {
    const hasKatex = typeof window.katex !== 'undefined';
    for (const box of document.querySelectorAll('.equation[data-eq]')) {
      const e = EQ[box.dataset.eq];
      if (!e) continue;
      box.innerHTML = '';
      const math = document.createElement('div');
      if (hasKatex) {
        try { window.katex.render(e.tex, math, { displayMode: true, throwOnError: false }); }
        catch (err) { math.className = 'tex-fallback'; math.textContent = e.tex; }
      } else { math.className = 'tex-fallback'; math.textContent = e.tex; }
      box.appendChild(math);
      const src = document.createElement('div');
      src.className = 'source';
      src.textContent = e.source ? `${e.source[0]} · PDF p. ${e.source.slice(1).join(', ')}` : txt('src-defined');
      box.appendChild(src);
    }
    // the sources table in section 6
    const table = $('sources-table');
    if (table) {
      const rows = Object.entries(EQ).map(([id, e]) => `<tr><td><code>${id}</code></td><td>${e.source ? `${e.source[0]} · p. ${e.source.slice(1).join(', ')}` : txt('src-defined')}</td></tr>`).join('');
      table.innerHTML = `<thead><tr><th>${txt('src-col-eq')}</th><th>${txt('src-col-src')}</th></tr></thead><tbody>${rows}</tbody>`;
    }
  }

  function renderInlineMath(rootEl) {
    if (typeof window.katex === 'undefined') return;
    const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    while (walker.nextNode()) if (walker.currentNode.nodeValue.includes('\\(')) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const parts = node.nodeValue.split(/(\\\(.+?\\\))/);
      if (parts.length < 2) continue;
      const frag = document.createDocumentFragment();
      for (const part of parts) {
        if (part.startsWith('\\(') && part.endsWith('\\)')) {
          const span = document.createElement('span');
          try { window.katex.render(part.slice(2, -2), span, { throwOnError: false }); } catch (e) { span.textContent = part; }
          frag.appendChild(span);
        } else frag.appendChild(document.createTextNode(part));
      }
      node.parentNode.replaceChild(frag, node);
    }
  }

  /** Light the equations and knob groups related to a control for a moment. */
  function light(ids) {
    for (const el of document.querySelectorAll('.lit')) el.classList.remove('lit');
    for (const id of ids) {
      for (const el of document.querySelectorAll(`.equation[data-eq="${id}"], .knobs fieldset[data-knob="${id}"]`)) el.classList.add('lit');
    }
    clearTimeout(light.timer);
    light.timer = setTimeout(() => { for (const el of document.querySelectorAll('.lit')) el.classList.remove('lit'); }, 1600);
  }

  /* -------------------------------------------------------------- helpers */
  function visible(el) {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.bottom > -80 && r.top < innerHeight + 80;
  }
  function fmt(v, d = 3) { return Number.isFinite(v) ? v.toFixed(d) : '–'; }
  function setPlay(btn, playing) { btn.textContent = playing ? txt('btn-pause') : txt('btn-play'); btn.setAttribute('aria-pressed', String(playing)); }
  function marginalSeries(t, lo = -1.6, hi = 1.6, n = 241) {
    const pts = [];
    for (let i = 0; i < n; i++) { const x = lo + (hi - lo) * i / (n - 1); pts.push([x, M.marginalX(x, t)]); }
    return pts;
  }
  function histogramSeries(xs, lo, hi, bins = 64) {
    const h = (hi - lo) / bins;
    const counts = new Array(bins).fill(0);
    for (const x of xs) { const i = Math.floor((x - lo) / h); if (i >= 0 && i < bins) counts[i]++; }
    const pts = [];
    for (let i = 0; i < bins; i++) { const d = counts[i] / xs.length / h; pts.push([lo + i * h, d], [lo + (i + 1) * h, d]); }
    return pts;
  }
  /** Slider position u in [0,1] <-> time: a cubic map gives the sharpening near t = 0 room. */
  const sliderToTime = (u, T = 1) => T * Math.pow(u, 3);
  const timeToSlider = (t, T = 1) => Math.cbrt(Math.max(0, t / T));
  /** Progress p in [0,1] of a generation run <-> its time (p = 1 is t = 0). */
  const progressToTime = (p, T) => T * Math.pow(1 - p, 3);

  /** State of a run at time t, interpolated between the two nearest snapshots. */
  function frameAtTime(run, t) {
    const frames = run.frames; // times decrease from T to 0
    if (frames.length === 1) return frames[0];
    let i = 0;
    while (i < frames.length - 2 && frames[i + 1].t > t) i++;
    const a = frames[i];
    const b = frames[i + 1];
    const w = a.t === b.t ? 1 : Math.min(1, Math.max(0, (a.t - t) / (a.t - b.t)));
    const xs = new Float64Array(a.xs.length);
    const ys = new Float64Array(a.xs.length);
    for (let n = 0; n < xs.length; n++) { xs[n] = a.xs[n] + w * (b.xs[n] - a.xs[n]); ys[n] = a.ys[n] + w * (b.ys[n] - a.ys[n]); }
    return { t: a.t + w * (b.t - a.t), xs, ys };
  }
  const frameAt = (run, p, T = 1) => frameAtTime(run, progressToTime(p, T));

  function reveal(xs, ys) {
    const f = S.slotFrequencies(xs, ys);
    const m = M.slotMasses(0);
    return Array.from(f, (v, k) => Math.min(1, v / m[k]));
  }
  function metricsInto(prefix, xs, ys, N) {
    const e = S.slotError(xs, ys);
    const sp = S.spread(xs, ys) / EXACT_SPREAD();
    const ks = S.ksX(xs);
    const fl = floors(N);
    $(prefix + '-tv').textContent = fmt(e.tv);
    $(prefix + '-spread').textContent = fmt(sp, 2);
    $(prefix + '-ks').textContent = fmt(ks);
    const flTv = $(prefix + '-tv-floor');
    if (flTv) { flTv.textContent = `(${txt('lbl-floor')} ${fmt(fl.tv)})`; $(prefix + '-spread-floor').textContent = `(${txt('lbl-floor')} ${fmt(fl.spread / EXACT_SPREAD(), 2)})`; $(prefix + '-ks-floor').textContent = `(${txt('lbl-floor')} ${fmt(fl.ks)})`; }
    const flAll = $(prefix + '-floor');
    if (flAll) flAll.textContent = `${fmt(fl.tv)} · ${fmt(fl.spread / EXACT_SPREAD(), 2)} · ${fmt(fl.ks)}`;
    return e;
  }

  /* ============================================================ 1. board */
  const board = { t: 0, playing: !reduced, arrows: false, last: 0 };
  function drawBoardSection() {
    if (!visible($('board-forward')) && !visible($('board-marginal'))) return;
    V.drawScene($('board-forward'), { lens: shared.lens, t: board.t, arrows: board.arrows, label: `t = ${board.t.toFixed(3)}` });
    Plot.draw($('board-marginal'), [{ points: marginalSeries(board.t), color: BLUE, label: txt('lbl-marginal'), fill: true }], { xlabel: 'x', yrange: [0, Math.max(0.6, 1.05 * Math.max(...marginalSeries(board.t).map((p) => p[1])))] });
    $('board-variance').textContent = fmt(M.variance(board.t), 4);
    $('board-contrast').textContent = fmt(V.slotContrast(board.t), 3);
    $('board-snr').textContent = board.t > 0 ? fmt(M.snr(board.t), 2) : '∞';
    $('board-time').value = timeToSlider(board.t);
    $('board-time-out').textContent = board.t.toFixed(4);
  }
  $('board-time').addEventListener('input', () => { board.playing = false; setPlay($('board-play'), false); board.t = sliderToTime(+$('board-time').value); light(['kernel', 'marginal', 'fokker-planck']); drawBoardSection(); });
  $('board-play').addEventListener('click', () => { if (board.t >= 1) board.t = 0; board.playing = !board.playing; setPlay($('board-play'), board.playing); });
  $('board-arrows').addEventListener('change', () => { board.arrows = $('board-arrows').checked; light(['landscape']); drawBoardSection(); });

  /* =========================================================== 2. family */
  const family = { eta: 1, progress: 0, playing: !reduced, startSeed: 11, noiseSeed: 23, colors: true, paths: true, run: null, selected: -1, colorList: null };
  function familyRun() {
    family.run = S.run({ T: 1, eta: family.eta, steps: 256, count: 1024, startSeed: family.startSeed, noiseSeed: family.noiseSeed, exactStart: true, trackPaths: 24, snapshots: 60 });
    family.colorList = V.startColors(family.run.startXs, family.run.startYs);
    const e = metricsInto('family', family.run.xs, family.run.ys, 1024);
    family.bars = e;
  }
  function drawFamily() {
    if (!family.run) familyRun();
    if (!visible($('family-board')) && !visible($('family-bars'))) return;
    const fr = frameAt(family.run, family.progress);
    const upto = Math.floor((1 - fr.t) * 256) + 1;
    const f = V.drawScene($('family-board'), {
      lens: shared.lens, t: fr.t, xs: fr.xs, ys: fr.ys, colors: family.colors ? family.colorList : null,
      paths: family.paths ? family.run.paths : null, pathsUpto: upto, reveal: reveal(fr.xs, fr.ys),
      label: `η = ${family.eta.toFixed(2)} · t = ${fr.t.toFixed(3)}`,
    });
    if (family.selected >= 0) {
      const n = family.selected;
      const path = family.run.paths[n];
      if (path) V.drawPaths(f, [path], { upto, color: RED, width: 2 });
      V.drawPieces(f, [fr.xs[n]], [fr.ys[n]], { lens: 'landscape', color: RED, size: 5 });
    }
    Bars.draw($('family-bars'), family.bars.frequencies, family.bars.masses, { labelLeft: txt('lbl-slots') });
    $('family-eta-out').textContent = family.eta.toFixed(2);
    $('family-progress').value = family.progress;
    $('family-progress-out').textContent = `${txt('lbl-time-t')} ${fr.t.toFixed(3)}`;
  }
  $('family-eta').addEventListener('input', () => { family.eta = +$('family-eta').value; light(['eta-family', 'toy-step']); familyRun(); drawFamily(); });
  $('family-progress').addEventListener('input', () => { family.playing = false; setPlay($('family-play'), false); family.progress = +$('family-progress').value; drawFamily(); });
  $('family-play').addEventListener('click', () => { if (family.progress >= 1) family.progress = 0; family.playing = !family.playing; setPlay($('family-play'), family.playing); });
  $('family-noise').addEventListener('click', () => { family.noiseSeed++; light(['reverse-sde']); familyRun(); drawFamily(); });
  $('family-starts').addEventListener('click', () => { family.startSeed++; familyRun(); drawFamily(); });
  $('family-colors').addEventListener('change', () => { family.colors = $('family-colors').checked; light(['flow-map', 'noncross']); drawFamily(); });
  $('family-paths').addEventListener('change', () => { family.paths = $('family-paths').checked; drawFamily(); });
  $('family-board').addEventListener('pointerdown', (e) => {
    const canvas = $('family-board');
    const f = V.frameOf(canvas);
    const r = canvas.getBoundingClientRect();
    const [wx, wy] = f.unmap(e.clientX - r.left, e.clientY - r.top);
    const fr = frameAt(family.run, family.progress);
    let best = Infinity;
    for (let n = 0; n < 24; n++) { const d = Math.hypot(fr.xs[n] - wx, fr.ys[n] - wy); if (d < best) { best = d; family.selected = n; } }
    drawFamily();
  });

  /* ============================================================== 3. lab */
  const lab = {
    T: 1, start: 'exact', bias: 0, smooth: 0, nfe: 128, solver: 'auto', eta: 1, count: 2048,
    noiseSeed: 23, startSeed: 11, progress: 1, playing: false, run: null, timer: null,
  };
  function labSteps() {
    const method = lab.eta > 0 ? 'em' : (lab.solver === 'auto' ? 'heun' : lab.solver);
    return { method, steps: Math.max(1, method === 'heun' ? Math.round(lab.nfe / 2) : lab.nfe) };
  }
  function labRun() {
    const { steps } = labSteps();
    const t0 = performance.now();
    lab.run = S.run({
      T: lab.T, eta: lab.eta, steps, solver: lab.eta > 0 ? 'auto' : lab.solver, count: lab.count,
      startSeed: lab.startSeed, noiseSeed: lab.noiseSeed, exactStart: lab.start === 'exact',
      error: { bias: [lab.bias, 0], smooth: lab.smooth }, trackPaths: 0, snapshots: 60,
    });
    lab.bars = metricsInto('lab', lab.run.xs, lab.run.ys, lab.count);
    $('lab-step').textContent = `h = ${(lab.T / steps).toFixed(4)} · ${lab.run.nfe}`;
    $('lab-snr').textContent = `${fmt(M.snr(lab.T), 2)} · KL ≤ ${fmt(M.klBound(lab.T), 3)}`;
    $('lab-status').textContent = `${txt('status-done')} ${Math.round(performance.now() - t0)} ms`;
  }
  function drawLab() {
    if (!lab.run) labRun();
    if (!visible($('lab-board')) && !visible($('lab-bars'))) return;
    const fr = frameAt(lab.run, lab.progress, lab.T);
    V.drawScene($('lab-board'), { lens: shared.lens, t: fr.t, xs: fr.xs, ys: fr.ys, reveal: reveal(fr.xs, fr.ys), label: `T = ${lab.T.toFixed(2)} · η = ${lab.eta.toFixed(2)} · t = ${fr.t.toFixed(3)}` });
    Bars.draw($('lab-bars'), lab.bars.frequencies, lab.bars.masses, { labelLeft: txt('lbl-slots') });
    $('lab-progress').value = lab.progress;
    $('lab-progress-out').textContent = `${txt('lbl-time-t')} ${fr.t.toFixed(3)}`;
  }
  function labChanged(lights, replay = true) {
    light(lights);
    $('lab-T-out').textContent = lab.T.toFixed(2);
    $('lab-bias-out').textContent = lab.bias.toFixed(1);
    $('lab-smooth-out').textContent = lab.smooth.toFixed(3);
    $('lab-eta-out').textContent = lab.eta.toFixed(2);
    $('lab-solver').disabled = lab.eta > 0;
    $('lab-status').textContent = txt('status-running');
    clearTimeout(lab.timer);
    lab.timer = setTimeout(() => {
      labRun();
      if (replay && !reduced) { lab.progress = 0; lab.playing = true; setPlay($('lab-play'), true); } else { lab.progress = 1; }
      drawLab();
    }, 60);
  }
  $('lab-T').addEventListener('input', () => { lab.T = +$('lab-T').value; $('prior-T').value = lab.T; drawPrior(); labChanged(['prior', 'snr', 'kl-bound']); });
  for (const r of document.querySelectorAll('input[name=lab-start]')) r.addEventListener('change', () => { lab.start = r.value; labChanged(['prior', 'substitutions']); });
  $('lab-bias').addEventListener('input', () => { lab.bias = +$('lab-bias').value; labChanged(['score', 'perturbed']); });
  $('lab-smooth').addEventListener('input', () => { lab.smooth = +$('lab-smooth').value; labChanged(['score', 'perturbed']); });
  $('lab-nfe').addEventListener('change', () => { lab.nfe = +$('lab-nfe').value; labChanged(['grid', 'em', 'euler-ode', 'heun']); });
  $('lab-solver').addEventListener('change', () => { lab.solver = $('lab-solver').value; labChanged(['grid', 'heun']); });
  $('lab-eta').addEventListener('input', () => { lab.eta = +$('lab-eta').value; labChanged(['process', 'eta-family', 'toy-step']); });
  $('lab-count').addEventListener('change', () => { lab.count = +$('lab-count').value; labChanged(['metrics'], false); });
  $('lab-noise').addEventListener('click', () => { lab.noiseSeed++; labChanged(['toy-step']); });
  $('lab-progress').addEventListener('input', () => { lab.playing = false; setPlay($('lab-play'), false); lab.progress = +$('lab-progress').value; drawLab(); });
  $('lab-play').addEventListener('click', () => { if (lab.progress >= 1) lab.progress = 0; lab.playing = !lab.playing; setPlay($('lab-play'), lab.playing); });
  $('lab-reset').addEventListener('click', () => {
    Object.assign(lab, { T: 1, start: 'exact', bias: 0, smooth: 0, nfe: 128, solver: 'auto', eta: 1 });
    $('lab-T').value = 1; $('prior-T').value = 1; $('lab-bias').value = 0; $('lab-smooth').value = 0; $('lab-nfe').value = '128'; $('lab-solver').value = 'auto'; $('lab-eta').value = 1;
    document.querySelector('input[name=lab-start][value=exact]').checked = true;
    drawPrior();
    labChanged(['substitutions']);
  });

  /* 3.1 prior */
  const klCurve = (() => {
    const Ts = [];
    for (let e = Math.log(0.25); e <= Math.log(4) + 1e-9; e += (Math.log(4) - Math.log(0.25)) / 10) Ts.push(Math.exp(e));
    return { Ts, bound: Ts.map((t) => [t, M.klBound(t)]), numeric: null };
  })();
  function drawPrior() {
    const Tv = +$('prior-T').value;
    $('prior-T-out').textContent = Tv.toFixed(2);
    if (!visible($('prior-marginal')) && !visible($('prior-kl'))) return;
    if (!klCurve.numeric) klCurve.numeric = klCurve.Ts.map((t) => [t, M.klNumeric(t, 110)]);
    const lo = -3.2 * Math.sqrt(Tv) - 0.9;
    const hi = -lo;
    const pT = [];
    const prior = [];
    for (let i = 0; i <= 240; i++) {
      const x = lo + (hi - lo) * i / 240;
      pT.push([x, M.marginalX(x, Tv)]);
      prior.push([x, Math.exp(-x * x / (2 * Tv)) / Math.sqrt(2 * Math.PI * Tv)]);
    }
    Plot.draw($('prior-marginal'), [
      { points: pT, color: BLUE, label: txt('lbl-pT'), width: 1.8 },
      { points: prior, color: RED, dash: [5, 4], label: txt('lbl-prior') },
    ], { xlabel: 'x', yrange: [0, 1.1 * Math.max(...pT.map((p) => p[1]), ...prior.map((p) => p[1]))] });
    Plot.draw($('prior-kl'), [
      { points: klCurve.bound, color: RED, dash: [5, 4], label: txt('lbl-bound') },
      { points: klCurve.numeric, color: BLUE, label: txt('lbl-klnum'), marker: true },
    ], { xlog: true, ylog: true, xlabel: 'T', vline: Tv, marginLeft: 50 });
    const klNow = M.klNumeric(Tv, 90);
    $('prior-readout').textContent = `SNR(T) = ${fmt(M.snr(Tv), 2)} · KL ≤ ${fmt(M.klBound(Tv), 3)} · KL = ${fmt(klNow, 4)}`;
  }
  $('prior-T').addEventListener('input', () => { lab.T = +$('prior-T').value; $('lab-T').value = lab.T; light(['snr', 'kl-bound', 'prior']); drawPrior(); labChanged(['snr', 'kl-bound', 'prior'], false); });

  /* 3.2 score */
  function drawScore() {
    const t = sliderToTime(+$('score-time').value);
    const bias = +$('score-bias').value;
    const smooth = +$('score-smooth').value;
    $('score-time-out').textContent = t.toFixed(4);
    $('score-bias-out').textContent = bias.toFixed(1);
    $('score-smooth-out').textContent = smooth.toFixed(3);
    if (!visible($('score-exact'))) return;
    V.drawScene($('score-exact'), { lens: shared.lens, t, arrows: true, label: `${txt('lbl-exact-field')} · t = ${t.toFixed(3)}` });
    V.drawScene($('score-perturbed'), { lens: shared.lens, t, arrows: true, error: { bias: [bias, 0], smooth }, label: `${txt('lbl-perturbed-field')} · b = (${bias.toFixed(1)}, 0), δ = ${smooth.toFixed(3)}` });
  }
  for (const id of ['score-time', 'score-bias', 'score-smooth']) $(id).addEventListener('input', () => { light(['perturbed', 'dsm-min']); drawScore(); });
  $('score-apply').addEventListener('click', () => {
    lab.bias = +$('score-bias').value; lab.smooth = +$('score-smooth').value;
    $('lab-bias').value = lab.bias; $('lab-smooth').value = lab.smooth;
    labChanged(['score', 'perturbed']);
    $('lab').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  });

  /* 3.3 grid */
  const grid = { data: null, running: false };
  async function computeGrid() {
    if (grid.running) return;
    grid.running = true;
    $('grid-status').textContent = txt('status-running');
    const nfes = [8, 16, 32, 64, 128, 256, 512];
    const methods = [['em', 1], ['euler', 0], ['heun', 0]];
    const out = { em: [], euler: [], heun: [] };
    const t0 = performance.now();
    for (const nfe of nfes) {
      for (const [method, eta] of methods) {
        await new Promise((r) => setTimeout(r, 0));
        const steps = method === 'heun' ? nfe / 2 : nfe;
        const run = S.run({ T: 1, eta, steps, solver: eta > 0 ? 'auto' : method, count: 2048, exactStart: true });
        out[method].push({ nfe, spread: S.spread(run.xs, run.ys) / EXACT_SPREAD(), ks: S.ksX(run.xs) });
        $('grid-status').textContent = `${txt('status-running')} ${nfe} · ${method}`;
      }
    }
    grid.data = out;
    grid.running = false;
    $('grid-status').textContent = `${txt('status-done')} ${Math.round(performance.now() - t0)} ms`;
    drawGrid();
  }
  function drawGrid() {
    if (!grid.data && !grid.running && visible($('grid-spread'))) setTimeout(computeGrid, 300);
    if (!grid.data) {
      Plot.draw($('grid-spread'), [], { xlog: true, xlabel: txt('lbl-evals'), xrange: [8, 512], yrange: [0.5, 4], ylabel: txt('lbl-spread-ratio') });
      Plot.draw($('grid-ks'), [], { xlog: true, xlabel: txt('lbl-evals'), xrange: [8, 512], yrange: [0.01, 0.3], ylog: true, ylabel: txt('lbl-ks') });
      return;
    }
    const fl = floors(2048);
    const series = (key) => [
      { points: grid.data.em.map((d) => [d.nfe, d[key]]), color: RED, label: txt('lbl-em'), marker: true },
      { points: grid.data.euler.map((d) => [d.nfe, d[key]]), color: BLUE, label: txt('lbl-euler'), marker: true },
      { points: grid.data.heun.map((d) => [d.nfe, d[key]]), color: '#2f7f74', label: txt('lbl-heun'), marker: true },
    ];
    Plot.draw($('grid-spread'), series('spread'), { xlog: true, ylog: true, xlabel: txt('lbl-evals'), ylabel: txt('lbl-spread-ratio'), hlines: [{ y: fl.spread / EXACT_SPREAD(), label: txt('lbl-floor') }] });
    Plot.draw($('grid-ks'), series('ks'), { xlog: true, ylog: true, xlabel: txt('lbl-evals'), ylabel: txt('lbl-ks'), hlines: [{ y: fl.ks, label: txt('lbl-floor') }] });
  }
  $('grid-run').addEventListener('click', computeGrid);

  /* =========================================================== 4. budget */
  const sweep = { data: null, running: false };
  const SWEEP = B.SWEEP;
  async function computeSweeps() {
    if (sweep.running) return;
    sweep.running = true;
    const out = { T: { 0: [], 1: [] }, bias: { 0: [], 1: [] }, smooth: { 0: [], 1: [] }, nfe: { 0: [], 1: [] } };
    const t0 = performance.now();
    let done = 0;
    const total = B.total();
    for (const kind of Object.keys(SWEEP)) {
      for (const eta of [0, 1]) {
        for (const value of SWEEP[kind].values) {
          await new Promise((r) => setTimeout(r, 0));
          out[kind][eta].push(B.runOnce(kind, value, eta));
          done++;
          $('sweep-status').textContent = `${txt('status-running')} ${done}/${total}`;
          if (done % 4 === 0) { sweep.data = out; drawSweeps(); }
        }
      }
    }
    sweep.data = out;
    sweep.running = false;
    $('sweep-status').textContent = `${txt('status-done')} ${(Math.round(performance.now() - t0) / 1000).toFixed(1)} s`;
    drawSweeps();
  }
  function drawSweeps() {
    const d = sweep.data;
    const fl = floors(2048);
    const mk = (kind, key, o) => {
      const s = [];
      if (d && d[kind]) {
        s.push({ points: d[kind][0].map((p) => [p.x, p[key]]), color: BLUE, label: txt('lbl-eta0'), marker: true });
        s.push({ points: d[kind][1].map((p) => [p.x, p[key]]), color: RED, label: txt('lbl-eta1'), marker: true });
      }
      return [s, o];
    };
    let [s, o] = mk('T', 'tv', { xlog: true, xlabel: txt('lbl-T'), ylabel: txt('lbl-tv'), hlines: [{ y: fl.tv, label: txt('lbl-floor') }], xrange: [0.25, 4], yrange: [0, 0.3] });
    Plot.draw($('sweep-T'), s, o);
    [s, o] = mk('bias', 'tv', { xlabel: txt('lbl-tilt'), ylabel: txt('lbl-tv'), hlines: [{ y: fl.tv, label: txt('lbl-floor') }], xrange: [0, 2], yrange: [0, 0.7] });
    Plot.draw($('sweep-bias'), s, o);
    [s, o] = mk('smooth', 'spread', { xlabel: txt('lbl-blur'), ylabel: txt('lbl-spread-ratio'), hlines: [{ y: fl.spread / EXACT_SPREAD(), label: txt('lbl-floor') }], xrange: [0, 0.1], yrange: [0.8, 3.2] });
    Plot.draw($('sweep-smooth'), s, o);
    [s, o] = mk('nfe', 'spread', { xlog: true, ylog: true, xlabel: txt('lbl-evals'), ylabel: txt('lbl-spread-ratio'), hlines: [{ y: fl.spread / EXACT_SPREAD(), label: txt('lbl-floor') }], xrange: [8, 512] });
    Plot.draw($('sweep-nfe'), s, o);
  }
  $('sweep-run').addEventListener('click', computeSweeps);
  fetch(new URL('sweeps.json', document.currentScript ? document.currentScript.src : location.href)).then((r) => (r.ok ? r.json() : null)).then((json) => {
    if (json && !sweep.data) { sweep.data = json; $('sweep-status').textContent = txt('status-precomputed'); drawSweeps(); }
  }).catch(() => { /* the button still works */ });

  /* ======================================================= chrome & loop */
  function setLens(lens) {
    shared.lens = lens;
    for (const b of document.querySelectorAll('.lens-switch button')) b.setAttribute('aria-pressed', String(b.dataset.lens === lens));
    try { localStorage.setItem('board-lens', lens); } catch (e) { /* ignore */ }
    drawAll();
  }
  for (const b of document.querySelectorAll('.lens-switch button')) b.addEventListener('click', () => setLens(b.dataset.lens));
  for (const b of document.querySelectorAll('.language-switch button')) b.addEventListener('click', () => T.setLanguage(b.dataset.lang));
  try { const l = localStorage.getItem('board-lens'); if (l === 'puzzle' || l === 'landscape') shared.lens = l; } catch (e) { /* ignore */ }
  for (const b of document.querySelectorAll('.lens-switch button')) b.setAttribute('aria-pressed', String(b.dataset.lens === shared.lens));

  function drawAll() {
    drawBoardSection();
    drawFamily();
    drawLab();
    drawPrior();
    drawScore();
    drawGrid();
    drawSweeps();
  }
  function relabel() {
    setPlay($('board-play'), board.playing);
    setPlay($('family-play'), family.playing);
    setPlay($('lab-play'), lab.playing);
    renderEquations();
    renderInlineMath(document.querySelector('main'));
    renderInlineMath(document.querySelector('.topbar'));
    renderInlineMath(document.querySelector('.contents'));
    if (lab.run) metricsInto('lab', lab.run.xs, lab.run.ys, lab.count);
    if (family.run) metricsInto('family', family.run.xs, family.run.ys, 1024);
    drawAll();
  }
  window.addEventListener('languagechange', relabel);

  // reading progress and active section
  const navLinks = Array.from(document.querySelectorAll('.contents nav a'));
  function onScroll() {
    const h = document.documentElement;
    $('reading-progress').style.width = `${100 * h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)}%`;
    let active = null;
    for (const link of navLinks) { const sec = document.querySelector(link.getAttribute('href')); if (sec && sec.getBoundingClientRect().top < 140) active = link; }
    for (const link of navLinks) link.classList.toggle('active', link === active);
    drawAll();
  }
  let queued = false;
  for (const ev of ['scroll', 'resize']) window.addEventListener(ev, () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; onScroll(); }); }, { passive: true });
  window.addEventListener('boardphotoload', drawAll);

  let last = 0;
  function tick(now) {
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    if (!document.hidden) {
      if (board.playing && visible($('board-forward'))) { board.t = sliderToTime(Math.min(1, timeToSlider(board.t) + dt / 14)); if (board.t >= 1) { board.playing = false; setPlay($('board-play'), false); } drawBoardSection(); }
      if (family.playing && visible($('family-board'))) { family.progress = Math.min(1, family.progress + dt / 10); if (family.progress >= 1) { family.playing = false; setPlay($('family-play'), false); } drawFamily(); }
      if (lab.playing && visible($('lab-board'))) { lab.progress = Math.min(1, lab.progress + dt / 6); if (lab.progress >= 1) { lab.playing = false; setPlay($('lab-play'), false); } drawLab(); }
    }
    requestAnimationFrame(tick);
  }

  // boot (T.apply() fires 'languagechange', which runs relabel and the first draw)
  $('lab-solver').disabled = lab.eta > 0;
  $('lab-T-out').textContent = lab.T.toFixed(2); $('lab-bias-out').textContent = lab.bias.toFixed(1); $('lab-smooth-out').textContent = lab.smooth.toFixed(3); $('lab-eta-out').textContent = lab.eta.toFixed(2);
  T.apply();
  onScroll();
  requestAnimationFrame(tick);
})();
