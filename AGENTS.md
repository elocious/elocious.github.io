# Base44 Dev Environment

## Project
Static HTML site — three standalone pages (`Drop.html`, `bookify apartment.html`, `shop online.html`) plus one image (`web2.jpg`). No backend, no database, no build step, no external credentials.

The HTML files reference CSS/JS/image assets (e.g. `css6.css`, `Untitled-2.css`, `Untitled-3.js`, `weplus logo white.png`) that are **not present in the repo**, so those links will be broken in the preview. That is expected — the repo is incomplete as imported.

## Running
- `docker compose -f docker-compose.base44.yml up -d` — serves the repo via `nginx:alpine` on host port 3000.
- `nginx-default.conf` is bind-mounted into the container; it enables `autoindex on` so the root URL shows a directory listing of the pages (there is no `index.html`).
- Repo directory permissions were set to 755 and files to world-readable so the nginx worker user can traverse and serve them.

## Verifying
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` → 200
- Each `.html` page returns 200 when URL-encoded (spaces in filenames: `bookify%20apartment.html`, `shop%20online.html`).

## Notes
- No live-reload dev server (static files); call `reload_preview` after edits to content the user should see.
- No secrets required.
