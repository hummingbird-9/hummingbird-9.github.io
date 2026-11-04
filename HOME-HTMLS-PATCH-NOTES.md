# Home and HTML Browser Button Cleanup

## Home page
- Keeps only the requested primary navigation actions: **View Web Ports and Projects**, **View HTMLs**, and **Search Hummingweb**.
- Removes the unrelated **About**, **WW3 Trailer**, and **Elmo Fight** home-page buttons.
- Keeps the original Hummingweb search engine page at `hummingweb.html`.
- Keeps the original Ports and Projects page at `gallery.html`.

## HTML browser
- Labels the new page **View HTMLs** / **humming[bird]Tech HTMLs**.
- Adds a direct **Search Hummingweb** link so the existing search engine remains available.
- The HTML list continues to discover numeric and suffixed `.html` filenames from `hummingbird-9/html` directly, without loading `zones.json`.
- The list is limited to root-level numeric HTML files in that repository; unrelated homepage files such as `ww3.html` and `elmofight.html` are not included.
- Numbered covers and asset folders continue to be read from `hummingbird-9/covers` and `hummingbird-9/assets`.

## Files
- `index.html` — updated home-page buttons.
- `games.html` — updated HTML browser labels and Hummingweb navigation link.

`gallery.html`, `hummingweb.html`, `zones.json`, and the other existing site files are not modified.
