'use strict';

// Procedural texture atlas generator.
// Everything is drawn on low-res canvases and upscaled with NearestFilter
// to reproduce the classic 90s edutainment look.

const TextureGen = (() => {

  // Deterministic PRNG
  function mulberry32(seed) {
    return function() {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // 2x backing resolution for finer pixel detail (logical coords unchanged)
  const S = 2;

  function makeCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w * S; c.height = h * S;
    return c;
  }

  function ctx2d(c) {
    const ctx = c.getContext('2d');
    ctx.scale(S, S);
    ctx.imageSmoothingEnabled = false;
    return ctx;
  }

  function toTexture(canvas, repeatX = 1, repeatY = 1) {
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    if (repeatX !== 1 || repeatY !== 1) {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeatX, repeatY);
    }
    return tex;
  }

  function noiseFill(ctx, w, h, rnd, colors, cell = 1) {
    for (let y = 0; y < h; y += cell) {
      for (let x = 0; x < w; x += cell) {
        ctx.fillStyle = colors[Math.floor(rnd() * colors.length)];
        ctx.fillRect(x, y, cell, cell);
      }
    }
  }

  // ---------- walls ----------

  function brickWall(seed = 1, base = '#8a5a3a') {
    const c = makeCanvas(32, 32);
    const g = ctx2d(c);
    const rnd = mulberry32(seed);
    g.fillStyle = base;
    g.fillRect(0, 0, 32, 32);
    const brickH = 8, brickW = 16;
    for (let row = 0; row < 4; row++) {
      const off = (row % 2) * 8;
      for (let x = -16; x < 32; x += brickW) {
        const shade = 0.85 + rnd() * 0.3;
        g.fillStyle = shadeColor(base, shade);
        g.fillRect(x + off + 1, row * brickH + 1, brickW - 2, brickH - 2);
        if (rnd() < 0.25) {
          g.fillStyle = 'rgba(0,0,0,0.12)';
          g.fillRect(x + off + 3, row * brickH + 3, 3, 2);
        }
      }
    }
    return toTexture(c);
  }

  function cinderBlock(base = '#9a9a92') {
    const c = makeCanvas(32, 32);
    const g = ctx2d(c);
    g.fillStyle = base;
    g.fillRect(0, 0, 32, 32);
    g.strokeStyle = 'rgba(0,0,0,0.25)';
    g.lineWidth = 1;
    for (let y = 0; y <= 32; y += 16) {
      g.beginPath(); g.moveTo(0, y + 0.5); g.lineTo(32, y + 0.5); g.stroke();
    }
    for (let y = 0; y < 32; y += 16) {
      for (let x = 8; x < 32; x += 16) {
        g.beginPath(); g.moveTo(x + 0.5, y); g.lineTo(x + 0.5, y + 16); g.stroke();
      }
    }
    return toTexture(c);
  }

  function classroomWall(seed = 2) {
    const c = makeCanvas(32, 32);
    const g = ctx2d(c);
    const rnd = mulberry32(seed);
    g.fillStyle = '#d8d0b0';
    g.fillRect(0, 0, 32, 32);
    // wallpaper-ish subtle marks
    for (let i = 0; i < 40; i++) {
      g.fillStyle = `rgba(0,0,0,${0.03 + rnd() * 0.05})`;
      g.fillRect(Math.floor(rnd() * 32), Math.floor(rnd() * 32), 2, 2);
    }
    // wainscot line
    g.fillStyle = '#b8a878';
    g.fillRect(0, 24, 32, 8);
    g.fillStyle = 'rgba(0,0,0,0.2)';
    g.fillRect(0, 24, 32, 1);
    return toTexture(c);
  }

  function cafeteriaWall() {
    const c = makeCanvas(32, 32);
    const g = ctx2d(c);
    g.fillStyle = '#c8b888';
    g.fillRect(0, 0, 32, 32);
    g.strokeStyle = 'rgba(0,0,0,0.18)';
    for (let i = 0; i < 3; i++) {
      g.strokeRect(2 + i * 10, 2, 26 - i * 10, 28);
    }
    return toTexture(c);
  }

  function libraryWall() {
    const c = makeCanvas(32, 32);
    const g = ctx2d(c);
    g.fillStyle = '#6a4a2a';
    g.fillRect(0, 0, 32, 32);
    g.strokeStyle = 'rgba(0,0,0,0.35)';
    g.lineWidth = 1;
    for (let x = 0; x < 32; x += 16) { g.strokeRect(x + 0.5, 0.5, 15, 31); }
    g.fillStyle = '#5a3a1a';
    g.fillRect(2, 2, 12, 28); g.fillRect(18, 2, 12, 28);
    // book spines
    const colors = ['#a03030', '#308030', '#3030a0', '#a0a030', '#a06030', '#703080'];
    for (let s = 0; s < 2; s++) {
      for (let i = 0; i < 7; i++) {
        g.fillStyle = colors[Math.floor(i * 1.7) % colors.length];
        g.fillRect(3 + s * 16 + (i % 3) * 4, 4 + Math.floor(i / 3) * 13, 3, 12);
      }
    }
    return toTexture(c);
  }

  function outsideWall() {
    const c = makeCanvas(32, 32);
    const g = ctx2d(c);
    g.fillStyle = '#b08050';
    g.fillRect(0, 0, 32, 32);
    g.strokeStyle = 'rgba(0,0,0,0.3)';
    g.strokeRect(0.5, 0.5, 31, 31);
    g.beginPath();
    g.moveTo(0, 0); g.lineTo(32, 32); g.moveTo(32, 0); g.lineTo(0, 32);
    g.stroke();
    return toTexture(c);
  }

  // ---------- floors ----------

  function checkeredFloor(seed = 3) {
    const c = makeCanvas(64, 64);
    const g = ctx2d(c);
    const rnd = mulberry32(seed);
    const colors = ['#e8e8d8', '#b8b8b8'];
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 2; x++) {
        const col = colors[(x + y) % 2];
        g.fillStyle = col;
        g.fillRect(x * 32, y * 32, 32, 32);
        const sh = 0.92 + rnd() * 0.12;
        g.fillStyle = shadeColor(col, sh);
        g.fillRect(x * 32 + 1, y * 32 + 1, 30, 1);
      }
    }
    for (let i = 0; i < 30; i++) {
      g.fillStyle = `rgba(0,0,0,${0.02 + rnd() * 0.06})`;
      g.fillRect(Math.floor(rnd() * 64), Math.floor(rnd() * 64), 2, 2);
    }
    return toTexture(c);
  }

  function woodFloor(seed = 4) {
    const c = makeCanvas(32, 32);
    const g = ctx2d(c);
    const rnd = mulberry32(seed);
    g.fillStyle = '#a07040';
    g.fillRect(0, 0, 32, 32);
    for (let y = 0; y < 32; y += 8) {
      const sh = 0.9 + rnd() * 0.2;
      g.fillStyle = shadeColor('#a07040', sh);
      g.fillRect(0, y, 32, 7);
      g.fillStyle = 'rgba(0,0,0,0.3)';
      g.fillRect(0, y + 7, 32, 1);
      g.fillStyle = 'rgba(0,0,0,0.15)';
      g.fillRect(8 + rnd() * 16, y, 1, 7);
    }
    return toTexture(c);
  }

  function cafeteriaFloor(seed = 5) {
    const c = makeCanvas(32, 32);
    const g = ctx2d(c);
    const rnd = mulberry32(seed);
    g.fillStyle = '#d8c8a0';
    g.fillRect(0, 0, 32, 32);
    for (let i = 0; i < 24; i++) {
      g.fillStyle = `rgba(0,0,0,${0.03 + rnd() * 0.06})`;
      g.fillRect(Math.floor(rnd() * 32), Math.floor(rnd() * 32), 2, 2);
    }
    g.strokeStyle = 'rgba(0,0,0,0.2)';
    g.strokeRect(0.5, 0.5, 31, 31);
    return toTexture(c);
  }

  function playgroundFloor(seed = 6) {
    const c = makeCanvas(32, 32);
    const g = ctx2d(c);
    const rnd = mulberry32(seed);
    g.fillStyle = '#c8a050';
    g.fillRect(0, 0, 32, 32);
    for (let i = 0; i < 60; i++) {
      g.fillStyle = `rgba(120,80,20,${0.1 + rnd() * 0.25})`;
      g.fillRect(Math.floor(rnd() * 32), Math.floor(rnd() * 32), 1 + rnd() * 2, 1);
    }
    return toTexture(c);
  }

  function grassFloor(seed = 7) {
    const c = makeCanvas(32, 32);
    const g = ctx2d(c);
    const rnd = mulberry32(seed);
    g.fillStyle = '#4a8a30';
    g.fillRect(0, 0, 32, 32);
    for (let i = 0; i < 90; i++) {
      g.fillStyle = `rgba(${30 + rnd() * 40},${100 + rnd() * 60},${20 + rnd() * 30},0.5)`;
      g.fillRect(Math.floor(rnd() * 32), Math.floor(rnd() * 32), 1, 2);
    }
    return toTexture(c);
  }

  function redCarpet(seed = 8) {
    const c = makeCanvas(32, 32);
    const g = ctx2d(c);
    const rnd = mulberry32(seed);
    g.fillStyle = '#a03030';
    g.fillRect(0, 0, 32, 32);
    g.fillStyle = '#c0a050';
    g.fillRect(0, 0, 32, 3); g.fillRect(0, 29, 32, 3);
    g.fillRect(0, 0, 3, 32); g.fillRect(29, 0, 3, 32);
    for (let i = 0; i < 16; i++) {
      g.fillStyle = `rgba(255,255,200,${0.05 + rnd() * 0.1})`;
      g.fillRect(Math.floor(rnd() * 32), Math.floor(rnd() * 32), 2, 2);
    }
    return toTexture(c);
  }

  function ceilingTile(seed = 9) {
    const c = makeCanvas(32, 32);
    const g = ctx2d(c);
    g.fillStyle = '#dcdcd0';
    g.fillRect(0, 0, 32, 32);
    g.strokeStyle = 'rgba(0,0,0,0.15)';
    g.strokeRect(0.5, 0.5, 31, 31);
    g.fillStyle = 'rgba(0,0,0,0.08)';
    g.fillRect(6, 6, 4, 4); g.fillRect(22, 6, 4, 4); g.fillRect(6, 22, 4, 4); g.fillRect(22, 22, 4, 4);
    return toTexture(c);
  }

  // ---------- doors ----------

  function doorTexture(seed = 10, color = '#8a5a2a', locked = false) {
    const c = makeCanvas(32, 64);
    const g = ctx2d(c);
    const rnd = mulberry32(seed);
    g.fillStyle = color;
    g.fillRect(0, 0, 32, 64);
    g.strokeStyle = 'rgba(0,0,0,0.4)';
    g.strokeRect(1.5, 1.5, 29, 61);
    g.fillStyle = shadeColor(color, 0.85);
    g.fillRect(4, 4, 11, 56); g.fillRect(17, 4, 11, 56);
    g.fillStyle = 'rgba(0,0,0,0.25)';
    g.fillRect(4, 4, 11, 2); g.fillRect(17, 4, 11, 2);
    // window
    g.fillStyle = '#c8d8e8';
    g.fillRect(8, 10, 16, 16);
    g.strokeStyle = '#333';
    g.strokeRect(8.5, 10.5, 15, 15);
    // knob
    g.fillStyle = locked ? '#444' : '#d8c030';
    g.beginPath(); g.arc(26, 36, 3, 0, Math.PI * 2); g.fill();
    if (locked) {
      // keyhole
      g.fillStyle = '#222';
      g.beginPath(); g.arc(26, 44, 2, 0, Math.PI * 2); g.fill();
      g.fillRect(25.5, 44, 2, 5);
    }
    for (let i = 0; i < 20; i++) {
      g.fillStyle = `rgba(0,0,0,${0.03 + rnd() * 0.05})`;
      g.fillRect(Math.floor(rnd() * 32), Math.floor(rnd() * 64), 1, 2);
    }
    return toTexture(c);
  }

  function exitDoorTexture(seed = 11) {
    const c = makeCanvas(32, 64);
    const g = ctx2d(c);
    g.fillStyle = '#6a6a72';
    g.fillRect(0, 0, 32, 64);
    g.strokeStyle = 'rgba(0,0,0,0.5)';
    g.strokeRect(1.5, 1.5, 29, 61);
    g.fillStyle = '#585860';
    g.fillRect(4, 4, 11, 56); g.fillRect(17, 4, 11, 56);
    // push bar
    g.fillStyle = '#c8c8cc';
    g.fillRect(4, 28, 24, 4);
    // EXIT sign
    g.fillStyle = '#cc2020';
    g.fillRect(6, 6, 20, 12);
    g.fillStyle = '#fff';
    g.font = 'bold 8px "Arial"';
    g.textAlign = 'center';
    g.fillText('EXIT', 16, 15);
    return toTexture(c);
  }

  // ---------- furniture ----------

  function chalkboardTexture(seed = 12) {
    const c = makeCanvas(64, 48);
    const g = ctx2d(c);
    const rnd = mulberry32(seed);
    g.fillStyle = '#2a4030';
    g.fillRect(0, 0, 64, 48);
    for (let i = 0; i < 90; i++) {
      g.fillStyle = `rgba(255,255,255,${0.03 + rnd() * 0.07})`;
      g.fillRect(Math.floor(rnd() * 64), Math.floor(rnd() * 48), 2, 2);
    }
    g.fillStyle = '#7a5a2a';
    g.fillRect(0, 0, 64, 4); g.fillRect(0, 44, 64, 4);
    g.fillRect(0, 0, 3, 48); g.fillRect(61, 0, 3, 48);
    // chalk writing: 7+9=16 etc
    g.fillStyle = '#d8d8d8';
    g.font = 'bold 13px "Comic Sans MS", cursive';
    g.textAlign = 'left';
    g.fillText('7 + 9 = 16', 8, 22);
    g.fillText('12 - 4 = 8', 8, 38);
    return toTexture(c);
  }

  function posterTexture(seed, title, lines, bg, fg) {
    const c = makeCanvas(64, 48);
    const g = ctx2d(c);
    g.fillStyle = bg;
    g.fillRect(0, 0, 64, 48);
    g.strokeStyle = 'rgba(0,0,0,0.4)';
    g.strokeRect(1.5, 1.5, 61, 45);
    g.fillStyle = fg;
    g.textAlign = 'center';
    g.font = 'bold 9px "Comic Sans MS", cursive';
    g.fillText(title, 32, 14);
    g.font = '7px "Comic Sans MS", cursive';
    for (let i = 0; i < lines.length; i++) {
      g.fillText(lines[i], 32, 24 + i * 9);
    }
    return toTexture(c);
  }

  function lockersTexture(seed = 13) {
    const c = makeCanvas(64, 64);
    const g = ctx2d(c);
    const rnd = mulberry32(seed);
    const cols = ['#5570a0', '#7050a0', '#a05050', '#50a070', '#a08830'];
    for (let i = 0; i < 8; i++) {
      const x = (i % 4) * 16, y = Math.floor(i / 4) * 32;
      const col = cols[Math.floor(rnd() * cols.length)];
      g.fillStyle = col;
      g.fillRect(x + 1, y + 1, 14, 30);
      g.strokeStyle = 'rgba(0,0,0,0.35)';
      g.strokeRect(x + 1.5, y + 1.5, 13, 29);
      g.fillStyle = shadeColor(col, 0.8);
      g.fillRect(x + 3, y + 3, 10, 4); g.fillRect(x + 3, y + 9, 10, 4);
      g.fillStyle = '#333';
      g.fillRect(x + 6, y + 17, 3, 3);
    }
    return toTexture(c);
  }

  function bookshelfTexture(seed = 14) {
    const c = makeCanvas(64, 64);
    const g = ctx2d(c);
    const rnd = mulberry32(seed);
    g.fillStyle = '#5a3a1a';
    g.fillRect(0, 0, 64, 64);
    const cols = ['#a03030', '#308030', '#3030a0', '#a0a030', '#a06030', '#703080', '#306060'];
    for (let shelf = 0; shelf < 5; shelf++) {
      const y = 2 + shelf * 12;
      let x = 2;
      while (x < 62) {
        const w = 2 + Math.floor(rnd() * 4);
        g.fillStyle = cols[Math.floor(rnd() * cols.length)];
        g.fillRect(x, y, w, 10);
        x += w + 1;
      }
    }
    return toTexture(c);
  }

  function deskTexture(seed = 15) {
    const c = makeCanvas(32, 32);
    const g = ctx2d(c);
    g.fillStyle = '#c8a878';
    g.fillRect(0, 0, 32, 32);
    g.fillStyle = 'rgba(0,0,0,0.2)';
    g.fillRect(0, 0, 32, 2); g.fillRect(0, 30, 32, 2);
    g.fillStyle = '#a08858';
    g.fillRect(2, 6, 28, 20);
    return toTexture(c);
  }

  function vendingFront(label, color) {
    const c = makeCanvas(32, 64);
    const g = ctx2d(c);
    g.fillStyle = color;
    g.fillRect(0, 0, 32, 64);
    g.strokeStyle = 'rgba(0,0,0,0.45)';
    g.strokeRect(1.5, 1.5, 29, 61);
    g.fillStyle = '#222';
    g.fillRect(3, 3, 26, 20);
    g.fillStyle = '#99d8f0';
    g.fillRect(5, 5, 22, 16);
    g.fillStyle = '#222';
    g.font = 'bold 6px "Arial"';
    g.textAlign = 'center';
    g.fillText(label, 16, 15);
    // product rows
    const prod = ['#cc4444', '#44cc44', '#4444cc'];
    for (let r = 0; r < 3; r++) {
      for (let k = 0; k < 2; k++) {
        g.fillStyle = prod[r];
        g.fillRect(5 + k * 12, 26 + r * 9, 10, 8);
      }
    }
    g.fillStyle = '#ddd';
    g.fillRect(7, 54, 18, 6);
    g.fillStyle = '#333';
    g.fillRect(10, 55, 12, 4);
    return toTexture(c);
  }

  function notebookTexture(seed = 16) {
    const c = makeCanvas(32, 32);
    const g = ctx2d(c);
    const rnd = mulberry32(seed);
    g.fillStyle = '#3030a0';
    g.fillRect(0, 0, 32, 32);
    g.fillStyle = '#20206a';
    g.fillRect(0, 0, 6, 32);
    g.strokeStyle = '#101040';
    g.strokeRect(0.5, 0.5, 31, 31);
    // label
    g.fillStyle = '#f0f0e0';
    g.fillRect(9, 8, 20, 16);
    g.fillStyle = '#333';
    g.fillRect(11, 11, 16, 2); g.fillRect(11, 15, 16, 2); g.fillRect(11, 19, 10, 2);
    return toTexture(c);
  }

  function tableRound(seed = 17) {
    const c = makeCanvas(32, 32);
    const g = ctx2d(c);
    g.fillStyle = '#c8b080';
    g.fillRect(0, 0, 32, 32);
    g.fillStyle = '#e0cc9a';
    g.beginPath(); g.arc(16, 16, 13, 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(0,0,0,0.3)';
    g.beginPath(); g.arc(16, 16, 13, 0, Math.PI * 2); g.stroke();
    return toTexture(c);
  }

  function clockTexture(seed = 18) {
    const c = makeCanvas(16, 16);
    const g = ctx2d(c);
    g.fillStyle = '#f0f0f0';
    g.beginPath(); g.arc(8, 8, 7, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#333';
    g.lineWidth = 2;
    g.beginPath(); g.arc(8, 8, 7, 0, Math.PI * 2); g.stroke();
    g.lineWidth = 1;
    g.beginPath(); g.moveTo(8, 8); g.lineTo(8, 3); g.moveTo(8, 8); g.lineTo(11, 10); g.stroke();
    return toTexture(c);
  }

  function flagTexture(seed = 19) {
    const c = makeCanvas(32, 32);
    const g = ctx2d(c);
    g.fillStyle = '#f0f0f0';
    g.fillRect(0, 0, 32, 32);
    // US-flag-like but simplified school flag
    for (let y = 0; y < 26; y += 4) {
      g.fillStyle = (y / 4) % 2 === 0 ? '#c03030' : '#f0f0f0';
      g.fillRect(4, 4 + y, 24, 4);
    }
    g.fillStyle = '#303060';
    g.fillRect(4, 4, 12, 12);
    return toTexture(c);
  }

  function bulletinTexture(seed = 20) {
    const c = makeCanvas(64, 48);
    const g = ctx2d(c);
    const rnd = mulberry32(seed);
    g.fillStyle = '#8a6a3a';
    g.fillRect(0, 0, 64, 48);
    g.strokeStyle = 'rgba(0,0,0,0.4)';
    g.strokeRect(2, 2, 60, 44);
    const papers = ['#f0f0d8', '#e0d8f0', '#d8f0d8', '#f0e0c0'];
    for (let i = 0; i < 5; i++) {
      g.save();
      g.translate(10 + rnd() * 44, 8 + rnd() * 32);
      g.rotate((rnd() - 0.5) * 0.5);
      g.fillStyle = papers[Math.floor(rnd() * papers.length)];
      g.fillRect(-8, -6, 16, 12);
      g.fillStyle = '#555';
      g.fillRect(-6, -4, 12, 2);
      g.restore();
    }
    return toTexture(c);
  }

  function detentionDeskTexture() {
    const c = makeCanvas(32, 32);
    const g = ctx2d(c);
    g.fillStyle = '#7a7a72';
    g.fillRect(0, 0, 32, 32);
    g.fillStyle = '#55554e';
    g.fillRect(1, 1, 30, 30);
    g.strokeStyle = 'rgba(0,0,0,0.5)';
    g.strokeRect(1.5, 1.5, 29, 29);
    return toTexture(c);
  }

  function teacherDeskTexture() {
    const c = makeCanvas(32, 32);
    const g = ctx2d(c);
    g.fillStyle = '#5a4030';
    g.fillRect(0, 0, 32, 32);
    g.fillStyle = '#6a5040';
    g.fillRect(1, 1, 30, 30);
    g.fillStyle = '#8a7050';
    g.fillRect(3, 3, 26, 6);
    g.fillStyle = '#d8c030';
    g.fillRect(13, 20, 6, 6);
    return toTexture(c);
  }

  function shadeColor(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) & 255, gg = (n >> 8) & 255, b = n & 255;
    r = Math.min(255, Math.round(r * f));
    gg = Math.min(255, Math.round(gg * f));
    b = Math.min(255, Math.round(b * f));
    return `rgb(${r},${gg},${b})`;
  }

  // ---------- item icons ----------

  function itemIcon(drawFn, size = 32) {
    const c = makeCanvas(size, size);
    const g = ctx2d(c);
    g.fillStyle = 'rgba(0,0,0,0)';
    g.clearRect(0, 0, size, size);
    drawFn(g, size);
    return toTexture(c);
  }

  const icons = {};

  function buildIcons() {
    icons.quarter = itemIcon((g, s) => {
      g.fillStyle = '#d8c030';
      g.beginPath(); g.arc(s / 2, s / 2, s / 2 - 3, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#8a7010'; g.lineWidth = 2;
      g.beginPath(); g.arc(s / 2, s / 2, s / 2 - 3, 0, Math.PI * 2); g.stroke();
      g.fillStyle = '#8a7010';
      g.font = `bold ${s * 0.4}px "Arial"`;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('25', s / 2, s / 2 + 1);
    });
    icons.bsoda = itemIcon((g, s) => {
      g.fillStyle = '#3070c0';
      g.fillRect(s * 0.28, s * 0.05, s * 0.44, s * 0.18);
      g.fillRect(s * 0.28, s * 0.2, s * 0.44, s * 0.62);
      g.fillStyle = '#f0f0f0';
      g.fillRect(s * 0.36, s * 0.2, s * 0.28, s * 0.3);
      g.fillStyle = '#fff';
      g.font = `bold ${s * 0.22}px "Arial"`;
      g.textAlign = 'center';
      g.fillText('BS', s / 2, s * 0.44);
    });
    icons.zesty = itemIcon((g, s) => {
      g.fillStyle = '#d8b028';
      g.fillRect(s * 0.3, s * 0.1, s * 0.4, s * 0.75);
      g.fillStyle = '#f0d848';
      g.fillRect(s * 0.34, s * 0.12, s * 0.32, s * 0.06);
      g.fillStyle = '#8a3010';
      g.font = `bold ${s * 0.16}px "Arial"`;
      g.textAlign = 'center';
      g.fillText('ZESTY', s / 2, s * 0.42);
    });
    icons.keys = itemIcon((g, s) => {
      g.fillStyle = '#c8c8c8';
      g.beginPath(); g.arc(s * 0.4, s * 0.3, s * 0.14, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#c8c8c8'; g.lineWidth = s * 0.08;
      g.beginPath(); g.moveTo(s * 0.4, s * 0.3); g.lineTo(s * 0.75, s * 0.65); g.stroke();
      g.beginPath(); g.moveTo(s * 0.68, s * 0.58); g.lineTo(s * 0.82, s * 0.44); g.stroke();
      g.beginPath(); g.moveTo(s * 0.75, s * 0.65); g.lineTo(s * 0.62, s * 0.82); g.stroke();
    });
    icons.wd = itemIcon((g, s) => {
      g.fillStyle = '#505050';
      g.beginPath(); g.moveTo(s * 0.15, s * 0.85); g.lineTo(s * 0.5, s * 0.2); g.lineTo(s * 0.85, s * 0.85); g.closePath(); g.fill();
      g.fillStyle = '#f0f0f0';
      g.fillRect(s * 0.15, s * 0.85, s * 0.7, s * 0.08);
      g.fillStyle = '#888';
      g.fillRect(s * 0.44, s * 0.3, s * 0.12, s * 0.5);
    });
    icons.scissors = itemIcon((g, s) => {
      g.strokeStyle = '#c0c0d0'; g.lineWidth = s * 0.1;
      g.beginPath(); g.moveTo(s * 0.2, s * 0.25); g.lineTo(s * 0.75, s * 0.8); g.stroke();
      g.beginPath(); g.moveTo(s * 0.8, s * 0.25); g.lineTo(s * 0.25, s * 0.8); g.stroke();
      g.fillStyle = '#d04040';
      g.beginPath(); g.arc(s * 0.2, s * 0.25, s * 0.1, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(s * 0.8, s * 0.25, s * 0.1, 0, Math.PI * 2); g.fill();
    });
    icons.clock = itemIcon((g, s) => {
      g.fillStyle = '#d03030';
      g.beginPath(); g.arc(s / 2, s / 2, s * 0.42, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#fff';
      g.beginPath(); g.arc(s / 2, s / 2, s * 0.3, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#333'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(s / 2, s / 2); g.lineTo(s / 2, s * 0.3);
      g.moveTo(s / 2, s / 2); g.lineTo(s * 0.62, s * 0.58); g.stroke();
      g.fillStyle = '#d03030';
      g.fillRect(s * 0.44, s * 0.02, s * 0.12, s * 0.1);
      g.beginPath(); g.arc(s * 0.2, s * 0.25, s * 0.08, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(s * 0.8, s * 0.25, s * 0.08, 0, Math.PI * 2); g.fill();
    });
    icons.eraser = itemIcon((g, s) => {
      g.fillStyle = '#5a5a5a';
      g.fillRect(s * 0.15, s * 0.4, s * 0.7, s * 0.25);
      g.fillStyle = '#8a8a8a';
      g.fillRect(s * 0.15, s * 0.4, s * 0.7, s * 0.1);
      g.fillStyle = '#e8e8e8';
      g.fillRect(s * 0.2, s * 0.68, s * 0.6, s * 0.12);
    });
    icons.boots = itemIcon((g, s) => {
      g.fillStyle = '#4a3020';
      g.beginPath();
      g.moveTo(s * 0.15, s * 0.55); g.lineTo(s * 0.15, s * 0.35); g.lineTo(s * 0.35, s * 0.35);
      g.lineTo(s * 0.55, s * 0.2); g.lineTo(s * 0.85, s * 0.2); g.lineTo(s * 0.85, s * 0.55);
      g.closePath(); g.fill();
      g.fillStyle = '#2a1a10';
      g.fillRect(s * 0.12, s * 0.5, s * 0.76, s * 0.12);
      g.fillStyle = '#d8d8d8';
      g.fillRect(s * 0.6, s * 0.24, s * 0.2, s * 0.08);
    });
    icons.quarterIcon = icons.quarter;
  }

  function getIcon(name) {
    return icons[name] || icons.quarter;
  }

  // ---------- sprite-style decorations ----------

  function treeSprite(seed) {
    const c = makeCanvas(48, 64);
    const g = ctx2d(c);
    const rnd = mulberry32(seed);
    g.fillStyle = '#5a3a1a';
    g.fillRect(21, 44, 6, 18);
    g.fillStyle = '#2a6a20';
    g.beginPath(); g.arc(24, 30, 18, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#357f28';
    g.beginPath(); g.arc(18, 36, 12, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(31, 36, 11, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#1f5318';
    g.beginPath(); g.arc(24, 24, 13, 0, Math.PI * 2); g.fill();
    for (let i = 0; i < 30; i++) {
      g.fillStyle = `rgba(255,255,255,${0.05 + rnd() * 0.1})`;
      g.fillRect(8 + Math.floor(rnd() * 32), 12 + Math.floor(rnd() * 40), 2, 2);
    }
    return toTexture(c);
  }

  function bushSprite(seed) {
    const c = makeCanvas(32, 24);
    const g = ctx2d(c);
    const rnd = mulberry32(seed);
    g.fillStyle = '#3a7a28';
    g.beginPath();
    g.arc(8, 16, 8, Math.PI, 0); g.arc(16, 14, 9, Math.PI, 0); g.arc(24, 16, 8, Math.PI, 0);
    g.fill();
    g.fillStyle = '#4a8a34';
    g.beginPath();
    g.arc(8, 14, 6, Math.PI, 0); g.arc(16, 12, 7, Math.PI, 0); g.arc(24, 14, 6, Math.PI, 0);
    g.fill();
    return toTexture(c);
  }

  function fenceSprite() {
    const c = makeCanvas(32, 24);
    const g = ctx2d(c);
    g.fillStyle = '#c8c8c8';
    g.fillRect(0, 4, 32, 3);
    g.fillRect(0, 16, 32, 3);
    for (let x = 0; x < 32; x += 8) {
      g.fillRect(x, 2, 3, 20);
      g.fillRect(x - 1, 0, 5, 4);
    }
    return toTexture(c);
  }

  function fenceTileTexture() {
    const c = makeCanvas(32, 32);
    const g = ctx2d(c);
    g.fillStyle = 'rgba(0,0,0,0)';
    g.clearRect(0, 0, 32, 32);
    g.fillStyle = '#b8b8b8';
    g.fillRect(0, 2, 32, 2);
    g.fillRect(0, 26, 32, 2);
    for (let x = 0; x < 32; x += 6) {
      g.fillRect(x, 0, 2, 32);
      g.fillStyle = '#c8c8c8';
      g.fillRect(x + 1, 0, 1, 32);
      g.fillStyle = '#b8b8b8';
    }
    // diagonal mesh hints
    g.strokeStyle = 'rgba(160,160,160,0.6)';
    g.lineWidth = 1;
    for (let y = -32; y < 64; y += 8) {
      g.beginPath(); g.moveTo(0, y); g.lineTo(32, y + 8); g.stroke();
      g.beginPath(); g.moveTo(0, y + 8); g.lineTo(32, y); g.stroke();
    }
    return toTexture(c);
  }

  function waterFountainTexture() {
    const c = makeCanvas(16, 32);
    const g = ctx2d(c);
    g.fillStyle = '#b8c0c8';
    g.fillRect(4, 0, 8, 32);
    g.fillStyle = '#9098a0';
    g.fillRect(4, 8, 8, 4);
    g.fillStyle = '#d0d8e0';
    g.fillRect(0, 2, 16, 4);
    return toTexture(c);
  }

  function trophyTexture() {
    const c = makeCanvas(16, 24);
    const g = ctx2d(c);
    g.fillStyle = '#d8c030';
    g.beginPath(); g.arc(8, 6, 5, 0, Math.PI * 2); g.fill();
    g.fillRect(6, 10, 4, 4);
    g.fillRect(3, 14, 10, 3);
    g.fillRect(5, 17, 6, 6);
    g.fillStyle = '#a08810';
    g.fillRect(3, 13, 2, 10); g.fillRect(11, 13, 2, 10);
    return toTexture(c);
  }

  // the hidden trophy room's big golden cup
  function goldTrophyTexture() {
    const c = makeCanvas(16, 16);
    const g = ctx2d(c);
    const rnd = mulberry32(99);
    g.fillStyle = '#ffd830';
    g.fillRect(0, 0, 16, 16);
    for (let y = 0; y < 16; y += 2) {
      for (let x = 0; x < 16; x += 2) {
        g.fillStyle = rnd() < 0.22 ? '#d8a820' : (rnd() < 0.12 ? '#fff0a0' : '#ffd830');
        g.fillRect(x, y, 2, 2);
      }
    }
    g.fillStyle = '#a07810';
    g.fillRect(2, 5, 2, 9); g.fillRect(12, 5, 2, 9);
    g.fillRect(2, 5, 12, 2); g.fillRect(2, 12, 12, 2);
    g.fillStyle = '#ffe060';
    g.fillRect(4, 3, 8, 2);
    g.fillStyle = '#8a6010';
    g.fillRect(4, 14, 8, 2);
    return toTexture(c);
  }

  // static-y CRT television in the hidden room
  function tvTexture() {
    const c = makeCanvas(24, 16);
    const g = ctx2d(c);
    g.fillStyle = '#3a3a3a';
    g.fillRect(0, 0, 24, 16);
    const rnd = mulberry32(87);
    g.fillStyle = '#c8c8c8';
    for (let y = 3; y < 13; y++) {
      for (let x = 4; x < 20; x++) {
        if (rnd() < 0.5) g.fillRect(x, y, 1, 1);
      }
    }
    g.fillStyle = '#2a2a2a';
    g.fillRect(2, 14, 5, 1); g.fillRect(8, 14, 3, 1);
    return toTexture(c);
  }

  // a dusty old clock with a fixed 1987 face
  function clock87Texture() {
    const c = makeCanvas(16, 16);
    const g = ctx2d(c);
    g.fillStyle = '#c8a858';
    g.beginPath(); g.arc(8, 8, 7, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#6a4a18';
    g.lineWidth = 2;
    g.beginPath(); g.arc(8, 8, 7, 0, Math.PI * 2); g.stroke();
    g.lineWidth = 1;
    g.fillStyle = '#4a3210';
    g.font = 'bold 4px monospace';
    g.fillText('1987', 5, 10);
    return toTexture(c);
  }

  // the hint poster leaning on the sand side of the hidden passage
  function secretPosterTexture() {
    const c = makeCanvas(32, 24);
    const g = ctx2d(c);
    g.fillStyle = '#a87838';
    g.fillRect(0, 0, 32, 24);
    g.fillStyle = '#c8a060';
    g.fillRect(1, 1, 30, 22);
    g.fillStyle = '#5a3a18';
    g.fillRect(2, 2, 28, 20);
    g.fillStyle = '#e8d8a0';
    g.fillRect(4, 4, 24, 16);
    g.fillStyle = '#6a4a1a';
    g.font = 'bold 4px monospace';
    g.fillText('WHAT IS', 8, 8);
    g.fillText('THAT WALL', 6, 12);
    g.fillText('DOING AT', 7, 16);
    g.fillText('THE SAND?', 6, 20);
    g.fillStyle = '#8a2a2a';
    g.fillRect(4, 22, 24, 1);
    return toTexture(c);
  }

  const cache = {};
  function cached(key, fn) {
    if (!cache[key]) cache[key] = fn();
    return cache[key];
  }

  return {
    brickWall: (s) => cached('brick' + s, () => brickWall(s)),
    cinderBlock: (s) => cached('cinder' + s, () => cinderBlock()),
    classroomWall: (s) => cached('cwall' + s, () => classroomWall(s)),
    cafeteriaWall: () => cached('cafwall', () => cafeteriaWall()),
    libraryWall: () => cached('libwall', () => libraryWall()),
    outsideWall: () => cached('outwall', () => outsideWall()),
    checkeredFloor: (s) => cached('check' + s, () => checkeredFloor(s)),
    woodFloor: (s) => cached('wood' + s, () => woodFloor(s)),
    cafeteriaFloor: () => cached('caffloor', () => cafeteriaFloor()),
    playgroundFloor: () => cached('playfloor', () => playgroundFloor()),
    grassFloor: () => cached('grass', () => grassFloor()),
    redCarpet: () => cached('carpet', () => redCarpet()),
    ceilingTile: () => cached('ceil', () => ceilingTile()),
    doorTexture: (locked) => cached('door' + (locked ? 'L' : ''), () => doorTexture(locked ? 21 : 10, '#8a5a2a', locked)),
    exitDoorTexture: () => cached('exitdoor', () => exitDoorTexture()),
    chalkboardTexture: () => cached('chalk', () => chalkboardTexture()),
    poster: (seed, title, lines, bg, fg) => cached('poster' + seed, () => posterTexture(seed, title, lines, bg, fg)),
    lockersTexture: () => cached('lockers', () => lockersTexture()),
    bookshelfTexture: () => cached('bookshelf', () => bookshelfTexture()),
    deskTexture: () => cached('desk', () => deskTexture()),
    vendingFront: (label, color) => cached('vend' + label, () => vendingFront(label, color)),
    notebookTexture: () => cached('notebook', () => notebookTexture()),
    tableRound: () => cached('table', () => tableRound()),
    clockTexture: () => cached('clocktex', () => clockTexture()),
    flagTexture: () => cached('flag', () => flagTexture()),
    bulletinTexture: () => cached('bulletin', () => bulletinTexture()),
    detentionDeskTexture: () => cached('detdesk', () => detentionDeskTexture()),
    teacherDeskTexture: () => cached('tdesk', () => teacherDeskTexture()),
    treeSprite: (s) => cached('tree' + s, () => treeSprite(s)),
    bushSprite: (s) => cached('bush' + s, () => bushSprite(s)),
    fenceSprite: () => cached('fence', () => fenceSprite()),
    fenceTileTexture: () => cached('fencetile', () => fenceTileTexture()),
    waterFountainTexture: () => cached('wf', () => waterFountainTexture()),
    trophyTexture: () => cached('trophy', () => trophyTexture()),
    goldTrophyTexture: () => cached('goldtrophy', () => goldTrophyTexture()),
    tvTexture: () => cached('tv', () => tvTexture()),
    clock87Texture: () => cached('clock87', () => clock87Texture()),
    secretPosterTexture: () => cached('secposter', () => secretPosterTexture()),
    icons: buildIcons() && icons,
    getIcon,
    shadeColor,
    mulberry32,
  };
})();
