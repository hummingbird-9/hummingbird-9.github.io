# Games page update — November 5, 2026

## Games catalog
- Replaced the old numbered HTML/asset-repository catalog with a live folder catalog from `hummingbird-9/games` on the `main` branch.
- Discovers top-level game folders that contain a direct `index.html` entry point.
- Uses a PNG found in each game folder for its thumbnail, preferring `cover.png`, `thumbnail.png`, or `icon.png` when present.
- Loads games and their relative assets from jsDelivr, preserving the folder structure.
- Caches the folder catalog in local storage and includes a Refresh control to re-read GitHub.

## Search and controls
- Matches the Gallery page's glass search bar and game-card styling.
- Removes the Search Hummingweb and View Web Ports and Projects links from this page; the only navigation link is Home.
- Places Refresh to the left of the search input and an HTML-file selector to its right. The selector becomes active for a selected game when that folder contains multiple direct HTML files; `index.html` is the default.
- Reads the search from `?q=` on page load and updates the URL as the search changes, for example `games.html?q=poly+track`.

## Player
- Selecting a card opens the game in the centered player overlay.
- Supports opening the selected HTML in a new tab or an `about:blank` tab.
- Closing removes the iframe to unload the game page.
