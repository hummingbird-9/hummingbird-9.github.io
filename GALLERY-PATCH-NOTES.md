# Gallery patch notes

## Fixes

- Corrected malformed thumbnail and fallback avatar URLs; used the actual `cdn.jsdelivr.net/gh/user/repo@branch/file` format.
- Added a fallback sequence for repository cover art (`cover.png`, `Cover.png`, `thumbnail.png`, `icon.png`, `assets/cover.png`) and a valid GitHub account avatar as final fallback.
- Gallery cards display immediately, while optional GitHub metadata updates descriptions and the repository default branch.
- Changed `fetch('/html/repos.json')` to relative `fetch('html/repos.json')` so the site can be hosted under a folder path.
- Clicking a card now fetches an HTML entry (`index.html`, `Index.html`, `index.htm`, or `game.html`) from the *repository files* using jsDelivr and displays it in the gallery iframe via `srcdoc`. Links to relative resources use an injected `<base>` tag.
- "New Tab" opens the fetched HTML; "GitHub Repo" opens the source repository.
- Added keyboard support for cards and HTML-escaped card text via DOM insertion.

## Limits (important)

- This is a browser-only solution; it does not clone or bundle the remote game repositories into the site ZIP.
- jsDelivr serves HTML as plain text, so direct HTML URLs cannot be put in an iframe. The gallery fetches HTML and uses `srcdoc` instead.
- Games that rely on root-relative `/assets` URLs, dynamically resolved modules, navigation, service workers, local HTTP APIs, cross-origin restrictions, CORS, WebSockets or build output may not work inside `srcdoc`. These require adapting the game files or real hosting. Certain games/assets may exceed the CDN size limits.
- The gallery itself requires an HTTP(S) host (including a local static server), not the browser `file://` scheme, because it fetches JSON.
- Missing `cover.png` files still produce an initial missing-file request; if there is no cover, the gallery ultimately shows the owner's GitHub avatar.
