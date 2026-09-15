(function () {
  "use strict";

  var canvas = document.getElementById("roadmap-canvas");
  var col = document.querySelector(".roadmap-canvas-col");
  var stepsWrap = document.querySelector(".roadmap-steps");
  var steps = Array.prototype.slice.call(document.querySelectorAll(".roadmap-step"));
  if (!canvas || !stepsWrap || !steps.length) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ctx = canvas.getContext("2d");
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var nodeY = [];
  var pathW = 84;

  function measure() {
    var wrapRect = stepsWrap.getBoundingClientRect();
    var h = wrapRect.height;
    pathW = col.getBoundingClientRect().width || 56;
    col.style.height = h + "px";
    canvas.style.width = pathW + "px";
    canvas.style.height = h + "px";
    canvas.width = pathW * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    nodeY = steps.map(function (step) {
      var r = step.getBoundingClientRect();
      return r.top - wrapRect.top + r.height / 2;
    });
    drawPath(0);
  }

  function jaggedX(i) {
    // small left-right offset per node for a hand-drawn energy-line feel,
    // expressed as fractions of the available column width
    var pattern = [0.5, 0.32, 0.64, 0.28, 0.6, 0.38];
    var margin = Math.min(16, pathW * 0.18);
    return margin + pattern[i % pattern.length] * (pathW - margin * 2);
  }

  function drawPath(progress) {
    var h = parseFloat(canvas.style.height) || 0;
    ctx.clearRect(0, 0, pathW, h);
    if (!nodeY.length) return;

    ctx.strokeStyle = "rgba(242,234,224,0.16)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    nodeY.forEach(function (y, i) {
      var x = jaggedX(i);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // lit portion up to current progress
    var totalLen = nodeY.length - 1;
    var litIndex = progress * totalLen;
    ctx.strokeStyle = "#c9a227";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var i = 0; i < nodeY.length; i++) {
      var x = jaggedX(i);
      var y = nodeY[i];
      if (i === 0) ctx.moveTo(x, y);
      else if (i <= litIndex) ctx.lineTo(x, y);
      else {
        var prevFrac = litIndex - (i - 1);
        if (prevFrac > 0) {
          var px = jaggedX(i - 1) + (x - jaggedX(i - 1)) * prevFrac;
          var py = nodeY[i - 1] + (y - nodeY[i - 1]) * prevFrac;
          ctx.lineTo(px, py);
        }
        break;
      }
    }
    ctx.stroke();

    // nodes
    nodeY.forEach(function (y, i) {
      var x = jaggedX(i);
      var active = i <= Math.round(litIndex);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      var size = active ? 7 : 5;
      ctx.fillStyle = active ? "#c9a227" : "#3a2f2b";
      ctx.fillRect(-size / 2, -size / 2, size, size);
      ctx.restore();
    });

    steps.forEach(function (step, i) {
      step.classList.toggle("is-active", i <= Math.round(litIndex));
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var wrapRect = stepsWrap.getBoundingClientRect();
      var vh = window.innerHeight;
      var total = wrapRect.height - vh * 0.5;
      var scrolled = vh * 0.65 - wrapRect.top;
      var progress = total > 0 ? scrolled / total : 0;
      progress = Math.max(0, Math.min(1, progress));
      drawPath(progress);
      ticking = false;
    });
  }

  measure();
  window.addEventListener("resize", measure);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (reduced) {
    // still functional, just no per-frame smoothing beyond native scroll updates
  }
})();
