'use strict';

// Baldi: wander / math / chase AI with ruler slaps, hearing and door opening.
// Uses shared AI utilities for pathing, LOS, bounded wandering and stuck recovery.

const Baldi = (() => {

  const RADIUS = 0.28;

  const b = {
    x: 0, z: 0, yaw: 0,
    state: 'wander',        // wander | math | chase | frozen
    speed: 2.7,
    wrongCount: 0,
    path: [],
    pathTimer: 0,
    waypoint: null,
    pauseTimer: 0,
    slapTimer: 0,
    slapTotal: 0,
    hearing: false,
    frozenTimer: 0,
    distracted: false,      // detention / pomp event
    hearTarget: null,
    hearCooldown: 0,
    stuck: null,
    sprite: null,
    normalFrames: null,
    angryFrames: null,
    moving: false,
    endless: false,
  };

  function init(scene) {
    const p = MapData.SPAWNS.baldi;
    b.x = p.x; b.z = p.z; b.yaw = 0;
    b.state = 'wander';
    b.wrongCount = 0;
    b.path = [];
    b.waypoint = null;
    b.pauseTimer = 1;
    b.slapTimer = 0;
    b.slapTotal = 0;
    b.hearing = false;
    b.frozenTimer = 0;
    b.distracted = false;
    b.hearTarget = null;
    b.hearCooldown = 0;
    b.moving = false;
    b.allWrongFired = false;
    b.endless = Game.mode === 'endless';
    b.speed = b.endless ? 3.3 : 2.7;
    b.stuck = AIUtils.makeStuckDetector();

    b.normalFrames = SpriteGen.get('baldi');
    b.angryFrames = SpriteGen.get('baldi_angry');
    b.sprite = GameRenderer.createCharacterSprite(b.normalFrames, 0.71, 1.30);
    b.sprite.sprite.position.set(b.x, 0, b.z);
    GameRenderer.spriteGroup.add(b.sprite.sprite);
  }

  function resetAnger() {
    b.wrongCount = 0;
    b.hearing = false;
    b.slapTotal = 0;
    b.state = 'wander';
  }

  function wrongAnswer() {
    b.wrongCount++;
    if (b.state !== 'frozen') b.state = 'chase';
    b.path = [];
    b.hearTarget = null;
    if (b.wrongCount >= 21 && !b.allWrongFired) {
      // hidden ending: every single problem answered wrong
      b.allWrongFired = true;
      GameEvents.emit('allWrong');
    }
    if (b.wrongCount === 1) {
      // the classic first-wrong-answer line
      AudioSys.Voice.baldi(I18n.t('voice.angrier'), b.x, b.z);
    } else {
      AudioSys.Voice.baldi(I18n.t(['voice.uhoh', 'voice.wrong1', 'voice.wrong2', 'voice.wrong3'][Math.floor(Math.random() * 4)]), b.x, b.z);
    }
    AudioSys.SFX.uhoh();
  }

  function onNotebookSolved() {
    // Baldi only gets angry from wrong answers, but finishing all notebooks
    // while already angry keeps the chase going.
    if (b.state !== 'frozen' && b.wrongCount > 0) b.state = 'chase';
    b.path = [];
  }

  function currentSpeed() {
    const wrongBonus = b.wrongCount * (b.endless ? 0.55 : 0.5);
    let base = Math.min(13, b.speed + wrongBonus);
    if (Notebooks.getSolvedCount() >= 7) {
      // endgame rage: all notebooks collected - super speed
      base *= 2.2;
    }
    base = Math.min(15.5, base);
    return base * (b.inCloud ? 0.4 : 1);
  }

  function inClouds() {
    for (const c of CloudSystem.clouds()) {
      const dx = b.x - c.x, dz = b.z - c.z;
      if (dx * dx + dz * dz < c.r * c.r) return true;
    }
    return false;
  }

  function hearDoor(door) {
    if (!b.hearing) return;
    if (b.state !== 'chase' && b.state !== 'math') return;
    if (b.hearCooldown > 0) return;
    // only nearby doors are loud enough to distract him mid-chase
    const hd = Math.hypot((door.x + 0.5) - b.x, (door.z + 0.5) - b.z);
    if (hd > 9) return;
    b.hearTarget = { x: door.x + 0.5, z: door.z + 0.5, t: 2.5 };
    b.hearCooldown = 4;
    b.path = [];
  }

  function pickWanderTarget() {
    // wander to a nearby waypoint (feels like roaming, not teleporting)
    const wp = AIUtils.nearbyWaypoint(b.x, b.z, 8, 16);
    b.waypoint = wp;
    b.path = AIUtils.smoothPath(MapData.findPath(b.x, b.z, wp.x, wp.z, null, 4000) || []);
    b.pauseTimer = 0;
  }

  function canSeePlayer(player) {
    return AIUtils.lineOfSight(b.x, b.z, player.x, player.z, { blockClouds: true, maxDist: 11 });
  }

  function setTarget(tx, tz) {
    b.path = AIUtils.smoothPath(MapData.findPath(b.x, b.z, tx, tz, null, 4000) || []);
    if (!b.path || b.path.length === 0) {
      // fall back to direct line when pathing fails
      b.path = [{ x: tx, z: tz }];
    }
  }

  function followPath(dt) {
    if (b.path.length === 0) return false;
    const wp = b.path[0];
    const d = Math.hypot(wp.x - b.x, wp.z - b.z);
    if (d < 0.24) {
      b.path.shift();
      return true;
    }
    AIUtils.stepToward(b, wp.x, wp.z, currentSpeed(), dt, RADIUS);
    b.moving = true;
    const dx = wp.x - b.x, dz = wp.z - b.z;
    b.yaw = Math.atan2(-dx, -dz);
    return true;
  }

  function moveToward(tx, tz, dt) {
    AIUtils.stepToward(b, tx, tz, currentSpeed(), dt, RADIUS);
    const dx = tx - b.x, dz = tz - b.z;
    b.moving = Math.hypot(dx, dz) > 0.02;
    b.yaw = Math.atan2(-dx, -dz);
  }

  function update(dt, player) {
    b.inCloud = inClouds();

    // frozen (alarm clock)
    if (b.frozenTimer > 0) {
      b.frozenTimer -= dt;
      b.moving = false;
      if (b.frozenTimer <= 0) {
        b.state = b.wrongCount > 0 ? 'chase' : 'wander';
        b.path = [];
      }
      updateSprite(dt);
      return;
    }

    if (b.distracted) {
      // detention / pomp event: wander idly
      wanderUpdate(dt);
      updateSprite(dt);
      return;
    }

    if (b.hearCooldown > 0) b.hearCooldown -= dt;

    // alarm clock check
    if (player.state.inv.includes('clock') && b.state === 'chase') {
      const d = dist(player.x, player.z);
      if (d < 3.8) {
        // ring!
        b.frozenTimer = 30;
        b.state = 'frozen';
        player.state.inv.splice(player.state.inv.indexOf('clock'), 1);
        UI.updateHud(); // clock consumed - refresh the item bar
        AudioSys.SFX.alarmRing();
        UI.announce(I18n.t('ann.alarm'));
        UI.centerPrompt(I18n.t('center.alarm'), 3000);
        GameEvents.emit('alarmClock');
        updateSprite(dt);
        return;
      }
    }

    switch (b.state) {
      case 'wander':
        wanderUpdate(dt);
        break;
      case 'math': {
        // approach player, wait nearby
        const d = dist(player.x, player.z);
        if (d > 2.6) {
          b.pathTimer -= dt;
          if (b.pathTimer <= 0) {
            setTarget(player.x, player.z);
            b.pathTimer = 0.8;
            b.stuck.init(b.x, b.z);
          }
          if (!followPath(dt)) moveToward(player.x, player.z, dt);
        } else {
          b.moving = false;
        }
        break;
      }
      case 'chase': {
        chaseUpdate(dt, player);
        break;
      }
    }

    updateSprite(dt);
  }

  function wanderUpdate(dt) {
    if (b.pauseTimer > 0) {
      b.pauseTimer -= dt;
      b.moving = false;
      if (b.pauseTimer <= 0 && b.waypoint) {
        b.path = AIUtils.smoothPath(MapData.findPath(b.x, b.z, b.waypoint.x, b.waypoint.z, null, 4000) || []);
        b.stuck.init(b.x, b.z);
      }
      return;
    }
    if (b.waypoint) {
      const d = Math.hypot(b.waypoint.x - b.x, b.waypoint.z - b.z);
      if (d < 0.4) {
        b.waypoint = null;
        b.pauseTimer = 1 + Math.random() * 2.5;
        return;
      }
      if (b.stuck.update(dt, b.x, b.z)) {
        // blocked: pick another target
        pickWanderTarget();
        b.stuck.init(b.x, b.z);
        return;
      }
      if (b.path.length > 0) {
        if (!followPath(dt)) pickWanderTarget();
      } else {
        b.path = AIUtils.smoothPath(MapData.findPath(b.x, b.z, b.waypoint.x, b.waypoint.z, null, 4000) || []);
        if (!b.path || b.path.length === 0) pickWanderTarget();
      }
    } else {
      pickWanderTarget();
    }
  }

  function chaseUpdate(dt, player) {
    const d = dist(player.x, player.z);

    // slapping
    b.slapTimer -= dt;
    if (b.slapTimer <= 0) {
      b.slapTimer = clamp(d * 0.085, 0.17, 0.8);
      AudioSys.SFX.slap(1 - Math.min(0.4, d * 0.03), AudioSys.gainAt(b.x, b.z, 22));
      b.slapTotal += b.slapTimer;
      if (b.slapTotal > 5.5) b.hearing = true;
      b.slapBob = 0.04; // slap bob
    } else if (b.slapBob > 0) {
      b.slapBob = Math.max(0, b.slapBob - dt * 0.3);
    }

    // catch! (only with a clear line of sight - no grabbing through closed doors)
    if (d < 0.52 && AIUtils.lineOfSight(b.x, b.z, player.x, player.z, { blockDoors: true })) {
      GameEvents.emit('baldiCaught');
      return;
    }

    const sees = canSeePlayer(player);

    // hearing: only respond when the player is NOT in plain sight
    if (b.hearTarget) {
      if (sees && d < 9) {
        // player visible: forget the door sound and pursue directly
        b.hearTarget = null;
        b.path = [];
      } else {
        b.hearTarget.t -= dt;
        const hd = Math.hypot(b.hearTarget.x - b.x, b.hearTarget.z - b.z);
        if (hd < 0.6 || b.hearTarget.t < 0) {
          b.hearTarget = null;
          b.path = [];
        } else {
          if (b.path.length === 0) {
            b.path = AIUtils.smoothPath(MapData.findPath(b.x, b.z, b.hearTarget.x, b.hearTarget.z, null, 4000) || []);
            b.stuck.init(b.x, b.z);
          }
          followPath(dt);
          return;
        }
      }
    }

    b.pathTimer -= dt;
    if (b.pathTimer <= 0) {
      b.pathTimer = 0.55;
      if (sees && d < 9) {
        // direct pursuit (still re-route if stuck)
        if (b.stuck.update(dt, b.x, b.z)) {
          setTarget(player.x, player.z);
          b.stuck.init(b.x, b.z);
        } else {
          b.path = [];
          moveToward(player.x, player.z, dt);
        }
      } else {
        setTarget(player.x, player.z);
        b.stuck.init(b.x, b.z);
      }
    } else if (b.path.length > 0) {
      if (b.stuck.update(dt, b.x, b.z)) {
        b.pathTimer = 0; // force replan next frame
      } else {
        followPath(dt);
      }
    } else if (sees && d < 9) {
      if (b.stuck.update(dt, b.x, b.z)) {
        setTarget(player.x, player.z);
        b.stuck.init(b.x, b.z);
      } else {
        moveToward(player.x, player.z, dt);
      }
    } else {
      moveToward(player.x, player.z, dt);
    }
  }

  function dist(px, pz) {
    return Math.hypot(px - b.x, pz - b.z);
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function updateSprite(dt) {
    const angry = b.wrongCount > 0 && b.state === 'chase' && b.frozenTimer <= 0;
    const frames = angry ? b.angryFrames : b.normalFrames;
    b.sprite.setFrames(frames);
    if (b.moving) {
      b.sprite.update(dt, b.wrongCount > 0 ? 10 : 7);
    } else {
      b.sprite.setFrame(0);
      b.sprite.timer = 0;
    }
    b.sprite.sprite.position.x = b.x;
    b.sprite.sprite.position.z = b.z;
    const breath = b.moving ? 0 : Math.abs(Math.sin(performance.now() * 0.0025)) * 0.02;
    const jitter = b.frozenTimer > 0 ? Math.abs(Math.sin(performance.now() * 0.03)) * 0.03 : 0;
    b.sprite.sprite.position.y = breath + (b.slapBob || 0) + jitter;
  }

  // called from main when player opens pad
  function onPadOpened() {
    if (b.state === 'wander' || b.state === 'chase') {
      b.state = 'math';
      b.path = [];
      b.pathTimer = 0;
    }
  }

  function onPadClosed() {
    if (b.state === 'math') {
      b.state = b.wrongCount > 0 ? 'chase' : 'wander';
      b.path = [];
      b.pathTimer = 0;
    }
  }

  function setDistracted(v) { b.distracted = v; }
  function getPos() { return { x: b.x, z: b.z }; }
  function getSpeed() { return currentSpeed(); }
  function nudge(dx, dz) { b.x += dx; b.z += dz; }
  function getWaypoint() { return b.waypoint ? { x: b.waypoint.x, z: b.waypoint.z } : null; }
  function getHearTarget() { return b.hearTarget; }
  function setHearing(v) { b.hearing = v; if (v) { b.slapTotal = 999; b.hearCooldown = 0; } }

  return {
    init, update, resetAnger, wrongAnswer, onNotebookSolved, hearDoor,
    onPadOpened, onPadClosed, setDistracted, getPos, nudge,
    getWaypoint, getHearTarget, setHearing, getSpeed,
    get wrongCount() { return b.wrongCount; },
    get state() { return b.state; },
  };
})();
