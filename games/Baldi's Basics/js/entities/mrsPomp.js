'use strict';

// Mrs. Pomp: halls teacher. Catches the player and drags them to her
// classroom for a subtraction lesson (3 correct answers to leave).
// Bounded patrol, path smoothing, fast chase replanning.

const MrsPomp = (() => {

  const PATROL_SPEED = 2.1;
  const CHASE_SPEED = 3.4;
  const RADIUS = 0.28;

  const p = {
    x: 0, z: 0,
    state: 'patrol', // patrol | chase
    waypoint: null,
    path: [],
    pauseTimer: 1,
    cooldown: 0,
    sprite: null,
    moving: false,
    stuck: null,
  };

  function init(scene) {
    const s = MapData.SPAWNS.mrsPomp;
    p.x = s.x; p.z = s.z;
    p.state = 'patrol';
    p.waypoint = null;
    p.path = [];
    p.pauseTimer = 1;
    p.cooldown = 0;
    p.moving = false;
    p.stuck = AIUtils.makeStuckDetector();
    p.sprite = GameRenderer.createCharacterSprite(SpriteGen.get('mrsPomp'), 0.73, 1.12);
    p.sprite.sprite.position.set(p.x, 0, p.z);
    GameRenderer.spriteGroup.add(p.sprite.sprite);
  }

  function seesPlayer(player) {
    return AIUtils.lineOfSight(p.x, p.z, player.x, player.z, { blockDoors: true, maxDist: 9 });
  }

  function moveToward(tx, tz, dt, speed) {
    const dx = tx - p.x, dz = tz - p.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.01) return false;
    AIUtils.stepToward(p, tx, tz, speed, dt, RADIUS);
    p.moving = Math.hypot(tx - p.x, tz - p.z) > 0.02;
    p.yaw = Math.atan2(-dx, -dz);
    return true;
  }

  function update(dt, player, gameBusy) {
    if (p.cooldown > 0) p.cooldown -= dt;

    if (gameBusy) {
      p.moving = false;
      updateSprite(dt);
      return;
    }

    if (p.state === 'patrol') {
      if (p.cooldown <= 0 && seesPlayer(player)) {
        p.state = 'chase';
        p.path = [];
        p.stuck.init(p.x, p.z);
        AudioSys.SFX.pompHappy(AudioSys.gainAt(p.x, p.z, 20));
        AudioSys.Voice.pomp(I18n.t('voice.pompSee'), p.x, p.z);
        UI.announce(I18n.t('ann.pompSees'));
      }
      if (p.pauseTimer > 0) {
        p.pauseTimer -= dt;
        p.moving = false;
        if (p.pauseTimer <= 0 && p.waypoint) {
          p.path = AIUtils.smoothPath(MapData.findPath(p.x, p.z, p.waypoint.x, p.waypoint.z, null, 4000) || []);
          p.stuck.init(p.x, p.z);
        }
        updateSprite(dt);
        return;
      }
      if (p.waypoint) {
        const d = Math.hypot(p.waypoint.x - p.x, p.waypoint.z - p.z);
        if (d < 0.5) {
          p.waypoint = null;
          p.pauseTimer = 1.5 + Math.random() * 2.5;
          updateSprite(dt);
          return;
        }
        if (p.stuck.update(dt, p.x, p.z)) {
          p.waypoint = AIUtils.nearbyWaypoint(p.x, p.z, 8, 16);
          p.path = AIUtils.smoothPath(MapData.findPath(p.x, p.z, p.waypoint.x, p.waypoint.z, null, 4000) || []);
          p.stuck.init(p.x, p.z);
          return;
        }
        if (p.path.length > 0) {
          const wp = p.path[0];
          if (Math.hypot(wp.x - p.x, wp.z - p.z) < 0.2) p.path.shift();
          else if (!moveToward(wp.x, wp.z, dt, PATROL_SPEED)) p.path = [];
        } else {
          p.path = AIUtils.smoothPath(MapData.findPath(p.x, p.z, p.waypoint.x, p.waypoint.z, null, 4000) || []);
          if (!p.path || p.path.length === 0) { p.waypoint = null; p.pauseTimer = 1; }
        }
      } else {
        p.waypoint = AIUtils.nearbyWaypoint(p.x, p.z, 8, 16);
      }
    } else {
      // chase
      const d = Math.hypot(player.x - p.x, player.z - p.z);
      if (d < 0.7 && seesPlayer(player)) {
        GameEvents.emit('pompCaught');
        p.state = 'patrol';
        p.waypoint = null;
        p.pauseTimer = 3;
        p.cooldown = 25;
        return;
      }
      if (!seesPlayer(player)) {
        // keep going to the last seen spot briefly, then give up
        p.lostTimer = (p.lostTimer || 0) + dt;
        if (p.lostTimer > 2.5) {
          p.state = 'patrol';
          p.waypoint = null;
          p.pauseTimer = 1.5;
          return;
        }
      } else {
        p.lostTimer = 0;
      }
      p.pathTimer = (p.pathTimer || 0) - dt;
      if (!p.pathTimer || p.pathTimer <= 0) {
        p.path = AIUtils.smoothPath(MapData.findPath(p.x, p.z, player.x, player.z, null, 4000) || []);
        p.pathTimer = 0.45;
        p.stuck.init(p.x, p.z);
      }
      if (p.stuck.update(dt, p.x, p.z)) {
        p.pathTimer = 0;
      } else if (p.path.length > 0) {
        const wp = p.path[0];
        if (Math.hypot(wp.x - p.x, wp.z - p.z) < 0.2) p.path.shift();
        else moveToward(wp.x, wp.z, dt, CHASE_SPEED);
      } else {
        moveToward(player.x, player.z, dt, CHASE_SPEED);
      }
    }
    updateSprite(dt);
  }

  function updateSprite(dt) {
    if (p.moving) p.sprite.update(dt, 7);
    else { p.sprite.setFrame(0); p.sprite.timer = 0; }
    const mbreath = p.moving ? 0 : Math.abs(Math.sin(performance.now() * 0.002)) * 0.018;
    p.sprite.sprite.position.set(p.x, mbreath, p.z);
  }

  function getPos() { return { x: p.x, z: p.z }; }
  function nudge(dx, dz) { p.x += dx; p.z += dz; }
  function getWaypoint() { return p.waypoint ? { x: p.waypoint.x, z: p.waypoint.z } : null; }

  return { init, update, getPos, nudge, getWaypoint };
})();
