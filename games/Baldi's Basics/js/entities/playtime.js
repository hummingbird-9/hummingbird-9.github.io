'use strict';

// Playtime: jump rope girl. Initiates a 5-jump minigame; failing loses an item.
// Missing a full rope cycle now counts as a failure (no stalling forever),
// and she roams a small area when idle.

const Playtime = (() => {

  const ROAM_SPEED = 1.2;

  const p = {
    x: 0, z: 0,
    homeX: 0, homeZ: 0,
    active: false,     // minigame in progress
    available: true,   // rope not cut
    cooldown: 0,
    sprite: null,
    jumpPhase: 0,      // 0..1 rope cycle
    jumpsLeft: 5,
    failTimer: 0,
    bounce: 0,
    jumpedThisCycle: false,
    roamTarget: null,
    roamTimer: 0,
    sadTarget: null,
  };

  function init(scene) {
    const s = MapData.SPAWNS.playtime;
    p.x = s.x; p.z = s.z;
    p.homeX = s.x; p.homeZ = s.z;
    p.active = false;
    p.available = true;
    p.cooldown = 2;
    p.jumpPhase = 0;
    p.jumpsLeft = 5;
    p.failTimer = 0;
    p.jumpedThisCycle = false;
    p.roamTarget = null;
    p.roamTimer = 0;
    p.sadTarget = null;
    p.sprite = GameRenderer.createCharacterSprite(SpriteGen.get('playtime'), 0.57, 0.78);
    p.sprite.sprite.position.set(p.x, 0, p.z);
    GameRenderer.spriteGroup.add(p.sprite.sprite);
  }

  function startGame() {
    if (!p.available) return false;
    if (p.active || p.cooldown > 0) return false;
    p.active = true;
    p.jumpsLeft = 5;
    p.jumpPhase = 0;
    p.failTimer = 0;
    p.jumpedThisCycle = false;
    AudioSys.Voice.playtime(I18n.t('voice.playtimeHi'), p.x, p.z);
    UI.announce(I18n.t('ann.playtimePrompt'));
    UI.centerPrompt(I18n.t('center.playtime'), 2800);
    return true;
  }

  // a walkable roam target near home (keeps her out of fences/walls)
  function pickWalkableRoamTarget() {
    for (let i = 0; i < 10; i++) {
      const ang = Math.random() * Math.PI * 2;
      const dist = 1 + Math.random() * 2.5;
      const x = p.homeX + Math.cos(ang) * dist;
      const z = p.homeZ + Math.sin(ang) * dist;
      const tx = Math.floor(x), tz = Math.floor(z);
      if (MapData.isWalkableFloor(MapData.tile(tx, tz))) {
        return { x, z };
      }
    }
    return { x: p.homeX, z: p.homeZ };
  }

  function cutRope() {
    if (!p.available) return false;
    p.available = false;
    p.active = false;
    // wander off to a sad corner away from the player
    const away = Player.getPos();
    const dx = p.x - away.x, dz = p.z - away.z;
    const len = Math.max(0.1, Math.hypot(dx, dz));
    p.sadTarget = {
      x: p.homeX + (dx / len) * 3.5 + (Math.random() - 0.5),
      z: p.homeZ + (dz / len) * 3.5 + (Math.random() - 0.5),
    };
    AudioSys.SFX.scissors();
    AudioSys.Voice.playtime(I18n.t('voice.playtimeSad'), p.x, p.z);
    UI.announce(I18n.t('ann.ropeCut'));
    GameEvents.emit('playtimeRopeCut');
    return true;
  }

  function onJumpInput() {
    if (!p.active) return;
    // rope at bottom when phase in [0.35, 0.65] (jump zone)
    const zone = p.jumpPhase >= 0.3 && p.jumpPhase <= 0.72;
    if (zone) {
      p.jumpsLeft--;
      p.jumpedThisCycle = true;
      p.bounce = 0.25;
      AudioSys.SFX.jumpRope();
      if (p.jumpsLeft <= 0) {
        finish(true);
        return;
      }
    } else {
      finish(false);
    }
  }

  function finish(success) {
    p.active = false;
    p.cooldown = success ? 6 : 8;
    if (success) {
      AudioSys.Voice.playtime(I18n.t('voice.playtimeWin'), p.x, p.z);
      UI.announce(I18n.t('ann.playtimeWin'));
    } else {
      // steal a random item
      AudioSys.SFX.jumpRopeFail();
      AudioSys.Voice.playtime(I18n.t('voice.playtimeTake'), p.x, p.z);
      const inv = Player.state.inv;
      if (inv.length > 0) {
        const idx = Math.floor(Math.random() * inv.length);
        const stolen = inv.splice(idx, 1)[0];
        UI.announce(I18n.t('ann.playtimeStole', { item: UI.itemName(stolen) }));
      } else {
        UI.announce(I18n.t('ann.playtimeFail'));
      }
      UI.updateHud(); // stolen item - refresh the item bar
    }
    UI.hideJumpUI();
  }

  function update(dt, player, gameBusy) {
    if (p.cooldown > 0) p.cooldown -= dt;
    if (p.bounce > 0) p.bounce -= dt;

    if (!gameBusy && !p.active && p.available && p.cooldown <= 0) {
      const d = Math.hypot(player.x - p.x, player.z - p.z);
      if (d < 4.0) {
        startGame();
      }
    }

    if (p.active) {
      // rope cycle
      const prevPhase = p.jumpPhase;
      p.jumpPhase = (p.jumpPhase + dt * 1.5) % 1;
      // cycle completed without a jump -> miss -> failure
      if (prevPhase > p.jumpPhase) {
        if (!p.jumpedThisCycle) {
          finish(false);
          p.sprite.sprite.position.set(p.x, 0, p.z);
          return;
        }
        p.jumpedThisCycle = false;
      }
    } else if (!gameBusy) {
      // sad walk after the rope was cut, otherwise idle roaming
      if (!p.available && p.sadTarget) {
        const d = Math.hypot(p.sadTarget.x - p.x, p.sadTarget.z - p.z);
        if (d < 0.3) p.sadTarget = null;
        else AIUtils.stepToward(p, p.sadTarget.x, p.sadTarget.z, ROAM_SPEED, dt, 0.25);
      } else if (p.available) {
        p.roamTimer -= dt;
        if (p.roamTimer <= 0) {
          p.roamTimer = 2.5 + Math.random() * 2.5;
          p.roamTarget = pickWalkableRoamTarget();
        }
        if (p.roamTarget) {
          const d = Math.hypot(p.roamTarget.x - p.x, p.roamTarget.z - p.z);
          if (d < 0.3) {
            p.roamTarget = null;
          } else {
            // stuck against a fence/wall: pick a new target
            if (p.stuckTimer === undefined) p.stuckTimer = 0;
            const before = { x: p.x, z: p.z };
            AIUtils.stepToward(p, p.roamTarget.x, p.roamTarget.z, ROAM_SPEED, dt, 0.25);
            if (Math.hypot(p.x - before.x, p.z - before.z) < 0.002) {
              p.stuckTimer += dt;
              if (p.stuckTimer > 1.2) {
                p.stuckTimer = 0;
                p.roamTarget = null;
              }
            } else {
              p.stuckTimer = 0;
            }
          }
        }
      }
    }

    // idle bounce
    const idle = !p.active;
    p.sprite.sprite.position.set(p.x, 0, p.z);
    if (idle) {
      p.sprite.update(dt, 3);
    } else {
      p.sprite.sprite.position.y = Math.abs(Math.sin(p.jumpPhase * Math.PI)) * 0.12 + (p.bounce > 0 ? p.bounce : 0);
      p.sprite.setFrame(0);
    }
  }

  // abruptly end the minigame (used when the player gets dragged away)
  function forceEnd() {
    if (!p.active) return;
    p.active = false;
    p.cooldown = 5;
    UI.hideJumpUI();
  }

  function getPos() { return { x: p.x, z: p.z }; }
  function isActive() { return p.active; }
  function isAvailable() { return p.available; }
  function ropePhase() { return p.jumpPhase; }
  function jumpsLeft() { return p.jumpsLeft; }

  return { init, update, cutRope, onJumpInput, forceEnd, getPos, isActive, isAvailable, ropePhase, jumpsLeft };
})();
