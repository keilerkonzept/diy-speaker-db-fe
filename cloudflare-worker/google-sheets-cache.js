export default {
    async fetch(request, env, ctx) {
      return await handleRequest(request, env, ctx);
    }
  }
  
  async function handleRequest(request, env, ctx) {
  
    const tab = new URL(request.url).searchParams.get("tab");
    if(!tab) {
      const opts = { status: 400, statusText: "Bad Request" };
      return new Response("parameter missing: tab", opts);
    }
  
    const urlTpl = 'https://sheets.googleapis.com/v4/spreadsheets/1PoYey8POjJOA-ucpMtjJpdDWmXww5tK5HlhHbNeUZrs/values/_TAB_?alt=json&key=' + env.API_KEY;
    const sheetsUrl = urlTpl.replace('_TAB_', tab);
  
    const cache = caches.default;
    const cacheKey = new Request(sheetsUrl, {
      method: 'GET'
    });
  
    // Trigger background refresh regardless of cache state
    ctx.waitUntil(fetchAndCache(cache, cacheKey, sheetsUrl, false));
  
    let cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }
  
    // If no cache, fetch synchronously, cache it, and return
    const freshResponse = await fetchAndCache(cache, cacheKey, sheetsUrl, true);
    return freshResponse;
  }
  
  async function fetchAndCache(cache, cacheKey, sheetsUrl, clone) {
    const freshResp = await fetch(sheetsUrl);
    const freshResp2 = clone ? freshResp.clone() : null;
  
    // Only cache if the fetch was successful
    if (freshResp.ok) {
      const responseToCache = wrapResponse(freshResp);
      await cache.put(cacheKey, responseToCache);
    }
  
    return wrapResponse(freshResp2);
  }
  
  function wrapResponse(resp) {
    return new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }