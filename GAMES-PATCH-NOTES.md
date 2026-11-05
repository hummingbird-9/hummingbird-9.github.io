# HTML Games page layout and overview fix

- Replaces the unstyled one-line game list with a responsive CSS grid that wraps cards into multiple columns and adapts to narrow screens.
- Constrains card buttons so the site's global button minimum-width and margins cannot stretch or overflow the cards.
- Changes game selection to open a centered, fixed-position game overview dialog instead of inserting the game viewer after the long list.
- Adds a separate **Play Game** action; the game iframe is created only after the user chooses to launch the game.
- Keeps Open in New Tab, fullscreen, close, Escape-to-close, repository sorting/search, caching, and incremental loading.
- Hides and unloads the iframe when the dialog closes so a running game does not continue consuming resources in the background.

Replace `games.html` and `GAMES-PATCH-NOTES.md` in the site repository. Clear the page's cached files or hard-refresh the page after deployment if the old layout remains visible.
