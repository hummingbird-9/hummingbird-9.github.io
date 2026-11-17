'use strict';

// Player: movement, collision, interaction, inventory, item effects.

const Player = (() => {

  const WALK_SPEED = 2.9;
  const BSODA_SPEED = 6.2;
  const SHIFT_SPEED = 6.0;
  const ZESTY_SPEED = 4.4;
  const RADIUS = 0.28;
  const EYE = 0.75;
  const SPRINT_DRAIN = 100 / 8; // full stamina in 8 seconds
  const STAMINA_REGEN = 40;     // per second while not sprinting

  const state = {
    x: 0, z: 0, yaw: 0, pitch: 0,
    speed: WALK_SPEED,
    inv: [],            // up to 3 items: {kind, icon}
    selected: 0,
    controlLocked: false,
    sprintTimer: 0,     // bsoda (free sprint, no stamina drain)
    zestTimer: 0,
    bootsTimer: Infinity,
    stepTimer: 0,
    running: false,
    shiftSprint: false, // holding the sprint key
    staminaExhausted: false,
  };

  function reset(x, z, yaw) {
    state.x = x; state.z = z; state.yaw = yaw; state.pitch = 0;
    state.inv = []; state.selected = 0;
    state.controlLocked = false;
    state.sprintTimer = 0; state.zestTimer = 0;
    state.bootsTimer = 0;
    state.stepTimer = 0; state.running = false;
    state.moving = false; state.bobPhase = 0;
    state.stamina = 100;
    state.shiftSprint = false;
    state.staminaExhausted = false;
  }

  function shiftSprintActive() {
    return state.shiftSprint && state.stamina > 0.5 && !state.staminaExhausted;
  }

  function currentSpeed() {
    if (state.sprintTimer > 0) return BSODA_SPEED;
    if (shiftSprintActive()) return SHIFT_SPEED;
    if (state.zestTimer > 0) return ZESTY_SPEED;
    return WALK_SPEED;
  }

  function isSprinting() { return state.sprintTimer > 0 || shiftSprintActive(); }

  function isBootsWorn() { return state.bootsTimer > 0; }

  function addItem(kind) {
    if (state.inv.length >= 3) return false;
    state.inv.push(kind);
    return true;
  }

  function removeSelected() {
    state.inv.splice(state.selected, 1);
    if (state.selected >= state.inv.length) state.selected = Math.max(0, state.inv.length - 1);
  }

  function hasItem(kind) {
    return state.inv.includes(kind);
  }

  function tryUseKeys(door) {
    if (!hasItem('keys')) return false;
    state.inv.splice(state.inv.indexOf('keys'), 1);
    return true;
  }

  // ---------- collision ----------

  function collideCircle(px, pz, r) {
    let cx = px, cz = pz;
    // tiles
    const minX = Math.floor(cx - r), maxX = Math.floor(cx + r);
    const minZ = Math.floor(cz - r), maxZ = Math.floor(cz + r);
    for (let tz = minZ; tz <= maxZ; tz++) {
      for (let tx = minX; tx <= maxX; tx++) {
        const c = MapData.tile(tx, tz);
        let solid = MapData.isSolidChar(c);
        if (c === 'D') solid = DoorSystem.isDoorBlocked(tx, tz);
        if (!solid) continue;
        // clamp circle out of tile
        const tileCx = tx + 0.5, tileCz = tz + 0.5;
        const dx = cx - tileCx, dz = cz - tileCz;
        // nearest point on tile AABB to circle center
        const hw = 0.5, hh = 0.5;
        const nx = Math.max(tileCx - hw, Math.min(cx, tileCx + hw));
        const nz = Math.max(tileCz - hh, Math.min(cz, tileCz + hh));
        let ex = cx - nx, ez = cz - nz;
        const d2 = ex * ex + ez * ez;
        if (d2 < r * r) {
          if (d2 > 1e-9) {
            const d = Math.sqrt(d2);
            ex /= d; ez /= d;
            cx = nx + ex * r;
            cz = nz + ez * r;
          } else {
            // center inside tile: push out along smallest penetration
            const penX = (tileCx + hw) - cx, penXm = cx - (tileCx - hw);
            const penZ = (tileCz + hh) - cz, penZm = cz - (tileCz - hh);
            const minPen = Math.min(penX, penXm, penZ, penZm);
            if (minPen === penX) cx = tileCx + hw + r;
            else if (minPen === penXm) cx = tileCx - hw - r;
            else if (minPen === penZ) cz = tileCz + hh + r;
            else cz = tileCz - hh - r;
          }
        }
      }
    }
    // furniture solids
    for (const s of MapData.FURNITURE.solid) {
      const nx = Math.max(s.x0, Math.min(cx, s.x1));
      const nz = Math.max(s.z0, Math.min(cz, s.z1));
      let ex = cx - nx, ez = cz - nz;
      const d2 = ex * ex + ez * ez;
      if (d2 < r * r) {
        if (d2 > 1e-9) {
          const d = Math.sqrt(d2);
          cx = nx + (ex / d) * r;
          cz = nz + (ez / d) * r;
        } else {
          const penX = s.x1 - cx, penXm = cx - s.x0;
          const penZ = s.z1 - cz, penZm = cz - s.z0;
          const minPen = Math.min(penX, penXm, penZ, penZm);
          if (minPen === penX) cx = s.x1 + r;
          else if (minPen === penXm) cx = s.x0 - r;
          else if (minPen === penZ) cz = s.z1 + r;
          else cz = s.z0 - r;
        }
      }
    }
    return { x: cx, z: cz };
  }

  function tryMove(dx, dz, dt) {
    const speed = currentSpeed();
    // move in world space (yaw rotation applied by caller)
    const nx = state.x + dx * speed * dt;
    const nz = state.z + dz * speed * dt;
    // axis separated
    let p = collideCircle(nx, state.z, RADIUS);
    state.x = p.x;
    p = collideCircle(state.x, nz, RADIUS);
    state.z = p.z;

    if (Math.abs(dx) > 0.1 || Math.abs(dz) > 0.1) {
      state.running = isSprinting();
      state.moving = true;
      state.bobPhase += dt * (state.running ? 13 : 9);
      state.stepTimer -= dt;
      if (state.stepTimer <= 0) {
        state.stepTimer = state.running ? 0.22 : 0.38;
        AudioSys.SFX.step();
      }
    } else {
      state.moving = false;
      state.bobPhase = 0;
    }
  }

  function update(dt) {
    // stamina: shift-sprinting drains it; anything else regenerates it.
    // BSoda/Zesty are paid boosts and never touch stamina.
    if (shiftSprintActive()) {
      state.stamina -= dt * SPRINT_DRAIN;
      if (state.stamina <= 0) {
        state.stamina = 0;
        state.staminaExhausted = true; // must recover before sprinting again
      }
    } else {
      state.stamina = Math.min(100, state.stamina + dt * STAMINA_REGEN);
      if (state.stamina >= 15) state.staminaExhausted = false;
    }

    if (state.sprintTimer > 0) state.sprintTimer -= dt;
    if (state.zestTimer > 0) state.zestTimer -= dt;
    if (state.bootsTimer > 0) state.bootsTimer -= dt;
  }

  // ---------- interaction ----------

  function forwardDir() {
    return { x: -Math.sin(state.yaw), z: -Math.cos(state.yaw) };
  }

  function findInteractable(notebooks, vending, items, exits, npcs) {
    const fx = -Math.sin(state.yaw), fz = -Math.cos(state.yaw);
    let best = null, bestScore = Infinity;

    function score(tx, tz, dist) {
      const dx = tx - state.x, dz = tz - state.z;
      const d = Math.sqrt(dx * dx + dz * dz);
      if (d > dist) return null;
      const dot = d > 0.001 ? (dx * fx + dz * fz) / d : 1;
      return { d, dot, score: d + (1 - dot) * 0.3 };
    }

    function consider(kind, ref, tx, tz, dist) {
      const s = score(tx, tz, dist);
      if (!s) return;
      if (s.score < bestScore) {
        bestScore = s.score;
        best = { kind, ...ref, d: s.d, dot: s.dot };
      }
    }

    // doors first
    for (const door of DoorSystem.allDoors()) {
      consider('door', { door }, door.x + 0.5, door.z + 0.5, 1.4);
    }
    for (const nb of notebooks) {
      if (nb.solved) continue;
      consider('notebook', { notebook: nb }, nb.x, nb.z, 1.7);
    }
    for (const v of vending) {
      consider('vending', { vending: v }, v.x, v.z, 1.6);
    }
    for (const it of items) {
      if (!it.alive) continue;
      consider('item', { item: it }, it.x, it.z, 1.2);
    }
    for (const ex of exits) {
      consider('exit', { exit: ex }, ex.x, ex.z, 1.4);
    }
    // reject targets clearly behind the player
    if (best && best.dot < 0.15 && best.d > 0.85) return null;
    return best;
  }

  function lookAt(tx, tz) {
    // face a point (used when grabbing notebook etc.)
    state.yaw = Math.atan2(-(tx - state.x), -(tz - state.z));
  }

  function getPos() { return { x: state.x, z: state.z }; }

  return {
    state, reset, currentSpeed, isSprinting, isBootsWorn,
    addItem, removeSelected, hasItem, tryUseKeys,
    collideCircle, tryMove, update, forwardDir,
    findInteractable, lookAt, getPos,
    isPlayer: true,
    EYE, RADIUS,
    get x() { return state.x; },
    get z() { return state.z; },
    get yaw() { return state.yaw; },
    set yaw(v) { state.yaw = v; },
    get pitch() { return state.pitch; },
    set pitch(v) { state.pitch = v; },
  };
})();
