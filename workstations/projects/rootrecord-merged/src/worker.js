
const AVA_ORIGIN = "https://ava.rootmc.net";

async function proxyJson(request, path, { method } = {}) {
  const init = {
    method: method || request.method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "rootrecord-merged/ava-proxy",
    },
  };
  if (init.method !== "GET" && init.method !== "HEAD") {
    init.body = await request.text();
  }
  const upstream = await fetch(`${AVA_ORIGIN}${path}`, init);
  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": method === "GET" ? "public, max-age=30" : "no-store",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS" && (url.pathname === "/api/ava-hours" || url.pathname === "/api/ava-chat")) {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Accept",
          "Access-Control-Max-Age": "86400",
        },
      });
    }
    if ((request.method === "GET" || request.method === "HEAD") && url.pathname === "/api/ava-hours") {
      return proxyJson(request, "/api/ava-hours", { method: "GET" });
    }
    if (request.method === "POST" && url.pathname === "/api/ava-chat") {
      return proxyJson(request, "/api/public-chat", { method: "POST" });
    }
    return env.ASSETS.fetch(request);
  },
};
