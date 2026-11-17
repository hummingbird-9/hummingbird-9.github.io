'use strict';

// Procedural pixel-art character sprite generator, redrawn with
// original-game proportions:
//   Baldi: very tall & lanky | Principal: suit + comb-over
//   Playtime: small kid, pigtails | Bully: stocky, crossed arms
//   Gotta Sweep: face on yellow bristles | 1st Prize: boxy screen robot
//   Arts & Crafters: sock puppet | Mrs. Pomp: bun + glasses + skirt
// Walkers use 4-frame cycles; robots/objects use 2-frame cycles.

const SpriteGen = (() => {

  // 2x backing resolution for finer pixel art (logical coords unchanged)
  const S = 2;

  function canvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w * S; c.height = h * S;
    return c;
  }

  function g2d(c) {
    const ctx = c.getContext('2d');
    ctx.scale(S, S);
    ctx.imageSmoothingEnabled = false;
    return ctx;
  }

  function tex(c) {
    const outlined = addOutline(c);
    const t = new THREE.CanvasTexture(outlined);
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.generateMipmaps = false;
    return t;
  }

  // dark 1px outline around the silhouette for definition
  function addOutline(src) {
    const w = src.width, h = src.height;
    const srcData = src.getContext('2d').getImageData(0, 0, w, h).data;
    const out = document.createElement('canvas');
    out.width = w; out.height = h;
    const g = out.getContext('2d');
    g.drawImage(src, 0, 0);
    const img = g.getImageData(0, 0, w, h);
    const d = img.data;
    const has = (x, y) => x >= 0 && x < w && y >= 0 && y < h && srcData[(y * w + x) * 4 + 3] > 40;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        if (d[i + 3] > 40) continue;
        if (has(x - 1, y) || has(x + 1, y) || has(x, y - 1) || has(x, y + 1)) {
          d[i] = 18; d[i + 1] = 14; d[i + 2] = 12; d[i + 3] = 255;
        }
      }
    }
    g.putImageData(img, 0, 0);
    return out;
  }

  function px(g, x, y, w, h, color) {
    g.fillStyle = color;
    g.fillRect(x, y, w, h);
  }

  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) & 255, gg = (n >> 8) & 255, b = n & 255;
    r = Math.min(255, Math.round(r * f));
    gg = Math.min(255, Math.round(gg * f));
    b = Math.min(255, Math.round(b * f));
    return `rgb(${r},${gg},${b})`;
  }

  // 4-frame walk pose helper: returns leg lift / arm swing values
  const WALK = [
    { lLift: 2, rLift: 0, lSwing: -3, rSwing: 3 },
    { lLift: 0, rLift: 0, lSwing: 0, rSwing: 0 },
    { lLift: 0, rLift: 2, lSwing: 3, rSwing: -3 },
    { lLift: 0, rLift: 0, lSwing: 0, rSwing: 0 },
  ];

  function walkPose(f) { return WALK[f % 4]; }

  // shared face pieces
  function drawEyes(g, x0, y0, x1, y1, eyeW, eyeH, pupilW, pupilH, angry = false) {
    px(g, x0, y0, eyeW, eyeH, '#fff');
    px(g, x1, y0, eyeW, eyeH, '#fff');
    px(g, x0 + 1, y0 + 1, eyeW - 2, eyeH - 2, '#e8f0f8');
    px(g, x1 + 1, y0 + 1, eyeW - 2, eyeH - 2, '#e8f0f8');
    const px0 = x0 + (angry ? 2 : Math.floor(eyeW / 2));
    const px1 = x1 + (angry ? 2 : Math.floor(eyeW / 2));
    px(g, px0, y0 + 3, pupilW, pupilH, '#000');
    px(g, px1, y0 + 3, pupilW, pupilH, '#000');
    px(g, px0 + 1, y0 + 4, 2, 2, '#fff');
    px(g, px1 + 1, y0 + 4, 2, 2, '#fff');
  }

  // ------------------- BALDI (tall & lanky, 48x88) -------------------
  function baldi(angry = false) {
    const frames = [];
    const skin = angry ? '#f0a080' : '#f2c8a0';
    for (let f = 0; f < 4; f++) {
      const c = canvas(48, 88);
      const g = g2d(c);
      const p = walkPose(f);
      // legs: thin, long jeans
      px(g, 16, 44, 7, 36 - p.lLift, '#3a5a9a');
      px(g, 26, 44, 7, 36 - p.rLift, '#3a5a9a');
      px(g, 16, 46, 2, 32 - p.lLift, '#2a4a7a'); // leg shade
      px(g, 26, 46, 2, 32 - p.rLift, '#2a4a7a');
      // shoes
      px(g, 15, 80 - p.lLift, 10, 5, '#1a1a1a');
      px(g, 25, 80 - p.rLift, 10, 5, '#1a1a1a');
      px(g, 15, 80 - p.lLift, 10, 2, '#3a3a3a');
      px(g, 25, 80 - p.rLift, 10, 2, '#3a3a3a');
      // torso: narrow green shirt
      px(g, 13, 27, 22, 18, '#3a8a3a');
      px(g, 13, 27, 22, 3, '#2a6a2a');
      px(g, 13, 40, 22, 2, '#2a6a2a');
      px(g, 22, 28, 4, 12, '#2a6a2a'); // placket
      px(g, 21, 30, 1, 1, '#d8d8d8'); px(g, 21, 34, 1, 1, '#d8d8d8');
      px(g, 26, 30, 1, 1, '#d8d8d8'); px(g, 26, 34, 1, 1, '#d8d8d8');
      // neck
      px(g, 21, 24, 6, 4, skin);
      // left arm: long & thin, swinging
      px(g, 8 + p.lSwing, 28, 5, 30, skin);
      px(g, 8 + p.lSwing, 28, 5, 7, '#3a8a3a'); // sleeve
      px(g, 8 + p.lSwing, 28, 2, 30, shade(skin, 0.9));
      // right arm holds the ruler
      px(g, 35, 28, 5, 26, skin);
      px(g, 35, 28, 5, 7, '#3a8a3a');
      // ruler angled down from the hand
      g.save();
      g.translate(37, 50);
      g.rotate(0.45);
      px(g, 0, 0, 4, 28, '#c89858');
      px(g, 0, 0, 4, 3, '#8a6030');
      px(g, 0, 10, 4, 1, '#8a6030');
      px(g, 0, 20, 4, 1, '#8a6030');
      g.restore();
      // head: bald, narrow
      px(g, 9, 2, 30, 22, skin);
      px(g, 11, 0, 26, 4, skin);
      px(g, 9, 4, 2, 18, shade(skin, 0.88));   // side shading
      px(g, 37, 4, 2, 18, shade(skin, 0.88));
      // ears
      px(g, 5, 10, 4, 6, skin);
      px(g, 39, 10, 4, 6, skin);
      px(g, 6, 12, 2, 3, shade(skin, 0.8));
      px(g, 40, 12, 2, 3, shade(skin, 0.8));
      // eyes: big with small pupils
      drawEyes(g, 13, 10, 27, 10, 8, 9, 3, 4, angry);
      // eyebrows
      if (angry) {
        px(g, 12, 8, 9, 2, '#5a3020');
        px(g, 27, 8, 9, 2, '#5a3020');
      } else {
        px(g, 13, 8, 8, 2, '#5a3a20');
        px(g, 27, 8, 8, 2, '#5a3a20');
      }
      // nose
      px(g, 23, 15, 2, 3, shade(skin, 0.85));
      // mouth: huge grin with both tooth rows
      if (angry) {
        px(g, 13, 19, 22, 4, '#8a2010');
        px(g, 13, 20, 22, 2, '#fff');
        px(g, 15, 22, 18, 2, '#8a2010');
      } else {
        px(g, 12, 18, 24, 6, '#c04030');
        px(g, 12, 19, 24, 2, '#fff');       // upper teeth
        px(g, 14, 22, 20, 2, '#fff');       // lower teeth
        px(g, 13, 18, 22, 1, '#8a2010');    // lip line
      }
      frames.push(tex(c));
    }
    return frames;
  }

  // ------------------- PRINCIPAL (56x80) -------------------
  function principal() {
    const frames = [];
    for (let f = 0; f < 4; f++) {
      const c = canvas(56, 80);
      const g = g2d(c);
      const p = walkPose(f);
      // legs (gray pants) + shoes
      px(g, 19, 52, 10, 24 - p.lLift, '#3a3a44');
      px(g, 29, 52, 10, 24 - p.rLift, '#3a3a44');
      px(g, 17, 76 - p.lLift, 12, 5, '#1a1a1a');
      px(g, 28, 76 - p.rLift, 12, 5, '#1a1a1a');
      // torso: blue-gray suit
      px(g, 13, 28, 30, 26, '#5a5a6a');
      px(g, 13, 28, 30, 3, '#4a4a5a');
      // white shirt + black tie
      px(g, 24, 30, 8, 14, '#f0f0f0');
      px(g, 26, 30, 4, 16, '#202020');
      px(g, 27, 30, 2, 4, '#404040');
      // suit lapels
      px(g, 17, 30, 6, 12, '#4a4a5a');
      px(g, 33, 30, 6, 12, '#4a4a5a');
      // arms (suit + white cuff + hand)
      px(g, 7 + p.lSwing, 30, 7, 26, '#5a5a6a');
      px(g, 7 + p.lSwing, 30, 7, 3, '#4a4a5a');
      px(g, 7 + p.lSwing, 52, 7, 4, '#f0f0f0');
      px(g, 8 + p.lSwing, 55, 5, 4, '#f2c8a0');
      px(g, 42, 30, 7, 26, '#5a5a6a');
      px(g, 42, 30, 7, 3, '#4a4a5a');
      px(g, 42, 52, 7, 4, '#f0f0f0');
      px(g, 43, 55, 5, 4, '#f2c8a0');
      // whistle on a string
      px(g, 20, 28, 2, 12, '#c8c8c8');
      px(g, 18, 39, 6, 4, '#d8d020');
      px(g, 18, 41, 2, 3, '#b8a010');
      // head
      px(g, 15, 6, 26, 22, '#f2c8a0');
      // gray comb-over hair
      px(g, 15, 2, 26, 8, '#d8d8d8');
      px(g, 13, 4, 6, 12, '#d8d8d8');
      px(g, 15, 4, 22, 3, '#e8e8e8');
      px(g, 41, 4, 3, 8, '#d8d8d8');
      // ears
      px(g, 12, 12, 4, 6, '#f2c8a0');
      px(g, 40, 12, 4, 6, '#f2c8a0');
      // eyes + smile
      drawEyes(g, 18, 12, 30, 12, 8, 8, 3, 4, false);
      px(g, 22, 22, 12, 5, '#c04030');
      px(g, 22, 22, 12, 2, '#fff');
      frames.push(tex(c));
    }
    return frames;
  }

  // ------------------- PLAYTIME (44x60) -------------------
  function playtime() {
    const frames = [];
    for (let f = 0; f < 4; f++) {
      const c = canvas(44, 60);
      const g = g2d(c);
      const p = walkPose(f);
      // legs (jeans) + white sneakers
      px(g, 14, 34, 8, 20 - p.lLift, '#3a5a9a');
      px(g, 24, 34, 8, 20 - p.rLift, '#3a5a9a');
      px(g, 12, 54 - p.lLift, 10, 5, '#f0f0f0');
      px(g, 23, 54 - p.rLift, 10, 5, '#f0f0f0');
      // torso: red shirt
      px(g, 12, 22, 22, 14, '#d03030');
      px(g, 12, 22, 22, 3, '#b02828');
      px(g, 18, 24, 10, 10, '#d03030');
      // arms with white sleeves
      px(g, 5 + p.lSwing, 24, 6, 14, '#f0f0f0');
      px(g, 6 + p.lSwing, 24, 4, 14, '#d03030');
      px(g, 5 + p.lSwing, 34, 6, 4, '#f2c8a0');
      px(g, 33, 24, 6, 14, '#f0f0f0');
      px(g, 33, 24, 4, 14, '#d03030');
      px(g, 33, 34, 6, 4, '#f2c8a0');
      // jump rope (yellow arc)
      px(g, 3, 16, 3, 3, '#e8d030');
      px(g, 38, 16, 3, 3, '#e8d030');
      g.strokeStyle = '#e8d030';
      g.lineWidth = 2;
      g.beginPath();
      g.arc(22, 30, 20, Math.PI * 0.2, Math.PI * 0.8);
      g.stroke();
      // head (big for a kid)
      px(g, 10, 4, 24, 20, '#f2c8a0');
      // pigtails with red bows
      px(g, 2, 2, 10, 10, '#d06020');
      px(g, 32, 2, 10, 10, '#d06020');
      px(g, 0, 5, 6, 6, '#e87028');
      px(g, 38, 5, 6, 6, '#e87028');
      px(g, 6, 8, 4, 3, '#e03030');
      px(g, 34, 8, 4, 3, '#e03030');
      // bangs
      px(g, 10, 2, 24, 6, '#d06020');
      px(g, 8, 4, 4, 8, '#d06020');
      px(g, 32, 4, 4, 8, '#d06020');
      // freckles
      px(g, 15, 18, 2, 2, '#d89060');
      px(g, 20, 20, 2, 2, '#d89060');
      px(g, 28, 18, 2, 2, '#d89060');
      // eyes + smile
      drawEyes(g, 13, 11, 25, 11, 6, 6, 3, 4, false);
      px(g, 17, 20, 10, 4, '#c04030');
      frames.push(tex(c));
    }
    return frames;
  }

  // ------------------- IT'S A BULLY (56x64) -------------------
  function bully() {
    const frames = [];
    for (let f = 0; f < 2; f++) {
      const c = canvas(56, 64);
      const g = g2d(c);
      const sway = f === 0 ? 0 : 1;
      // legs
      px(g, 16, 44, 11, 14, '#2a3a5a');
      px(g, 30, 44, 11, 14, '#2a3a5a');
      px(g, 14, 56, 13, 5, '#f0f0f0');
      px(g, 29, 56, 13, 5, '#f0f0f0');
      // torso: wide red tee
      px(g, 9, 22, 38, 24, '#c02828');
      px(g, 9, 22, 38, 3, '#a02020');
      px(g, 9, 22, 38, 2, '#e04040');
      // thick crossed arms
      px(g, 3, 26 + sway, 12, 20, '#c02828');
      px(g, 41, 26 - sway, 12, 20, '#c02828');
      px(g, 3, 26 + sway, 12, 4, '#f2b890');
      px(g, 41, 26 - sway, 12, 4, '#f2b890');
      px(g, 14, 28, 28, 8, '#a02020'); // crossed forearms
      px(g, 14, 28, 28, 2, '#c02828');
      px(g, 12, 32, 6, 4, '#f2b890');
      px(g, 38, 30, 6, 4, '#f2b890');
      // head
      px(g, 12, 2, 32, 22, '#f2b890');
      px(g, 12, 0, 32, 6, '#3a2818'); // messy hair
      px(g, 10, 2, 6, 8, '#3a2818');
      px(g, 40, 2, 6, 8, '#3a2818');
      px(g, 14, 4, 28, 2, '#4a3820');
      // thick angry brows
      px(g, 14, 11, 12, 4, '#2a1c10');
      px(g, 30, 11, 12, 4, '#2a1c10');
      // squinting eyes
      px(g, 15, 14, 10, 5, '#fff');
      px(g, 31, 14, 10, 5, '#fff');
      px(g, 17, 15, 5, 4, '#000');
      px(g, 33, 15, 5, 4, '#000');
      // frown
      px(g, 20, 22, 16, 4, '#8a2010');
      px(g, 20, 25, 16, 2, '#5a1008');
      frames.push(tex(c));
    }
    return frames;
  }

  // ------------------- GOTTA SWEEP (44x80) -------------------
  function sweep() {
    const frames = [];
    for (let f = 0; f < 2; f++) {
      const c = canvas(44, 80);
      const g = g2d(c);
      const sway = f === 0 ? 0 : 2;
      // bottom bristles
      for (let i = 0; i < 15; i++) {
        px(g, 4 + i * 2.4 + sway, 70, 3, 8, i % 2 === 0 ? '#e0c050' : '#c8a830');
      }
      // wooden handle body
      px(g, 19, 30, 6, 42, '#a07030');
      px(g, 20, 30, 2, 42, '#b88040');
      // stick arms
      px(g, 10, 34 + sway, 5, 18, '#a07030');
      px(g, 29, 34 - sway, 5, 18, '#a07030');
      px(g, 10, 34 + sway, 5, 3, '#c09050');
      px(g, 29, 34 - sway, 5, 3, '#c09050');
      // green shirt wrapped around the handle
      px(g, 16, 26, 12, 12, '#3a8a3a');
      px(g, 16, 26, 12, 3, '#2a6a2a');
      px(g, 16, 34, 12, 3, '#2a6a2a');
      // yellow bristle head with the FACE on it
      px(g, 6, 4, 32, 24, '#f0d050');
      for (let i = 0; i < 22; i++) {
        px(g, 6 + i * 1.5, 2, 2, 6, i % 2 === 0 ? '#f8e070' : '#e0b830');
      }
      px(g, 8, 6, 28, 3, '#f8e070');
      // face
      drawEyes(g, 15, 12, 26, 12, 7, 7, 3, 4, false);
      px(g, 18, 22, 8, 4, '#8a2010');
      frames.push(tex(c));
    }
    return frames;
  }

  // ------------------- 1ST PRIZE (56x72) -------------------
  function firstPrize() {
    const frames = [];
    for (let f = 0; f < 2; f++) {
      const c = canvas(56, 72);
      const g = g2d(c);
      const wob = f === 0 ? 0 : 1;
      // wheels
      px(g, 12, 62, 13, 7, '#1a1a1a');
      px(g, 31, 62, 13, 7, '#1a1a1a');
      px(g, 15, 64, 7, 4, '#555');
      px(g, 34, 64, 7, 4, '#555');
      // body: dark blue-gray
      px(g, 12, 30, 32, 34, '#406080');
      px(g, 12, 30, 32, 4, '#30485a');
      px(g, 14, 36, 28, 2, '#6080a0');
      px(g, 14, 52, 28, 2, '#30485a');
      // screen head: dark frame + light screen + pixel face
      px(g, 8, 4 + wob, 40, 28, '#30405a');
      px(g, 12, 8 + wob, 32, 20, '#c8d8e8');
      px(g, 14, 10 + wob, 28, 16, '#dce8f4');
      px(g, 20, 14 + wob, 7, 7, '#202020');
      px(g, 30, 14 + wob, 7, 7, '#202020');
      px(g, 23, 21 + wob, 11, 3, '#202020');
      px(g, 23, 22 + wob, 11, 1, '#404040');
      px(g, 21, 15 + wob, 2, 2, '#c8d8e8');
      px(g, 31, 15 + wob, 2, 2, '#c8d8e8');
      // antenna
      px(g, 26, 0, 4, 6 + wob, '#6080a0');
      px(g, 24, 0, 8, 3, '#d03030');
      // red bowtie
      px(g, 25, 38, 3, 3, '#d03030');
      px(g, 29, 38, 3, 3, '#d03030');
      px(g, 26, 36, 5, 7, '#b02828');
      // stubby arms
      px(g, 4, 34 + wob, 9, 7, '#406080');
      px(g, 43, 34 - wob, 9, 7, '#406080');
      px(g, 4, 34 + wob, 9, 2, '#6080a0');
      px(g, 43, 34 - wob, 9, 2, '#6080a0');
      frames.push(tex(c));
    }
    return frames;
  }

  // ------------------- ARTS AND CRAFTERS (48x48) -------------------
  function artsCrafters() {
    const frames = [];
    for (let f = 0; f < 2; f++) {
      const c = canvas(48, 48);
      const g = g2d(c);
      const shift = f === 0 ? 0 : 1;
      // sock body
      px(g, 9, 10, 30, 34, '#f0f0e8');
      px(g, 9, 10, 30, 3, '#e0e0d0');
      px(g, 9, 40, 30, 4, '#e8e8e0');
      // toe (curved tip at top)
      px(g, 7, 8, 10, 30, '#f8f8f0');
      px(g, 9, 6, 6, 34, '#f0f0e8');
      px(g, 11, 5, 20, 4, '#f8f8f0');
      // knit line
      px(g, 13, 8, 22, 2, '#c8c8b8');
      for (let x = 14; x < 34; x += 6) px(g, x, 9, 2, 2, '#a0a090');
      // googly eyes (big, slightly offset)
      px(g, 14, 14 + shift, 11, 13, '#fff');
      px(g, 25, 12 - shift, 11, 13, '#fff');
      px(g, 15, 15 + shift, 9, 11, '#f4f4ee');
      px(g, 26, 13 - shift, 9, 11, '#f4f4ee');
      px(g, 18, 18 + shift, 4, 5, '#000');
      px(g, 29, 16 - shift, 4, 5, '#000');
      px(g, 19, 19 + shift, 2, 2, '#fff');
      px(g, 30, 17 - shift, 2, 2, '#fff');
      // stitched mouth with cross stitches
      px(g, 16, 32, 16, 4, '#c03030');
      for (let x = 17; x < 31; x += 4) px(g, x, 32, 1, 4, '#e0e0d0');
      px(g, 15, 31, 1, 1, '#8a2010');
      px(g, 32, 35, 1, 1, '#8a2010');
      frames.push(tex(c));
    }
    return frames;
  }

  // ------------------- MRS. POMP (52x80) -------------------
  function mrsPomp() {
    const frames = [];
    for (let f = 0; f < 4; f++) {
      const c = canvas(52, 80);
      const g = g2d(c);
      const p = walkPose(f);
      const hem = [0, 1, 0, -1][f % 4];
      // long skirt (legs hidden, hem sways)
      px(g, 15, 42, 22, 32, '#6a4a3a');
      px(g, 15, 42 + hem, 22, 2, '#5a3a2c');
      px(g, 15, 40, 22, 4, '#7a5a4a');
      // shoes peeking below
      px(g, 17, 74, 8, 5, '#2a1a10');
      px(g, 28, 74, 8, 5, '#2a1a10');
      // torso: peach blouse + white collar
      px(g, 15, 26, 22, 18, '#e8b8a0');
      px(g, 15, 26, 22, 3, '#d8a890');
      px(g, 20, 28, 12, 10, '#f8f0e0');
      px(g, 22, 30, 8, 8, '#e8dcc8');
      // arms
      px(g, 8 + p.lSwing, 28, 6, 18, '#e8b8a0');
      px(g, 8 + p.lSwing, 28, 6, 4, '#d8a890');
      px(g, 8 + p.lSwing, 42, 6, 4, '#f2c8a0');
      px(g, 38, 28, 6, 18, '#e8b8a0');
      px(g, 38, 28, 6, 4, '#d8a890');
      px(g, 38, 42, 6, 4, '#f2c8a0');
      // pointer stick in right hand
      px(g, 42, 20, 3, 26, '#8a6030');
      px(g, 42, 18, 3, 3, '#6a4520');
      // head
      px(g, 14, 4, 24, 22, '#f2c8a0');
      // hair + bun with hairpin
      px(g, 13, 0, 26, 10, '#5a3a20');
      px(g, 19, 0, 14, 8, '#6a4a2c');
      px(g, 11, 2, 5, 14, '#5a3a20');
      px(g, 36, 2, 5, 14, '#5a3a20');
      px(g, 24, 2, 6, 2, '#d8b890'); // hairpin shine
      // round glasses
      px(g, 15, 12, 10, 9, '#888');
      px(g, 27, 12, 10, 9, '#888');
      px(g, 15, 12, 10, 2, '#444');
      px(g, 27, 12, 10, 2, '#444');
      px(g, 25, 14, 2, 2, '#444');
      px(g, 16, 13, 8, 7, '#c8d8e8');
      px(g, 28, 13, 8, 7, '#c8d8e8');
      // eyes + pupils behind glasses
      px(g, 19, 15, 3, 4, '#000');
      px(g, 31, 15, 3, 4, '#000');
      // rosy cheeks
      px(g, 15, 20, 4, 3, '#e89080');
      px(g, 33, 20, 4, 3, '#e89080');
      // big smile
      px(g, 19, 23, 14, 5, '#c04030');
      px(g, 19, 23, 14, 2, '#fff');
      frames.push(tex(c));
    }
    return frames;
  }

  // ------------------- BUILD ALL -------------------

  function build(character) {
    switch (character) {
      case 'baldi': return baldi(false);
      case 'baldi_angry': return baldi(true);
      case 'principal': return principal();
      case 'playtime': return playtime();
      case 'bully': return bully();
      case 'sweep': return sweep();
      case 'firstprize': return firstPrize();
      case 'arts': return artsCrafters();
      case 'mrsPomp': return mrsPomp();
      default: return baldi(false);
    }
  }

  const cache = {};
  function get(character) {
    if (!cache[character]) cache[character] = build(character);
    return cache[character];
  }

  return { get };
})();
