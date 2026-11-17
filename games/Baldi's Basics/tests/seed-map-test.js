// Random-seed map verification — loads seed.js + mapgen.js + map.js in a
// sandbox, generates several procedural maps and checks structure invariants.
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

let failures = 0;
function assert(cond, msg) {
  if (!cond) { console.error('FAIL:', msg); failures++; }
  else console.log('ok:', msg);
}

function bfsReach() {
  const start = [M.SPAWNS.player.x, M.SPAWNS.player.z].map(Math.floor);
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

const seeds = ['hello', 'baldi', 'school', '12345', 'zzz', '0xDEADBEEF'];
for (const seed of seeds) {
  M.reset(seed);
  assert(M.seedKeyOf() === seed, `seed '${seed}' normalized to itself`);

  // structure
  M.validate();
  assert(M.findDoors().length >= 12, `seed '${seed}' has >= 12 doors (${M.findDoors().length})`);

  // connectivity
  const { floorTiles, reached } = bfsReach();
  assert(floorTiles === reached, `seed '${seed}' fully reachable (${reached}/${floorTiles})`);

  // notebooks: exactly 7, all inside the map
  assert(M.NOTEBOOKS.length === 7, `seed '${seed}' has 7 notebooks (${M.NOTEBOOKS.length})`);
  for (const n of M.NOTEBOOKS) {
    assert(n.x > 0 && n.x < M.W && n.z > 0 && n.z < M.H, `seed '${seed}' notebook in bounds (${n.x},${n.z})`);
  }

  // exits: exactly 4, locked
  assert(M.EXITS.length === 4, `seed '${seed}' has 4 exits (${M.EXITS.length})`);
  assert(M.EXITS.every(e => e.locked), `seed '${seed}' exits locked`);

  // spawns exist
  for (const k of ['player', 'baldi', 'principal', 'playtime', 'bully', 'sweep', 'firstprize']) {
    assert(M.SPAWNS[k] !== undefined, `seed '${seed}' spawn '${k}' exists`);
  }

  // items: enough spawns, all on walkable floor, all reachable via A*
  assert(M.ITEM_SPAWNS.length >= 10, `seed '${seed}' has >= 10 items (${M.ITEM_SPAWNS.length})`);
  for (const it of M.ITEM_SPAWNS) {
    const c = M.tile(Math.floor(it.x), Math.floor(it.z));
    assert(M.isWalkableFloor(c), `seed '${seed}' item (${it.x},${it.z}) on floor '${c}'`);
    const path = M.findPath(M.SPAWNS.player.x, M.SPAWNS.player.z, it.x, it.z, {});
    assert(path && path.length > 0, `seed '${seed}' item (${it.x},${it.z}) reachable`);
  }

  // player spawn clear of furniture
  const p = M.SPAWNS.player;
  let clear = true;
  for (const s of M.FURNITURE.solid) {
    if (p.x >= s.x0 && p.x <= s.x1 && p.z >= s.z0 && p.z <= s.z1) clear = false;
  }
  assert(clear, `seed '${seed}' player spawn not inside furniture`);

  // secret room: same spot, sealed until revealed
  const sec = M.secret();
  assert(sec.entry.x === 45 && sec.entry.z === 17, `seed '${seed}' secret entry fixed (${sec.entry.x},${sec.entry.z})`);
  const snapshot = M.ROWS.join('|');
  assert(M.tile(sec.entry.x, sec.entry.z) === 'S', `seed '${seed}' secret wall sealed before reveal`);
  assert(M.revealSecret() === true, `seed '${seed}' revealSecret() reports change`);
  assert(M.tile(sec.entry.x, sec.entry.z) === 'O', `seed '${seed}' secret wall opens after reveal`);
  assert(M.tile(46, 17) === 's', `seed '${seed}' trophy room floor inside`);
  assert(M.revealSecret() === false, `seed '${seed}' second reveal is a no-op`);

  // determinism: same seed => identical map
  M.reset(seed);
  assert(M.ROWS.join('|') === snapshot, `seed '${seed}' deterministic`);
}

// classic modes
M.reset(null);
assert(M.findDoors().length === 16, 'null seed => classic 16 doors');
M.reset('0');
assert(M.findDoors().length === 16, '"0" seed => classic');
M.reset('classic');
assert(M.findDoors().length === 16, '"classic" seed => classic');
assert(M.secret().entry.x === 45 && M.secret().entry.z === 17, 'classic secret spot');

console.log(failures === 0 ? '\nDONE' : `\n${failures} FAILURES`);
process.exitCode = failures === 0 ? 0 : 1;
