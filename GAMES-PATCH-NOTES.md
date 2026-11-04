# HTML Games duplicate-list fix

- Fixes the repeated GitHub Contents API requests that were adding the same directory listing up to 20 times.
- Fetches each repository root once once (the directory endpoint returns up to 1,000 entries).
- Deduplicates HTML files by repository path/filename and asset folders by numeric ID.
- Changes the localStorage cache key to `hummingbird-view-games-v2-unique`, so the previous duplicated 13,840-entry cache is ignored.
- Adds defensive deduplication when reading cached data and before rendering games.
- Keeps the current page layout, controls, card design, game title map, and launch behavior unchanged.

Replace only `games.html` in the site repository. The new page will rebuild its list from GitHub on the first load after deployment.
