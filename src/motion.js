import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Premium cinematic motion layer -- additive, and safe by construction:
 * every "hidden" starting state here is set by gsap.from() AT RUNTIME,
 * never baked into CSS. If this script fails to load for any reason, every
 * element it would have animated is already sitting in its normal,
 * fully-visible CSS state -- nothing to break, nothing to get stuck
 * invisible. That's the lesson from the earlier reveal-system bug, applied
 * up front this time instead of after the fact.
 */

gsap.registerPlugin(ScrollTrigger);

var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

var hero = document.querySelector(".hero");

if (hero && !reduced) {
  var atmosphere = hero.querySelector(".hero-atmosphere");
  var halo = hero.querySelector(".hero-halo");
  var shield = hero.querySelector(".hero-shield");
  var eyebrow = hero.querySelector(".hero-eyebrow-block");
  var titleLines = hero.querySelectorAll(".hero-clip");
  var tagline = hero.querySelector(".hero-tagline");
  var foot = hero.querySelector(".hero-foot");
  var hud = hero.querySelector(".hero-hud");

  var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
  if (atmosphere) tl.from(atmosphere, { opacity: 0, scale: 1.18, duration: 1.6 }, 0);
  if (halo) tl.from(halo, { opacity: 0, scale: 0.82, rotate: -8, duration: 1.5 }, 0.15);
  if (shield) tl.from(shield, { opacity: 0, scale: 0.9, duration: 1.3 }, 0.2);
  if (eyebrow) tl.from(eyebrow, { y: 20, opacity: 0, duration: 0.7 }, 0.3);
  if (titleLines.length) {
    tl.from(titleLines, { yPercent: 120, duration: 1, stagger: 0.14, ease: "expo.out" }, 0.42);
  }
  if (tagline) tl.from(tagline, { opacity: 0, y: 12, duration: 0.6 }, 0.85);
  if (foot) tl.from(foot, { opacity: 0, y: 18, duration: 0.65 }, 0.95);
  if (hud) tl.from(hud, { opacity: 0, x: 26, duration: 0.7, ease: "power3.out" }, 1.05);

  // background layers drift slower than the page scrolls -- real depth,
  // not just a static image behind the text
  if (atmosphere) {
    gsap.to(atmosphere, {
      yPercent: 16,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 }
    });
  }
  if (halo) {
    gsap.to(halo, {
      yPercent: 8, rotate: 10,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 }
    });
  }
}

// Magnetic buttons -- a primary CTA gently leans toward the cursor within
// a small radius, then eases back. Desktop-with-a-mouse only.
if (canHover && !reduced) {
  document.querySelectorAll(".btn-primary").forEach(function (btn) {
    var xTo = gsap.quickTo(btn, "x", { duration: 0.45, ease: "power3" });
    var yTo = gsap.quickTo(btn, "y", { duration: 0.45, ease: "power3" });
    btn.addEventListener("mousemove", function (e) {
      var r = btn.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.25);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    });
    btn.addEventListener("mouseleave", function () {
      xTo(0);
      yTo(0);
    });
  });
}
