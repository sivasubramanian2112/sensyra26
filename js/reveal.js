(function () {
  "use strict";

  /**
   * Safety model: [data-reveal] elements are fully visible, normal HTML
   * by default. Nothing is clipped in CSS on its own -- see the
   * .reveal-armed gate in style.css. Only once this script confirms it's
   * running (and IntersectionObserver exists) do we arm the hidden state,
   * and even then a hard timeout guarantees everything reveals itself
   * within a few seconds no matter what. Content should never be
   * permanently invisible or unclickable because of a script hiccup.
   */

  var els = Array.prototype.slice.call(
    document.querySelectorAll("[data-reveal], [data-inview]")
  );
  if (!els.length) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !("IntersectionObserver" in window)) {
    return; // leave everything in its natural, visible state
  }

  els.forEach(function (el) {
    el.classList.add("reveal-armed");
  });

  var counts = {};
  els.forEach(function (el) {
    var group = el.getAttribute("data-reveal-group");
    if (!group) return;
    var idx = counts[group] || 0;
    counts[group] = idx + 1;
    el.style.transitionDelay = idx * 70 + "ms";
  });

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-inview");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );
  els.forEach(function (el) {
    io.observe(el);
  });

  // belt-and-braces: nothing stays hidden past this, ever
  setTimeout(function () {
    els.forEach(function (el) {
      el.classList.add("is-inview");
    });
  }, 4000);
})();
