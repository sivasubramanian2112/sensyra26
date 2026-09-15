(function () {
  "use strict";

  /**
   * Original geometric line-art motifs -- inspired by hero iconography
   * (a ring-and-arc, a hammer silhouette, a web, a shield-and-star, a
   * bolt, a small radiating "spider" mark) but hand-built as simple
   * generic shapes, not reproductions of any trademarked logo or design.
   *
   * Kept deliberately LOW on line-count per shape, and placed with real
   * minimum spacing between shapes -- a few clean, readable glyphs beat
   * many overlapping ones, which just reads as tangled wires once they
   * cross each other.
   */

  function drawStar(ctx, cx, cy, r, points) {
    ctx.beginPath();
    for (var i = 0; i < points * 2; i++) {
      var rad = i % 2 === 0 ? r : r * 0.45;
      var a = (Math.PI / points) * i - Math.PI / 2;
      var px = cx + Math.cos(a) * rad;
      var py = cy + Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }

  var SHAPES = {
    ring: function (ctx, s) {
      ctx.beginPath(); ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2); ctx.stroke();
      for (var i = 0; i < 4; i++) {
        var a = (i * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * s * 0.58, Math.sin(a) * s * 0.58);
        ctx.lineTo(Math.cos(a) * s * 0.72, Math.sin(a) * s * 0.72);
        ctx.stroke();
      }
    },
    hammer: function (ctx, s) {
      ctx.strokeRect(-s * 0.3, -s * 0.48, s * 0.6, s * 0.32);
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.16);
      ctx.lineTo(0, s * 0.48);
      ctx.stroke();
    },
    web: function (ctx, s) {
      for (var r = 1; r <= 2; r++) {
        ctx.beginPath();
        for (var i = 0; i <= 6; i++) {
          var a = (i * Math.PI) / 3;
          var rad = s * 0.22 * r;
          var px = Math.cos(a) * rad, py = Math.sin(a) * rad;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      for (var j = 0; j < 6; j++) {
        var b = (j * Math.PI) / 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(b) * s * 0.48, Math.sin(b) * s * 0.48);
        ctx.stroke();
      }
    },
    shieldStar: function (ctx, s) {
      ctx.beginPath();
      ctx.moveTo(-s * 0.36, -s * 0.4);
      ctx.lineTo(s * 0.36, -s * 0.4);
      ctx.lineTo(s * 0.36, s * 0.04);
      ctx.quadraticCurveTo(s * 0.36, s * 0.38, 0, s * 0.5);
      ctx.quadraticCurveTo(-s * 0.36, s * 0.38, -s * 0.36, s * 0.04);
      ctx.closePath();
      ctx.stroke();
      drawStar(ctx, 0, -s * 0.02, s * 0.2, 5);
    },
    bolt: function (ctx, s) {
      ctx.beginPath();
      ctx.moveTo(-s * 0.1, -s * 0.46);
      ctx.lineTo(s * 0.07, -s * 0.06);
      ctx.lineTo(-s * 0.05, 0);
      ctx.lineTo(s * 0.12, s * 0.46);
      ctx.lineTo(-s * 0.02, s * 0.04);
      ctx.lineTo(s * 0.08, 0);
      ctx.closePath();
      ctx.stroke();
    },
    spider: function (ctx, s) {
      ctx.beginPath(); ctx.arc(0, 0, s * 0.1, 0, Math.PI * 2); ctx.stroke();
      for (var i = 0; i < 6; i++) {
        var a = (i * Math.PI) / 3 + Math.PI / 6;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * s * 0.1, Math.sin(a) * s * 0.1);
        ctx.lineTo(Math.cos(a) * s * 0.4, Math.sin(a) * s * 0.4);
        ctx.stroke();
      }
    },
    starburst: function (ctx, s) {
      for (var i = 0; i < 8; i++) {
        var a = (i * Math.PI) / 4;
        var len = i % 2 === 0 ? 0.5 : 0.28;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * s * len, Math.sin(a) * s * len);
        ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(0, 0, s * 0.07, 0, Math.PI * 2); ctx.stroke();
    },
    impact: function (ctx, s) {
      var n = 10;
      ctx.beginPath();
      for (var i = 0; i <= n; i++) {
        var a = (i / n) * Math.PI * 2;
        var r = i % 2 === 0 ? s * 0.5 : s * 0.22;
        var px = Math.cos(a) * r, py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    },
    hex: function (ctx, s) {
      function hexPath(r) {
        ctx.beginPath();
        for (var i = 0; i <= 6; i++) {
          var a = (i * Math.PI) / 3;
          var px = Math.cos(a) * r, py = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
      hexPath(s * 0.5);
      hexPath(s * 0.3);
    },
    wing: function (ctx, s) {
      ctx.beginPath();
      ctx.moveTo(-s * 0.5, s * 0.1);
      ctx.quadraticCurveTo(-s * 0.15, -s * 0.45, s * 0.05, -s * 0.02);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-s * 0.4, s * 0.28);
      ctx.quadraticCurveTo(-s * 0.1, -s * 0.2, s * 0.15, s * 0.1);
      ctx.stroke();
    }
  };

  var TYPES = Object.keys(SHAPES);
  var VERDANT = "47,216,137";
  var BRASS = "201,162,39";
  var COSMIC = "165,97,224";

  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function drawShape(ctx, type, size) {
    (SHAPES[type] || SHAPES.ring)(ctx, size);
  }

  function mount(canvas) {
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var opts = {};
    try { opts = JSON.parse(canvas.getAttribute("data-doodle") || "{}"); } catch (e) { opts = {}; }

    var count = opts.count || 3;
    var alpha = opts.alpha != null ? opts.alpha : 0.6;
    var xRange = opts.xRange || [0, 1];
    var yRange = opts.yRange || [0, 1];
    var minSize = opts.minSize || 70;
    var maxSize = opts.maxSize || 130;
    var lineWidth = opts.lineWidth || 1.5;
    var seed = opts.seed || 1;
    var glow = opts.glow !== false;
    var animate = !!opts.animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var avoidSelectors = opts.avoid || [];
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    var shapes = [];
    var w = 0, h = 0;
    var avoidRects = [];

    // Real content this canvas must steer clear of (a heading, an emblem,
    // a tagline) -- computed from actual DOM positions, not guessed with
    // fractions. Padded outward a little so shapes don't just kiss the edge.
    function computeAvoidRects() {
      avoidRects = [];
      if (!w || !h || !avoidSelectors.length) return;
      var canvasBox = canvas.getBoundingClientRect();
      avoidSelectors.forEach(function (sel) {
        var el = document.querySelector(sel);
        if (!el) return;
        var r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        var padX = 26 / w, padY = 26 / h;
        avoidRects.push({
          x0: (r.left - canvasBox.left) / w - padX,
          x1: (r.right - canvasBox.left) / w + padX,
          y0: (r.top - canvasBox.top) / h - padY,
          y1: (r.bottom - canvasBox.top) / h + padY
        });
      });
    }

    function hitsAvoidZone(x, y) {
      for (var i = 0; i < avoidRects.length; i++) {
        var r = avoidRects[i];
        if (x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1) return true;
      }
      return false;
    }

    // Fractional-space placement (0-1) with real minimum spacing so shapes
    // never overlap into a tangle -- rejection-sample a few times, and if a
    // spot truly can't be found, shrink that shape rather than crowd it in.
    function seedShapes() {
      var rand = mulberry32(seed);
      shapes = [];
      var placed = []; // {x, y, radiusFrac}
      var aspect = w > 0 && h > 0 ? w / h : 1;

      for (var i = 0; i < count; i++) {
        var size = minSize + rand() * (maxSize - minSize);
        var best = null;
        for (var attempt = 0; attempt < 20; attempt++) {
          var x = xRange[0] + rand() * (xRange[1] - xRange[0]);
          var y = yRange[0] + rand() * (yRange[1] - yRange[0]);
          if (hitsAvoidZone(x, y)) continue;
          var rFrac = h ? (size * 0.55) / h : 0.1;
          var ok = true;
          for (var p = 0; p < placed.length; p++) {
            var dx = (x - placed[p].x) * aspect;
            var dy = y - placed[p].y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < (rFrac + placed[p].r) * 1.35) { ok = false; break; }
          }
          if (ok) { best = { x: x, y: y, r: rFrac }; break; }
        }
        if (!best) continue; // no safe spot found after 20 tries -- skip it, don't force an overlap
        placed.push(best);
        var roll = rand();
        var color = roll < 0.48 ? VERDANT : roll < 0.8 ? BRASS : COSMIC;
        shapes.push({
          type: TYPES[Math.floor(rand() * TYPES.length)],
          x: best.x, y: best.y, baseY: best.y,
          size: size,
          rot: rand() * Math.PI * 2,
          spin: (rand() - 0.5) * (0.05 + rand() * 0.07) * (animate ? 1 : 0),
          bobPhase: rand() * Math.PI * 2,
          bobSpeed: 0.35 + rand() * 0.35,
          bobAmp: (0.012 + rand() * 0.016) * (animate ? 1 : 0),
          color: color
        });
      }
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      if (!w || !h) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      computeAvoidRects();
      // cap shape size relative to the canvas itself, so it never
      // dominates a narrow mobile column
      var cap = Math.min(w, h) * 0.6;
      shapes.forEach(function (s) { if (s.size > cap) s.size = cap; });
    }

    var t = 0;
    function draw() {
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      shapes.forEach(function (s) {
        var floatY = (s.y + Math.sin(t * s.bobSpeed + s.bobPhase) * s.bobAmp) * h;
        ctx.save();
        ctx.translate(s.x * w, floatY);
        ctx.rotate(s.rot);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = "rgba(" + s.color + "," + alpha + ")";
        if (glow) {
          ctx.shadowColor = "rgba(" + s.color + ",.7)";
          ctx.shadowBlur = 8;
        }
        drawShape(ctx, s.type, s.size);
        ctx.restore();
      });
    }

    var running = false, rafId = null;
    function frame() {
      t += 0.016;
      shapes.forEach(function (s) { s.rot += s.spin * 0.01; });
      draw();
      rafId = requestAnimationFrame(frame);
    }
    function start() {
      if (running || !animate) { if (!animate) draw(); return; }
      running = true;
      rafId = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    }

    resize();
    seedShapes();
    draw();

    window.addEventListener("resize", function () { resize(); seedShapes(); draw(); });
    window.addEventListener("load", function () { resize(); seedShapes(); draw(); });

    if (animate) {
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) { entry.isIntersecting ? start() : stop(); });
        }, { threshold: 0.01 }).observe(canvas);
      } else {
        start();
      }
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) stop();
        else if (canvas.getBoundingClientRect().bottom > 0) start();
      });
    }
  }

  window.SensyraDoodles = { drawShape: drawShape, mount: mount, types: TYPES };

  document.querySelectorAll("[data-doodle]").forEach(mount);
})();
