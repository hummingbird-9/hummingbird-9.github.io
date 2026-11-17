'use strict';

// UI: menus, HUD, You Can Think Pad, detention, prompts, win/lose screens.

const UI = (() => {

  const layer = document.getElementById('ui-layer');
  const staticEl = document.getElementById('static-overlay');
  let hud = null;
  let announceTimer = null;
  let padState = null;   // {onSubmit, title, problem, input, multi}

  const ITEM_NAMES = {
    quarter: 'Quarter', bsoda: 'BSoda', zesty: 'Zesty Bar',
    keys: "Principal's Keys", wd: 'WD-NoSquee', scissors: 'Safety Scissors',
    clock: 'Alarm Clock', eraser: 'Dirty Chalk Eraser', boots: "Big Ol' Boots",
  };

  function itemName(kind) { return I18n.t('item.' + kind); }

  function clear() {
    layer.innerHTML = '';
  }

  function el(tag, cls, parent, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }

  // ---------- loading ----------

  function setLoading(text, pct) {
    const t = document.getElementById('loading-text');
    const b = document.getElementById('loading-bar');
    if (t) t.textContent = text;
    if (b) b.style.width = pct + '%';
  }

  function hideLoading() {
    const ls = document.getElementById('loading-screen');
    if (ls) ls.style.display = 'none';
  }

  // ---------- main menu ----------

  function showMainMenu() {
    clear();
    const screen = el('div', 'ui-screen ui-backdrop', layer);
    const faceWrap = el('div', null, screen);
    faceWrap.style.cssText = 'margin-bottom: 10px; filter: drop-shadow(6px 6px 0 rgba(0,0,0,0.45));';
    const face = document.createElement('img');
    face.className = 'face-sprite';
    face.style.cssText = 'width: 200px; height: 250px; image-rendering: pixelated;';
    face.src = SpriteGen.get('baldi')[0].image.toDataURL();
    faceWrap.appendChild(face);
    el('div', 'ui-title', screen, "BALDI'S BASICS");
    el('div', 'ui-subtitle', screen, 'IN EDUCATION AND LEARNING');

    const btnStart = el('button', 'ui-button', screen, I18n.t('menu.start'));
    btnStart.addEventListener('click', () => {
      AudioSys.unlock();
      GameEvents.emit('startGame', { endless: false, seed: seedInput.value.trim() || null });
    });

    const btnEndless = el('button', 'ui-button', screen, I18n.t('menu.endless'));
    const saves = Saves.load();
    if (!saves.endlessUnlocked) {
      btnEndless.classList.add('disabled');
      btnEndless.title = I18n.t('menu.endlessLocked');
    } else {
      btnEndless.addEventListener('click', () => {
        AudioSys.unlock();
        GameEvents.emit('startGame', { endless: true, seed: seedInput.value.trim() || null });
      });
    }

    // seed input: type a seed (or roll one) to generate a brand new school
    const seedRow = el('div', null, screen);
    seedRow.style.cssText = 'margin-top: 14px; display: flex; gap: 8px; align-items: center;';
    const seedInput = el('input', null, seedRow);
    seedInput.type = 'text';
    seedInput.placeholder = I18n.t('menu.seedPlaceholder');
    seedInput.value = Game.pendingSeed() || '';
    seedInput.maxLength = 32;
    seedInput.style.cssText = 'padding: 8px 10px; font: 16px monospace; background: #1a1a1a; color: #eee; ' +
      'border: 3px solid #555; width: 240px; text-align: center; image-rendering: pixelated;';
    const btnDice = el('button', 'ui-button', seedRow, I18n.t('menu.seedRandom'));
    btnDice.title = I18n.t('menu.seedRandom');
    btnDice.addEventListener('click', () => {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      seedInput.value = Array.from({ length: 6 },
        () => chars[Math.floor(Math.random() * chars.length)]).join('');
    });
    const seedNote = el('div', 'credits-text', screen, I18n.t('menu.seedHint'));
    seedNote.style.fontSize = '12px';

    const btnHowto = el('button', 'ui-button blue', screen, I18n.t('menu.howto'));
    btnHowto.addEventListener('click', () => HowTo.show());

    const btnSettings = el('button', 'ui-button blue', screen, I18n.t('menu.settings'));
    btnSettings.addEventListener('click', () => showSettings());

    const btnCredits = el('button', 'ui-button gray', screen, I18n.t('menu.credits'));
    btnCredits.addEventListener('click', () => showCredits());

    el('div', 'credits-text', screen, I18n.t('menu.footer'));
    const keysLine = el('div', 'credits-text', screen, I18n.t('howto.controlsText'));
    keysLine.style.whiteSpace = 'pre-line';
    keysLine.style.fontSize = '13px';
    keysLine.style.maxWidth = '620px';
  }

  function showCredits() {
    clear();
    const screen = el('div', 'ui-screen ui-backdrop', layer);
    el('div', 'ui-title', screen, I18n.t('menu.credits'));
    el('div', 'credits-text', screen, I18n.t('menu.creditsText'));
    const back = el('button', 'ui-button', screen, I18n.t('menu.back'));
    back.addEventListener('click', showMainMenu);
  }

  function showSettings(backToMenu = true) {
    clear();
    const screen = el('div', 'ui-screen ui-backdrop', layer);
    el('div', 'ui-title', screen, I18n.t('menu.settings'));
    const saves = Saves.load();

    function row(label, ctrl) {
      const r = el('div', 'settings-row', screen, label);
      r.appendChild(ctrl);
      return r;
    }

    const sens = el('input'); sens.type = 'range'; sens.min = 0.3; sens.max = 2; sens.step = 0.05;
    sens.value = saves.sensitivity;
    sens.addEventListener('input', () => {
      saves.sensitivity = parseFloat(sens.value);
      Saves.save(saves);
      GameEvents.emit('settingsChanged', saves);
    });
    row(I18n.t('settings.sensitivity'), sens);

    const sfx = el('input'); sfx.type = 'range'; sfx.min = 0; sfx.max = 1; sfx.step = 0.05;
    sfx.value = saves.sfxVolume;
    sfx.addEventListener('input', () => {
      saves.sfxVolume = parseFloat(sfx.value);
      Saves.save(saves);
      AudioSys.setSfxVolume(saves.sfxVolume);
    });
    row(I18n.t('settings.sfx'), sfx);

    const mus = el('input'); mus.type = 'range'; mus.min = 0; mus.max = 1; mus.step = 0.05;
    mus.value = saves.musicVolume;
    mus.addEventListener('input', () => {
      saves.musicVolume = parseFloat(mus.value);
      Saves.save(saves);
      AudioSys.setMusicVolume(saves.musicVolume);
    });
    row(I18n.t('settings.musicVol'), mus);

    const musicOn = el('input'); musicOn.type = 'checkbox'; musicOn.checked = saves.musicEnabled;
    musicOn.addEventListener('change', () => {
      saves.musicEnabled = musicOn.checked;
      Saves.save(saves);
      AudioSys.setMusicEnabled(saves.musicEnabled);
    });
    row(I18n.t('settings.music'), musicOn);

    const voiceOn = el('input'); voiceOn.type = 'checkbox'; voiceOn.checked = saves.voiceEnabled;
    voiceOn.addEventListener('change', () => {
      saves.voiceEnabled = voiceOn.checked;
      Saves.save(saves);
      AudioSys.setVoiceEnabled(saves.voiceEnabled);
    });
    row(I18n.t('settings.voices'), voiceOn);

    const langSel = el('select');
    const langOpts = [
      ['en', 'English'],
      ['zh', '中文'],
      ['ja', '日本語'],
    ];
    for (const [code, name] of langOpts) {
      const o = document.createElement('option');
      o.value = code;
      o.textContent = name;
      if (I18n.lang === code) o.selected = true;
      langSel.appendChild(o);
    }
    langSel.addEventListener('change', () => {
      I18n.setLang(langSel.value);
      GameEvents.emit('langChanged');
    });
    row(I18n.t('settings.lang'), langSel);

    const back = el('button', 'ui-button', screen, I18n.t('menu.back'));
    back.addEventListener('click', () => {
      if (backToMenu) showMainMenu();
      else GameEvents.emit('settingsClosed');
    });
  }

  // ---------- HUD ----------

  function buildHud() {
    clear();
    hud = el('div', null, layer);
    hud.id = 'hud';

    // top-left: notebook counter (red rounded box) + clock below
    hud.notebooks = el('div', 'hud-notebooks', hud, 'Notebooks: 0/7');
    hud.clock = el('div', 'hud-clock', hud, '9:00 AM');

    // top-right: 3 item slots in a row + selected item name below
    hud.slots = [];
    for (let i = 0; i < 3; i++) {
      const s = el('div', 'hud-item-slot', hud);
      s.style.top = '12px';
      s.style.right = `${12 + i * 86}px`;
      s.addEventListener('click', () => {
        GameEvents.emit('useItem', i);
      });
      s.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        GameEvents.emit('dropItem', i);
      });
      s.title = '';
      hud.slots.push(s);
    }
    hud.itemName = el('div', 'hud-item-name', hud, '');

    // bottom-left: stamina bar (green over red)
    const staminaWrap = el('div', 'hud-stamina', hud);
    hud.staminaWrap = staminaWrap;
    hud.staminaFill = el('div', 'hud-stamina-fill', staminaWrap);
    hud.staminaFill.style.width = '100%';

    // bottom-center: interaction hint
    hud.hint = el('div', 'hud-hint', hud, '');
    updateHud();
  }

  function updateHud() {
    if (!hud) return;
    hud.notebooks.textContent = I18n.t('hud.notebooks', { n: Notebooks.getSolvedCount() });
    const inv = Player.state.inv;
    for (let i = 0; i < 3; i++) {
      const slot = hud.slots[i];
      slot.innerHTML = '';
      if (i < inv.length) {
        const img = document.createElement('img');
        img.src = TextureGen.getIcon(inv[i]).image.toDataURL();
        slot.appendChild(img);
        slot.title = itemName(inv[i]);
      }
      slot.classList.toggle('selected', i === Player.state.selected);
    }
    // selected item name under the bar
    const sel = Player.state.selected;
    hud.itemName.textContent = (sel < inv.length && inv[sel]) ? itemName(inv[sel]) : '';
  }

  function updateStamina(pct, exhausted = false) {
    if (!hud) return;
    hud.staminaFill.style.width = Math.max(0, Math.min(100, pct)) + '%';
    hud.staminaWrap.classList.toggle('exhausted', !!exhausted);
  }

  function setHint(text) {
    if (hud) hud.hint.textContent = text;
  }

  function setClock(text) {
    if (hud) hud.clock.textContent = text;
  }

  function announce(text, dur = 2600) {
    if (announceTimer) clearTimeout(announceTimer);
    const old = layer.querySelector('.hud-announce');
    if (old) old.remove();
    const a = el('div', 'hud-announce', layer, text);
    announceTimer = setTimeout(() => {
      if (a.parentNode) a.remove();
      announceTimer = null;
    }, dur);
  }

  // big center-screen event prompt
  let centerTimer = null;
  function centerPrompt(text, dur = 2600) {
    if (centerTimer) clearTimeout(centerTimer);
    const old = layer.querySelector('.center-prompt');
    if (old) old.remove();
    const a = el('div', 'center-prompt', layer, text);
    centerTimer = setTimeout(() => {
      if (a.parentNode) a.remove();
      centerTimer = null;
    }, dur);
  }

  // ---------- You Can Think Pad ----------

  function showPad({ title, problem, onSubmit, input = '' }) {
    // overlay ON TOP of the HUD - never clear the layer (the item bar must survive)
    const oldPad = document.getElementById('pad');
    if (oldPad) oldPad.remove();
    const wrap = el('div', null, layer);
    wrap.id = 'pad';
    const paper = el('div', 'pad-paper', wrap);
    el('div', 'pad-title', paper, title || I18n.t('hud.padTitle'));
    const prob = el('div', 'pad-problem', paper);
    const qIdx = problem.lastIndexOf('?');
    if (qIdx >= 0) {
      prob.textContent = problem.slice(0, qIdx) + ' ';
      el('span', 'eq', prob, '?');
    } else {
      prob.textContent = problem;
    }
    const inputEl = el('div', 'pad-input', paper, input || '_');
    const keys = el('div', 'pad-keys', paper);
    for (let i = 0; i <= 9; i++) {
      const k = el('button', 'pad-key', keys, String(i));
      k.addEventListener('click', () => {
        padState.input = padState.input.replace('_', '') + String(i);
        if (padState.input.length > 4) padState.input = padState.input.slice(0, 4);
        inputEl.textContent = padState.input + '_';
      });
    }
    const clearBtn = el('button', 'pad-key', keys, 'C');
    clearBtn.addEventListener('click', () => {
      padState.input = '';
      inputEl.textContent = '_';
    });
    const ok = el('button', 'pad-ok', paper, I18n.t('hud.ok'));
    ok.addEventListener('click', () => {
      const val = parseInt(padState.input, 10);
      if (isNaN(val)) return;
      padState.onSubmit(val);
    });
    const back = el('button', 'pad-key', keys, 'X');
    back.addEventListener('click', () => {
      if (padState.onCancel) padState.onCancel();
    });

    const fb = el('div', 'pad-feedback', paper);
    fb.style.display = 'none';

    padState = { input: '', onSubmit, fbEl: fb };
  }

  function padFeedback(kind) {
    const fb = document.querySelector('#pad .pad-feedback');
    if (!fb) return;
    fb.textContent = kind === 'correct' ? I18n.t('pad.correct')
      : kind === 'wrong' ? I18n.t('pad.wrong') : I18n.t('pad.tryagain');
    fb.className = 'pad-feedback ' + kind;
    fb.style.display = 'block';
    // retrigger pop animation
    fb.style.animation = 'none';
    void fb.offsetWidth;
    fb.style.animation = '';
  }

  function hidePadFeedback() {
    const fb = document.querySelector('#pad .pad-feedback');
    if (fb) fb.style.display = 'none';
  }

  function setPadInput(text) {
    const inputEl = document.querySelector('#pad .pad-input');
    if (inputEl) inputEl.textContent = text + '_';
  }

  function closePad() {
    padState = null;
    const pad = document.getElementById('pad');
    if (pad) pad.remove();
  }

  // ---------- playtime jump indicator ----------

  let jumpUI = null;
  function showJumpUI() {
    if (jumpUI) return;
    const wrap = el('div', null, layer);
    wrap.id = 'jumpui';
    wrap.style.cssText = 'position:fixed;bottom:20%;left:50%;transform:translateX(-50%);text-align:center;z-index:8;';
    const label = el('div', null, wrap, I18n.t('jump.label', { n: '5' }));
    label.style.cssText = 'font-size:22px;color:#fff;text-shadow:2px 2px 0 #000;';
    const track = el('div', null, wrap);
    track.style.cssText = 'width:240px;height:18px;background:#333;border:3px solid #fff;margin:8px auto;position:relative;';
    const zone = el('div', null, track);
    zone.style.cssText = 'position:absolute;left:30%;width:42%;height:100%;background:#4a4;';
    const marker = el('div', null, track);
    marker.style.cssText = 'position:absolute;left:0;top:-4px;width:10px;height:26px;background:#fff;';
    wrap.marker = marker;
    wrap.label = label;
    jumpUI = wrap;
  }

  function updateJumpUI(phase, jumpsLeft) {
    if (!jumpUI) return;
    jumpUI.marker.style.left = `${phase * 100}%`;
    jumpUI.label.textContent = I18n.t('jump.label', { n: jumpsLeft });
  }

  function hideJumpUI() {
    if (jumpUI) { jumpUI.remove(); jumpUI = null; }
  }

  // ---------- detention ----------

  let detentionEl = null;
  function showDetention(seconds, onTick, onDone) {
    clear();
    const wrap = el('div', 'ui-screen', layer);
    wrap.style.background = 'rgba(0,0,0,0.88)';
    el('div', 'ui-title', wrap, I18n.t('det.title'));
    const sub = el('div', 'ui-subtitle', wrap, I18n.t('det.sub'));
    const time = el('div', null, wrap, String(seconds));
    time.style.cssText = 'font-size:80px;color:#ff4444;text-shadow:4px 4px 0 #222;';
    let t = seconds;
    time.textContent = t;
    AudioSys.SFX.detentionBell();
    const iv = setInterval(() => {
      t--;
      if (t <= 0) {
        clearInterval(iv);
        onDone();
        return;
      }
      time.textContent = t;
      AudioSys.SFX.tick();
      if (onTick) onTick(t);
    }, 1000);
    detentionEl = { wrap, iv };
  }

  function closeDetention() {
    if (detentionEl) {
      clearInterval(detentionEl.iv);
      detentionEl.wrap.remove();
      detentionEl = null;
    }
  }

  // ---------- static / jumpscare ----------

  const rageEl = document.getElementById('rage-overlay');
  const crosshairEl = document.getElementById('crosshair');
  function showRage() {
    if (rageEl) rageEl.classList.add('rage-on');
  }
  function hideRage() {
    if (rageEl) rageEl.classList.remove('rage-on');
  }

  // center crosshair: white dot by default, hand over interactables
  function setCrosshair(mode) {
    if (!crosshairEl) return;
    if (mode === 'hand' || mode === 'dot') {
      crosshairEl.classList.remove('dot', 'hand');
      crosshairEl.classList.add(mode);
      crosshairEl.classList.add('visible');
    } else {
      crosshairEl.classList.remove('visible');
    }
  }

  // ---------- hidden ending: every single problem answered wrong ----------

  function showAllWrongEnding(timeStr) {
    clear();
    hideRage();
    AudioSys.SFX.win();
    AudioSys.Voice.baldi(I18n.t('ending.allWrong.line'));
    const screen = el('div', 'ui-screen ui-backdrop', layer);
    screen.style.background = 'rgba(60, 0, 0, 0.88)';
    const faceWrap = el('div', null, screen);
    faceWrap.style.cssText = 'filter: drop-shadow(6px 6px 0 rgba(0,0,0,0.5));';
    const face = document.createElement('img');
    face.className = 'face-sprite';
    face.style.cssText = 'width: 170px; height: 220px; image-rendering: pixelated;';
    face.src = SpriteGen.get('baldi_angry')[0].image.toDataURL();
    faceWrap.appendChild(face);
    el('div', 'ui-title', screen, I18n.t('ending.allWrong.title'));
    el('div', 'ui-subtitle', screen, I18n.t('ending.allWrong.sub'));
    el('div', 'credits-text', screen, I18n.t('ending.allWrong.text'));
    if (timeStr) el('div', 'credits-text', screen, I18n.t('win.time', { t: timeStr }));
    el('div', 'credits-text', screen, I18n.t('ending.allWrong.unlock'));
    const btnMenu = el('button', 'ui-button', screen, I18n.t('menu.mainMenu'));
    btnMenu.addEventListener('click', showMainMenu);
  }

  function showStatic(dur = 0.8, withFace = false) {
    staticEl.style.opacity = 1;
    if (withFace) {
      const img = document.createElement('img');
      img.className = 'face-sprite';
      img.src = SpriteGen.get('baldi_angry')[0].image.toDataURL();
      img.style.cssText = 'position:fixed;inset:0;margin:auto;z-index:41;';
      staticEl.parentNode.appendChild(img);
      setTimeout(() => img.remove(), dur * 1000);
    }
    setTimeout(() => { staticEl.style.opacity = 0; }, dur * 1000);
  }

  function showGameOver() {
    clear();
    AudioSys.SFX.staticBurst(1.5, 0.6);
    AudioSys.SFX.lose();
    AudioSys.Voice.baldi('Wow! You exist!');
    showStatic(1.6, true);
    setTimeout(() => {
      const screen = el('div', 'ui-screen ui-backdrop', layer);
      el('div', 'ui-title', screen, I18n.t('lose.title'));
      el('div', 'ui-subtitle', screen, I18n.t('lose.sub'));
      const btn = el('button', 'ui-button', screen, I18n.t('lose.menu'));
      btn.addEventListener('click', showMainMenu);
    }, 1700);
  }

  function showWin(timeStr, endless, bestStr, seed) {
    clear();
    AudioSys.SFX.win();
    AudioSys.Voice.baldi(I18n.t('voice.wowGreat'));
    const screen = el('div', 'ui-screen ui-backdrop', layer);
    el('div', 'ui-title', screen, I18n.t('win.title'));
    el('div', 'ui-subtitle', screen, I18n.t('win.sub'));
    el('div', 'credits-text', screen, I18n.t('win.time', { t: timeStr }));
    if (seed) {
      el('div', 'credits-text', screen, I18n.t('win.seed', { s: seed }));
    }
    if (bestStr) {
      el('div', 'credits-text', screen, I18n.t('win.best', { t: bestStr }));
    }
    if (!endless) {
      el('div', 'credits-text', screen, I18n.t('win.unlocked'));
    }
    const btnMenu = el('button', 'ui-button', screen, I18n.t('menu.mainMenu'));
    btnMenu.addEventListener('click', showMainMenu);
    const btnAgain = el('button', 'ui-button blue', screen, endless ? I18n.t('win.playAgain') : I18n.t('win.playEndless'));
    btnAgain.addEventListener('click', () => {
      GameEvents.emit('startGame', { endless: true });
    });
  }

  // ---------- pause ----------

  function showPause() {
    clear();
    const screen = el('div', 'ui-screen ui-backdrop', layer);
    el('div', 'ui-title', screen, I18n.t('menu.paused'));
    const ctrl = el('div', 'credits-text', screen, I18n.t('howto.controlsText'));
    ctrl.style.whiteSpace = 'pre-line';
    const btnResume = el('button', 'ui-button', screen, I18n.t('menu.resume'));
    btnResume.addEventListener('click', () => GameEvents.emit('resume'));
    const btnSettings = el('button', 'ui-button blue', screen, I18n.t('menu.settings'));
    btnSettings.addEventListener('click', () => {
      showSettings(false);
      screen.style.display = 'none';
      GameEvents.emit('pauseSettingsOpen', screen);
    });
    const btnMenu = el('button', 'ui-button red', screen, I18n.t('menu.mainMenu'));
    btnMenu.addEventListener('click', () => GameEvents.emit('quitToMenu'));
  }

  function hideAll() {
    clear();
    if (detentionEl) closeDetention();
    hideJumpUI();
    closePad();
  }

  return {
    setLoading, hideLoading, showMainMenu, showCredits, showSettings,
    buildHud, updateHud, updateStamina, setHint, setClock, announce, centerPrompt, itemName,
    showPad, closePad, padFeedback, hidePadFeedback,
    showJumpUI, updateJumpUI, hideJumpUI,
    showDetention, closeDetention, showStatic, showGameOver, showWin,
    showRage, hideRage, showAllWrongEnding, setCrosshair,
    showPause, hideAll,
  };
})();
