/* Jace Griffith — portfolio
 *
 * The provenance drawers are native <details>, so they already open, close and
 * respond to the keyboard with no JavaScript at all. Everything here is polish
 * on top of behaviour that works without it.
 */
(function () {
  'use strict';

  var drawers = Array.prototype.slice.call(document.querySelectorAll('details.prov'));

  /* One drawer at a time. The page is dense enough that leaving a trail of open
     panels behind you turns it into a mess. */
  drawers.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      drawers.forEach(function (other) {
        if (other !== d) other.open = false;
      });
    });
  });

  /* Escape closes the open drawer and returns focus to the tag that opened it. */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = document.querySelector('details.prov[open]');
    if (!open) return;
    open.open = false;
    var summary = open.querySelector('summary');
    if (summary) summary.focus();
  });

  /* Mark the section currently in view in the masthead. Purely decorative, and
     skipped entirely where IntersectionObserver is unavailable. */
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

    // Topmost visible section wins, so scrolling up doesn't leave it stale.
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
