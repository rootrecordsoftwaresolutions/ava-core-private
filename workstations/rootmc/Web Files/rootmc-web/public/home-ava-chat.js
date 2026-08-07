/*! RootMC home — Ava chat + daily summary opener */
(function () {
  var DAILY_URLS = [
    "https://api.rootmc.net/api/rootmc/daily-report",
  ];
  var HOURS_URLS = [
    "https://ava.rootmc.net/api/ava-hours",
  ];
  var CHAT_URLS = [
    "https://ava.rootmc.net/api/public-chat",
  ];

  function $(id) {
    return document.getElementById(id);
  }

  function stripMd(s) {
    return String(s || "")
      .replace(/\*\*/g, "")
      .replace(/^#+\s*/gm, "")
      .replace(/_/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function appendBubble(who, text, opts) {
    var log = $("rmcChatLog");
    if (!log) return;
    var loading = log.querySelector(".rmc-ava-loading");
    if (loading) loading.remove();
    var div = document.createElement("div");
    div.className =
      "rmc-ava-bubble " + who + (opts && opts.summary ? " rmc-ava-summary" : "");
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function fetchJson(urls) {
    var i = 0;
    function next() {
      if (i >= urls.length) return Promise.reject(new Error("unreachable"));
      var url = urls[i++];
      return fetch(url, { cache: "no-store" })
        .then(function (r) {
          if (!r.ok) throw new Error("bad");
          return r.json();
        })
        .catch(function () {
          return next();
        });
    }
    return next();
  }

  function buildDailyMessage(daily, hours) {
    var latest = (daily && daily.reports && daily.reports[0]) || null;
    var day = latest && latest.day_key ? latest.day_key : "today";
    var summary = "";
    if (latest) {
      summary = String(latest.summary || "").trim();
      if (!summary && latest.report_text) {
        summary = stripMd(latest.report_text).split("\n").slice(0, 5).join(" ");
      }
    }
    var parts = [];
    parts.push("Daily summary · " + day);
    if (summary) parts.push(stripMd(summary).slice(0, 480));
    if (hours && hours.ok) {
      var open = hours.typicalOpen || {};
      var bank =
        hours.live && hours.live.bankPct != null
          ? Math.round(hours.live.bankPct) + "%"
          : null;
      var state = hours.asleep ? "dreaming (sleep)" : "awake";
      parts.push(
        "Ava is " +
          state +
          (open.hstLabel ? " · usual hours " + open.hstLabel : "") +
          (bank != null ? " · bank " + bank : "") +
          "."
      );
    }
    parts.push("Ask me anything about RootMC — join, gold, votes, map, wiki.");
    return parts.join("\n\n");
  }

  function loadOpener() {
    Promise.all([
      fetchJson(DAILY_URLS).catch(function () {
        return null;
      }),
      fetchJson(HOURS_URLS).catch(function () {
        return null;
      }),
    ]).then(function (pair) {
      var daily = pair[0];
      var hours = pair[1];
      var st = $("rmcChatStatus");
      if (st && hours) {
        st.textContent = hours.asleep ? "sleep · solar" : "awake · solar";
      }
      appendBubble("ava", buildDailyMessage(daily, hours), { summary: true });
    });
  }

  function bootChat() {
    var form = $("rmcChatForm");
    var input = $("rmcChatInput");
    var send = $("rmcChatSend");
    if (!form || !input) return;
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var text = String(input.value || "").trim();
      if (!text) return;
      appendBubble("you", text);
      input.value = "";
      if (send) send.disabled = true;
      var i = 0;
      function next() {
        if (i >= CHAT_URLS.length) {
          return Promise.reject(new Error("chat unreachable"));
        }
        var url = CHAT_URLS[i++];
        return fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            question: text,
            message: text,
            authorName: "rootmc-visitor",
            context: "rootmc.net home chat",
          }),
        })
          .then(function (r) {
            if (!r.ok) throw new Error("bad");
            return r.json();
          })
          .then(function (d) {
            if (d && (d.answer || d.ok)) return d;
            throw new Error("bad");
          })
          .catch(function () {
            return next();
          });
      }
      next()
        .then(function (d) {
          appendBubble("ava", d.answer || "…");
        })
        .catch(function () {
          appendBubble(
            "ava",
            "Couldn’t reach my solar host just now — try again shortly, or ping me on Discord."
          );
        })
        .finally(function () {
          if (send) send.disabled = false;
          input.focus();
        });
    });
  }

  loadOpener();
  bootChat();
})();
