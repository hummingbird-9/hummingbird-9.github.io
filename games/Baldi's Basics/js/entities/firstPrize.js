'use strict';

// 1st Prize: patrolling robot that charges the player when it sees them.
// Charge uses pathfinding (no more corner grinding); doors block its sight.
// Safety Scissors disable it for 15 seconds.

const FirstPrize = (() => {

  const WANDER_SPEED = 1.3;
  const CHARGE_SPEED = 4.8;
  const RADIUS = 0.3;

  const p = {
    x: 0, z: 0,
    state: 'wander', // wander | chase | disabled
    waypoint: null,
    pauseTimer: 1,
    disabledTimer: 0,
    beepTimer: 0,
    path: [],
    pathTimer: 0,
    stuck: null,
    sprite: null,
  };

  function init(scene) {
    const s = MapData.SPAWNS.firstprize;
    p.x = s.x; p.z = s.z;
    p.state = 'wander';
    p.waypoint = null;
    p.pauseTimer = 1;
    p.disabledTimer = 0;
    p.beepTimer = 0;
    p.path = [];
    p.pathTimer = 0;
    p.pushCooldown = 0;
    p.stuck = AIUtils.makeStuckDetector();
    p.sprite = GameRenderer.createCharacterSprite(SpriteGen.get('firstprize'), 0.72, 0.92);
    p.sprite.sprite.position.set(p.x, 0, p.z);
    GameRenderer.spriteGroup.add(p.sprite.sprite);
  }

  function seesPlayer(player) {
    return AIUtils.lineOfSight(p.x, p.z, player.x, player.z, { blockDoors: true, maxDist: 10 });
  }

  function moveToward(tx, tz, dt, speed) {
    AIUtils.stepToward(p, tx, tz, speed, dt, RADIUS);
  }

  function disable() {
    if (p.state === 'disabled') return false;
    p.state = 'disabled';
    p.disabledTimer = 15;
    AudioSys.SFX.robotDisabled();
    UI.announce(I18n.t('ann.prizeDisabled'));
    return true;
  }

  function update(dt, player, gameBusy) {
    p.beepTimer -= dt;
    if (p.beepTimer <= 0) {
      p.beepTimer = 1.2 + Math.random() * 1.5;
      if (p.state !== 'disabled' && !gameBusy) AudioSys.SFX.robotBeep(AudioSys.gainAt(p.x, p.z, 18));
    }

    if (p.state === 'disabled') {
      p.disabledTimer -= dt;
      p.sprite.sprite.position.y = 0.06 * Math.abs(Math.sin(performance.now() * 0.02));
      if (p.disabledTimer <= 0) {
        p.state = 'wander';
        p.sprite.sprite.position.y = 0;
        AudioSys.SFX.robotBeep(AudioSys.gainAt(p.x, p.z, 18));
      }
      updateSprite(dt);
      return;
    }

    if (gameBusy) {
      updateSprite(dt);
      return;
    }

    if (p.state === 'wander') {
      if (seesPlayer(player)) {
        p.state = 'chase';
        p.path = [];
        p.pathTimer = 0;
        p.stuck.init(p.x, p.z);
        AudioSys.SFX.robotHumStart(AudioSys.gainAt(p.x, p.z, 20));
        AudioSys.Voice.robot(I18n.t('voice.prizePush'), p.x, p.z);
      }
      if (p.pauseTimer > 0) {
        p.pauseTimer -= dt;
        updateSprite(dt);
        return;
      }
      if (p.waypoint) {
        const d = Math.hypot(p.waypoint.x - p.x, p.waypoint.z - p.z);
        if (d < 0.6) {
          p.waypoint = null;
          p.pauseTimer = 1.5 + Math.random() * 2.5;
        } else {
          moveToward(p.waypoint.x, p.waypoint.z, dt, WANDER_SPEED);
        }
      } else {
        p.waypoint = AIUtils.nearbyWaypoint(p.x, p.z, 8, 16);
      }
    } else {
      // chase: navigate along a path at high speed
      const d = Math.hypot(player.x - p.x, player.z - p.z);
      if (d < RADIUS + Player.RADIUS + 0.05) {
        // knockback with a cooldown (no endless wall-grinding push)
        p.pushCooldown -= dt;
        if (p.pushCooldown <= 0) {
          p.pushCooldown = 1.2;
          const dx = player.x - p.x, dz = player.z - p.z;
          const len = Math.max(0.01, Math.hypot(dx, dz));
          const knock = 0.38;
          const c1 = Player.collideCircle(player.x + dx / len * knock, player.z, Player.RADIUS);
          player.state.x = c1.x;
          const c2 = Player.collideCircle(player.x, player.z + dz / len * knock, Player.RADIUS);
          player.state.z = c2.z;
          AudioSys.SFX.robotPush(AudioSys.gainAt(p.x, p.z, 20));
        }
      }
      if (!seesPlayer(player)) {
        p.state = 'wander';
        p.waypoint = null;
        p.pauseTimer = 2;
      } else {
        p.pathTimer -= dt;
        if (p.pathTimer <= 0) {
          p.path = AIUtils.smoothPath(MapData.findPath(p.x, p.z, player.x, player.z, null, 4000) || []);
          p.pathTimer = 0.4;
          p.stuck.init(p.x, p.z);
        }
        if (p.stuck.update(dt, p.x, p.z)) {
          p.pathTimer = 0;
        } else if (p.path.length > 0) {
          const wp = p.path[0];
          if (Math.hypot(wp.x - p.x, wp.z - p.z) < 0.25) p.path.shift();
          else moveToward(wp.x, wp.z, dt, CHARGE_SPEED);
        } else {
          moveToward(player.x, player.z, dt, CHARGE_SPEED);
        }
      }
    }
    updateSprite(dt);
  }

  function updateSprite(dt) {
    if (p.state === 'chase') p.sprite.update(dt, 12);
    else if (p.state === 'wander') p.sprite.update(dt, 4);
    else p.sprite.setFrame(0);
    p.sprite.sprite.position.x = p.x;
    p.sprite.sprite.position.z = p.z;
    if (p.state !== 'disabled') {
      p.sprite.sprite.position.y = p.state === 'wander' && p.pauseTimer > 0
        ? Math.abs(Math.sin(performance.now() * 0.003)) * 0.012 : 0;
    }
  }

  function getPos() { return { x: p.x, z: p.z }; }
  function nudge(dx, dz) { p.x += dx; p.z += dz; }

  return { init, update, disable, getPos, nudge, get state() { return p.state; } };
})();
