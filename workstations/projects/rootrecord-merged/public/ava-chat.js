/*! Merge homepage — Ava chat + solar open hours */
(function () {
  var HOURS_URLS = [
    "/api/ava-hours",
    "https://ava.rootmc.net/api/ava-hours",
  ];
  var CHAT_URLS = [
    "/api/ava-chat",
    "https://ava.rootmc.net/api/public-chat",
  ];

  function $(id) { return document.getElementById(id); }

  function fmtLocalWindow(startHour, endHour, homeTz) {
    try {
      var now = new Date();
      // Build today's HST instants, then format in visitor TZ
      var start = hstWallToDate(now, startHour, 0);
      var end = hstWallToDate(now, endHour, 0);
      var opts = { hour: "numeric", minute: "2-digit" };
      var a = new Intl.DateTimeFormat(undefined, opts).format(start);
      var b = new Intl.DateTimeFormat(undefined, opts).format(end);
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "local";
      return a + " – " + b + " (" + tz + ")";
    } catch (e) {
      return startHour + ":00–" + endHour + ":00 " + (homeTz || "HST");
    }
  }

  function hstWallToDate(ref, hour, minute) {
    // Find UTC ms for HST wall clock on ref's HST calendar day
    var utc = ref.getTime();
    var hst = new Date(utc - 10 * 3600 * 1000);
    var y = hst.getUTCFullYear();
    var m = hst.getUTCMonth();
    var d = hst.getUTCDate();
    return new Date(Date.UTC(y, m, d, hour + 10, minute || 0, 0)); // HST = UTC-10
  }

  function appendBubble(who, text) {
    var log = $("chatLog");
    if (!log) return;
    var div = document.createElement("div");
    div.className = "bubble " + who;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function loadHours() {
    var i = 0;
    function next() {
      if (i >= HOURS_URLS.length) {
        $("solarLine").textContent = "Powered by solar · usual hours unavailable";
        return;
      }
      var url = HOURS_URLS[i++];
      fetch(url, { cache: "no-store" })
        .then(function (r) { if (!r.ok) throw new Error("bad"); return r.json(); })
        .then(function (d) {
          if (!d || !d.ok) throw new Error("bad");
          var open = d.typicalOpen || {};
          var local = fmtLocalWindow(open.startHour, open.endHour, d.homeTzLabel);
          var bank = d.live && d.live.bankPct != null ? " · bank " + Math.round(d.live.bankPct) + "%" : "";
          var state = d.asleep ? "dreaming (sleep)" : "awake";
          $("solarLine").textContent =
            "Powered by solar · usually online " + local +
            " · home " + (open.hstLabel || "") +
            " · " + state + bank;
          if ($("chatStatus")) {
            $("chatStatus").textContent = d.asleep ? "sleep · solar" : "awake · solar";
          }
          var c = d.credits && d.credits.proposed;
          var dec = d.credits && d.credits.decided;
          if (c && $("creditsLine")) {
            $("creditsLine").textContent =
              "Ava usage (draft): $" + c.monthlyIncludedUsd +
              "/mo credits for members · extras $" + (c.extraPacksUsd || []).join(" / $") +
              " · billed ≥" + (dec && dec.sellMarkup ? dec.sellMarkup : 2) + "× cost" +
              (dec && dec.usageBillingEnabled ? "" : " · not charging yet");
          }
        })
        .catch(next);
    }
    next();
  }

  function sendChat(text) {
    var body = JSON.stringify({
      question: text,
      message: text,
      authorName: "merge-visitor",
      context: "merged.rootrecord.info public chat",
    });
    var i = 0;
    function next() {
      if (i >= CHAT_URLS.length) {
        return Promise.reject(new Error("chat unreachable"));
      }
      var url = CHAT_URLS[i++];
      return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: body,
      }).then(function (r) {
        if (!r.ok) throw new Error("bad");
        return r.json();
      }).then(function (d) {
        if (d && (d.answer || d.ok)) return d;
        throw new Error("bad");
      }).catch(function () { return next(); });
    }
    return next();
  }

  function bootChat() {
    var form = $("chatForm");
    var input = $("chatInput");
    var send = $("chatSend");
    if (!form || !input) return;
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var text = String(input.value || "").trim();
      if (!text) return;
      appendBubble("you", text);
      input.value = "";
      if (send) send.disabled = true;
      sendChat(text)
        .then(function (d) {
          appendBubble("ava", d.answer || "…");
        })
        .catch(function () {
          appendBubble("ava", "I couldn’t reach my solar host just now — try again in a moment, or ping me on Discord/Telegram.");
        })
        .finally(function () {
          if (send) send.disabled = false;
          input.focus();
        });
    });
  }

  loadHours();
  bootChat();
})();
