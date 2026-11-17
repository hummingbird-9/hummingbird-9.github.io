// Map verification harness — loads map.js in a sandbox and checks structure.
const fs = require('fs');
const vm = require('vm');

const seedCode = fs.readFileSync('js/systems/seed.js', 'utf8');
const genCode = fs.readFileSync('js/mapgen.js', 'utf8');
const code = fs.readFileSync('js/map.js', 'utf8');
const sandbox = { TextureGen: {}, Math, console };
vm.createContext(sandbox);
vm.runInContext(seedCode, sandbox);
vm.runInContext(genCode, sandbox);
vm.runInContext(code + '\nglobalThis.__MAP = MapData;', sandbox);
const M = sandbox.__MAP;

function assert(cond, msg) {
  if (!cond) { console.error('FAIL:', msg); process.exitCode = 1; }
  else console.log('ok:', msg);
}

// row lengths
M.validate();

// tile access sanity
assert(M.tile(24, 4) === 'D', 'front door at (24,4)');
assert(M.tile(7, 19) === 'D', 'west exit at (7,19)');
assert(M.tile(24, 36) === 'D', 'south exit at (24,36)');
assert(M.tile(48, 23) === 'D', 'playground gate at (48,23)');
assert(M.tile(41, 25) === 'D', 'east building door at (41,25)');
assert(M.tile(11, 8) === 'D', 'mrs pomp door');
assert(M.tile(17, 8) === 'D', 'janitor door');
assert(M.tile(35, 8) === 'D', 'detention door');
assert(M.tile(28, 12) === 'D', 'class B door');
assert(M.tile(35, 12) === 'D', 'class F door');
assert(M.tile(20, 15) === 'D', 'faculty door');
assert(M.tile(22, 26) === 'D', 'cafeteria door (east wall)');
assert(M.tile(16, 23) === '#', 'cafeteria north wall sealed');
assert(M.tile(28, 30) === 'D', 'class C door');
assert(M.tile(35, 30) === 'D', 'class E door');
assert(M.tile(17, 33) === 'D', 'library door');
assert(M.tile(31, 33) === 'D', 'class D door');

const doors = M.findDoors();
assert(doors.length === 16, `16 doors found, got ${doors.length}`);
for (const d of doors) {
  assert(d.orient === 'NS' || d.orient === 'EW', `door (${d.x},${d.z}) has orient ${d.orient}`);
}
assert(doors.find(d => d.x === 24 && d.z === 4).type === 'exit', 'front door is exit');
assert(doors.find(d => d.x === 7 && d.z === 19).locked, 'west exit locked');
assert(doors.find(d => d.x === 24 && d.z === 36).locked, 'south exit locked');
assert(doors.find(d => d.x === 24 && d.z === 4).locked, 'front door locked');
assert(doors.find(d => d.x === 48 && d.z === 23).locked, 'gate locked');
assert(doors.find(d => d.x === 7 && d.z === 19).orient === 'NS', 'west exit orientation NS (E/W floors)');

// floors under characters / notebooks / vending
const floorChecks = [
  [28, 26, ','], [28, 16, ','], [35, 16, ','], [35, 26, ','], [30, 34, ','],
  [16, 34, ';'], [16, 26, '='],
  [24, 10, '.'], [24, 6, 'c'], [45, 20, 'p'], [9, 15, '.'], [17, 10, '.'],
  [39, 25, '.'], [11, 6, 'm'],
  [13, 24, '='], [19, 24, '='],
];
for (const [x, z, c] of floorChecks) {
  assert(M.tile(x, z) === c, `tile (${x},${z}) is '${M.tile(x, z)}' expected '${c}'`);
}

// every interior floor tile must be reachable from spawn via walkable tiles (BFS through doors treated open)
function bfsReach() {
  const start = [28, 26];
  const seen = new Set([`${start[0]},${start[1]}`]);
  const q = [start];
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let floorTiles = 0, reached = 0;
  for (let z = 0; z < M.H; z++) for (let x = 0; x < M.W; x++) {
    const c = M.tile(x, z);
    if (M.isWalkableFloor(c) || c === 'D' || c === 'O') floorTiles++;
  }
  while (q.length) {
    const [x, z] = q.shift();
    reached++;
    for (const [dx, dz] of dirs) {
      const nx = x + dx, nz = z + dz;
      const c = M.tile(nx, nz);
      const key = `${nx},${nz}`;
      if ((M.isWalkableFloor(c) || c === 'D' || c === 'O') && !seen.has(key)) {
        seen.add(key);
        q.push([nx, nz]);
      }
    }
  }
  return { floorTiles, reached };
}
const { floorTiles, reached } = bfsReach();
assert(floorTiles === reached, `all walkable tiles reachable (${reached}/${floorTiles})`);

// A* from baldi spawn to player spawn
const p = M.findPath(24, 10, 28, 26, {});
assert(p && p.length > 5, `A* path exists (${p ? p.length : 'null'} steps)`);

// waypoints exist
assert(M.WAYPOINTS.length > 20, `waypoints ${M.WAYPOINTS.length}`);

