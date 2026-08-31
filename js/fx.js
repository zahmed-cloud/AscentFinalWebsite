/* The interaction layer of the evergreen design.
   Reveals: things rise gently the first time they enter the viewport, with a
   short ripple across siblings. Gated behind prefers-reduced-motion in CSS,
   and everything is visible without JS because the .rv class only exists
   once this file has run.
   Floating nav: only the homepage carries nav.floating; the solid bar fades
   in past 70% of the first screen and dissolves again at the top. */
(function () {
  document.documentElement.classList.add("js");

  var nav = document.querySelector("nav.floating");
  if (nav) {
    var bar = function () {
      nav.classList.toggle("scrolled", window.scrollY > innerHeight * 0.7);
    };
    addEventListener("scroll", bar, { passive: true });
    bar();
  }

  if (!("IntersectionObserver" in window)) return;
  var targets = document.querySelectorAll(
    ".shead, .prob, .probleft, .pcard, .scard, .step, .pack, .pkg, .q, .tw, .post, .seg, .arow, .mini, .case, .svc, .numcard, .range, .founder, .story, .ctapanel, .bookcard, .ccol, .faq details"
  );
  targets.forEach(function (el) { el.classList.add("rv"); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var kin = [].filter.call(e.target.parentElement.children, function (c) {
        return c.classList.contains("rv");
      });
      e.target.style.transitionDelay = Math.min(kin.indexOf(e.target), 4) * 60 + "ms";
      e.target.classList.add("in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.05, rootMargin: "0px 0px 80px 0px" });
  targets.forEach(function (el) { io.observe(el); });
})();
