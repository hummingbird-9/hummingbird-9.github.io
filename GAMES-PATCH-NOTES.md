# Gallery-matched HTML browser correction

## Files
- `index.html`: keeps the original humming[bird]Tech home page visual style and the three requested links, stacked one per row. Search Hummingweb points to `web.html`.
- `games.html`: rebuilt to use the same `style.css`, page structure, card markup, controls, theme toggle, and game viewer conventions as `gallery.html`. It does not read `zones.json`.

## Duplicate listing fix
The previous implementation requested the same GitHub Contents API directory endpoint repeatedly with `page=1..20`. The Contents API directory listing isn't page-based for a single directory, so the same files were appended repeatedly. This version requests each repository root once, deduplicates by filename, and also deduplicates cached data. The cache key is bumped so an old duplicated 13,840-entry cache cannot be reused.

The GitHub Contents API listing is sufficient for the current repository size (the repository was described as roughly 700 root HTML files). If the repository grows beyond GitHub's 1,000-entry directory listing limit, the implementation should be migrated to the Git Trees API.

## Filesystem assumptions
- Root HTML files: `hummingbird-9/html` on branch `main`.
- Numbered non-single-file game assets: root numeric directories in `hummingbird-9/assets` on branch `main`.
- Numbered covers: `hummingbird-9/covers` on branch `main`, named `<numeric-id>.png`.
- The `web.html` page is linked but not included or modified by this patch.

## Test notes
JavaScript syntax, embedded title-map JSON, and ZIP integrity were checked locally. Live GitHub API and CDN requests could not be made from the build environment, so browser-side live loading still needs verification after deployment.
