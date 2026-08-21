const UPSTREAM = "https://rootrecord-api-account.rootrecord.workers.dev";

type Ctx = {
  request: Request;
  next: () => Promise<Response>;
  env: { ASSETS: { fetch: (input: Request | string) => Promise<Response> } };
};

export async function onRequest(context: Ctx): Promise<Response> {
  const url = new URL(context.request.url);
  if (url.pathname === "/api/site-config" || url.pathname === "/api/site-config.json") {
    try { return await context.next(); } catch { return context.env.ASSETS.fetch(context.request); }
  }
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": url.origin,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type, X-Requested-With",
      },
    });
  }
  const target = UPSTREAM + url.pathname + url.search;
  const headers = new Headers(context.request.headers);
  headers.delete("host");
  const body = context.request.method === "GET" || context.request.method === "HEAD" ? undefined : await context.request.arrayBuffer();
  const res = await fetch(target, { method: context.request.method, headers, body, redirect: "manual" });
  const outH = new Headers(res.headers);
  outH.set("Access-Control-Allow-Origin", url.origin);
  outH.set("Access-Control-Allow-Credentials", "true");
  outH.set("Vary", "Origin");
  return new Response(res.body, { status: res.status, headers: outH });
}
