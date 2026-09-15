import {
  Color, WebGLRenderer, Scene, PerspectiveCamera, Group,
  BufferGeometry, BufferAttribute, PointsMaterial, Points,
  AdditiveBlending, Clock
} from "three";

/**
 * Real WebGL hero background: two depth layers of point-light "cosmic
 * dust" (verdant + brass), additive blending, slow group drift, mouse
 * parallax on desktop / scroll parallax on touch. This is the module
 * that needs a bundler (Vite) to resolve the "three" import -- see
 * README for the npm commands. If this script can't run at all (older
 * browser, no WebGL, or opened without building), the CSS gradient in
 * .hero-atmosphere is still there underneath, so the hero never looks
 * broken -- it just loses the particle layer.
 */

var canvas = document.querySelector(".hero-cine");
var hero = document.querySelector(".hero");

if (canvas && hero && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  try {
    initHeroScene(canvas, hero);
  } catch (err) {
    console.warn("Hero WebGL scene skipped:", err);
    canvas.remove();
  }
} else if (canvas) {
  canvas.remove();
}

function initHeroScene(canvas, hero) {
  var VERDANT = new Color(47 / 255, 216 / 255, 137 / 255);
  var BRASS = new Color(201 / 255, 162 / 255, 39 / 255);
  var COSMIC = new Color(165 / 255, 97 / 255, 224 / 255);

  var renderer = new WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  var scene = new Scene();
  var camera = new PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 12;

  var group = new Group();
  scene.add(group);

  function makeLayer(count, spread, size, opacity) {
    var positions = new Float32Array(count * 3);
    var colors = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.6;
      var roll = Math.random();
      var c = roll < 0.52 ? VERDANT : roll < 0.82 ? BRASS : COSMIC;
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    var geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(positions, 3));
    geo.setAttribute("color", new BufferAttribute(colors, 3));
    var mat = new PointsMaterial({
      size: size,
      vertexColors: true,
      transparent: true,
      opacity: opacity,
      depthWrite: false,
      blending: AdditiveBlending,
      sizeAttenuation: true
    });
    return new Points(geo, mat);
  }

  var far = makeLayer(320, 28, 0.062, 0.65);
  var near = makeLayer(110, 17, 0.11, 0.9);
  group.add(far);
  group.add(near);

  var isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var mouseX = 0, mouseY = 0, driftX = 0, driftY = 0;

  if (isFinePointer) {
    hero.addEventListener("mousemove", function (e) {
      var rect = hero.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    });
    hero.addEventListener("mouseleave", function () { mouseX = 0; mouseY = 0; });
  } else {
    window.addEventListener("scroll", function () {
      var rect = hero.getBoundingClientRect();
      mouseX = Math.max(-1, Math.min(1, rect.top / 400)) * 0.5;
    }, { passive: true });
  }

  function resize() {
    var rect = hero.getBoundingClientRect();
    var w = Math.max(1, rect.width), h = Math.max(1, rect.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  window.addEventListener("load", resize);
  resize();

  var running = false;
  var rafId = null;
  var clock = new Clock();

  function animate() {
    var dt = clock.getDelta();
    driftX += (mouseX - driftX) * 0.03;
    driftY += (mouseY - driftY) * 0.03;
    group.rotation.y = driftX * 0.35;
    group.rotation.x = driftY * 0.2;
    group.rotation.z += dt * 0.006; // very slow ambient drift, independent of input
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }
  function start() { if (!running) { running = true; clock.getDelta(); rafId = requestAnimationFrame(animate); } }
  function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = null; }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { entry.isIntersecting ? start() : stop(); });
    }, { threshold: 0.01 }).observe(hero);
  } else {
    start();
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else if (hero.getBoundingClientRect().bottom > 0) start();
  });

  window.addEventListener("pagehide", function () {
    stop();
    far.geometry.dispose(); far.material.dispose();
    near.geometry.dispose(); near.material.dispose();
    renderer.dispose();
  });
}
