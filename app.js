/* Jace Griffith — portfolio
 *
 * Everything here is enhancement. The page is complete, readable and fully
 * navigable with this file removed: provenance drawers are native <details>,
 * the attack field degrades to its aria-label, and nothing is hidden until
 * script decides to show it.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia &&
               window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ── theme ─────────────────────────────────────────────────────────────
   * An explicit choice beats the OS preference and any browser that decides
   * to invert the page on the reader's behalf.
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
      paint();
    });
  }

  /* ── scroll progress ───────────────────────────────────────────────── */

  var bar = document.getElementById('progress');
  if (bar && !reduce) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var pct = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        bar.style.transform = 'scaleX(' + pct + ')';
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── aurora parallax ───────────────────────────────────────────────── */

  var aurora = document.querySelector('.aurora');
  var chips = document.querySelectorAll('.chip[data-depth]');
  var fine = window.matchMedia('(pointer: fine)').matches;

  if (!reduce && fine && (aurora || chips.length)) {
    window.addEventListener('pointermove', function (e) {
      var dx = (e.clientX / window.innerWidth - 0.5) * 2;
      var dy = (e.clientY / window.innerHeight - 0.5) * 2;

      if (aurora) {
        aurora.style.setProperty('--ax', (dx * 26).toFixed(1) + 'px');
        aurora.style.setProperty('--ay', (dy * 20).toFixed(1) + 'px');
      }

      /* Each chip drifts at its own depth, so the stage reads as layered
         rather than flat. Parallax rides the `translate` property while the
         bob animation keeps `transform`, so the two never fight. */
      Array.prototype.forEach.call(chips, function (chip) {
        var d = parseFloat(chip.getAttribute('data-depth')) || 1;
        chip.style.setProperty('--tx', (dx * d * 9).toFixed(1) + 'px');
        chip.style.setProperty('--ty', (dy * d * 7).toFixed(1) + 'px');
      });
    }, { passive: true });
  }

  /* ── scroll reveal ─────────────────────────────────────────────────── */
  /* Classes are added by script, never authored into the HTML, so a reader
     without JavaScript is never left staring at opacity:0. */

  if (hasIO && !reduce) {
    var targets = document.querySelectorAll(
      '.proj, .figure, .tblwrap, .limit, .rolecard, .build, .cert, .tl, ' +
      '.readout, .hero__lead, .section__head, .buildgrid, .channels, .field__head'
    );

    /* These classes start at opacity 0, so anything that can throw between
       hiding an element and arranging to show it again would hide real
       content permanently. Reveal everything if that ever happens. */
    try {
      Array.prototype.forEach.call(targets, function (el) { el.classList.add('rise'); });

      var riseObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry, i) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          setTimeout(function () { el.classList.add('is-in'); }, Math.min(i, 6) * 70);
          obs.unobserve(el);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

      Array.prototype.forEach.call(targets, function (el) { riseObs.observe(el); });
    } catch (err) {
      Array.prototype.forEach.call(targets, function (el) {
        el.classList.remove('rise');
      });
    }

    /* charts draw themselves once they are on screen */
    var svgs = document.querySelectorAll('.pair svg');
    var svgObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.25 });
    Array.prototype.forEach.call(svgs, function (s) { svgObs.observe(s); });
  }

  /* ── pointer spotlight ─────────────────────────────────────────────── */

  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    var spots = document.querySelectorAll(
      '.readout, .figure, .limit, .rolecard, .build, .cert, .tblwrap'
    );
    Array.prototype.forEach.call(spots, function (el) {
      el.classList.add('spot');
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--px', (e.clientX - r.left) + 'px');
        el.style.setProperty('--py', (e.clientY - r.top) + 'px');
      }, { passive: true });
    });
  }

  /* ── attack field ──────────────────────────────────────────────────────
   * field-data.js holds one record per line of
   * red-team-simulator/results/attack_log.jsonl: technique index, target
   * index, outcome. This is the run, not an illustration of it.
   */

  var RUN = window.ATTACK_RUN;
  var canvas = document.getElementById('attackField');
  var tip = document.getElementById('fieldTip');
  var replayBtn = document.getElementById('fieldReplay');

  if (!canvas || !canvas.getContext || !RUN) return finish();

  var N = RUN.log.length / 4;
  var B36 = '0123456789abcdefghijklmnopqrstuvwxyz';

  function rec(i) {
    var o = i * 4;
    return {
      tech: RUN.techs[B36.indexOf(RUN.log.charAt(o)) * 36 + B36.indexOf(RUN.log.charAt(o + 1))],
      target: RUN.targets[+RUN.log.charAt(o + 2)],
      hit: RUN.log.charAt(o + 3) === '1'
    };
  }

  var ctx = canvas.getContext('2d');
  var base = document.createElement('canvas');   /* the 1,746 blocked marks */
  var L = null;
  /* The first paint is always the complete field. The replay rewinds it only
     once we know the reader is scrolling toward it, so a blank canvas can
     never be the resting state. */
  var shown = N;
  var hover = -1;
  var pulsing = false;
  var t0 = 0;

  function cssVar(name, fallback) {
    var v = getComputedStyle(root).getPropertyValue(name).trim();
    return v || fallback;
  }

  function measure() {
    var w = canvas.clientWidth;
    if (!w) return null;
    var pad = w < 560 ? 12 : 18;
    var cell = w > 900 ? 7 : (w > 560 ? 6 : 5);
    var gap = w > 560 ? 3 : 2;
    var step = cell + gap;
    var cols = Math.max(16, Math.floor((w - pad * 2 + gap) / step));
    var rows = Math.ceil(N / cols);
    return {
      w: w, pad: pad, cell: cell, step: step, cols: cols, rows: rows,
      h: rows * step - gap + pad * 2,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    };
  }

  function xy(i) {
    return [L.pad + (i % L.cols) * L.step, L.pad + Math.floor(i / L.cols) * L.step];
  }

  /* the dim layer changes only on resize or theme change */
  function buildBase() {
    base.width = Math.round(L.w * L.dpr);
    base.height = Math.round(L.h * L.dpr);
    var b = base.getContext('2d');
    b.setTransform(L.dpr, 0, 0, L.dpr, 0, 0);
    b.clearRect(0, 0, L.w, L.h);
    b.fillStyle = cssVar('--ink-3', '#7a8299');
    b.globalAlpha = 0.3;
    for (var i = 0; i < N; i++) {
      if (RUN.log.charAt(i * 4 + 3) === '1') continue;
      var p = xy(i);
      b.fillRect(p[0], p[1], L.cell, L.cell);
    }
  }

  function paint(ts) {
    if (!L) return;
    var hit = cssVar('--signal', '#ff6f4d');

    ctx.setTransform(L.dpr, 0, 0, L.dpr, 0, 0);
    ctx.clearRect(0, 0, L.w, L.h);

    /* blocked layer, clipped to however far the replay has got */
    if (shown >= N) {
      ctx.drawImage(base, 0, 0, L.w, L.h);
    } else {
      var full = Math.floor(shown / L.cols);
      if (full > 0) {
        var hgt = L.pad + full * L.step;
        ctx.drawImage(base, 0, 0, base.width, Math.round(hgt * L.dpr),
                            0, 0, L.w, hgt);
      }
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = cssVar('--ink-3', '#7a8299');
      for (var k = full * L.cols; k < shown; k++) {
        if (RUN.log.charAt(k * 4 + 3) === '1') continue;
        var q = xy(k);
        ctx.fillRect(q[0], q[1], L.cell, L.cell);
      }
      ctx.globalAlpha = 1;
    }

    /* the 78 that got through, breathing */
    var wave = (!reduce && ts) ? 0.78 + 0.22 * Math.sin(ts / 620) : 1;
    ctx.globalAlpha = 1;
    ctx.fillStyle = hit;
    ctx.shadowColor = hit;
    ctx.shadowBlur = 8 + 7 * wave;
    for (var j = 0; j < shown; j++) {
      if (RUN.log.charAt(j * 4 + 3) !== '1') continue;
      var p2 = xy(j);
      ctx.globalAlpha = 0.72 + 0.28 * wave;
      ctx.fillRect(p2[0], p2[1], L.cell, L.cell);
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    /* whatever the pointer is on */
    if (hover >= 0 && hover < shown) {
      var p3 = xy(hover);
      ctx.strokeStyle = cssVar('--ink', '#e9ebf2');
      ctx.lineWidth = 1;
      ctx.strokeRect(p3[0] - 1.5, p3[1] - 1.5, L.cell + 3, L.cell + 3);
    }
  }

  function relayout() {
    var m = measure();
    if (!m) return;
    L = m;
    canvas.style.height = L.h + 'px';
    canvas.width = Math.round(L.w * L.dpr);
    canvas.height = Math.round(L.h * L.dpr);
    buildBase();
    paint();
  }

  /* continuous pulse, only while the field is actually on screen */
  function loop(ts) {
    if (!pulsing) return;
    paint(ts);
    requestAnimationFrame(loop);
  }
  function setPulsing(on) {
    if (on === pulsing) return;
    pulsing = on;
    if (on) requestAnimationFrame(loop); else paint();
  }

  function replay() {
    if (reduce) { shown = N; paint(); return; }
    shown = 0;
    t0 = 0;
    var span = 1500;
    function frame(ts) {
      if (!t0) t0 = ts;
      var t = Math.min(1, (ts - t0) / span);
      shown = Math.round(N * (1 - Math.pow(1 - t, 2.4)));
      if (!pulsing) paint(ts);
      if (t < 1) requestAnimationFrame(frame);
      else shown = N;
    }
    requestAnimationFrame(frame);
  }

  relayout();

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(relayout, 150);
  });

  /* hover read-out */
  if (window.matchMedia('(pointer: fine)').matches && tip) {
    canvas.addEventListener('pointermove', function (e) {
      if (!L) return;
      var r = canvas.getBoundingClientRect();
      var x = e.clientX - r.left - L.pad;
      var y = e.clientY - r.top - L.pad;
      var col = Math.floor(x / L.step);
      var row = Math.floor(y / L.step);
      var i = row * L.cols + col;
      var inCell = x >= 0 && y >= 0 && col >= 0 && col < L.cols &&
                   (x % L.step) <= L.cell && (y % L.step) <= L.cell;

      if (!inCell || i < 0 || i >= N) {
        if (hover !== -1) { hover = -1; tip.classList.remove('is-on'); if (!pulsing) paint(); }
        return;
      }

      if (i !== hover) {
        hover = i;
        var d = rec(i);
        tip.innerHTML = '<b>' + d.tech[0] + ' · ' + d.tech[1] + '</b>' +
          d.target + ' · ' + d.tech[2] + '<br>' +
          '<span class="' + (d.hit ? 'v-hit">verdict: succeeded' : 'v-blk">verdict: blocked') + '</span>';
        tip.classList.add('is-on');
        if (!pulsing) paint();
      }

      var tw = tip.offsetWidth || 210;
      var left = Math.max(0, Math.min(L.w - tw, e.clientX - r.left - tw / 2));
      tip.style.left = left + 'px';
      tip.style.top = Math.max(0, e.clientY - r.top - tip.offsetHeight - 14) + 'px';
    }, { passive: true });

    canvas.addEventListener('pointerleave', function () {
      hover = -1;
      tip.classList.remove('is-on');
      if (!pulsing) paint();
    });
  }

  if (replayBtn) replayBtn.addEventListener('click', replay);

  if (hasIO) {
    var firstCall = true;
    new IntersectionObserver(function (entries) {
      var vis = entries[0].isIntersecting;
      setPulsing(vis && !reduce);

      /* Already on screen when the page loaded? Leave it drawn — rewinding a
         field the reader is looking at reads as a glitch, not an animation.
         Only replay for someone who scrolls down to it. */
      if (firstCall) {
        firstCall = false;
        if (vis) replay.done = true;
        return;
      }
      if (vis && !replay.done && !reduce) { replay.done = true; replay(); }
    }, { threshold: 0.12 }).observe(canvas);
  }

  finish();

  /* ── provenance drawers + current section ──────────────────────────── */

  function finish() {
    var drawers = Array.prototype.slice.call(document.querySelectorAll('details.prov'));

    /* one at a time — the page is dense enough that a trail of open panels
       turns it into a mess */
    drawers.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        drawers.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var open = document.querySelector('details.prov[open]');
      if (!open) return;
      open.open = false;
      var s = open.querySelector('summary');
      if (s) s.focus();
    });

    if (!hasIO) return;

    var links = {};
    document.querySelectorAll('.masthead__nav a[href^="#"]').forEach(function (a) {
      links[a.getAttribute('href').slice(1)] = a;
    });

    var sections = Object.keys(links)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    if (!sections.length) return;

    var seen = new Set();
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) seen.add(e.target.id); else seen.delete(e.target.id);
      });
      var cur = sections.filter(function (s) { return seen.has(s.id); })[0];
      Object.keys(links).forEach(function (id) {
        var on = !!cur && id === cur.id;
        links[id].classList.toggle('is-current', on);
        if (on) links[id].setAttribute('aria-current', 'true');
        else links[id].removeAttribute('aria-current');
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    sections.forEach(function (s) { obs.observe(s); });
  }
})();
