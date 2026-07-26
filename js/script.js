/* ============================================================
   Ascent — shared behaviour for every page.
   1. Scroll reveal: elements with [data-r] fade in on scroll
      (hero elements reveal on load instead).
   2. Mobile nav: burger toggles .nl.open + aria-expanded.
   3. Services mega-menu: desktop hover is pure CSS; on mobile
      first tap expands the accordion, second tap navigates.
   Read docs/DESIGN-SYSTEM.md for the full picture.
   ============================================================ */
(function () {
  // scroll reveal
  var els = document.querySelectorAll('[data-r]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el, i) {
      // hero elements are revealed by the load handler below, not the observer
      if (el.closest('.hero, .phero')) { return; }
      el.style.transitionDelay = (Math.min(i % 7, 6) * 50) + 'ms';
      io.observe(el);
    });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  // hero reveals immediately on load
  window.addEventListener('load', function () {
    document.querySelectorAll('.hero [data-r], .phero [data-r]').forEach(function (el, i) {
      el.style.transitionDelay = (i * 70) + 'ms';
      el.classList.add('in');
    });
  });

  // mobile nav
  var burger = document.querySelector('.burger');
  var nl = document.querySelector('.nl');
  if (burger && nl) {
    burger.addEventListener('click', function () {
      var open = nl.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Services mega-menu: desktop hover is handled in CSS (with a 150ms close delay).
  // On mobile: first tap expands the accordion, second tap follows the link to services.html.
  var mega = document.querySelector('.has-mega');
  if (mega) {
    var trigger = mega.querySelector(':scope > a');
    if (trigger) {
      trigger.addEventListener('click', function (e) {
        if (window.matchMedia('(max-width: 860px)').matches && !mega.classList.contains('open')) {
          e.preventDefault();
          mega.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    }
  }
})();
