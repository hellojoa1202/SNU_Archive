/* app.js — controls for the four experiments. Numerical work is in model.js,
 * sampler.js and budget.js; drawing in puzzle.js. Equation terms carry data-link
 * names; each experiment keeps the term it shows highlighted and flashes the
 * term a control just changed. */
(function () {
  'use strict';
  const M = window.BoardModel;
  const S = window.BoardSampler;
  const B = window.BoardBudget;
  const P = window.Puzzle;
  const T = window.BoardText;
  const $ = (id) => document.getElementById(id);
  const txt = (k) => T.text(k);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shared = { lens: 'puzzle' };

  /* ---------------------------------------------------------------- helpers */
  const floors = {};
  function floor(N) {
    if (!floors[N]) { const d = S.exactDraws(N); floors[N] = { tv: S.slotError(d.xs, d.ys).tv, spread: S.spread(d.xs, d.ys) / S.exactSpread(), ks: S.ksX(d.xs) }; }
    return floors[N];
  }
  const fmt = (v, d = 3) => (Number.isFinite(v) ? v.toFixed(d) : '–');
  const visible = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.bottom > -60 && r.top < innerHeight + 60; };
  const sliderToTime = (u, Tt = 1) => Tt * u * u * u;
  const timeToSlider = (t, Tt = 1) => Math.cbrt(Math.max(0, t / Tt));
  const progressToTime = (p, Tt) => Tt * Math.pow(1 - p, 3);
  function setPlay(btn, playing) { btn.textContent = playing ? txt('btn-pause') : txt('btn-play'); btn.setAttribute('aria-pressed', String(playing)); }

  /** State at time t, interpolated between the two nearest snapshots of a run. */
  function frameAtTime(run, t) {
    const fr = run.frames;
    if (fr.length === 1) return fr[0];
    let i = 0;
    while (i < fr.length - 2 && fr[i + 1].t > t) i++;
    const a = fr[i];
    const b = fr[i + 1];
    const w = a.t === b.t ? 1 : Math.min(1, Math.max(0, (a.t - t) / (a.t - b.t)));
    const xs = new Float64Array(a.xs.length);
    const ys = new Float64Array(a.xs.length);
    for (let n = 0; n < xs.length; n++) { xs[n] = a.xs[n] + w * (b.xs[n] - a.xs[n]); ys[n] = a.ys[n] + w * (b.ys[n] - a.ys[n]); }
    return { t: a.t + w * (b.t - a.t), xs, ys };
  }
  function reveal(xs, ys) {
    const f = S.slotFrequencies(xs, ys);
    const m = M.slotMasses(0);
    return Array.from(f, (v, k) => Math.min(1, v / m[k]));
  }
  function marginalSeries(t) { const pts = []; for (let i = 0; i <= 240; i++) { const x = -1.6 + 3.2 * i / 240; pts.push([x, M.marginalX(x, t)]); } return pts; }

  /* equation highlighting: persistent focus per equation + a short flash */
  function focus(equation, names) {
    const eq = document.querySelector(`.equation[data-equation="${equation}"]`);
    if (!eq) return;
    for (const el of eq.querySelectorAll('[data-link]')) el.classList.toggle('active', names.includes(el.dataset.link));
  }
  function flash(names) {
    for (const el of document.querySelectorAll('.equation [data-link]')) if (names.includes(el.dataset.link)) el.classList.add('active', 'flash');
    clearTimeout(flash.timer);
    flash.timer = setTimeout(() => { for (const el of document.querySelectorAll('.equation .flash')) { el.classList.remove('flash'); if (!el.dataset.keep) el.classList.remove('active'); } restoreFocus(); }, 1500);
  }
  const focusState = {};
  function setFocus(equation, names) { focusState[equation] = names; focus(equation, names); }
  function restoreFocus() { for (const [eq, names] of Object.entries(focusState)) focus(eq, names); }

  /** Draw one scene: board or contours, then pieces (puzzle) and sample dots. */
  function scene(canvas, { t, xs = null, ys = null, colors = null, revealMap = null, arrows = null, selected = -1, path = null, label = '' }) {
    const f = P.frame(canvas);
    if (shared.lens === 'contour') {
      P.contours(f, t);
      P.board(f, 0.5);
    } else {
      P.board(f, 1);
      P.pieces(f, revealMap || P.slotContrast(t));
    }
    if (arrows) P.arrows(f, t, arrows.error || null, shared.lens === 'contour' ? 'rgba(23,40,62,.5)' : 'rgba(23,40,62,.38)');
    if (path) P.line(f, path, P.RED, 1.6);
    let shown = 0;
    if (xs) shown = P.dots(f, xs, ys, { colors, r: shared.lens === 'contour' ? 2 : 2.1 });
    if (selected >= 0 && xs) { P.dot(f, [xs[selected], ys[selected]], '#fff', 6); P.dot(f, [xs[selected], ys[selected]], P.RED, 4); }
    if (label) P.text(f, label + (xs && shown < xs.length ? `  ·  ${shown} / ${xs.length}` : ''), [P.WINDOW.x0 + 0.03, P.WINDOW.y1 - 0.05], P.INK, 10);
    return f;
  }

  /* ================================================================ 1 forward */
  const fw = { t: 0, playing: !reduced, arrows: false };
  function drawForward() {
    $('forward-time').value = timeToSlider(fw.t);
    $('forward-time-out').textContent = fw.t.toFixed(4);
    $('forward-variance').textContent = fmt(M.variance(fw.t), 4);
    $('forward-contrast').textContent = fmt(P.slotContrast(fw.t), 3);
    $('forward-snr').textContent = fw.t > 0 ? fmt(M.snr(fw.t), 2) : '∞';
    if (!visible($('forward-board'))) return;
    scene($('forward-board'), { t: fw.t, arrows: fw.arrows ? {} : null, label: `t = ${fw.t.toFixed(4)}` });
    const pts = marginalSeries(fw.t);
    P.plot($('forward-marginal'), [{ points: pts, color: P.BLUE, label: txt('lbl-marginal'), fill: true }], { xlabel: 'x', yrange: [0, Math.max(0.5, 1.08 * Math.max(...pts.map((p) => p[1])))] });
  }
  $('forward-time').addEventListener('input', () => { fw.playing = false; setPlay($('forward-play'), false); fw.t = sliderToTime(+$('forward-time').value); flash(['time']); drawForward(); });
  $('forward-play').addEventListener('click', () => { if (fw.t >= 1) fw.t = 0; fw.playing = !fw.playing; setPlay($('forward-play'), fw.playing); });
  $('forward-arrows').addEventListener('change', () => { fw.arrows = $('forward-arrows').checked; flash(['mixture']); drawForward(); });
  setFocus('marginal', ['time']);

  /* ================================================================= 2 family */
  const fam = { eta: 1, progress: 0, playing: !reduced, startSeed: 11, noiseSeed: 23, colors: true, run: null, selected: -1 };
  function familyRun() {
    fam.run = S.run({ T: 1, eta: fam.eta, steps: 256, count: 1024, startSeed: fam.startSeed, noiseSeed: fam.noiseSeed, exactStart: true, trackPaths: 1024, snapshots: 60 });
    fam.colorList = P.startColors(fam.run.startXs, fam.run.startYs);
    fam.err = S.slotError(fam.run.xs, fam.run.ys);
    $('family-tv').textContent = fmt(fam.err.tv);
    $('family-spread').textContent = fmt(S.spread(fam.run.xs, fam.run.ys) / S.exactSpread(), 2);
    const fl = floor(1024);
    $('family-floor').textContent = `${fmt(fl.tv)} · ${fmt(fl.spread, 2)}`;
  }
  function drawFamily() {
    if (!fam.run) familyRun();
    $('family-eta-out').textContent = fam.eta.toFixed(2);
    $('family-progress').value = fam.progress;
    const fr = frameAtTime(fam.run, progressToTime(fam.progress, 1));
    $('family-progress-out').textContent = `${txt('lbl-noise-time')} ${fr.t.toFixed(3)}`;
    if (!visible($('family-board'))) return;
    const upto = Math.floor((1 - fr.t) * 256) + 1;
    const path = fam.selected >= 0 ? fam.run.paths[fam.selected].slice(0, upto) : null;
    scene($('family-board'), { t: fr.t, xs: fr.xs, ys: fr.ys, colors: fam.colors ? fam.colorList : null, revealMap: reveal(fr.xs, fr.ys), selected: fam.selected, path, label: `η = ${fam.eta.toFixed(2)} · t = ${fr.t.toFixed(3)}` });
    P.bars($('family-bars'), fam.err.frequencies, fam.err.masses, { left: txt('lbl-slots') });
  }
  $('family-eta').addEventListener('input', () => { fam.eta = +$('family-eta').value; flash(['eta', 'randomness']); familyRun(); drawFamily(); });
  $('family-progress').addEventListener('input', () => { fam.playing = false; setPlay($('family-play'), false); fam.progress = +$('family-progress').value; drawFamily(); });
  $('family-play').addEventListener('click', () => { if (fam.progress >= 1) fam.progress = 0; fam.playing = !fam.playing; setPlay($('family-play'), fam.playing); });
  $('family-noise').addEventListener('click', () => { fam.noiseSeed++; flash(['randomness']); familyRun(); drawFamily(); });
  $('family-starts').addEventListener('click', () => { fam.startSeed++; familyRun(); drawFamily(); });
  $('family-colors').addEventListener('change', () => { fam.colors = $('family-colors').checked; drawFamily(); });
  $('family-board').addEventListener('pointerdown', (e) => {
    const [wx, wy] = P.point($('family-board'), e);
    const fr = frameAtTime(fam.run, progressToTime(fam.progress, 1));
    let best = Infinity;
    for (let n = 0; n < Math.min(600, fr.xs.length); n++) { const d = Math.hypot(fr.xs[n] - wx, fr.ys[n] - wy); if (d < best) { best = d; fam.selected = n; } }
    drawFamily();
  });
  setFocus('eta-family', ['score', 'randomness']);

  /* ==================================================================== 3 lab */
  const lab = { tab: 'start', T: 1, start: 'exact', bias: 0, smooth: 0, nfe: 128, method: 'auto', eta: 1, count: 2048, noiseSeed: 23, startSeed: 11, progress: 1, playing: false, arrows: false, run: null, timer: null };
  const TAB_LINKS = { start: ['start'], score: ['score-term'], grid: ['grid'] };
  function labSteps() { const method = lab.eta > 0 ? 'em' : (lab.method === 'auto' ? 'heun' : lab.method); return { method, steps: Math.max(1, method === 'heun' ? Math.round(lab.nfe / 2) : lab.nfe) }; }
  function labRun() {
    const { steps } = labSteps();
    const t0 = performance.now();
    lab.run = S.run({ T: lab.T, eta: lab.eta, steps, solver: lab.eta > 0 ? 'auto' : lab.method, count: lab.count, startSeed: lab.startSeed, noiseSeed: lab.noiseSeed, exactStart: lab.start === 'exact', error: { bias: [lab.bias, 0], smooth: lab.smooth }, snapshots: 60 });
    lab.err = S.slotError(lab.run.xs, lab.run.ys);
    const fl = floor(lab.count);
    $('lab-tv').textContent = fmt(lab.err.tv); $('lab-tv-floor').textContent = `${txt('lbl-floor')} ${fmt(fl.tv)}`;
    $('lab-spread').textContent = fmt(S.spread(lab.run.xs, lab.run.ys) / S.exactSpread(), 2); $('lab-spread-floor').textContent = `${txt('lbl-floor')} ${fmt(fl.spread, 2)}`;
    $('lab-ks').textContent = fmt(S.ksX(lab.run.xs)); $('lab-ks-floor').textContent = `${txt('lbl-floor')} ${fmt(fl.ks)}`;
    $('lab-step').textContent = (lab.T / steps).toFixed(4); $('lab-nfe-out').textContent = String(lab.run.nfe);
    $('lab-status').textContent = `${txt('status-done')} · ${Math.round(performance.now() - t0)} ms`;
  }
  function labReadouts() {
    $('lab-T-out').textContent = lab.T.toFixed(2); $('lab-bias-out').textContent = lab.bias.toFixed(1); $('lab-smooth-out').textContent = lab.smooth.toFixed(3); $('lab-eta-out').textContent = lab.eta.toFixed(2);
    $('lab-snr').textContent = fmt(M.snr(lab.T), 2); $('lab-klbound').textContent = fmt(M.klBound(lab.T), 3);
    if (lab.klT !== lab.T) { lab.klT = lab.T; lab.kl = M.klNumeric(lab.T, 100); }
    $('lab-kl').textContent = fmt(lab.kl, 4);
    $('lab-method').disabled = lab.eta > 0;
  }
  function drawLab() {
    if (!lab.run) labRun();
    labReadouts();
    $('lab-progress').value = lab.progress;
    const fr = frameAtTime(lab.run, progressToTime(lab.progress, lab.T));
    $('lab-progress-out').textContent = `${txt('lbl-noise-time')} ${fr.t.toFixed(3)}`;
    if (!visible($('lab-board'))) return;
    const arrows = lab.arrows && lab.tab === 'score' ? { error: { bias: [lab.bias, 0], smooth: lab.smooth } } : null;
    scene($('lab-board'), { t: arrows ? 0.02 : fr.t, xs: arrows ? null : fr.xs, ys: fr.ys, revealMap: reveal(fr.xs, fr.ys), arrows, label: arrows ? `s̃ at t = 0.02 · b = (${lab.bias.toFixed(1)}, 0), δ = ${lab.smooth.toFixed(3)}` : `T = ${lab.T.toFixed(2)} · η = ${lab.eta.toFixed(2)} · t = ${fr.t.toFixed(3)}` });
    P.bars($('lab-bars'), lab.err.frequencies, lab.err.masses, { left: txt('lbl-slots') });
  }
  function labChanged(links, replay = true) {
    flash(links);
    labReadouts();
    $('lab-status').textContent = txt('status-running');
    clearTimeout(lab.timer);
    lab.timer = setTimeout(() => { labRun(); if (replay && !reduced) { lab.progress = 0; lab.playing = true; setPlay($('lab-play'), true); } else lab.progress = 1; drawLab(); }, 50);
  }
  function selectTab(tab) {
    lab.tab = tab;
    for (const b of document.querySelectorAll('.tabs [role=tab]')) b.setAttribute('aria-selected', String(b.dataset.tab === tab));
    for (const p of document.querySelectorAll('.tab-panels [data-panel]')) p.hidden = p.dataset.panel !== tab;
    setFocus('step', TAB_LINKS[tab]);
    setFocus('surrogate', tab === 'score' ? ['score-term'] : []);
    drawLab();
  }
  for (const b of document.querySelectorAll('.tabs [role=tab]')) b.addEventListener('click', () => selectTab(b.dataset.tab));
  $('lab-T').addEventListener('input', () => { lab.T = +$('lab-T').value; labChanged(['start']); });
  $('lab-start').addEventListener('change', () => { lab.start = $('lab-start').value; labChanged(['start']); });
  $('lab-bias').addEventListener('input', () => { lab.bias = +$('lab-bias').value; labChanged(['tilt', 'score-term']); });
  $('lab-smooth').addEventListener('input', () => { lab.smooth = +$('lab-smooth').value; labChanged(['blur', 'score-term']); });
  $('lab-arrows').addEventListener('change', () => { lab.arrows = $('lab-arrows').checked; drawLab(); });
  $('lab-nfe').addEventListener('change', () => { lab.nfe = +$('lab-nfe').value; labChanged(['grid']); });
  $('lab-method').addEventListener('change', () => { lab.method = $('lab-method').value; labChanged(['grid']); });
  $('lab-eta').addEventListener('input', () => { lab.eta = +$('lab-eta').value; labChanged(['grid']); });
  $('lab-progress').addEventListener('input', () => { lab.playing = false; setPlay($('lab-play'), false); lab.progress = +$('lab-progress').value; drawLab(); });
  $('lab-play').addEventListener('click', () => { if (lab.progress >= 1) lab.progress = 0; lab.playing = !lab.playing; setPlay($('lab-play'), lab.playing); });
  $('lab-noise').addEventListener('click', () => { lab.noiseSeed++; labChanged([]); });
  $('lab-reset').addEventListener('click', () => {
    Object.assign(lab, { T: 1, start: 'exact', bias: 0, smooth: 0, nfe: 128, method: 'auto', eta: 1, arrows: false });
    $('lab-T').value = 1; $('lab-start').value = 'exact'; $('lab-bias').value = 0; $('lab-smooth').value = 0; $('lab-nfe').value = '128'; $('lab-method').value = 'auto'; $('lab-eta').value = 1; $('lab-arrows').checked = false;
    labChanged([]);
  });

  /* ================================================================= 4 budget */
  const sw = { data: null, running: false };
  function drawSweeps() {
    const d = sw.data;
    const fl = floor(2048);
    const mk = (kind, key) => (d && d[kind] ? [
      { points: d[kind][0].map((p) => [p.x, p[key]]), color: P.BLUE, label: txt('lbl-eta0'), marker: true },
      { points: d[kind][1].map((p) => [p.x, p[key]]), color: P.RED, label: txt('lbl-eta1'), marker: true },
    ] : []);
    P.plot($('sweep-T'), mk('T', 'tv'), { xlog: true, xlabel: txt('lbl-T'), ylabel: txt('lbl-tv'), hline: { y: fl.tv, label: txt('lbl-floor') }, xrange: [0.25, 4], yrange: [0, 0.3] });
    P.plot($('sweep-bias'), mk('bias', 'tv'), { xlabel: txt('lbl-tilt'), ylabel: txt('lbl-tv'), hline: { y: fl.tv, label: txt('lbl-floor') }, xrange: [0, 2], yrange: [0, 0.7] });
    P.plot($('sweep-smooth'), mk('smooth', 'spread'), { xlabel: txt('lbl-blur'), ylabel: txt('lbl-spread'), hline: { y: fl.spread, label: txt('lbl-floor') }, xrange: [0, 0.1], yrange: [0.8, 3.2] });
    P.plot($('sweep-nfe'), mk('nfe', 'spread'), { xlog: true, ylog: true, xlabel: txt('lbl-evals'), ylabel: txt('lbl-spread'), hline: { y: fl.spread, label: txt('lbl-floor') }, xrange: [8, 512], yrange: [0.5, 30] });
  }
  async function computeSweeps() {
    if (sw.running) return;
    sw.running = true;
    const out = { T: { 0: [], 1: [] }, bias: { 0: [], 1: [] }, smooth: { 0: [], 1: [] }, nfe: { 0: [], 1: [] } };
    let done = 0;
    const total = B.total();
    const t0 = performance.now();
    for (const kind of Object.keys(B.SWEEP)) for (const eta of [0, 1]) for (const value of B.SWEEP[kind].values) {
      await new Promise((r) => setTimeout(r, 0));
      out[kind][eta].push(B.runOnce(kind, value, eta));
      done++;
      $('sweep-status').textContent = `${txt('status-running')} ${done} / ${total}`;
      if (done % 4 === 0) { sw.data = out; drawSweeps(); }
    }
    sw.data = out;
    sw.running = false;
    $('sweep-status').textContent = `${txt('status-done')} · ${((performance.now() - t0) / 1000).toFixed(1)} s`;
    drawSweeps();
  }
  $('sweep-run').addEventListener('click', computeSweeps);
  fetch(new URL('sweeps.json', document.currentScript ? document.currentScript.src : location.href)).then((r) => (r.ok ? r.json() : null)).then((json) => { if (json && !sw.data) { sw.data = json; $('sweep-status').textContent = txt('status-pre'); drawSweeps(); } }).catch(() => {});

  /* ============================================================ chrome & loop */
  function drawAll() { drawForward(); drawFamily(); drawLab(); drawSweeps(); }
  function setLens(lens) {
    shared.lens = lens;
    for (const b of document.querySelectorAll('.lens-switch button')) b.setAttribute('aria-pressed', String(b.dataset.lens === lens));
    try { localStorage.setItem('board-lens', lens); } catch (e) { /* ignore */ }
    drawAll();
  }
  try { const l = localStorage.getItem('board-lens'); if (l === 'puzzle' || l === 'contour') shared.lens = l; } catch (e) { /* ignore */ }
  for (const b of document.querySelectorAll('.lens-switch button')) { b.setAttribute('aria-pressed', String(b.dataset.lens === shared.lens)); b.addEventListener('click', () => setLens(b.dataset.lens)); }
  for (const b of document.querySelectorAll('.language-switch button')) b.addEventListener('click', () => T.setLanguage(b.dataset.lang));
  window.addEventListener('languagechange', () => { setPlay($('forward-play'), fw.playing); setPlay($('family-play'), fam.playing); setPlay($('lab-play'), lab.playing); restoreFocus(); if (lab.run) labRun(); drawAll(); });

  const navLinks = Array.from(document.querySelectorAll('.contents nav a'));
  let queued = false;
  function onScroll() {
    const h = document.documentElement;
    $('reading-progress').style.width = `${100 * h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)}%`;
    let active = null;
    for (const a of navLinks) { const sec = document.querySelector(a.getAttribute('href')); if (sec && sec.getBoundingClientRect().top < 140) active = a; }
    for (const a of navLinks) a.classList.toggle('active', a === active);
    drawAll();
  }
  for (const ev of ['scroll', 'resize']) window.addEventListener(ev, () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; onScroll(); }); }, { passive: true });
  window.addEventListener('puzzlephotoload', drawAll);

  let last = 0;
  function tick(now) {
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    if (!document.hidden) {
      if (fw.playing && visible($('forward-board'))) { fw.t = sliderToTime(Math.min(1, timeToSlider(fw.t) + dt / 14)); if (fw.t >= 1) { fw.playing = false; setPlay($('forward-play'), false); } drawForward(); }
      if (fam.playing && visible($('family-board'))) { fam.progress = Math.min(1, fam.progress + dt / 10); if (fam.progress >= 1) { fam.playing = false; setPlay($('family-play'), false); } drawFamily(); }
      if (lab.playing && visible($('lab-board'))) { lab.progress = Math.min(1, lab.progress + dt / 6); if (lab.progress >= 1) { lab.playing = false; setPlay($('lab-play'), false); } drawLab(); }
    }
    requestAnimationFrame(tick);
  }

  // boot
  T.apply();
  selectTab('start');
  onScroll();
  requestAnimationFrame(tick);
})();
