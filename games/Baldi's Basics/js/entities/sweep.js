'use strict';

// Gotta Sweep: patrols hall routes at speed, pushing the player it touches.
// Routes connect at crossings: he only switches routes at their ends,
// so his movement is continuous (no teleporting between halls).
// Big Ol' Boots make the player immune to the sweep.

const Sweep = (() => {

  const BASE_SPEED = 4.6;
  const RADIUS = 0.26;

  // hall centerline routes (replaced from MapData.SWEEP_ROUTES on init)
  let ROUTES = [
    { x0: 8.5, z0: 10.0, x1: 40.5, z1: 10.0 },   // 0 north hall
    { x0: 8.5, z0: 21.5, x1: 40.5, z1: 21.5 },   // 1 middle hall
    { x0: 8.5, z0: 31.5, x1: 40.5, z1: 31.5 },   // 2 south hall
    { x0: 9.0, z0: 9.5, x1: 9.0, z1: 31.5 },     // 3 west hall
    { x0: 23.5, z0: 9.5, x1: 23.5, z1: 31.5 },   // 4 center hall
    { x0: 39.5, z0: 9.5, x1: 39.5, z1: 31.5 },   // 5 east hall
  ];

  // connectivity: routes whose lines come within 2.2 tiles of each other
  let CONNECTIONS = [];
  function computeConnections(routes) {
    const links = [];
    function distToSegment(px, pz, ax, az, bx, bz) {
      const dx = bx - ax, dz = bz - az;
      const len2 = dx * dx + dz * dz;
      let t = len2 > 0 ? ((px - ax) * dx + (pz - az) * dz) / len2 : 0;
      t = Math.max(0, Math.min(1, t));
      const cx = ax + dx * t, cz = az + dz * t;
      return Math.hypot(px - cx, pz - cz);
    }
    for (let i = 0; i < routes.length; i++) {
      for (let j = i + 1; j < routes.length; j++) {
        const A = routes[i], B = routes[j];
        // closest approach between segments (sample 8 points each way)
        let minD = Infinity;
        for (let k = 0; k <= 8; k++) {
          const t = k / 8;
          const ax = A.x0 + (A.x1 - A.x0) * t, az = A.z0 + (A.z1 - A.z0) * t;
          minD = Math.min(minD, distToSegment(ax, az, B.x0, B.z0, B.x1, B.z1));
          const bx = B.x0 + (B.x1 - B.x0) * t, bz = B.z0 + (B.z1 - B.z0) * t;
          minD = Math.min(minD, distToSegment(bx, bz, A.x0, A.z0, A.x1, A.z1));
        }
        if (minD < 2.2) {
          links.push([i, j]);
        }
      }
    }
    return links;
  }
  CONNECTIONS = computeConnections(ROUTES);

  const p = {
    x: 0, z: 0,
    route: null,
    dir: 1,
    speed: BASE_SPEED,
    pushCooldown: 0,
    sprite: null,
    moving: false,
  };

  function init(scene) {
    const s = MapData.SPAWNS.sweep;
    ROUTES = MapData.SWEEP_ROUTES || ROUTES;
    CONNECTIONS = computeConnections(ROUTES);
    p.x = s.x; p.z = s.z;
    p.route = ROUTES[0];
    p.dir = 1;
    p.speed = Game.mode === 'endless' ? BASE_SPEED * 1.15 : BASE_SPEED;
    p.sprite = GameRenderer.createCharacterSprite(SpriteGen.get('sweep'), 0.55, 1.0);
    p.sprite.sprite.position.set(p.x, 0, p.z);
    GameRenderer.spriteGroup.add(p.sprite.sprite);
  }

  function connectedRoutes(idx) {
    const out = [idx]; // can always reverse
    for (const [a, b] of CONNECTIONS) {
      if (a === idx) out.push(b);
      if (b === idx) out.push(a);
    }
    return out;
  }

  // snap point to the closest spot on route
  function closestOnRoute(route, x, z) {
    const dx = route.x1 - route.x0, dz = route.z1 - route.z0;
    const len2 = dx * dx + dz * dz;
    let t = len2 > 0 ? ((x - route.x0) * dx + (z - route.z0) * dz) / len2 : 0;
    t = Math.max(0, Math.min(1, t));
    return { x: route.x0 + dx * t, z: route.z0 + dz * t, t };
  }

  function switchRoute() {
    const cur = ROUTES.indexOf(p.route);
    // only switch to routes that actually pass near this endpoint
    const options = connectedRoutes(cur)
      .map(idx => ({ idx, snap: closestOnRoute(ROUTES[idx], p.x, p.z) }))
      .filter(o => Math.hypot(o.snap.x - p.x, o.snap.z - p.z) <= 2.5);
    const pick = options[Math.floor(Math.random() * options.length)];
    p.x = pick.snap.x;
    p.z = pick.snap.z;
    p.route = ROUTES[pick.idx];
    // pick a direction (biased to continue moving forward)
    p.dir = Math.random() < 0.5 ? 1 : -1;
  }

  function update(dt, player, gameBusy) {
    if (gameBusy) {
      p.moving = false;
      updateSprite(dt);
      return;
    }
    if (!p.route) p.route = ROUTES[Math.floor(Math.random() * ROUTES.length)];
    const r = p.route;
    const dx = r.x1 - r.x0, dz = r.z1 - r.z0;
    const len = Math.hypot(dx, dz);
    const ux = dx / len, uz = dz / len;

    // move along route
    const step = p.speed * dt * p.dir;
    p.x += ux * step;
    p.z += uz * step;

    // turn / switch at route ends
    const proj = (p.x - r.x0) * ux + (p.z - r.z0) * uz;
    if (proj >= len) {
      p.x = r.x1; p.z = r.z1;
      switchRoute();
    } else if (proj <= 0) {
      p.x = r.x0; p.z = r.z0;
      switchRoute();
    }

    // push player (stops when he is pinned against a wall)
    const d = Math.hypot(player.x - p.x, player.z - p.z);
    if (d < RADIUS + Player.RADIUS && !Player.isBootsWorn()) {
      p.pushCooldown -= dt;
      if (p.pushCooldown <= 0) {
        const before = { x: player.x, z: player.z };
        const c1 = Player.collideCircle(player.x + ux * p.dir * 5.5 * dt, player.z, Player.RADIUS);
        player.state.x = c1.x;
        const c2 = Player.collideCircle(player.x, player.z + uz * p.dir * 5.5 * dt, Player.RADIUS);
        player.state.z = c2.z;
        const moved = Math.hypot(player.x - before.x, player.z - before.z);
        if (moved < 0.001) {
          // the player is flush against a wall: stop shoving for a bit
          p.pushCooldown = 0.7;
        }
        if (Math.random() < dt * 3) AudioSys.SFX.sweepPush();
      }
    }

    p.moving = true;
    updateSprite(dt);
  }

  function updateSprite(dt) {
    p.sprite.update(dt, 12);
    p.sprite.sprite.position.set(p.x, 0, p.z);
  }

  function getPos() { return { x: p.x, z: p.z }; }

  return { init, update, getPos };
})();
