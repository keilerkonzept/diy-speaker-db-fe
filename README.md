# DIY Speaker Database

A Vue.js application for browsing and managing a database of DIY speaker projects.

## Backend

The backend is a Google Sheets document, which can be queried as JSON.
Every tab on the FE corresponds to a tab in the Spreadsheet.
Changes are posted to a dedidcated tab via Google App Script endpoint.

## Image Proxy Solution

The application uses a Cloudflare Worker to proxy HTTP images to HTTPS, allowing them to be displayed in modern browsers that block mixed content.

### Deployment Instructions

1. **Create a Cloudflare Worker**:
   - Sign up for a free Cloudflare account (if you don't have one)
   - Go to Workers & Pages in the Cloudflare dashboard
   - Create a new Worker
   - Paste the code from `ai/cloudflare-worker-image-proxy.js` into the Worker editor
   - Save and deploy

2. **Configure the application**:
   - Update the `PROXY_URL` in `src/utils/imageProxy.js` with your deployed Worker URL
   - Build and deploy the application

### Usage

The application automatically detects HTTP image URLs and routes them through the Cloudflare Worker proxy, which:
- Fetches the original HTTP image
- Preserves all headers (Content-Type, etc.)
- Returns the image over HTTPS
- Adds proper caching headers

## Development

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Run tests
npm run test:unit

# Lint files
npm run lint
```