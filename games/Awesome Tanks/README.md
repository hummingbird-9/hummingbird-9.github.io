# Awesome Tanks

A 2D top-down tank action/shooter game built with the [Phaser](https://phaser.io/) HTML5 game framework (v2.x). Fight through a series of levels, blast enemies with five different weapon types, buy tank upgrades, and take down boss tanks.

## Features

- **5 weapon types** — Cannon, Minigun, Shotgun, Rockets, and Laser, each with its own turret, projectile, and sound effects
- **Tank upgrades** — an in-game parts/shop system for buying and equipping tank components
- **Level progression** — a level-select screen with multiple stages
- **Boss battles** — dedicated boss tank variants for each weapon type
- **Pickups & bonuses** — health packs, freeze bonuses, ammo crates
- **Achievements** — in-game achievement pop-ups (e.g. "Ultra Combo", "Treasurer")
- **Full audio** — separate music tracks for the menu, gameplay, and victory screen, plus 30+ sound effects
- **Custom shaders** — grayscale, tint, and inverse-alpha GLSL fragment shaders for visual effects
- **Mobile-friendly** — touch-friendly meta tags and no-select CSS for a clean mobile web experience

## Controls

| Action | Keys |
|---|---|
| Move | `W` `A` `S` `D` or Arrow keys |
| Aim / Fire | Mouse (aim with cursor, click to shoot) |
| Next weapon | `E` or `Space` |
| Previous weapon | `Q` |
| Select weapon slot directly | `1`–`6` |
| Pause | `P` |

## Project Structure

```
AwesomeTanks/
├── index.html            Entry point — loads the game and sets up the page
├── awesome_tanks.js       Bundled game code (Phaser 2 engine + game logic + Google WebFont Loader)
├── styles/
│   ├── main.css             Base page/canvas styling
│   └── fonts.css            @font-face declaration for the "Gunplay" font
├── fonts/
│   └── gunplay.ttf          Custom UI/HUD font
├── images/
│   ├── game.png / game.json   Main sprite atlas (tanks, turrets, projectiles, particles, HUD, achievements)
│   └── menu/                  Menu atlases: boot, title, loading, level select, upgrades, help, congratulations
├── sounds/                Weapon, UI, and event sound effects, plus menu/gameplay/victory music (MP3)
└── scripts/shaders/       GLSL fragment shaders (tint, grayscale, inverse-alpha)
```

## Running Locally

This is a static HTML5/JavaScript bundle with no build step, but the assets (sprite atlases, JSON, fonts) are loaded via HTTP requests, so opening `index.html` directly from the filesystem (`file://`) will fail in most browsers due to CORS restrictions. Serve the folder with any local web server instead, for example:

```bash
# Python
cd AwesomeTanks
python3 -m http.server 8000

# Node.js
npx serve AwesomeTanks-main
```

Then open `http://localhost:8000` in your browser.

## Tech Notes

- Built on **Phaser 2.2.9**, bundled together with the game's own code and the Google WebFont Loader into a single minified `awesome_tanks.js` file — there's no separate framework file to install, and no `package.json` or build tooling included.
- The page forwards clicks/keypresses to the parent window via `postMessage('keypress-from-game', '*')` and includes a Cloudflare Insights beacon, suggesting this build was originally meant to be embedded (e.g. via `<iframe>`) on a game portal site rather than run standalone.

## License
MIT
