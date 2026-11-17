'use strict';

// Arts and Crafters: shy sock puppet. Before all 7 notebooks are solved he
// hides when approached. With 7 notebooks he hops off his desk and hunts the
// player; touching him teleports the player back to the school entrance.

const ArtsCrafters = (() => {

  const HUNT_SPEED = 2.5;
  const RADIUS = 0.25;
  const desk = () => MapData.SPAWNS.arts;   // his desk = the arts spawn (classroom F in classic)

  const p = {
    x: 0, z: 0, y: 0.55,
    state: 'shy',       // shy | hunt
    teleportCooldown: 0,
    hideTimer: 0,
    visible: true,
    path: [],
    pathTimer: 0,
    stuck: null,
    sprite: null,
  };

  function init(scene) {
    const s = MapData.SPAWNS.arts;
    p.x = s.x; p.z = s.z; p.y = s.y;
    p.state = 'shy';
    p.teleportCooldown = 0;
    p.hideTimer = 0;
    p.visible = true;
    p.path = [];
    p.pathTimer = 0;
    p.stuck = AIUtils.makeStuckDetector();
    p.sprite = GameRenderer.createCharacterSprite(SpriteGen.get('arts'), 0.60, 0.60);
    p.sprite.sprite.position.set(p.x, p.y, p.z);
    p.sprite.sprite.material.transparent = true;
    GameRenderer.spriteGroup.add(p.sprite.sprite);
  }

  function startHunting() {
    const s = desk();
    p.state = 'hunt';
    // hop off the desk onto the floor
    p.x = s.x;
    p.z = s.z + 1.2;
    p.y = 0;
    p.path = [];
    p.pathTimer = 0;
    p.stuck.init(p.x, p.z);
    AudioSys.SFX.teleport();
    UI.announce(I18n.t('ann.artsHunting'));
  }

  function returnToDesk() {
    const s = desk();
    p.state = 'shy';
    p.x = s.x;
    p.z = s.z;
    p.y = s.y;
    p.path = [];
    p.visible = true;
    p.hideTimer = 0;
  }

  function update(dt, player, gameBusy) {
    if (p.teleportCooldown > 0) p.teleportCooldown -= dt;

    if (p.state === 'hunt') {
      if (!gameBusy) {
        const d = Math.hypot(player.x - p.x, player.z - p.z);
        const touch = d < 0.62 && AIUtils.lineOfSight(p.x, p.z, player.x, player.z, { blockDoors: true });
        if (touch && p.teleportCooldown <= 0) {
          p.teleportCooldown = 30;
          GameEvents.emit('artsTeleport');
          returnToDesk();
        } else {
          p.pathTimer -= dt;
          if (p.pathTimer <= 0) {
            p.path = AIUtils.smoothPath(MapData.findPath(p.x, p.z, player.x, player.z, null, 4000) || []);
            p.pathTimer = 0.5;
            p.stuck.init(p.x, p.z);
          }
          if (p.stuck.update(dt, p.x, p.z)) {
            p.pathTimer = 0;
          } else if (p.path.length > 0) {
            const wp = p.path[0];
            if (Math.hypot(wp.x - p.x, wp.z - p.z) < 0.25) p.path.shift();
            else AIUtils.stepToward(p, wp.x, wp.z, HUNT_SPEED, dt, RADIUS);
          } else {
            AIUtils.stepToward(p, player.x, player.z, HUNT_SPEED, dt, RADIUS);
          }
        }
      }
      p.sprite.sprite.position.set(p.x, p.y, p.z);
      p.sprite.update(dt, 8);
      return;
    }

    // shy state (also the "waiting on desk" state)
    if (p.hideTimer > 0) {
      p.hideTimer -= dt;
      if (p.hideTimer <= 0) {
        p.visible = true;
        AudioSys.SFX.teleport();
      }
    }
    p.sprite.sprite.position.set(p.x, p.y, p.z);

    if (!gameBusy) {
      const allSolved = Notebooks.getSolvedCount() >= 7;
      if (allSolved && p.teleportCooldown <= 0) {
        // with 7 notebooks he relentlessly comes for you
        startHunting();
        return;
      }
      if (p.visible) {
        const d = Math.hypot(player.x - p.x, player.z - p.z);
        if (d < 2.2 && p.teleportCooldown <= 0) {
          // shy: he hides for a while
          p.teleportCooldown = 20;
          p.hideTimer = 3 + Math.random() * 2;
          p.visible = false;
          AudioSys.SFX.teleport();
        }
      }
    }
    p.sprite.sprite.visible = p.visible;
    p.sprite.update(dt, 4);
  }

  function getPos() { return { x: p.x, z: p.z }; }

  return { init, update, getPos, get state() { return p.state; } };
})();
