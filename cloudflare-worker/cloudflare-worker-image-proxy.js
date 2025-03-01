/**
 * HTTP to HTTPS Image Proxy - Cloudflare Worker
 * 
 * This Worker proxies HTTP images to make them available over HTTPS.
 * It preserves content type and other relevant headers.
 * 
 * Deployment steps:
 * 1. Sign up for a free Cloudflare account if you don't have one
 * 2. Go to Workers & Pages in the Cloudflare dashboard
 * 3. Create a new Worker
 * 4. Paste this code into the Worker editor
 * 5. Save and deploy
 * 6. Note the assigned *.workers.dev URL
 * 
 * Usage in your Vue.js application:
 * 
 * <img :src="proxyImage(item.image_url)" />
 * 
 * methods: {
 *   proxyImage(url) {
 *     if (!url) return '';
 *     if (url.startsWith('https://')) return url;
 *     return 'https://your-worker-url.workers.dev/?url=' + encodeURIComponent(url);
 *   }
 * }
 */

export default {
  async fetch(request, env, ctx) {
    // Parse the request URL
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get('url');

    // Check if URL parameter exists
    if (!imageUrl) {
      return new Response('Error: Missing url parameter', { status: 400 });
    }

    try {
      // Fetch the image from the original HTTP URL
      const response = await fetch(imageUrl);
      
      // Check if the response was successful
      if (!response.ok) {
        return new Response(`Error: Failed to fetch image (HTTP ${response.status})`, { status: response.status });
      }
      
      // Create a new response with the same body
      const imageResponse = new Response(response.body);
      
      // Copy all headers from the original response
      response.headers.forEach((value, key) => {
        // Skip setting Content-Encoding to avoid issues with double compression
        if (key.toLowerCase() !== 'content-encoding') {
          imageResponse.headers.set(key, value);
        }
      });
      
      // Add CORS headers to allow access from any origin
      imageResponse.headers.set('Access-Control-Allow-Origin', '*');
      
      // Add cache control headers for better performance
      imageResponse.headers.set('Cache-Control', 'public, max-age=86400');
      
      return imageResponse;
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }
};