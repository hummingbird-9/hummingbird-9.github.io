#!/usr/bin/env python3
from pathlib import Path
import re

path = Path("games.html")
if not path.exists():
    raise SystemExit("games.html was not found. Run this from the website repository root.")
html = path.read_text(encoding="utf-8")
tag = '<script src="global-utils.js"></script>'
if tag not in html:
    # Insert before the page's main inline application script.
    match = re.search(r'(?m)^[ \t]*<script>\s*(?:\(\(\) =>|const |let |async function)', html)
    if not match:
        raise SystemExit("Could not safely locate the main script in games.html; no changes made.")
    html = html[:match.start()] + "  " + tag + "\n" + html[match.start():]
    path.write_text(html, encoding="utf-8")
    print("Added shared settings to games.html.")
else:
    print("games.html already loads global-utils.js; no change needed.")
