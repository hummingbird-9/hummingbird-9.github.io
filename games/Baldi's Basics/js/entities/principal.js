'use strict';

// Principal of the Thing: patrols halls, enforces rules, sends you to detention.
// Bounded patrol, path smoothing, persistent rule-chase.

const Principal = (() => {

  const RADIUS = 0.28;
  const PATROL_SPEED = 1.5;
  const CHASE_SPEED = 2.05;

  const p = {
    x: 0, z: 0, yaw: 0,
    state: 'patrol', // patrol | chase
    waypoint: null,
    path: [],
    pauseTimer: 1,
    chaseTimer: 0,
    infractions: 0,
    sprite: null,
    moving: false,
    whistleTimer: 0,
    stuck: null,
  };

  function init(scene) {
    const s = MapData.SPAWNS.principal;
    p.x = s.x; p.z = s.z; p.yaw = 0;
    p.state = 'patrol';
    p.waypoint = null;
    p.path = [];
    p.pauseTimer = 1;
    p.chaseTimer = 0;
    p.infractions = 0;
    p.moving = false;
    p.stuck = AIUtils.makeStuckDetector();
    p.sprite = GameRenderer.createCharacterSprite(SpriteGen.get('principal'), 0.78, 1.12);
    p.sprite.sprite.position.set(p.x, 0, p.z);
    GameRenderer.spriteGroup.add(p.sprite.sprite);
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

  function seesPlayer(player) {
    return AIUtils.lineOfSight(p.x, p.z, player.x, player.z, { blockDoors: true, maxDist: 9 });
  }

  function playerBreakingRules(player) {
    const inFaculty = MapData.getRoom(Math.floor(player.x), Math.floor(player.z)) === 'faculty';
    const running = Player.isSprinting();
    return inFaculty || running;
  }

  function giveDetention(player, dt) {
    // escalation: 15,30,45,60,99,99...
    const times = [15, 30, 45, 60, 99, 99];
    const t = times[Math.min(p.infractions, times.length - 1)];
    p.infractions++;
    GameEvents.emit('detention', { time: t });
  }

  function update(dt, player, gameBusy) {
    if (gameBusy) {
      p.moving = false;
      updateSprite(dt);
      return;
    }

    if (p.whistleTimer > 0) p.whistleTimer -= dt;

    if (p.state === 'patrol') {
      // rule check
      if (playerBreakingRules(player) && seesPlayer(player)) {
        p.state = 'chase';
        p.chaseTimer = 14;
        p.path = [];
        p.stuck.init(p.x, p.z);
        p.whistleTimer = 0; // whistle right away
        AudioSys.SFX.whistle(AudioSys.gainAt(p.x, p.z, 24));
        AudioSys.Voice.principal(I18n.t('voice.principalRun'), p.x, p.z);
        UI.announce(I18n.t('ann.principalSees'));
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
          p.pauseTimer = 2 + Math.random() * 3;
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
      // chase player
      p.chaseTimer -= dt;
      // periodic whistle while chasing (like the original)
      p.whistleTimer -= dt;
      if (p.whistleTimer <= 0) {
        p.whistleTimer = 2.5 + Math.random() * 1.5;
        AudioSys.SFX.whistle(AudioSys.gainAt(p.x, p.z, 24));
      }
      const d = Math.hypot(player.x - p.x, player.z - p.z);
      if (d < 0.75 && seesPlayer(player)) {
        giveDetention(player, dt);
        p.state = 'patrol';
        p.waypoint = null;
        p.pauseTimer = 4;
        return;
      }
      // keep chasing while the rule stands and the player is in sight
      if (playerBreakingRules(player) && seesPlayer(player)) {
        p.chaseTimer = Math.max(p.chaseTimer, 3.5);
      } else if (!playerBreakingRules(player)) {
        p.chaseTimer = Math.min(p.chaseTimer, 2.5);
      }
      if (p.chaseTimer <= 0) {
        p.state = 'patrol';
        p.waypoint = null;
        p.pauseTimer = 2;
        return;
      }
      // path to player, replan often
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
    if (p.moving) p.sprite.update(dt, 5);
    else { p.sprite.setFrame(0); p.sprite.timer = 0; }
    const pbreath = p.moving ? 0 : Math.abs(Math.sin(performance.now() * 0.002)) * 0.018;
    p.sprite.sprite.position.set(p.x, pbreath, p.z);
  }

  function resetInfractions() { p.infractions = 0; }
  function getPos() { return { x: p.x, z: p.z }; }
  function nudge(dx, dz) { p.x += dx; p.z += dz; }
  function getWaypoint() { return p.waypoint ? { x: p.waypoint.x, z: p.waypoint.z } : null; }

  return { init, update, resetInfractions, seesPlayer, getPos, nudge, getWaypoint };
})();
