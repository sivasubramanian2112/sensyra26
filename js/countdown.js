(function () {
  "use strict";

  /**
   * Registration closes 12 Oct 2026, end of day (IST). Event itself runs
   * 14 Oct 2026 -- see the "When" row in the About section and the hero
   * note for that date; this timer counts down to the registration
   * deadline specifically, since that's the action this widget drives.
   */
  var REGISTRATION_DEADLINE = new Date("2026-10-12T23:59:59+05:30");

  var els = {
    status: document.querySelector("[data-status-text]"),
    days: document.querySelector("[data-timer-days]"),
    hours: document.querySelector("[data-timer-hours]"),
    mins: document.querySelector("[data-timer-mins]"),
    secs: document.querySelector("[data-timer-secs]"),
  };

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function renderTBA() {
    if (els.days) els.days.textContent = "--";
    if (els.hours) els.hours.textContent = "--";
    if (els.mins) els.mins.textContent = "--";
    if (els.secs) els.secs.textContent = "--";
    if (els.status) els.status.textContent = "REGISTRATION OPEN";
  }

  function tick() {
    if (!REGISTRATION_DEADLINE) {
      renderTBA();
      return;
    }
    var diff = REGISTRATION_DEADLINE.getTime() - Date.now();
    if (diff <= 0) {
      if (els.status) els.status.textContent = "REGISTRATION CLOSED";
      if (els.days) els.days.textContent = "00";
      if (els.hours) els.hours.textContent = "00";
      if (els.mins) els.mins.textContent = "00";
      if (els.secs) els.secs.textContent = "00";
      return;
    }
    var s = Math.floor(diff / 1000);
    var d = Math.floor(s / 86400);
    var h = Math.floor((s % 86400) / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    if (els.status) els.status.textContent = "REGISTRATION OPEN";
    if (els.days) els.days.textContent = pad(d);
    if (els.hours) els.hours.textContent = pad(h);
    if (els.mins) els.mins.textContent = pad(m);
    if (els.secs) els.secs.textContent = pad(sec);
  }

  tick();
  setInterval(tick, 1000);
})();
