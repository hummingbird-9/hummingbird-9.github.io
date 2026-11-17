'use strict';

// Game orchestrator: boot, state machine, input, loop, event wiring.

const Game = (() => {

  const g = {
    mode: 'classic',       // classic | endless
    state: 'menu',         // menu | playing | paused | gameover | win | detention | pomp
    busy: false,
    time: 9 * 60,          // game clock in minutes from midnight (9:00 AM)
    timeAcc: 0,
    elapsed: 0,
    keys: {},
    pausedScreen: null,
    pompProblems: null,
    pompIndex: 0,
    hintTimer: 0,
    mouseLook: false,
    viewOffset: 0,          // Alt look-back camera offset
    lookBack: false,
    lookBackTarget: 0,
    padBusy: false,
    seed: null,              // active seed key (null = classic map)
  };

  // ---------- seed handling ----------

  const SEED_STORE = 'bbseed';

  // seed that will be used for the next run; ?seed= URL wins over storage
  function pendingSeed() {
    const params = new URLSearchParams(window.location.search);
    const url = params.get('seed');
    if (url !== null && url.trim() !== '') return url.trim().slice(0, 32);
    try {
      const s = localStorage.getItem(SEED_STORE);
      if (s && s.trim() !== '') return s.trim().slice(0, 32);
    } catch (e) { /* storage unavailable */ }
    return null;
  }

  function rememberSeed(seed) {
    g.seed = seed;
    try {
      if (seed === null || seed === '') localStorage.removeItem(SEED_STORE);
      else localStorage.setItem(SEED_STORE, seed);
    } catch (e) { /* storage unavailable */ }
  }

  // switch the map (and rebuild the world) if the seed changed
  function applySeed(seed) {
    const key = SeedRng.normalize(seed);
    if (key === MapData.seedKeyOf()) return;
    MapData.reset(key);
    GameRenderer.rebuildWorld();
    rememberSeed(key);
  }

  function boot() {
    UI.setLoading(I18n.t('load.render'), 10);
    MapData.validate();
    const seed = pendingSeed();
    MapData.reset(seed);
    rememberSeed(seed);
    GameRenderer.init();
    AudioSys.init();
    I18n.init();
    const saves = Saves.load();
    AudioSys.setSfxVolume(saves.sfxVolume);
    AudioSys.setMusicVolume(saves.musicVolume);
    AudioSys.setMusicEnabled(saves.musicEnabled);
    AudioSys.setVoiceEnabled(saves.voiceEnabled);

    // audio needs a user gesture; start menu music on first interaction
    window.addEventListener('pointerdown', () => {
      AudioSys.unlock();
      if (g.state === 'menu') AudioSys.crossfadeMusic('menu');
    });

    GameRenderer.buildWorld();
    UI.setLoading(I18n.t('load.baldi'), 50);

    Vending.init();
    Exits.init();

    UI.setLoading(I18n.t('load.notebooks'), 70);
    Notebooks.init(GameRenderer.scene);

    UI.setLoading(I18n.t('load.polish'), 85);

    wireEvents();
    UI.hideLoading();
    UI.showMainMenu();
    requestAnimationFrame(loop);
  }

  // ---------- run setup ----------

  function startRun(endless) {
    g.mode = endless ? 'endless' : 'classic';
    g.state = 'playing';
    g.busy = false;
    g.time = 9 * 60;
    g.timeAcc = 0;
    g.elapsed = 0;
    g.viewOffset = 0;
    g.lookBack = false;
    g.lookBackTarget = 0;
    g.rage = false;
    g.allWrongPending = false;
    UI.hideRage();

    // clear dynamic sprites from previous run
    const sg = GameRenderer.spriteGroup;
    while (sg.children.length) sg.remove(sg.children[0]);

    Notebooks.init(GameRenderer.scene);
    Items.init(GameRenderer.scene, endless);
    Vending.init();
    Exits.init();
    DoorSystem.resetAll();
    Baldi.init(GameRenderer.scene);
    Principal.init(GameRenderer.scene);
    Playtime.init(GameRenderer.scene);
    Bully.init(GameRenderer.scene);
    Sweep.init(GameRenderer.scene);
    FirstPrize.init(GameRenderer.scene);
    ArtsCrafters.init(GameRenderer.scene);
    MrsPomp.init(GameRenderer.scene);
    Principal.resetInfractions();

    const sp = MapData.SPAWNS.player;
    Player.reset(sp.x, sp.z, sp.rot);

    GameRenderer.camera.position.set(Player.x, Player.EYE, Player.z);
    GameRenderer.camera.rotation.set(0, Player.yaw, 0);

    UI.hideAll();
    UI.buildHud();
    UI.updateHud();
    UI.announce(I18n.t('ann.collect'), 3000);

    AudioSys.playMusic('game');
    AudioSys.Voice.baldi(I18n.t('voice.welcome'));
  }

  function gameOver() {
    if (g.state === 'gameover' || g.state === 'menu') return;
    g.state = 'gameover';
    g.busy = true;
    document.exitPointerLock && document.exitPointerLock();
    UI.hideRage();
    AudioSys.stopMusic();
    UI.showGameOver();
  }

  function winGame() {
    if (g.state !== 'playing') return;
    g.state = 'win';
    g.busy = true;
    document.exitPointerLock && document.exitPointerLock();
    UI.hideRage();
    const saves = Saves.load();
    let bestStr = null;
    if (!saves.endlessUnlocked) {
      saves.endlessUnlocked = true;
    }
    if (g.mode !== 'endless') {
      const secs = Math.floor(g.elapsed);
      if (!saves.bestTime || secs < saves.bestTime) {
        saves.bestTime = secs;
      }
      const bm = Math.floor(saves.bestTime / 60);
      const bs = (saves.bestTime % 60).toString().padStart(2, '0');
      bestStr = `${bm}:${bs}`;
    }
    Saves.save(saves);
    const mins = Math.floor(g.elapsed / 60);
    const secs = Math.floor(g.elapsed % 60);
    const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;
    AudioSys.stopMusic();
    UI.showWin(timeStr, g.mode === 'endless', bestStr, MapData.seedKeyOf());
  }

  // ---------- detention / pomp flows ----------

  function startDetention(time) {
    if (g.state !== 'playing') return;
    g.state = 'detention';
    g.busy = true;
    document.exitPointerLock && document.exitPointerLock();
    Playtime.forceEnd();
    Baldi.setDistracted(true);
    AudioSys.Voice.principal(I18n.t('voice.principalDet'));
    AudioSys.crossfadeMusic('detention');
    // teleport to detention room
    const det = MapData.TELEPORTS.detentionIn;
    Player.state.x = det.x; Player.state.z = det.z;
    Player.state.yaw = det.rot !== undefined ? det.rot : Math.PI / 2;
    UI.showDetention(time, null, () => {
      const detOut = MapData.TELEPORTS.detentionOut;
      Player.state.x = detOut.x; Player.state.z = detOut.z;
      Player.state.yaw = detOut.rot !== undefined ? detOut.rot : Math.PI;
      Baldi.setDistracted(false);
      g.state = 'playing';
      g.busy = false;
      g.padBusy = false;
      g.keys = {};
      Player.state.shiftSprint = false;
      Playtime.forceEnd();
      AudioSys.crossfadeMusic('game');
      UI.hideAll();
      UI.buildHud();
      UI.updateHud();
      UI.announce(I18n.t('ann.backToClass'));
      lockPointer();
    });
    // shown after the detention screen clears the layer
    UI.centerPrompt(I18n.t('center.detention'), 4000);
  }

  function startPomp() {
    if (g.state !== 'playing') return;
    g.state = 'pomp';
    g.busy = true;
    document.exitPointerLock && document.exitPointerLock();
    Playtime.forceEnd();
    Baldi.setDistracted(true);
    AudioSys.Voice.pomp(I18n.t('voice.pompTeach'));
    UI.centerPrompt(I18n.t('center.pomp'), 4000);
    // teleport to her classroom
    const pompin = MapData.TELEPORTS.pompIn;
    Player.state.x = pompin.x; Player.state.z = pompin.z;
    Player.state.yaw = pompin.rot !== undefined ? pompin.rot : Math.PI;
    g.pompIndex = 0;
    g.pompProblems = [MathGen.generateSubtraction(), MathGen.generateSubtraction(), MathGen.generateSubtraction()];
    showPompProblem();
  }

  function showPompProblem() {
    if (g.pompIndex >= 3) {
      // done: release outside her classroom
      const pompin = MapData.TELEPORTS.pompOut;
      Player.state.x = pompin.x; Player.state.z = pompin.z;
      Player.state.yaw = pompin.rot !== undefined ? pompin.rot : Math.PI;
      Baldi.setDistracted(false);
      g.state = 'playing';
      g.busy = false;
      g.padBusy = false;
      g.keys = {};
      Player.state.shiftSprint = false;
      Playtime.forceEnd();
      UI.hideAll();
      UI.buildHud();
      UI.updateHud();
      UI.announce(I18n.t('ann.classDismissed'));
      AudioSys.crossfadeMusic('game');
      lockPointer();
      return;
    }
    const prob = g.pompProblems[g.pompIndex];
    g.padBusy = false;
    UI.hidePadFeedback();
    UI.showPad({
      title: I18n.t('pomp.title'),
      problem: prob.text,
      onSubmit: (val) => {
        if (g.padBusy) return;
        g.padBusy = true;
        if (val === prob.answer) {
          AudioSys.SFX.correct();
          UI.padFeedback('correct');
          g.pompIndex++;
          setTimeout(showPompProblem, 520);
        } else {
          AudioSys.SFX.wrong();
          AudioSys.Voice.pomp(I18n.t('voice.pompTry'));
          UI.padFeedback('tryagain');
          setTimeout(showPompProblem, 750); // repeat same problem
        }
      },
      onCancel: () => { /* cannot cancel */ },
    });
  }

  // ---------- interaction ----------

  function interact() {
    if (g.state !== 'playing' || g.busy) return;
    // the hint poster opens the hidden passage
    if (!MapData.SECRET_REVEALED) {
      const pos = MapData.secret().poster;
      const d = Math.hypot(pos.x - Player.x, pos.z - Player.z);
      if (d < 2.2) {
        MapData.revealSecret();
        GameRenderer.rebuildWorld();
        AudioSys.SFX.doorOpen(pos.x, pos.z);
        AudioSys.Voice.baldi(I18n.t('voice.wowGreat'));
        UI.announce(I18n.t('ann.secretFound'), 4200);
        return;
      }
    }
    const t = Player.findInteractable(
      Notebooks.all(), Vending.all(), Items.all(), Exits.all(), null
    );
    if (!t) return;
    switch (t.kind) {
      case 'door': {
        const door = t.door;
        if (door.type === 'exit') {
          const exit = Exits.all().find(e => e.door === door);
          const res = Exits.tryExit(exit);
          if (res === 'win') winGame();
        } else {
          DoorSystem.openDoor(door, Player);
        }
        break;
      }
      case 'notebook': {
        if (Notebooks.isSolving()) break;
        const prob = Notebooks.startSolving(t.notebook);
        Baldi.onPadOpened();
        showPadProblem(prob);
        break;
      }
      case 'vending': {
        Vending.tryBuy(t.vending);
        break;
      }
      case 'item': {
        Items.pickup(t.item);
        break;
      }
      case 'exit': {
        const res = Exits.tryExit(t.exit);
        if (res === 'win') winGame();
        break;
      }
    }
  }

  function showPadProblem(prob) {
    document.exitPointerLock && document.exitPointerLock();
    g.mouseLook = false;
    g.padBusy = false;
    UI.hidePadFeedback();
    UI.showPad({
      title: I18n.t('hud.padTitle'),
      problem: prob.text,
      onSubmit: (val) => {
        if (g.padBusy) return;
        g.padBusy = true;
        const res = Notebooks.submitAnswer(val);
        if (res === 'correct') {
          AudioSys.SFX.correct();
          UI.padFeedback('correct');
          setTimeout(() => {
            const next = Notebooks.currentProblem();
            if (next) showPadProblem(next);
            else closePadAfterSolve();
          }, 520);
        } else if (res === 'wrong' || res === 'wrong-finished') {
          AudioSys.SFX.wrong();
          Baldi.wrongAnswer();
          UI.padFeedback('wrong');
          setTimeout(() => {
            const next = Notebooks.currentProblem();
            if (next) showPadProblem(next);
            else closePadAfterSolve();
          }, 850);
        } else {
          closePadAfterSolve();
        }
      },
      onCancel: () => {
        Notebooks.cancelSolving();
        UI.closePad();
        Baldi.onPadClosed();
        lockPointer();
      },
    });
  }

  function closePadAfterSolve() {
    UI.closePad();
    Baldi.onPadClosed();
    if (g.allWrongPending) {
      g.allWrongPending = false;
      UI.hideRage();
      showAllWrongEnding();
      return;
    }
    GameEvents.emit('notebookSolvedFx');
    lockPointer();
  }

  function showAllWrongEnding() {
    g.state = 'win';
    g.busy = true;
    document.exitPointerLock && document.exitPointerLock();
    const saves = Saves.load();
    if (!saves.endlessUnlocked) {
      saves.endlessUnlocked = true;
      Saves.save(saves);
    }
    const mins = Math.floor(g.elapsed / 60);
    const secs = Math.floor(g.elapsed % 60);
    const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;
    AudioSys.stopMusic();
    UI.showAllWrongEnding(timeStr);
  }

  // ---------- item use ----------

  function useItem(idx) {
    if (g.state !== 'playing' || g.busy) return;
    const inv = Player.state.inv;
    if (idx >= inv.length) return;
    Player.state.selected = idx;
    UI.updateHud();
    const kind = inv[idx];
    switch (kind) {
      case 'bsoda': {
        Player.state.inv.splice(idx, 1);
        Player.state.sprintTimer = 8;
        AudioSys.SFX.gulp();
        AudioSys.Voice.baldi(I18n.t('voice.wowFast'));
        UI.announce(I18n.t('ann.bsoda'));
        break;
      }
      case 'zesty': {
        Player.state.inv.splice(idx, 1);
        Player.state.zestTimer = 4.5;
        AudioSys.SFX.crunch();
        UI.announce(I18n.t('ann.zesty'));
        break;
      }
      case 'keys': {
        UI.announce(I18n.t('ann.keysHint'));
        break;
      }
      case 'wd': {
        // find nearest door
        let best = null, bd = 1.6;
        for (const d of DoorSystem.allDoors()) {
          const dd = Math.hypot((d.x + 0.5) - Player.x, (d.z + 0.5) - Player.z);
          if (dd < bd) { bd = dd; best = d; }
        }
        if (best && best.type !== 'exit') {
          Player.state.inv.splice(idx, 1);
          DoorSystem.wedgeDoor(best.x, best.z);
          UI.announce(I18n.t('ann.wedged'));
        } else {
          UI.announce(I18n.t('ann.wdHint'));
        }
        break;
      }
      case 'scissors': {
        const fpos = FirstPrize.getPos();
        const ppos = Playtime.getPos();
        const df = Math.hypot(fpos.x - Player.x, fpos.z - Player.z);
        const dp = Math.hypot(ppos.x - Player.x, ppos.z - Player.z);
        if (df < 1.8) {
          Player.state.inv.splice(idx, 1);
          FirstPrize.disable();
        } else if (dp < 2.2 && Playtime.isAvailable()) {
          Player.state.inv.splice(idx, 1);
          Playtime.cutRope();
        } else {
          UI.announce(I18n.t('ann.scissorsHint'));
        }
        break;
      }
      case 'eraser': {
        Player.state.inv.splice(idx, 1);
        CloudSystem.spawn(Player.x, Player.z);
        UI.announce(I18n.t('ann.chalk'));
        break;
      }
      case 'boots': {
        Player.state.inv.splice(idx, 1);
        Player.state.bootsTimer = 99999;
        AudioSys.SFX.crunch();
        UI.announce(I18n.t('ann.boots'));
        break;
      }
      case 'clock': {
        UI.announce(I18n.t('ann.clockHint'));
        break;
      }
    }
    UI.updateHud();
  }

  function dropSelectedItem() {
    if (g.state !== 'playing' || g.busy) return;
    const inv = Player.state.inv;
    if (inv.length === 0) return;
    const kind = inv[Player.state.selected];
    inv.splice(Player.state.selected, 1);
    if (Player.state.selected >= inv.length) Player.state.selected = Math.max(0, inv.length - 1);
    Items.dropItem(kind, Player.x, Player.z);
    AudioSys.SFX.notebookPickup();
    UI.announce(I18n.t('ann.dropped', { item: UI.itemName(kind) }));
    UI.updateHud();
  }

  function dropItemAt(idx) {
    if (g.state !== 'playing' || g.busy) return;
    const inv = Player.state.inv;
    if (idx >= inv.length) return;
    const kind = inv[idx];
    inv.splice(idx, 1);
    if (Player.state.selected >= inv.length) Player.state.selected = Math.max(0, inv.length - 1);
    Items.dropItem(kind, Player.x, Player.z);
    AudioSys.SFX.notebookPickup();
    UI.announce(I18n.t('ann.dropped', { item: UI.itemName(kind) }));
    UI.updateHud();
  }

  // ---------- input ----------

  function lockPointer() {
    if (g.state !== 'playing' || g.busy) return;
    const canvas = GameRenderer.renderer.domElement;
    try {
      const p = canvas.requestPointerLock && canvas.requestPointerLock();
      if (p && p.catch) p.catch(() => {});
    } catch (e) { /* pointer lock needs a user gesture; player can click canvas */ }
  }

  function wireEvents() {
    const canvas = GameRenderer.renderer.domElement;

    canvas.addEventListener('click', () => {
      AudioSys.unlock();
      if (g.state === 'playing' && !g.busy && !Notebooks.isSolving()) {
        if (document.pointerLockElement === canvas) {
          interact();
        } else {
          lockPointer();
        }
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (g.state !== 'playing' || g.busy) return;
      if (document.pointerLockElement !== canvas) return;
      const saves = Saves.load();
      const sens = saves.sensitivity * 0.0022;
      Player.yaw -= e.movementX * sens;
      Player.pitch -= e.movementY * sens;
      Player.pitch = Math.max(-1.1, Math.min(1.1, Player.pitch));
    });

    document.addEventListener('keydown', (e) => {
      g.keys[e.code] = true;
      if (g.state === 'playing' && !g.busy) {
        if (e.code === 'Space') {
          Playtime.onJumpInput();
          e.preventDefault();
        }
        if (e.code === 'Escape') {
          pause();
        }
        if (e.code === 'AltLeft' || e.code === 'AltRight') {
          // glance behind while held
          g.lookBack = true;
          g.lookBackTarget = Math.PI;
          e.preventDefault();
        }
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
          // sprint key (stamina bar shows the cost)
          e.preventDefault();
        }
        // item bar selection: 1/2/3 or numpad
        const digit = e.code.match(/^(Digit|Numpad)([1-3])$/);
        if (digit) {
          const idx = parseInt(digit[2], 10) - 1;
          const inv = Player.state.inv;
          if (idx < inv.length) {
            Player.state.selected = idx;
            UI.updateHud();
          }
          e.preventDefault();
        }
        // drop the selected item on the floor
        if (e.code === 'KeyQ') {
          dropSelectedItem();
          e.preventDefault();
        }
        // use the selected item (clicks on the bar don't work under pointer lock)
        if (e.code === 'KeyE') {
          const inv = Player.state.inv;
          if (inv.length > 0 && Player.state.selected < inv.length) {
            useItem(Player.state.selected);
          }
          e.preventDefault();
        }
      } else if (g.state === 'paused' && e.code === 'Escape') {
        resume();
      }
      // pad keyboard input
      const pad = document.getElementById('pad');
      if (pad && g.state === 'playing') {
        if (e.key >= '0' && e.key <= '9') {
          const btn = Array.from(pad.querySelectorAll('.pad-key')).find(b => b.textContent === e.key);
          if (btn) btn.click();
        }
        if (e.key === 'Enter') {
          const ok = pad.querySelector('.pad-ok');
          if (ok) ok.click();
        }
      }
    });

    document.addEventListener('keyup', (e) => {
      g.keys[e.code] = false;
      if (e.code === 'AltLeft' || e.code === 'AltRight') {
        g.lookBack = false;
        g.lookBackTarget = 0;
      }
    });

    // mouse wheel cycles the item bar selection
    canvas.addEventListener('wheel', (e) => {
      if (g.state !== 'playing' || g.busy) return;
      const inv = Player.state.inv;
      if (inv.length === 0) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      Player.state.selected = (Player.state.selected + dir + inv.length) % inv.length;
      UI.updateHud();
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('pointerlockchange', () => {
      g.mouseLook = document.pointerLockElement === canvas;
      if (!g.mouseLook && g.state === 'playing' && !g.busy && !Notebooks.isSolving()) {
        // pointer unlocked by ESC: pause
        pause();
      }
    });

    GameEvents.on('startGame', ({ endless, seed }) => {
      if (seed !== undefined) applySeed(seed);
      startRun(endless);
    });
    GameEvents.on('resume', resume);
    GameEvents.on('quitToMenu', () => {
      g.state = 'menu';
      g.busy = false;
      g.rage = false;
      g.allWrongPending = false;
      UI.hideRage();
      document.exitPointerLock && document.exitPointerLock();
      AudioSys.stopMusic();
      UI.showMainMenu();
      AudioSys.playMusic('menu');
    });
    GameEvents.on('useItem', (i) => useItem(i));
    GameEvents.on('dropItem', (i) => dropItemAt(i));
    GameEvents.on('settingsChanged', () => {});
    GameEvents.on('settingsClosed', () => {
      if (g.state === 'paused') UI.showPause();
      else if (g.state === 'menu') UI.showMainMenu();
    });
    GameEvents.on('doorOpen', (door) => Baldi.hearDoor(door));
    GameEvents.on('doorClose', (door) => Baldi.hearDoor(door));
    GameEvents.on('notebookSolved', () => {
      Baldi.onNotebookSolved();
      AudioSys.Voice.baldi(I18n.t('voice.wowGreat'));
      UI.announce(I18n.t('ann.notebookSolved'));
      if (Notebooks.getSolvedCount() >= 7) {
        UI.centerPrompt(I18n.t('center.exits'), 3600);
        // endgame rage: red screen + heartbeat, Baldi is super fast now
        g.rage = true;
        UI.showRage();
        g.rageTimer = 0;
        AudioSys.SFX.heartbeat();
      }
    });
    GameEvents.on('allWrong', () => {
      // hidden ending - shown right after the 7th notebook pad closes
      g.allWrongPending = true;
    });
    GameEvents.on('detention', ({ time }) => startDetention(time));
    GameEvents.on('pompCaught', () => startPomp());
    GameEvents.on('artsTeleport', () => {
      if (g.state !== 'playing') return;
      AudioSys.SFX.staticBurst(0.9, 0.5);
      AudioSys.SFX.teleport();
      UI.showStatic(0.9);
      const ent = MapData.TELEPORTS.entrance;
      Player.state.x = ent.x; Player.state.z = ent.z;
      Player.state.yaw = ent.rot !== undefined ? ent.rot : 0;
      UI.centerPrompt(I18n.t('center.arts'), 3000);
    });
    GameEvents.on('baldiCaught', () => gameOver());
    GameEvents.on('pauseSettingsOpen', (screen) => { g.pausedScreen = screen; });
    GameEvents.on('langChanged', () => {
      if (g.state === 'menu') UI.showMainMenu();
      else if (g.state === 'playing' || g.state === 'detention' || g.state === 'pomp') {
        UI.updateHud();
      }
    });
  }

  function pause() {
    if (g.state !== 'playing' || g.busy) return;
    g.state = 'paused';
    document.exitPointerLock && document.exitPointerLock();
    UI.showPause();
  }

  function resume() {
    if (g.state !== 'paused') return;
    g.state = 'playing';
    UI.hideAll();
    UI.buildHud();
    UI.updateHud();
    lockPointer();
  }

  // ---------- NPC mutual push ----------

  function pushApart() {
    const entries = [
      { o: Baldi, r: 0.3 },
      { o: Principal, r: 0.3 },
      { o: MrsPomp, r: 0.3 },
      { o: FirstPrize, r: 0.3 },
      { o: Player, r: Player.RADIUS },
    ];
    const pos = entries.map(e => {
      const p = e.o.getPos();
      return { x: p.x, z: p.z, r: e.r, o: e.o, isPlayer: e.o === Player };
    });
    for (let i = 0; i < pos.length; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        const a = pos[i], b = pos[j];
        // Baldi must be able to reach the player (he kills on contact)
        if ((a.o === Baldi && b.isPlayer) || (b.o === Baldi && a.isPlayer)) continue;
        const dx = b.x - a.x, dz = b.z - a.z;
        const d = Math.hypot(dx, dz);
        const minD = a.r + b.r;
        if (d < minD && d > 0.001) {
          const push = (minD - d) / 2;
          const nx = dx / d, nz = dz / d;
          if (a.isPlayer) {
            const c = Player.collideCircle(a.o.state.x - nx * push, a.o.state.z - nz * push, Player.RADIUS);
            a.o.state.x = c.x; a.o.state.z = c.z;
          } else {
            const c = Player.collideCircle(a.o.getPos().x - nx * push, a.o.getPos().z - nz * push, a.r);
            a.o.nudge(c.x - a.o.getPos().x, c.z - a.o.getPos().z);
          }
          if (b.isPlayer) {
            const c = Player.collideCircle(b.o.state.x + nx * push, b.o.state.z + nz * push, Player.RADIUS);
            b.o.state.x = c.x; b.o.state.z = c.z;
          } else {
            const c = Player.collideCircle(b.o.getPos().x + nx * push, b.o.getPos().z + nz * push, b.r);
            b.o.nudge(c.x - b.o.getPos().x, c.z - b.o.getPos().z);
          }
        }
      }
    }
  }

  // ---------- loop ----------

  let lastT = performance.now();

  function loop(now) {
    requestAnimationFrame(loop);
    let dt = (now - lastT) / 1000;
    lastT = now;
    dt = Math.min(dt, 0.05);

    if (g.state === 'playing' || g.state === 'detention' || g.state === 'pomp') {
      AudioSys.setListener(Player.x, Player.z);
      // game clock
      g.timeAcc += dt;
      while (g.timeAcc > 1.2) {
        g.timeAcc -= 1.2;
        g.time += 1;
        UI.setClock(formatTime(g.time));
      }
      if (g.state === 'playing') g.elapsed += dt;
    }

    if (g.state === 'playing') {
      // movement input (locked during pad solving and Playtime's minigame)
      if (!Notebooks.isSolving() && !g.busy && !Playtime.isActive()) {
        Player.state.shiftSprint = !!(g.keys['ShiftLeft'] || g.keys['ShiftRight']);
        let mx = 0, mz = 0;
        if (g.keys['KeyW'] || g.keys['ArrowUp']) mz -= 1;
        if (g.keys['KeyS'] || g.keys['ArrowDown']) mz += 1;
        if (g.keys['KeyA'] || g.keys['ArrowLeft']) mx -= 1;
        if (g.keys['KeyD'] || g.keys['ArrowRight']) mx += 1;
        if (mx !== 0 || mz !== 0) {
          const len = Math.hypot(mx, mz);
          mx /= len; mz /= len;
          // rotate movement into world space by yaw (matches camera basis)
          const wx = mx * Math.cos(Player.yaw) + mz * Math.sin(Player.yaw);
          const wz = -mx * Math.sin(Player.yaw) + mz * Math.cos(Player.yaw);
          Player.tryMove(wx, wz, dt);
        }
      } else {
        Player.state.shiftSprint = false;
      }

      Player.update(dt);
      UI.updateStamina(Player.state.stamina, Player.state.staminaExhausted);

      // Alt look-back: smoothly glance behind while held
      g.viewOffset += (g.lookBackTarget - g.viewOffset) * (1 - Math.exp(-10 * dt));
      if (Math.abs(g.lookBackTarget - g.viewOffset) < 0.01) g.viewOffset = g.lookBackTarget;

      // hints
      g.hintTimer -= dt;
      if (g.hintTimer <= 0) {
        g.hintTimer = 0.18;
        updateHint();
      }

      // entities
      Baldi.update(dt, Player);
      Principal.update(dt, Player, false);
      Playtime.update(dt, Player, false);
      Bully.update(dt, Player, false);
      Sweep.update(dt, Player, false);
      FirstPrize.update(dt, Player, false);
      ArtsCrafters.update(dt, Player, false);
      MrsPomp.update(dt, Player, false);
      pushApart();

      // playtime jump UI
      if (Playtime.isActive()) {
        UI.showJumpUI();
        UI.updateJumpUI(Playtime.ropePhase(), Playtime.jumpsLeft());
      } else {
        UI.hideJumpUI();
      }

      // music switch when Baldi chasing nearby
      if (Baldi.state === 'chase' && Baldi.wrongCount > 0) {
        const bp = Baldi.getPos();
        const d = Math.hypot(bp.x - Player.x, bp.z - Player.z);
        AudioSys.crossfadeMusic(d < 7 ? 'chase' : 'game');
      } else {
        AudioSys.crossfadeMusic('game');
      }

      // endgame rage heartbeat
      if (g.rage) {
        g.rageTimer -= dt;
        if (g.rageTimer <= 0) {
          g.rageTimer = 0.85;
          AudioSys.SFX.heartbeat();
        }
      }

      // camera (with subtle head-bob + Alt look-back offset)
      const cam = GameRenderer.camera;
      const bob = Player.state.moving ? Math.abs(Math.sin(Player.state.bobPhase)) * 0.035 : 0;
      cam.position.set(Player.x, Player.EYE + bob, Player.z);
      cam.rotation.set(Player.pitch, Player.yaw + g.viewOffset, 0);
    } else if (g.state === 'detention' || g.state === 'pomp') {
      // keep world alive but static
      const cam = GameRenderer.camera;
      cam.position.set(Player.x, Player.EYE, Player.z);
      cam.rotation.set(Player.pitch, Player.yaw, 0);
    }

    DoorSystem.update(dt);
    CloudSystem.update(dt);

    GameRenderer.render();
  }

  function formatTime(minutes) {
    const m = minutes % (24 * 60);
    let h = Math.floor(m / 60);
    const mm = m % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${mm.toString().padStart(2, '0')} ${ampm}`;
  }

  function updateHint() {
    if (g.state !== 'playing' || g.busy) {
      UI.setHint('');
      UI.setCrosshair(null);
      return;
    }
    if (Notebooks.isSolving()) { UI.setHint(''); UI.setCrosshair(null); return; }
    // hint poster
    if (!MapData.SECRET_REVEALED) {
      const pos = MapData.secret().poster;
      if (Math.hypot(pos.x - Player.x, pos.z - Player.z) < 2.4) {
        UI.setHint(I18n.t('hint.secretPoster'));
        UI.setCrosshair('hand');
        return;
      }
    }
    const t = Player.findInteractable(
      Notebooks.all(), Vending.all(), Items.all(), Exits.all(), null
    );
    if (!t) {
      UI.setHint('');
      UI.setCrosshair('dot');
      return;
    }
    UI.setCrosshair('hand');
    switch (t.kind) {
      case 'door': {
        if (t.door.type === 'exit') {
          UI.setHint(t.door.locked ? I18n.t('hint.exitLocked') : I18n.t('hint.exit'));
        } else {
          UI.setHint(t.door.locked ? I18n.t('hint.locked') : I18n.t('hint.openDoor'));
        }
        break;
      }
      case 'notebook':
        UI.setHint(I18n.t('hint.notebook'));
        break;
      case 'vending':
        UI.setHint(I18n.t('hint.vending'));
        break;
      case 'item':
        UI.setHint(I18n.t('hint.pickup', { item: UI.itemName(t.item.kind) }));
        break;
      case 'exit':
        UI.setHint(I18n.t('hint.exitSchool'));
        break;
    }
  }

  return {
    boot,
    pendingSeed,
    get mode() { return g.mode; },
    get state() { return g.state; },
    __debug: {
      state: () => g.state,
      pos: () => ({ x: Player.x, z: Player.z, yaw: Player.yaw, pitch: Player.pitch }),
      teleport: (x, z, yaw) => {
        Player.state.x = x; Player.state.z = z;
        if (yaw !== undefined) Player.state.yaw = yaw;
      },
      inventory: () => Player.state.inv.slice(),
      addItem: (kind) => { Player.state.inv.length = 0; Player.addItem(kind); UI.updateHud(); },
      notebooks: () => Notebooks.getSolvedCount(),
      solveAll: () => Notebooks.debugSolveAll(),
      interact: () => interact(),
      wrongAnswer: () => Baldi.wrongAnswer(),
      baldiPos: () => Baldi.getPos(),
      setBaldiPos: (x, z) => { Baldi.nudge(x - Baldi.getPos().x, z - Baldi.getPos().z); },
      baldiState: () => Baldi.state,
      baldiSpeed: () => Baldi.getSpeed(),
      baldiWaypoint: () => Baldi.getWaypoint(),
      setBaldiDistracted: (v) => Baldi.setDistracted(v),
      baldiHearTarget: () => Baldi.getHearTarget(),
      setBaldiHearing: (v) => Baldi.setHearing(v),
      principalWaypoint: () => Principal.getWaypoint(),
      pompWaypoint: () => MrsPomp.getWaypoint(),
      firstPrizeState: () => FirstPrize.state,
      artsState: () => ArtsCrafters.state,
      setFirstPrizePos: (x, z) => { FirstPrize.nudge(x - FirstPrize.getPos().x, z - FirstPrize.getPos().z); },
      npcPositions: () => ({
        principal: Principal.getPos(), playtime: Playtime.getPos(),
        bully: Bully.getPos(), sweep: Sweep.getPos(),
        firstprize: FirstPrize.getPos(), arts: ArtsCrafters.getPos(),
        mrsPomp: MrsPomp.getPos(),
      }),
      startRun: (endless) => startRun(endless),
      useItemAt: (i) => useItem(i),
      setPrincipalPos: (x, z) => { Principal.nudge(x - Principal.getPos().x, z - Principal.getPos().z); },
      forceDetention: () => GameEvents.emit('detention', { time: 15 }),
      forcePomp: () => GameEvents.emit('pompCaught'),
      forceGameOver: () => gameOver(),
      forceWin: () => winGame(),
      startSprint: () => { Player.state.sprintTimer = 8; },
      mapStats: () => ({
        seed: MapData.seedKeyOf(),
        secretRevealed: MapData.SECRET_REVEALED,
        doors: MapData.findDoors().length,
        exits: MapData.EXITS.length,
        notebooks: MapData.NOTEBOOKS.length,
        waypoints: MapData.WAYPOINTS.length,
        lights: MapData.LIGHTS.length,
      }),
      revealSecret: () => {
        if (MapData.revealSecret()) GameRenderer.rebuildWorld();
        return MapData.SECRET_REVEALED;
      },
    },
  };
})();

window.addEventListener('load', () => {
  try {
    Game.boot();
  } catch (e) {
    console.error(e);
    document.getElementById('loading-text').textContent = 'ERROR: ' + e.message;
  }
});
