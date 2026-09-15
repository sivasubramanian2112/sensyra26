import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// __dirname doesn't exist in native ESM -- this is the portable equivalent,
// works on every Node version that supports import.meta.url (not just the
// newer import.meta.dirname, which needs Node 20.11+).
const __dirname = dirname(fileURLToPath(import.meta.url));

// Multi-page static site: every existing HTML file becomes a build entry.
// Nothing about the pages themselves changes -- this only teaches Vite
// where to find them so `npm run build` bundles all seven.
export default defineConfig({
  // Relative asset paths in the built output -- so dist/ works whether
  // it's opened directly (file://), served from a subfolder, or deployed
  // at a domain root. Root-absolute paths (the Vite default) only work
  // for the last of those three.
  base: "./",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        paperPresentation: resolve(__dirname, "events/paper-presentation.html"),
        iotronics: resolve(__dirname, "events/iotronics.html"),
        bidnex: resolve(__dirname, "events/bidnex.html"),
        iplAuction: resolve(__dirname, "events/ipl-auction.html"),
        cinetrix: resolve(__dirname, "events/cinetrix.html"),
        artiverse: resolve(__dirname, "events/artiverse.html")
      }
    }
  }
});
