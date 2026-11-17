'use strict';

// Shared AI utilities: line of sight, bounded waypoint picking,
// path smoothing (string pulling), stuck detection, door opening.

const AIUtils = (() => {

  // ---------- line of sight ----------

  // opts: { blockDoors: bool, blockClouds: bool, maxDist: number }
  function lineOfSight(x0, z0, x1, z1, opts = {}) {
    const dx = x1 - x0, dz = z1 - z0;
    const dist = Math.hypot(dx, dz);
    if (opts.maxDist !== undefined && dist > opts.maxDist) return false;
    if (dist < 0.05) return true;
    const steps = Math.ceil(dist * 4);
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const px = x0 + dx * t, pz = z0 + dz * t;
      const tx = Math.floor(px), tz = Math.floor(pz);
      const c = MapData.tile(tx, tz);
      if (c === 'D') {
        // doors only block sight when closed (and when the caller cares)
        if (opts.blockDoors && DoorSystem.isDoorBlocked(tx, tz)) return false;
        continue;
      }
      if (MapData.isSolidChar(c)) return false;
      if (opts.blockClouds && CloudSystem && CloudSystem.clouds().length > 0) {
        for (const cl of CloudSystem.clouds()) {
          const cx = px - cl.x, cz = pz - cl.z;
          if (cx * cx + cz * cz < cl.r * cl.r) return false;
        }
      }
    }
    return true;
  }

  // ---------- bounded waypoint picking ----------

  function nearbyWaypoint(x, z, minDist = 8, maxDist = 16, rnd = Math.random) {
    let best = null;
    // sample waypoints within the band
    const candidates = [];
    for (let i = 0; i < MapData.WAYPOINTS.length; i++) {
      const p = MapData.WAYPOINTS[i];
      const d = Math.hypot(p.x - x, p.z - z);
      if (d >= minDist && d <= maxDist) candidates.push(p);
      if (candidates.length > 24) break; // enough to choose from
    }
    if (candidates.length === 0) return MapData.randomWaypoint(rnd);
    return candidates[Math.floor(rnd() * candidates.length)];
  }

  // ---------- path smoothing (string pulling) ----------

  // Removes waypoints that can be skipped in a straight walkable line.
  function smoothPath(path) {
    if (!path || path.length < 3) return path;
    const out = [path[0]];
    let anchor = path[0];
    for (let i = 1; i < path.length - 1; i++) {
      const next = path[i + 1];
      if (!straightWalkable(anchor.x, anchor.z, next.x, next.z)) {
        out.push(path[i]);
        anchor = path[i];
      }
    }
    out.push(path[path.length - 1]);
    return out;
  }

  function straightWalkable(x0, z0, x1, z1) {
    const dx = x1 - x0, dz = z1 - z0;
    const dist = Math.hypot(dx, dz);
    if (dist > 9) return false; // keep segments reasonably short
    const steps = Math.ceil(dist * 4);
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const px = x0 + dx * t, pz = z0 + dz * t;
      const c = MapData.tile(Math.floor(px), Math.floor(pz));
      if (MapData.isSolidChar(c)) return false;
    }
    return true;
  }

  // ---------- stuck detection ----------

  function makeStuckDetector() {
    return {
      lastX: 0, lastZ: 0, time: 0,
      init(x, z) { this.lastX = x; this.lastZ = z; this.time = 0; },
      // returns true if movement is blocked for a while
      update(dt, x, z, threshold = 0.55) {
        const moved = Math.hypot(x - this.lastX, z - this.lastZ);
        if (moved > 0.05) {
          this.lastX = x; this.lastZ = z; this.time = 0;
          return false;
        }
        this.time += dt;
        return this.time > threshold;
      },
    };
  }

  // ---------- door opening ahead ----------

  function openDoorAhead(x, z, mx, mz) {
    const lookTx = Math.floor(x + mx * 2 + Math.sign(mx) * 0.5);
    const lookTz = Math.floor(z + mz * 2 + Math.sign(mz) * 0.5);
    if (MapData.tile(lookTx, lookTz) === 'D') {
      DoorSystem.openDoorAt(lookTx, lookTz, null);
      return true;
    }
    return false;
  }

  // ---------- shared "move with collision" ----------

  // Moves a circle toward (tx,tz) by speed*dt, resolving collisions,
  // opening doors in the way. Returns distance remaining.
  function stepToward(pos, tx, tz, speed, dt, radius) {
    const dx = tx - pos.x, dz = tz - pos.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.01) return 0;
    const step = Math.min(speed * dt, d);
    const mx = dx / d * step, mz = dz / d * step;
    openDoorAhead(pos.x, pos.z, mx, mz);
    let c = Player.collideCircle(pos.x + mx, pos.z, radius);
    pos.x = c.x;
    c = Player.collideCircle(pos.x, pos.z + mz, radius);
    pos.z = c.z;
    return Math.hypot(tx - pos.x, tz - pos.z);
  }

  return {
    lineOfSight,
    nearbyWaypoint,
    smoothPath,
    straightWalkable,
    makeStuckDetector,
    openDoorAhead,
    stepToward,
  };
})();
