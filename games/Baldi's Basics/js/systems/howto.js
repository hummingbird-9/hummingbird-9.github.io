'use strict';

// "How to Play" screen: school mini-map, goal/controls, character gallery,
// item gallery and survival tips. All art is generated from the live assets.

const HowTo = (() => {

  function el(tag, cls, parent, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }

  // ---------- mini-map ----------

  const TILE_COLORS = {
    '%': '#6a3a2a',
    '#': '#4a4a52',
    'D': '#8a5a2a',
    'O': '#c8c8c0',
    '.': '#c0c0b8',
    ',': '#c8a878',
    '=': '#d8c090',
    ';': '#8a6a40',
    'f': '#b06060',
    'c': '#a03030',
    'm': '#88b878',
    'd': '#7a7a88',
    'j': '#606058',
    'p': '#d8b060',
    'g': '#5a9a40',
    'F': '#b8b8c8',
    'x': '#3a7a28',
  };

  function buildMapCanvas() {
    const TILE = 8;
    const W = MapData.W, H = MapData.H;
    const c = document.createElement('canvas');
    c.width = W * TILE;
    c.height = H * TILE;
    const g = c.getContext('2d');
    for (let z = 0; z < H; z++) {
      for (let x = 0; x < W; x++) {
        const t = MapData.tile(x, z);
        g.fillStyle = TILE_COLORS[t] || '#222';
        g.fillRect(x * TILE, z * TILE, TILE, TILE);
        // subtle grid
        g.fillStyle = 'rgba(0,0,0,0.12)';
        g.fillRect(x * TILE, z * TILE + TILE - 1, TILE, 1);
      }
    }
    // exits
    for (const d of MapData.findDoors()) {
      if (d.type !== 'exit') continue;
      g.fillStyle = '#ff4040';
      g.fillRect(d.x * TILE + 1, d.z * TILE + 1, TILE - 2, TILE - 2);
    }
    // notebooks
    for (const nb of MapData.NOTEBOOKS) {
      g.fillStyle = '#4040d8';
      g.beginPath();
      g.arc(nb.x * TILE, nb.z * TILE, 3, 0, Math.PI * 2);
      g.fill();
    }
    // player start
    const s = MapData.SPAWNS.player;
    g.fillStyle = '#40d040';
    g.font = 'bold 9px sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('+', s.x * TILE, s.z * TILE);
    return c;
  }

  function legendRow(color, label) {
    const row = el('div', 'howto-legend-row');
    const sw = el('span', 'howto-legend-swatch', row);
    sw.style.background = color;
    el('span', null, row, label);
    return row;
  }

  // ---------- character gallery ----------

  const CHARS = [
    ['baldi', 'howto.char.baldi'],
    ['principal', 'howto.char.principal'],
    ['playtime', 'howto.char.playtime'],
    ['bully', 'howto.char.bully'],
    ['sweep', 'howto.char.sweep'],
    ['firstprize', 'howto.char.firstprize'],
    ['arts', 'howto.char.arts'],
    ['mrsPomp', 'howto.char.pomp'],
  ];

  const ITEM_KINDS = ['quarter', 'bsoda', 'zesty', 'keys', 'wd', 'scissors', 'clock', 'eraser', 'boots'];

  function show() {
    UI.hideAll();
    const layer = document.getElementById('ui-layer');
    const wrap = el('div', 'ui-screen howto-screen', layer);
    wrap.style.cssText = 'justify-content: flex-start; overflow-y: auto; padding: 26px 36px 70px; pointer-events: auto; background: rgba(8,8,26,0.94);';

    el('div', 'ui-title', wrap, I18n.t('howto.title'));

    // quick language switcher
    const langRow = el('div', null, wrap);
    langRow.style.cssText = 'display:flex;gap:10px;margin-bottom:6px;';
    for (const [code, name] of [['en', 'English'], ['zh', '中文'], ['ja', '日本語']]) {
      const btn = el('button', 'ui-button small' + (I18n.lang === code ? '' : ' gray'), langRow, name);
      btn.addEventListener('click', () => {
        I18n.setLang(code);
        show();
      });
    }

    // --- map ---
    el('h2', 'howto-section', wrap, I18n.t('howto.map'));
    const mapWrap = el('div', 'howto-map-wrap', wrap);
    const mapCanvas = buildMapCanvas();
    mapCanvas.style.cssText = 'width: 380px; image-rendering: pixelated; border: 3px solid #222;';
    mapWrap.appendChild(mapCanvas);
    const legend = el('div', 'howto-legend', wrap);
    legend.appendChild(legendRow(TILE_COLORS['%'], I18n.t('howto.legend.wall')));
    legend.appendChild(legendRow(TILE_COLORS['.'], I18n.t('howto.legend.hall')));
    legend.appendChild(legendRow(TILE_COLORS[','], I18n.t('howto.legend.classroom')));
    legend.appendChild(legendRow(TILE_COLORS['='], I18n.t('howto.legend.cafeteria')));
    legend.appendChild(legendRow(TILE_COLORS[';'], I18n.t('howto.legend.library')));
    legend.appendChild(legendRow(TILE_COLORS['f'], I18n.t('howto.legend.faculty')));
    legend.appendChild(legendRow(TILE_COLORS['d'], I18n.t('howto.legend.detention')));
    legend.appendChild(legendRow(TILE_COLORS['p'], I18n.t('howto.legend.playground')));
    legend.appendChild(legendRow(TILE_COLORS['g'], I18n.t('howto.legend.grass')));
    legend.appendChild(legendRow('#ff4040', I18n.t('howto.legend.exit')));
    legend.appendChild(legendRow('#4040d8', I18n.t('howto.legend.notebook')));
    legend.appendChild(legendRow('#40d040', I18n.t('howto.legend.you')));

    // --- goal / controls ---
    el('h2', 'howto-section', wrap, I18n.t('howto.goal'));
    el('p', 'howto-text', wrap, I18n.t('howto.goalText'));
    el('h2', 'howto-section', wrap, I18n.t('howto.controls'));
    const ctrl = el('p', 'howto-text', wrap, I18n.t('howto.controlsText'));
    ctrl.style.whiteSpace = 'pre-line';

    // --- characters ---
    el('h2', 'howto-section', wrap, I18n.t('howto.characters'));
    const charGrid = el('div', 'howto-grid', wrap);
    for (const [sprite, key] of CHARS) {
      const card = el('div', 'howto-card', charGrid);
      const img = document.createElement('img');
      img.className = 'howto-char-img';
      const frames = SpriteGen.get(sprite);
      img.src = frames[0].image.toDataURL();
      card.appendChild(img);
      el('div', 'howto-card-name', card, I18n.t(key + '.name'));
      el('div', 'howto-card-desc', card, I18n.t(key + '.desc'));
    }

    // --- items ---
    el('h2', 'howto-section', wrap, I18n.t('howto.items'));
    const itemGrid = el('div', 'howto-grid', wrap);
    for (const kind of ITEM_KINDS) {
      const card = el('div', 'howto-card', itemGrid);
      const img = document.createElement('img');
      img.className = 'howto-item-img';
      img.src = TextureGen.getIcon(kind).image.toDataURL();
      card.appendChild(img);
      el('div', 'howto-card-name', card, I18n.t('item.' + kind));
      el('div', 'howto-card-desc', card, I18n.t('howto.item.' + kind + '.desc'));
    }

    // --- tips ---
    el('h2', 'howto-section', wrap, I18n.t('howto.tips'));
    const tips = el('div', 'howto-tips', wrap);
    for (let i = 1; i <= 9; i++) {
      const t = el('div', 'howto-tip', tips);
      el('span', 'howto-tip-num', t, String(i) + '.');
      el('span', null, t, I18n.t('howto.tip.' + i));
    }

    const back = el('button', 'ui-button red howto-back', wrap, I18n.t('menu.back'));
    back.addEventListener('click', () => UI.showMainMenu());
  }

  return { show };
})();
