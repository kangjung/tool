# DevBox

Serverless developer utility pages built with Vite, TypeScript, HTML, and CSS.

## Features

- Static multi-page routes: `/`, `/base64/`, `/sha256/`, `/json/`, `/url/`, `/html/`, `/uuid/`, `/text/`
- Browser-only processing: no server, API, database, login, or logging layer
- Tools for Base64, SHA-256, JSON formatting, URL encoding, HTML entities, UUID v4, and text counts
- SEO basics per page, Open Graph tags, `robots.txt`, and `sitemap.xml`
- Separated ad placeholders using the `ad-placeholder` class

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Deployment

Deploy the generated `dist` directory, not the project root.

The GitHub Pages URL for this repository is:

```txt
https://kangjung.github.io/tool/
```

The source HTML files intentionally load `/src/main.ts` for the Vite dev server. A plain static server will serve `.ts` files with the wrong MIME type, which causes this browser error:

```txt
Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "video/mp2t".
```

Use one of these setups:

- Local development: `npm run dev`
- Local production check: `npm run build` then `npm run preview`
- Netlify: build command `npm run build`, publish directory `dist`
- Vercel: build command `npm run build`, output directory `dist`
- Cloudflare Pages: build command `npm run build`, output directory `dist`
- GitHub Pages: use the included `.github/workflows/deploy.yml` workflow, or configure Pages to deploy from a GitHub Actions artifact built from `dist`
