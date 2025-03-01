/**
 * Image Proxy Utility
 * 
 * This utility helps proxy HTTP images through Cloudflare Workers
 * to make them available over HTTPS.
 */

// Update this URL with your deployed Cloudflare Worker URL
const PROXY_URL = 'https://http-to-https-proxy.mb-ad3.workers.dev';

/**
 * Proxies an image URL through Cloudflare Workers if it's using HTTP
 * @param {string} url - The original image URL
 * @returns {string} - Either the original URL (if HTTPS) or proxied URL
 */
export function proxyImage(url) {
  // Return empty string for undefined/null URLs
  if (!url) return '';
  
  // Keep HTTPS URLs as they are
  if (url.startsWith('https://')) {
    return url;
  }
  
  // Proxy HTTP URLs through Cloudflare Worker
  if (url.startsWith('http://')) {
    return `${PROXY_URL}/?url=${encodeURIComponent(url)}`;
  }
  
  // Return the original URL for other protocols
  return url;
}

export default {
  proxyImage
};