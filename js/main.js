(function () {
  "use strict";

  var doc = document.documentElement;

  /* ---- one-time hero reveal trigger ---- */
  requestAnimationFrame(function () {
    doc.classList.add("is-ready");
  });

  /* ---- mobile nav ---- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".mobile-menu");

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  function openMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "true");
    menu.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      open ? closeMenu() : openMenu();
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 860) closeMenu();
    });
  }

  /* ---- active-section indicator ---- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('a[data-nav-link]')
  );
  var sections = navLinks
    .map(function (a) {
      var id = a.getAttribute("href");
      return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var current = null;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) current = entry.target.id;
        });
        navLinks.forEach(function (a) {
          var match = a.getAttribute("href") === "#" + current;
          a.toggleAttribute("aria-current", match);
          if (match) a.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      io.observe(s);
    });
  }
})();
