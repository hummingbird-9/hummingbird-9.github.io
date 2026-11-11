# humming[bird]Tech visual upgrade

This is an overlay update for the existing website. It keeps the site's green/glass identity and does not include or overwrite `games.html`, so your newer game-player and download changes are preserved.

## Included
- Refined shared CSS and responsive settings dialog
- Normal, extra-dark, and light themes
- Background presets and a custom background color
- Accent color and text-size controls
- Compact layout, reduced motion, and glass-effect toggles
- Persistent preferences saved in this browser
- Refreshed home page using the existing humming[bird]Tech branding
- Installer that adds the shared settings panel to `games.html` without replacing its existing code

## Apply
Extract this ZIP into the root of your existing `hummingbird-9.github.io` repository, replacing files when asked. Then run:

```bash
python3 install-settings.py
```

Review the changes before committing. The ZIP intentionally does not contain `games.html`.
