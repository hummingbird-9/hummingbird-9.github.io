# Gallery close/unload and HTTPS fix

## Changes
- Preserves the existing gallery layout, card names, descriptions, GitHub Pages launcher, thumbnail fallback sequence, and buttons.
- Uses the HTTPS origin serving the gallery for project Pages paths. This prevents the gallery from assigning legacy `http://` project URLs when the gallery itself is HTTPS.
- Adds a URL normalization guard before an app URL is assigned to an iframe or opened in a new tab.
- On Close, navigates the game iframe to `about:blank` and removes the iframe element entirely. Removing its browsing context unloads the game document and tears down its page-owned JavaScript/WebAssembly execution, media, timers, and workers. A fresh empty iframe is created the next time a game is launched.

## Install
Replace only `gallery.html` in the website repository. No changes to `html/repos.json` are required.

## Limits
A browser may retain some process memory temporarily for reuse, even after the document is unloaded. The gallery cannot force the browser or operating system to immediately return every reserved byte. Tabs opened separately with the New Tab or about:blank buttons are separate browsing contexts and must be closed separately.

If a destination server itself redirects HTTPS requests to HTTP, the browser can still block that redirect as mixed content; the destination must serve the game over HTTPS.
