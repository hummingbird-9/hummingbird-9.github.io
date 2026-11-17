'use strict';

// Ground items + pickup + chalk eraser clouds.

const Items = (() => {

  const items = [];   // {kind, x, z, alive, mesh}

  function init(scene, endless = false) {
    items.length = 0;
    const group = GameRenderer.spriteGroup;
    for (const sp of MapData.ITEM_SPAWNS) {
      // keys never shuffle (they are required to escape: all 4 exits are locked)
      const kind = (endless && sp.kind !== 'keys' && Math.random() < 0.5)
        ? ['quarter', 'bsoda', 'zesty', 'clock', 'eraser', 'wd', 'scissors', 'boots', 'keys'][Math.floor(Math.random() * 9)]
        : sp.kind;
      const mat = new THREE.SpriteMaterial({ map: TextureGen.getIcon(kind) });
      const s = new THREE.Sprite(mat);
      s.scale.set(0.4, 0.4, 1);
      s.position.set(sp.x, 0.22, sp.z);
      group.add(s);
      items.push({ kind, x: sp.x, z: sp.z, alive: true, mesh: s });
    }
  }

  function all() { return items; }

  function pickup(it) {
    if (!it.alive) return false;
    if (Player.state.inv.length >= 3) {
      UI.announce(I18n.t('ann.pocketsFull'));
      return false;
    }
    Player.addItem(it.kind);
    it.alive = false;
    it.mesh.visible = false;
    if (it.kind === 'quarter') AudioSys.SFX.quarter();
    else AudioSys.SFX.notebookPickup();
    UI.announce(I18n.t('ann.gotItem', { item: UI.itemName(it.kind) }));
    UI.updateHud();
    return true;
  }

  // drop an item onto the floor at (x, z)
  function dropItem(kind, x, z) {
    const group = GameRenderer.spriteGroup;
    const mat = new THREE.SpriteMaterial({ map: TextureGen.getIcon(kind) });
    const s = new THREE.Sprite(mat);
    s.scale.set(0.4, 0.4, 1);
    s.position.set(x, 0.22, z);
    group.add(s);
    items.push({ kind, x, z, alive: true, mesh: s });
  }

  return { init, all, pickup, dropItem };
})();

// ---------- chalk eraser clouds ----------

const CloudSystem = (() => {
  const clouds = [];

  function spawn(x, z) {
    clouds.push({ x, z, r: 1.5, life: 25, max: 25 });
    AudioSys.SFX.chalkPuff();
  }

  function update(dt, scene) {
    for (let i = clouds.length - 1; i >= 0; i--) {
      const c = clouds[i];
      c.life -= dt;
      c.mesh.material.opacity = Math.min(1, c.life / c.max) * 0.65;
      if (c.life <= 0) {
        GameRenderer.spriteGroup.remove(c.mesh);
        clouds.splice(i, 1);
      }
    }
  }

  function spawnWithMesh() {
    // creates the visual cloud mesh
  }

  function cloudsList() { return clouds; }

  function spawnVisual(x, z) {
    spawn(x, z);
    const c = clouds[clouds.length - 1];
    // make a soft cloud sprite via canvas
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const g = canvas.getContext('2d');
    const grad = g.createRadialGradient(32, 32, 4, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255,255,255,0.95)');
    grad.addColorStop(0.6, 'rgba(240,240,240,0.75)');
    grad.addColorStop(1, 'rgba(240,240,240,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    const s = new THREE.Sprite(mat);
    s.scale.set(3, 3, 1);
    s.position.set(x, 1.4, z);
    GameRenderer.spriteGroup.add(s);
    c.mesh = s;
  }

  return { spawn: spawnVisual, update, clouds: cloudsList };
})();
