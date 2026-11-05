/* app.js — controls for the four experiments. Numerical work lives in model.js,
 * sampler.js and budget.js; drawing in traps.js. Equation terms carry data-link
 * names: each experiment keeps the term it shows highlighted and flashes the term
 * a control has just changed. */
(function () {
  'use strict';
  const M = window.BoardModel;
  const S = window.BoardSampler;
  const B = window.BoardBudget;
  const V = window.Traps;
  const T = window.BoardText;
  const $ = (id) => document.getElementById(id);
  const txt = (k) => T.text(k);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const XL = [-1.4, 1.4];
  const YL = [-1.05, 1.05];
  const XLW = [-3.5, 3.5];
  const YLW = [-2.6, 2.6];
  const GRAY = '#9aa7b4';

  /* ------------------------------------------------------------------ helpers */
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
  function marginalSeries(t) { const pts = []; for (let i = 0; i <= 240; i++) { const x = -1.6 + 3.2 * i / 240; pts.push([x, M.marginalX(x, t)]); } return pts; }

  /* equation highlighting */
  const focusState = {};
  function applyFocus(equation) {
    const eq = document.querySelector(`.equation[data-equation="${equation}"]`);
    if (!eq) return;
    const names = focusState[equation] || [];
    for (const el of eq.querySelectorAll('[data-link]')) el.classList.toggle('active', names.includes(el.dataset.link));
  }
  function setFocus(equation, names) { focusState[equation] = names; applyFocus(equation); }
  function restoreFocus() { for (const eq of Object.keys(focusState)) applyFocus(eq); }
  function flash(names) {
    for (const el of document.querySelectorAll('.equation [data-link]')) if (names.includes(el.dataset.link)) el.classList.add('active');
    clearTimeout(flash.timer);
    flash.timer = setTimeout(restoreFocus, 1500);
  }

  /** A scene: boxed axes, gray contours of p_t, optional arrows, trails, dots, a tracked particle. */
  function scene(canvas, { t, xs = null, ys = null, color = V.BLUE, colors = null, arrows = null, trails = null, trailsUpto = Infinity, selected = -1, path = null, prevPath = null, start = null, max = 600, xlim = XL, ylim = YL }) {
    const f = V.frame(canvas, xlim, ylim);
    V.contours(f, t);
    if (arrows) V.arrows(f, t, arrows.error || null);
    if (trails) for (const tr of trails) V.line(f, tr.slice(0, trailsUpto), 'rgba(23,40,62,.14)', 0.8);
    if (prevPath) V.line(f, prevPath, '#9fb0c2', 1, [4, 4]);
    if (path) V.line(f, path, color, 1.8);
    if (xs) V.dots(f, xs, ys, { color, colors, r: 1.8, max });
    if (start) V.dot(f, start, V.INK, 3);
    if (selected >= 0 && xs) { V.dot(f, [xs[selected], ys[selected]], '#fff', 6); V.dot(f, [xs[selected], ys[selected]], color, 4); }
    f.end();
    return f;
  }

  /* ================================================================== 1 forward */
  const fw = { t: 0, playing: !reduced, arrows: false, seed: 3, paths: null };
  function forwardPaths() { fw.paths = S.brownianPaths(384, 160, fw.seed); }
  function forwardPositions(t) {
    if (!fw.paths) forwardPaths();
    const steps = fw.paths[0].length - 1;
    const u = Math.min(1, t) * steps;
    const i = Math.min(steps - 1, Math.floor(u));
    const w = u - i;
    const xs = new Float64Array(fw.paths.length);
    const ys = new Float64Array(fw.paths.length);
    fw.paths.forEach((p, n) => { xs[n] = p[i][0] + w * (p[i + 1][0] - p[i][0]); ys[n] = p[i][1] + w * (p[i + 1][1] - p[i][1]); });
    return { xs, ys };
  }
  function drawForward() {
    $('forward-time').value = timeToSlider(fw.t);
    $('forward-time-out').textContent = fw.t.toFixed(4);
    $('forward-variance').textContent = fmt(M.variance(fw.t), 4);
    $('forward-contrast').textContent = fmt(V.trapContrast(fw.t), 3);
    $('forward-snr').textContent = fw.t > 1e-4 ? fmt(M.snr(fw.t), 2) : '∞';
    if (!visible($('forward-board'))) return;
    const pos = forwardPositions(fw.t);
    const wide = fw.t > 0.25;
    scene($('forward-board'), { t: fw.t, xs: pos.xs, ys: pos.ys, arrows: fw.arrows ? {} : null, max: 384, xlim: wide ? XLW : XL, ylim: wide ? YLW : YL });
    const pts = marginalSeries(fw.t);
    V.plot($('forward-marginal'), [{ points: pts, color: V.BLUE }], { xlabel: 'x', xrange: [-1.6, 1.6], yrange: [0, Math.max(0.5, 1.1 * Math.max(...pts.map((p) => p[1])))], xticks: [-1.6, -0.8, 0, 0.8, 1.6] });
  }
  $('forward-time').addEventListener('input', () => { fw.playing = false; setPlay($('forward-play'), false); fw.t = sliderToTime(+$('forward-time').value); flash(['time']); drawForward(); });
  $('forward-play').addEventListener('click', () => { if (fw.t >= 1) fw.t = 0; fw.playing = !fw.playing; setPlay($('forward-play'), fw.playing); });
  $('forward-again').addEventListener('click', () => { fw.seed++; forwardPaths(); fw.t = 0; fw.playing = !reduced; setPlay($('forward-play'), fw.playing); drawForward(); });
  $('forward-arrows').addEventListener('change', () => { fw.arrows = $('forward-arrows').checked; flash(['mixture']); drawForward(); });
  setFocus('kernel', ['time']);

  /* =================================================================== 2 family */
  const fam = { progress: 0, playing: !reduced, startSeed: 11, noiseSeed: 23, count: 1024, sde: null, ode: null, prev: null, selected: 0, trails: true, colors: false };
  function familyRun(newStarts) {
    if (newStarts || !fam.ode) {
      fam.ode = S.run({ T: 1, eta: 0, steps: 256, count: fam.count, startSeed: fam.startSeed, exactStart: true, trackPaths: fam.count, snapshots: 60 });
      fam.prev = null;
    } else fam.prev = fam.sde;
    fam.sde = S.run({ T: 1, eta: 1, steps: 256, count: fam.count, startSeed: fam.startSeed, noiseSeed: fam.noiseSeed, exactStart: true, trackPaths: fam.count, snapshots: 60 });
    fam.colorList = V.startColors(fam.sde.startXs, fam.sde.startYs);
    fam.selected = Math.min(fam.selected, fam.count - 1);
  }
  function drawFamily() {
    if (!fam.sde) familyRun(true);
    $('family-progress').value = fam.progress;
    const t = progressToTime(fam.progress, 1);
    $('family-progress-out').textContent = `${txt('lbl-noise-time')} ${t.toFixed(3)}`;
    if (!visible($('sde-board')) && !visible($('family-projection'))) return;
    const a = frameAtTime(fam.sde, t);
    const b = frameAtTime(fam.ode, t);
    const upto = Math.floor((1 - t) * 256) + 1;
    const wide = t > 0.25;
    const n = fam.selected;
    const start = [fam.sde.startXs[n], fam.sde.startYs[n]];
    const common = { t, selected: n, start, trailsUpto: upto, xlim: wide ? XLW : XL, ylim: wide ? YLW : YL, colors: fam.colors ? fam.colorList : null };
    scene($('sde-board'), { ...common, xs: a.xs, ys: a.ys, color: V.BLUE, trails: fam.trails ? fam.sde.paths.slice(0, 40) : null, path: fam.sde.paths[n].slice(0, upto), prevPath: fam.prev ? fam.prev.paths[n].slice(0, upto) : null });
    scene($('ode-board'), { ...common, xs: b.xs, ys: b.ys, color: V.RED, trails: fam.trails ? fam.ode.paths.slice(0, 40) : null, path: fam.ode.paths[n].slice(0, upto) });
    V.projection($('family-projection'), [{ xs: a.xs, color: V.BLUE, label: 'SDE' }, { xs: b.xs, color: V.RED, label: 'ODE' }], t, wide ? -3.5 : -1.5, wide ? 3.5 : 1.5, { ref: txt('lbl-analytic'), x: txt('lbl-x') });
    $('family-sde-ks').textContent = fmt(S.ksX(a.xs, t));
    $('family-ode-ks').textContent = fmt(S.ksX(b.xs, t));
    $('family-sep').textContent = fmt(Math.hypot(a.xs[n] - b.xs[n], a.ys[n] - b.ys[n]));
  }
  $('family-progress').addEventListener('input', () => { fam.playing = false; setPlay($('family-play'), false); fam.progress = +$('family-progress').value; drawFamily(); });
  $('family-play').addEventListener('click', () => { if (fam.progress >= 1) fam.progress = 0; fam.playing = !fam.playing; setPlay($('family-play'), fam.playing); });
  $('family-noise').addEventListener('click', () => { fam.noiseSeed++; flash(['randomness']); familyRun(false); drawFamily(); });
  $('family-starts').addEventListener('click', () => { fam.startSeed++; familyRun(true); drawFamily(); });
  $('family-count').addEventListener('change', () => { fam.count = +$('family-count').value; familyRun(true); drawFamily(); });
  $('family-trails').addEventListener('change', () => { fam.trails = $('family-trails').checked; drawFamily(); });
  $('family-colors').addEventListener('change', () => { fam.colors = $('family-colors').checked; drawFamily(); });
  for (const id of ['sde-board', 'ode-board']) {
    $(id).addEventListener('pointerdown', (e) => {
      const t = progressToTime(fam.progress, 1);
      const wide = t > 0.25;
      const [wx, wy] = V.point($(id), e, wide ? XLW : XL, wide ? YLW : YL);
      const fr = frameAtTime(id === 'sde-board' ? fam.sde : fam.ode, t);
      let best = Infinity;
      for (let n = 0; n < Math.min(600, fr.xs.length); n++) { const d = Math.hypot(fr.xs[n] - wx, fr.ys[n] - wy); if (d < best) { best = d; fam.selected = n; } }
      drawFamily();
    });
    $(id).addEventListener('keydown', (e) => { if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return; e.preventDefault(); fam.selected = (fam.selected + (e.key === 'ArrowRight' ? 1 : -1) + fam.count) % fam.count; drawFamily(); });
  }
  setFocus('reverse-sde', ['score', 'randomness']);
  setFocus('pf-ode', ['score']);
  setFocus('eta-family', ['eta']);

  /* ====================================================================== 3 lab */
  const lab = { tab: 'start', T: 0.25, start: 'prior', bias: 0, smooth: 0, nfe: 128, method: 'auto', eta: 0, count: 1024, noiseSeed: 23, startSeed: 11, progress: 1, playing: false, arrows: false, run: null, ref: null, timer: null };
  const TAB_LINKS = { start: ['start'], score: ['score-term'], grid: ['grid'] };
  /** The substituted run uses only the knob of the active tab; the other two stay exact. */
  function labConfig() {
    const start = lab.tab === 'start' ? lab.start : 'exact';
    const error = lab.tab === 'score' ? { bias: [lab.bias, 0], smooth: lab.smooth } : { bias: [0, 0], smooth: 0 };
    const nfe = lab.tab === 'grid' ? lab.nfe : 256;
    const method = lab.tab === 'grid' ? lab.method : 'auto';
    const m = lab.eta > 0 ? 'em' : (method === 'auto' ? 'heun' : method);
    const steps = Math.max(1, m === 'heun' ? Math.round(nfe / 2) : nfe);
    return { start, error, steps, method, nfe };
  }
  function labRun() {
    const cfg = labConfig();
    const t0 = performance.now();
    const base = { T: lab.T, eta: lab.eta, count: lab.count, startSeed: lab.startSeed, noiseSeed: lab.noiseSeed, snapshots: 60 };
    const refSteps = lab.eta > 0 ? 256 : 128;
    lab.ref = S.run({ ...base, steps: refSteps, solver: 'auto', exactStart: true, error: { bias: [0, 0], smooth: 0 } });
    lab.run = S.run({ ...base, steps: cfg.steps, solver: lab.eta > 0 ? 'auto' : cfg.method, exactStart: cfg.start === 'exact', error: cfg.error });
    const e = S.slotError(lab.run.xs, lab.run.ys);
    const r = S.slotError(lab.ref.xs, lab.ref.ys);
    $('lab-tv').textContent = fmt(e.tv); $('lab-tv-floor').textContent = `${txt('lbl-floor')} ${fmt(r.tv)}`;
    $('lab-spread').textContent = fmt(S.spread(lab.run.xs, lab.run.ys) / S.exactSpread(), 2); $('lab-spread-floor').textContent = `${txt('lbl-floor')} ${fmt(S.spread(lab.ref.xs, lab.ref.ys) / S.exactSpread(), 2)}`;
    $('lab-ks').textContent = fmt(S.ksX(lab.run.xs)); $('lab-ks-floor').textContent = `${txt('lbl-floor')} ${fmt(S.ksX(lab.ref.xs))}`;
    $('lab-step').textContent = (lab.T / cfg.steps).toFixed(4); $('lab-nfe-out').textContent = String(lab.run.nfe);
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
    const t = progressToTime(lab.progress, lab.T);
    const fr = frameAtTime(lab.run, t);
    const rf = frameAtTime(lab.ref, t);
    $('lab-progress-out').textContent = `${txt('lbl-noise-time')} ${fr.t.toFixed(3)}`;
    if (!visible($('lab-board')) && !visible($('lab-projection'))) return;
    const showField = lab.arrows && lab.tab === 'score';
    const wide = fr.t > 0.25;
    const lims = { xlim: wide ? XLW : XL, ylim: wide ? YLW : YL };
    scene($('ref-board'), { t: rf.t, xs: rf.xs, ys: rf.ys, color: GRAY, ...lims });
    if (showField) scene($('lab-board'), { t: 0.02, arrows: { error: { bias: [lab.bias, 0], smooth: lab.smooth } } });
    else scene($('lab-board'), { t: fr.t, xs: fr.xs, ys: fr.ys, color: V.BLUE, ...lims });
    V.projection($('lab-projection'), [{ xs: rf.xs, color: GRAY, label: txt('lbl-exact-run') }, { xs: fr.xs, color: V.BLUE, label: txt('lbl-substituted') }], fr.t, wide ? -3.5 : -1.5, wide ? 3.5 : 1.5, { ref: txt('lbl-analytic'), x: txt('lbl-x') });
  }
  function labChanged(links, replay = true) {
    flash(links);
    labReadouts();
    $('lab-status').textContent = txt('status-running');
    clearTimeout(lab.timer);
    lab.timer = setTimeout(() => { labRun(); if (replay && !reduced) { lab.progress = 0; lab.playing = true; setPlay($('lab-play'), true); } else lab.progress = 1; drawLab(); }, 50);
  }
  function selectTab(tab, rerun = true) {
    lab.tab = tab;
    for (const b of document.querySelectorAll('.tabs [role=tab]')) b.setAttribute('aria-selected', String(b.dataset.tab === tab));
    for (const p of document.querySelectorAll('.tab-panels [data-panel]')) p.hidden = p.dataset.panel !== tab;
    setFocus('oracle', TAB_LINKS[tab]);
    setFocus('em-step', TAB_LINKS[tab]);
    setFocus('kl-bound', tab === 'start' ? ['start'] : []);
    if (rerun) labChanged(TAB_LINKS[tab]);
  }
  for (const b of document.querySelectorAll('.tabs [role=tab]')) b.addEventListener('click', () => selectTab(b.dataset.tab));
  $('lab-T').addEventListener('input', () => { lab.T = +$('lab-T').value; labChanged(['start']); });
  $('lab-start').addEventListener('change', () => { lab.start = $('lab-start').value; labChanged(['start']); });
  $('lab-bias').addEventListener('input', () => { lab.bias = +$('lab-bias').value; labChanged(['score-term']); });
  $('lab-smooth').addEventListener('input', () => { lab.smooth = +$('lab-smooth').value; labChanged(['score-term']); });
  $('lab-arrows').addEventListener('change', () => { lab.arrows = $('lab-arrows').checked; drawLab(); });
  $('lab-nfe').addEventListener('change', () => { lab.nfe = +$('lab-nfe').value; labChanged(['grid']); });
  $('lab-method').addEventListener('change', () => { lab.method = $('lab-method').value; labChanged(['grid']); });
  $('lab-eta').addEventListener('input', () => { lab.eta = +$('lab-eta').value; labChanged(['eta']); });
  $('lab-progress').addEventListener('input', () => { lab.playing = false; setPlay($('lab-play'), false); lab.progress = +$('lab-progress').value; drawLab(); });
  $('lab-play').addEventListener('click', () => { if (lab.progress >= 1) lab.progress = 0; lab.playing = !lab.playing; setPlay($('lab-play'), lab.playing); });
  $('lab-noise').addEventListener('click', () => { lab.noiseSeed++; labChanged([]); });
  function syncControls() {
    $('lab-T').value = lab.T; $('lab-start').value = lab.start; $('lab-bias').value = lab.bias; $('lab-smooth').value = lab.smooth; $('lab-nfe').value = String(lab.nfe); $('lab-method').value = lab.method; $('lab-eta').value = lab.eta; $('lab-arrows').checked = lab.arrows;
  }
  $('lab-reset').addEventListener('click', () => {
    Object.assign(lab, { T: 0.25, start: 'prior', bias: 0, smooth: 0, nfe: 128, method: 'auto', eta: 0, arrows: false });
    syncControls();
    labChanged([]);
  });
  const PRESETS = {
    'prior-short': { tab: 'start', T: 0.25, start: 'prior', eta: 0 },
    'prior-short-sde': { tab: 'start', T: 0.25, start: 'prior', eta: 1 },
    'bias': { tab: 'score', bias: 1, smooth: 0, eta: 1, arrows: false },
    'smooth': { tab: 'score', bias: 0, smooth: 0.03, eta: 1, arrows: false },
    'coarse-sde': { tab: 'grid', nfe: 8, method: 'auto', eta: 1 },
    'coarse-heun': { tab: 'grid', nfe: 16, method: 'heun', eta: 0 },
  };
  for (const b of document.querySelectorAll('.presets button')) b.addEventListener('click', () => {
    const p = PRESETS[b.dataset.preset];
    Object.assign(lab, p);
    syncControls();
    selectTab(p.tab, false);
    labChanged(TAB_LINKS[p.tab]);
  });

  /* =================================================================== 4 budget */
  const sw = { data: null, running: false };
  function drawSweeps() {
    const d = sw.data;
    const fl = floor(2048);
    const mk = (kind, key) => (d && d[kind] ? [
      { points: d[kind][0].map((p) => [p.x, p[key]]), color: V.BLUE, label: txt('lbl-eta0'), marker: true },
      { points: d[kind][1].map((p) => [p.x, p[key]]), color: V.RED, label: txt('lbl-eta1'), marker: true },
    ] : []);
    const fl_label = txt('lbl-floor-line');
    V.plot($('sweep-T'), mk('T', 'tv'), { xlog: true, xlabel: 'T', hline: { y: fl.tv, label: fl_label }, xrange: [0.25, 4], yrange: [0, 0.3], xticks: [0.25, 0.5, 1, 2, 4] });
    V.plot($('sweep-bias'), mk('bias', 'tv'), { xlabel: 'b_x', hline: { y: fl.tv, label: fl_label }, xrange: [0, 2], yrange: [0, 0.6], xticks: [0, 0.5, 1, 1.5, 2] });
    V.plot($('sweep-smooth'), mk('smooth', 'spread'), { xlabel: 'δ', hline: { y: fl.spread, label: fl_label }, xrange: [0, 0.1], yrange: [0.8, 3.2], xticks: [0, 0.025, 0.05, 0.075, 0.1] });
    V.plot($('sweep-nfe'), mk('nfe', 'spread'), { xlog: true, ylog: true, xlabel: txt('lbl-evals'), hline: { y: fl.spread, label: fl_label }, xrange: [8, 512], yrange: [0.5, 30], xticks: [8, 32, 128, 512] });
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

  /* ============================================================== chrome & loop */
  function drawAll() { drawForward(); drawFamily(); drawLab(); drawSweeps(); }
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

  let last = 0;
  function tick(now) {
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    if (!document.hidden) {
      if (fw.playing && visible($('forward-board'))) { fw.t = sliderToTime(Math.min(1, timeToSlider(fw.t) + dt / 14)); if (fw.t >= 1) { fw.playing = false; setPlay($('forward-play'), false); } drawForward(); }
      if (fam.playing && visible($('sde-board'))) { fam.progress = Math.min(1, fam.progress + dt / 12); if (fam.progress >= 1) { fam.playing = false; setPlay($('family-play'), false); } drawFamily(); }
      if (lab.playing && visible($('lab-board'))) { lab.progress = Math.min(1, lab.progress + dt / 6); if (lab.progress >= 1) { lab.playing = false; setPlay($('lab-play'), false); } drawLab(); }
    }
    requestAnimationFrame(tick);
  }

  T.apply();
  syncControls();
  selectTab('start', false);
  onScroll();
  requestAnimationFrame(tick);
})();
