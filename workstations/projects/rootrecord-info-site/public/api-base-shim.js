(function () {
  // Runs after account.js loadConfig if we hook fetch of site-config
  var origFetch = window.fetch;
  window.fetch = function (input, init) {
    var url = typeof input === "string" ? input : (input && input.url) || "";
    var p = origFetch.apply(this, arguments);
    if (String(url).indexOf("/api/site-config") !== -1) {
      return p.then(function (res) {
        if (!res.ok) return res;
        return res
          .clone()
          .json()
          .then(function (j) {
            if (j && typeof j === "object" && (!j.apiBase || !String(j.apiBase).trim())) {
              j.apiBase = location.origin;
              return new Response(JSON.stringify(j), {
                status: res.status,
                statusText: res.statusText,
                headers: { "Content-Type": "application/json" },
              });
            }
            return res;
          })
          .catch(function () {
            return res;
          });
      });
    }
    return p;
  };
})();
