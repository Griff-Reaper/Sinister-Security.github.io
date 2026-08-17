/* Jace Griffith — portfolio
 *
 * Two jobs: the colour-theme toggle, and drawing the attack field.
 * The provenance drawers are native <details> and need no JavaScript at all.
 */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ── theme ─────────────────────────────────────────────────────────────
   * An explicit choice beats both the OS preference and any browser that
   * decides to invert the page on the reader's behalf.
   */
  var toggle = document.getElementById('themeToggle');

  function systemDark() {
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function activeTheme() {
    return root.getAttribute('data-theme') || (systemDark() ? 'dark' : 'light');
  }

  if (toggle) {
    toggle.setAttribute('aria-pressed', String(activeTheme() === 'dark'));
    toggle.addEventListener('click', function () {
      var next = activeTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
      toggle.setAttribute('aria-pressed', String(next === 'dark'));
      drawField();
    });
  }

  /* ── attack field ──────────────────────────────────────────────────────
   * One character per line of red-team-simulator/results/attack_log.jsonl,
   * in run order grouped by target: 1 = the judge scored the attack a
   * success, 0 = blocked. 1,824 marks, 78 of them hits. This is the data,
   * not a picture of the data.
   */
  var FIELD = [
    '000000010000000000000000000000000000000000000000000100000010001011100001000000000000000010000000000000000000010000001000000100010010000000000000000000011000000000000000000000000000000000000000000000000000100010000000000000000000000100100000001000000100100100000000100000000000000000000000000000000000000000000000000000000000000000000000000011001000000000010010001100100001110000000000000000000010100000100000000000000000000111000000100000000000000000000000',
    '011100000000000000000000000000000000000000001000000000000000000100000010000000000000000000000100000000000000000000001000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000010000000000000000000000000000000000000000000000000000100000000000000000000000000',
    '000100100000000010000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001101110000000001000000000000000000000000000000000000000011000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111100000000000000000000000000000000000001000000000000000000001000000000'
  ].join('');

  var canvas = document.getElementById('attackField');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function cssVar(name, fallback) {
    var v = getComputedStyle(root).getPropertyValue(name).trim();
    return v || fallback;
  }

  function layout(width) {
    var pad = width < 560 ? 12 : 18;
    var cell = width > 900 ? 7 : (width > 560 ? 6 : 5);
    var gap = width > 560 ? 3 : 2;
    var step = cell + gap;
    var cols = Math.max(16, Math.floor((width - pad * 2 + gap) / step));
    return {
      pad: pad, cell: cell, step: step, cols: cols,
      rows: Math.ceil(FIELD.length / cols)
    };
  }

  function drawField() {
    if (!canvas || !canvas.getContext) return;

    var width = canvas.clientWidth;
    if (!width) return;

    var L = layout(width);
    var height = L.rows * L.step - (L.step - L.cell) + L.pad * 2;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.style.height = height + 'px';
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    var hit = cssVar('--signal', '#ff6f4d');
    var dim = cssVar('--ink-3', '#7a8299');
    var upto = FIELD.length;

    /* blocked first, as one flat pass */
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = dim;
    for (var i = 0; i < upto; i++) {
      if (FIELD.charAt(i) === '1') continue;
      ctx.fillRect(L.pad + (i % L.cols) * L.step,
                   L.pad + Math.floor(i / L.cols) * L.step,
                   L.cell, L.cell);
    }

    /* then the 78 that got through, lit */
    ctx.globalAlpha = 1;
    ctx.fillStyle = hit;
    ctx.shadowColor = hit;
    ctx.shadowBlur = 9;
    for (var j = 0; j < upto; j++) {
      if (FIELD.charAt(j) !== '1') continue;
      ctx.fillRect(L.pad + (j % L.cols) * L.step,
                   L.pad + Math.floor(j / L.cols) * L.step,
                   L.cell, L.cell);
    }
    ctx.shadowBlur = 0;
  }

  if (canvas) {
    /* Always draw the complete field first. The entrance is a CSS fade on top
       of finished pixels, never a gate in front of them — if the observer
       never fires, or JavaScript never runs at all, the marks are still there. */
    drawField();

    if (!reduce && 'IntersectionObserver' in window) {
      canvas.classList.add('is-armed');
      var show = function () { canvas.classList.add('is-in'); };
      new IntersectionObserver(function (entries, obs) {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        show();
      }, { threshold: 0.12 }).observe(canvas);
      setTimeout(show, 1600);
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(drawField, 150);
    });
  }

  /* ── provenance drawers ────────────────────────────────────────────── */

  var drawers = Array.prototype.slice.call(document.querySelectorAll('details.prov'));

  /* One at a time — the page is dense enough that a trail of open panels
     turns it into a mess. */
  drawers.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      drawers.forEach(function (other) { if (other !== d) other.open = false; });
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = document.querySelector('details.prov[open]');
    if (!open) return;
    open.open = false;
    var summary = open.querySelector('summary');
    if (summary) summary.focus();
  });

  /* ── current section in the masthead ───────────────────────────────── */

  if (!('IntersectionObserver' in window)) return;

  var links = {};
  document.querySelectorAll('.masthead__nav a[href^="#"]').forEach(function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });

  var sections = Object.keys(links)
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if (!sections.length) return;

  var seen = new Set();

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) seen.add(entry.target.id);
      else seen.delete(entry.target.id);
    });

    var current = sections.filter(function (s) { return seen.has(s.id); })[0];

    Object.keys(links).forEach(function (id) {
      var isCurrent = !!current && id === current.id;
      links[id].classList.toggle('is-current', isCurrent);
      if (isCurrent) links[id].setAttribute('aria-current', 'true');
      else links[id].removeAttribute('aria-current');
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(function (s) { observer.observe(s); });
})();
