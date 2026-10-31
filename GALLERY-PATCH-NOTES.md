# Gallery fix — Celeste assets and two new-tab buttons

- Fixed HTML root-absolute `src`, `href`, `poster`, and `data-src` paths such as `/assets/index-...js` and `/assets/index-...css` in srcdoc games. Paths now use the repository's jsDelivr base rather than `https://cdn.jsdelivr.net/assets/...` or the gallery website root.
- Renamed the former `New Tab` button to `about:blank`: it opens a blank tab and writes the fetched HTML into it.
- Replaced the former `GitHub Repo` button with `Open in New Tab`: this opens the actual GitHub Pages URL reported by GitHub's Pages API, and remains hidden unless Pages is configured and the API check succeeds. A Pages site's existence does **not** verify that a specific game URL responds with HTTP 200; cross-origin pages cannot be status-checked reliably from normal browser JavaScript.
- Keeps the existing in-gallery iframe and other gallery features intact.

## What this cannot fix automatically

Celeste/Webleste's dynamic fetches of root-relative `/_framework` files, workers, threads, WebAssembly cross-origin isolation requirements, and jsDelivr HTML MIME type limitations may still stop it from starting. Rewriting entry-HTML asset paths is necessary but not sufficient for a large WebAssembly app; successful standalone hosting needs a server that serves the build with correct paths and security headers. `about:blank` alone does not provide those headers.

If `hummingbird-9/Celeste` is on `threads-v2`, make sure that is the default branch used by the gallery (or add explicit branch override). A default-branch mismatch can also cause CDN 404s.
