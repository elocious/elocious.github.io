# Base44 Dev Environment

## Project
Static HTML site — three pages (`Drop.html`, `bookify apartment.html`, `shop online.html`) and one image (`web2.jpg`). No build step, no backend, no package manager.

## Running
```
docker compose -f docker-compose.base44.yml up -d
```
Serves the repo root via nginx:alpine on host port 3000. `index.html` is the entry point and links to the three pages.

## Notes
- Several HTML files reference local CSS/JS/image files (e.g. `css6.css`, `Untitled-2.css`, `weplus logo white.png`) that are NOT in the repo — those assets will 404 and the pages render unstyled. External CDNs (Font Awesome) and links to wepluz.com work if reachable.
- No credentials or external services are required.
