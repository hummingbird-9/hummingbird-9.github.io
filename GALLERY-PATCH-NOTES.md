# Gallery GitHub Pages launcher fix

This patch preserves the existing gallery layout, card naming, card descriptions, and repository list. It does not fetch repository HTML files, inject game pages into `srcdoc`, or rewrite game asset paths.

## Changes

- Restores the original GitHub Pages launch model: each card opens the repository's configured Pages site.
- Uses GitHub's public Pages API to discover the real Pages URL, including custom domains, and confirm the site is configured and the latest reported state is not errored.
- Hides **Open in New Tab** when GitHub does not confirm a usable Pages site.
- Keeps the `about:blank` button; it opens a blank tab containing an iframe to the same Pages URL.
- Adds `hummingbird-9/one-piece-character-spinner` to `html/repos.json` without renaming or removing existing entries.
- For that One Piece entry only, uses the supplied working URL: `https://ghp.hummingbird.rf.gd/One-Piece-Character-Spinner-/`.
- Fixes the original malformed cover image CDN and GitHub avatar URLs.

## Important iframe limitation

A site can work when opened directly but still refuse to load inside another site's iframe if its response sends `X-Frame-Options` or a restrictive Content-Security-Policy `frame-ancestors` header. The gallery cannot override those server headers. In that case **Open in New Tab** is the correct fallback.

## Apply

Extract the ZIP into the root of `hummingbird-9.github.io`, then run:

```bash
git add gallery.html html/repos.json GALLERY-PATCH-NOTES.md
git commit -m "Restore GitHub Pages game launching"
git push origin main
```

After deploying, refresh `https://hummingbird-9.github.io/gallery.html` with Ctrl+Shift+R.