// furniture is inside walkable bounds
let furnitureOk = true;
for (const s of M.FURNITURE.solid) {
  const c0 = M.tile(Math.floor(s.x0), Math.floor(s.z0));
  const c1 = M.tile(Math.floor(s.x1), Math.floor(s.z1));
  if (!M.isWalkableFloor(c0) && !M.isWalkableFloor(c1)) {
    console.error('furniture solid not on floor:', s);
    furnitureOk = false;
  }
}
assert(furnitureOk, 'furniture solids on walkable floor');

// player spawn must not be inside furniture
let spawnOk = true;
for (const s of M.FURNITURE.solid) {
  const p = M.SPAWNS.player;
  if (p.x >= s.x0 && p.x <= s.x1 && p.z >= s.z0 && p.z <= s.z1) {
    console.error('player spawn inside furniture:', s);
    spawnOk = false;
  }
}
assert(spawnOk, 'player spawn not inside furniture');

// every notebook / item must be reachable from the walkable area
// WITH furniture solids as obstacles (fine-grid BFS)
function furnitureReachable(targets) {
  const K = 4; // sub-cells per tile
  const W = M.W * K, H = M.H * K;
  const blocked = new Uint8Array(W * H);
  const blockedAt = (cx, cz) => {
    // sub-cell center (0.125 + 0.25*i)
    const x = cx / K, z = cz / K;
    const tx = Math.floor(x), tz = Math.floor(z);
    const c = M.tile(tx, tz);
    if (c === ' ') return true;
    if (M.isSolidChar(c) && c !== 'D') return true;
    // player-sized circle vs furniture
    for (const s of M.FURNITURE.solid) {
      if (x >= s.x0 - 0.28 && x <= s.x1 + 0.28 && z >= s.z0 - 0.28 && z <= s.z1 + 0.28) {
        // circle vs AABB
        const nx = Math.max(s.x0, Math.min(x, s.x1));
        const nz = Math.max(s.z0, Math.min(z, s.z1));
        const dx = x - nx, dz = z - nz;
        if (dx * dx + dz * dz < 0.28 * 0.28) return true;
      }
    }
    return false;
  };
  for (let i = 0; i < W * H; i++) {
    blocked[i] = blockedAt(i % W, Math.floor(i / W)) ? 1 : 0;
  }
  // BFS from player spawn
  const start = { x: Math.floor(M.SPAWNS.player.x * K), z: Math.floor(M.SPAWNS.player.z * K) };
  const key = (x, z) => z * W + x;
  const seen = new Uint8Array(W * H);
  const q = [key(start.x, start.z)];
  seen[q[0]] = 1;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.length) {
    const cur = q.shift();
    const cx = cur % W, cz = Math.floor(cur / W);
    for (const [dx, dz] of dirs) {
      const nx = cx + dx, nz = cz + dz;
      if (nx < 0 || nx >= W || nz < 0 || nz >= H) continue;
      const k = key(nx, nz);
      if (seen[k] || blocked[k]) continue;
      seen[k] = 1;
      q.push(k);
    }
  }
  const bad = [];
  for (const t of targets) {
    // reachable = some unblocked cell exists within interact range of the target
    const range = t.y !== undefined ? 1.6 : 1.1; // notebook / item interact distance
    const R = Math.ceil(range * K);
    const cx = Math.floor(t.x * K), cz = Math.floor(t.z * K);
    let ok = false;
    for (let dz = -R; dz <= R && !ok; dz++) {
      for (let dx = -R; dx <= R && !ok; dx++) {
        const x = cx + dx, z = cz + dz;
        if (x < 0 || x >= W || z < 0 || z >= H) continue;
        if (dx * dx + dz * dz > R * R) continue;
        if (seen[key(x, z)]) ok = true;
      }
    }
    if (!ok) bad.push(t);
  }
  return bad;
}

const unreachableNotebooks = furnitureReachable(M.NOTEBOOKS);
assert(unreachableNotebooks.length === 0,
  `all notebooks reachable with furniture (${unreachableNotebooks.length} blocked)`);
unreachableNotebooks.forEach(n => console.error('unreachable notebook:', n));

// item spawns (classic map list from map.js)
const itemTargets = M.ITEM_SPAWNS.map(({ x, z }) => ({ x, z }));
const unreachableItems = furnitureReachable(itemTargets);
assert(unreachableItems.length === 0,
  `all item spawns reachable with furniture (${unreachableItems.length} blocked)`);
unreachableItems.forEach(n => console.error('unreachable item:', n));

// character spawns must not be inside furniture
let npcOk = true;
for (const [name, p] of Object.entries(M.SPAWNS)) {
  if (name === 'arts') continue;
  for (const s of M.FURNITURE.solid) {
    if (p.x >= s.x0 && p.x <= s.x1 && p.z >= s.z0 && p.z <= s.z1) {
      console.error(`${name} spawn inside furniture:`, s);
      npcOk = false;
    }
  }
}
assert(npcOk, 'NPC spawns not inside furniture');

console.log('\nDONE');
