# View Games + Home Page Update

## Changes
- Renamed the existing home-page gallery button to **View Ports and Projects**; it still opens `gallery.html`.
- Added a **View Games** home-page button that opens `games.html`.
- Left the existing `gallery.html`, `script.js`, and `zones.json` files unchanged.
- `games.html` discovers actual root-level `.html` files from `hummingbird-9/html` through GitHub's public Contents API. It does not fetch or require `zones.json`.
- It preserves existing game names through a small embedded title lookup generated from the original site data. New HTML files are still discovered automatically; unknown names fall back to the filename suffix or `Game <id>`.
- Covers are loaded from `hummingbird-9/covers` as `<id>.png`.
- It checks the root of `hummingbird-9/assets` for a numbered directory matching each game ID and uses that folder as the relative-asset base when present.
- The game list is cached in the browser for six hours. Use **Refresh Game List** to fetch the latest repository contents immediately.
- Search, numeric repository ordering, name sorting, pagination, iframe launch, fullscreen, new-tab launch, and a close action that removes the iframe are included.

## Files
- `index.html` (updated)
- `games.html` (new)

`zones.json` is not included or changed by this patch.

## Notes
- The list reads the actual filenames instead of assuming every ID has a `<number>.html` file, so names such as `8-wow.html`, `1-a.html`, and `20a.html` are supported.
- The GitHub Contents API is public but rate-limited. The six-hour local cache reduces requests. If the API is temporarily unavailable, retry with **Refresh Game List** later.
- Game pages are fetched from jsDelivr and loaded into the viewer with a `<base>` pointing to the corresponding numbered assets folder when one exists. Games with nonstandard asset layouts may still need individual adjustments.
