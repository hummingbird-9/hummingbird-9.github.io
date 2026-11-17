'use strict';

// It's a Bully: blocks pinch points and steals a random item.
// Occasionally relocates between a few chokepoint spots.

const Bully = (() => {

  const MOVE_SPEED = 1.5;

  // chokepoint spots (replaced from MapData.BULLY_SPOTS on init)
  let SPOTS = [
    { x: 9.5, z: 15.5 },   // west hall
    { x: 23.5, z: 18.5 },  // center hall
    { x: 39.5, z: 27.5 },  // east hall
  ];

  const p = {
    x: 0, z: 0,
    alive: true,
    stealCooldown: 0,
    spotIndex: 0,
    relocateTimer: 25 + Math.random() * 15,
    moving: false,
    path: [],
    pinned: false,
    lastPx: 0, lastPz: 0,
    sprite: null,
  };

  function init(scene) {
    const s = MapData.SPAWNS.bully;
    SPOTS = MapData.BULLY_SPOTS || SPOTS;
    p.x = s.x; p.z = s.z;
    p.alive = true;
    p.stealCooldown = 0;
    p.spotIndex = 0;
    p.relocateTimer = 25 + Math.random() * 15;
    p.moving = false;
    p.path = [];
    p.pinned = false;
    p.lastPx = p.x; p.lastPz = p.z;
    p.sprite = GameRenderer.createCharacterSprite(SpriteGen.get('bully'), 0.72, 0.82);
    p.sprite.sprite.position.set(p.x, 0, p.z);
    GameRenderer.spriteGroup.add(p.sprite.sprite);
  }

  function update(dt, player, gameBusy) {
    if (p.stealCooldown > 0) p.stealCooldown -= dt;
    if (gameBusy) return;

    // relocation between chokepoints
    if (p.moving) {
      if (p.path.length > 0) {
        const wp = p.path[0];
        if (Math.hypot(wp.x - p.x, wp.z - p.z) < 0.25) p.path.shift();
        else AIUtils.stepToward(p, wp.x, wp.z, MOVE_SPEED, dt, 0.3);
      } else {
        p.moving = false;
        p.relocateTimer = 25 + Math.random() * 15;
      }
    } else {
      p.relocateTimer -= dt;
      if (p.relocateTimer <= 0) {
        const next = (p.spotIndex + 1 + Math.floor(Math.random() * (SPOTS.length - 1))) % SPOTS.length;
        p.spotIndex = next;
        const spot = SPOTS[next];
        p.path = AIUtils.smoothPath(MapData.findPath(p.x, p.z, spot.x, spot.z, null, 4000) || []);
        if (p.path && p.path.length > 0) {
          p.moving = true;
        } else {
          p.relocateTimer = 25;
        }
      }
    }

    const d = Math.hypot(player.x - p.x, player.z - p.z);

    // push player away from passing (stops once he is pinned against a wall)
    if (p.pinned) {
      // unpin once the player moves on their own
      const selfMoved = Math.hypot(player.x - p.lastPx, player.z - p.lastPz);
      if (selfMoved > 0.02) p.pinned = false;
      p.lastPx = player.x; p.lastPz = player.z;
    } else if (!p.moving && d < 0.75) {
      const before = { x: player.x, z: player.z };
      const dx = player.x - p.x, dz = player.z - p.z;
      const len = Math.max(0.01, Math.hypot(dx, dz));
      const nx = dx / len, nz = dz / len;
      // gentle, dt-scaled shove
      const c = Player.collideCircle(player.x + nx * 3.2 * dt, player.z, Player.RADIUS);
      player.state.x = c.x;
      const c2 = Player.collideCircle(player.x, player.z + nz * 3.2 * dt, Player.RADIUS);
      player.state.z = c2.z;
      if (Math.hypot(player.x - before.x, player.z - before.z) < 0.001) {
        p.pinned = true; // against a wall: stop pushing
        p.lastPx = player.x; p.lastPz = player.z;
      }
    } else {
      p.pinned = false;
    }

    if (!p.moving && d < 1.0 && p.stealCooldown <= 0 && Player.state.inv.length > 0) {
      p.stealCooldown = 20;
      const idx = Math.floor(Math.random() * Player.state.inv.length);
      const stolen = Player.state.inv.splice(idx, 1)[0];
      AudioSys.SFX.bullySteal();
      AudioSys.Voice.bully(I18n.t('voice.bullySteal'), p.x, p.z);
      UI.announce(I18n.t('ann.bullyStole', { item: UI.itemName(stolen) }));
      UI.updateHud(); // stolen item - refresh the item bar
    }
    p.sprite.update(dt, p.moving ? 6 : 3);
    p.sprite.sprite.position.set(p.x, 0, p.z);
  }

  function getPos() { return { x: p.x, z: p.z }; }

  return { init, update, getPos };
})();
