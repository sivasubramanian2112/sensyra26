(function () {
  "use strict";

  /**
   * Minimal cursor accent: a few small gold sparks trail the pointer,
   * fading fast. Desktop with a real mouse only -- skipped on touch and
   * under reduced-motion. Idle cost is ~0: the render loop only runs
   * while a spark is actually alive.
   */

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  var canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:fixed;inset:0;z-index:9999;pointer-events:none;width:100%;height:100%;";
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  var sparks = [];
  var running = false;
  var lastSpawn = 0;
  var BRASS = "201,162,39";

  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  function spawn(x, y) {
    var n = 2 + Math.floor(Math.random() * 2);
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2;
      var speed = 0.4 + Math.random() * 1.1;
      sparks.push({
        x: x, y: y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed - 0.3,
        life: 0,
        maxLife: 26 + Math.random() * 14,
        r: 1 + Math.random() * 1.6
      });
    }
  }

  function loop() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (var i = sparks.length - 1; i >= 0; i--) {
      var s = sparks[i];
      s.life++;
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.015;
      if (s.life >= s.maxLife) { sparks.splice(i, 1); continue; }
      var t = 1 - s.life / s.maxLife;
      ctx.beginPath();
      ctx.fillStyle = "rgba(" + BRASS + "," + (t * 0.9) + ")";
      ctx.arc(s.x, s.y, s.r * t, 0, Math.PI * 2);
      ctx.fill();
    }
    if (sparks.length) {
      requestAnimationFrame(loop);
    } else {
      running = false;
    }
  }

  function ensureRunning() {
    if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
  }

  window.addEventListener("mousemove", function (e) {
    var now = performance.now();
    if (now - lastSpawn < 55) return; // throttle: a sprinkle, not a firehose
    lastSpawn = now;
    spawn(e.clientX, e.clientY);
    ensureRunning();
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) sparks.length = 0;
  });
})();
