# Pool 2026

A single-file, browser-based 8-ball pool game built with HTML5 canvas and vanilla JavaScript — no build step, no dependencies.

## Running it

Just open `index.html` in a browser:

```bash
open index.html
```

## How to play

1. **Choose a cue** on the start screen (each cue has Power / Aim / Spin stats that affect max shot speed), then press **PLAY**.
2. **Ball in hand**: drag the white cue ball anywhere on the table, then press **CONFIRM**.
3. **Aim**: drag the arrow up/down on the ruler to the right of the table to set the shot direction.
4. **Spin (optional)**: drag the dot on the white spin-ball widget below the shoot button off-center before you shoot — up/down for follow/draw, sides for english off the rails. It resets to center after every shot.
5. **Shoot**: click and drag the cue down in the rack on the left to pull it back (further = more power), then release to fire — or press the white shoot button to fire using the current ruler direction and rack power.
6. Standard 8-ball rules apply: pot a ball to claim solids or stripes, clear your group, then legally sink the 8-ball to win. Fouls (scratches, hitting the wrong group, or no contact) give the other player ball-in-hand.

A coin wager is placed on each match; the winner takes the pot.

## Features

- Realistic-feeling physics: friction, cushion bounces, ball-on-ball collisions, and rolling animation (balls visibly spin as they travel). Collisions run in fixed-size substeps so fast shots (like a full-power break) can't skip past a ball or a pocket mouth between checks.
- Cue ball spin (english): a draggable spin widget sets follow/draw and side spin, each cue's Spin stat scaling how strong the effect is.
- Three selectable cues with different stats, switchable mid-game from the rack.
- A wood-and-gold table rendered entirely on canvas (carved corner flourishes, vibrant green felt with a centered watermark, metallic pocket trim, diamond rail markers).
- Separate aim (ruler), spin, and shoot (rack cue pull-back) controls.
- Two-player local hotseat play with coin wagering and a payout screen.

## Project status

Actively in progress — visuals and controls are being iterated on. Not polished yet.
