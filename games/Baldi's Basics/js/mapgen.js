'use strict';

// Procedural school generator: builds a complete 50x42 tile grid from a seed.
//
// Keeps the classic school's *band* structure (north rooms, north hall,
// classrooms, middle hall, cafeteria/classrooms, south hall, south rooms,
// playground + gate) but every run randomizes:
//   - corridor columns and room slot boundaries
//   - which slot gets which room type
//   - door positions, playground trees, spawn points
//
// Guarantees (enforced by BFS at build time, regenerating on failure):
//   - whole grid (school interior + grass + playground) fully connected
//   - 5 classrooms + cafeteria + library + faculty + office + pomp +
//     janitor + lobby, 4 locked exits, 7 notebooks
//   - the hidden trophy room annex in the playground (same spot all maps)
//
// Tile legend matches map.js:
//   % wall   # wall   D door   O opening   . hall
//   , class  = caf    ; lib    f faculty   c lobby
//   m pomp   d office j janitor v storage  s secret floor
//   S secret wall (opens when the hint poster is explored)
//   p sand   x tree   g grass   F fence

const MapGen = (() => {

  const W = 50, H = 42;

  const ROOM_CHARS = {
    classroom: ',', cafeteria: '=', library: ';', faculty: 'f',
    pomp: 'm', janitor: 'j', lobby: 'c', office: 'd', storage: 'v',
  };

  const WALL_ROWS = { north: 8, middleTop: 12, middleBot: 20, cafTop: 23, cafBot: 30, southTop: 33 };

  // pick k distinct sorted columns in [lo..hi], min gap `gap`
  function pickColumns(lo, hi, k, gap, rnd) {
    const out = [];
    let guard = 999;
    while (out.length < k && guard-- > 0) {
      const c = lo + Math.floor(rnd() * (hi - lo + 1));
      if (out.every(o => Math.abs(o - c) >= gap)) out.push(c);
    }
    if (out.length < k) return null;
    return out.sort((a, b) => a - b);
  }

  function build(seedKey) {
    const base = SeedRng.toNumber(seedKey);
    for (let attempt = 0; attempt < 24; attempt++) {
      const res = tryBuild(base ^ (attempt * 0x9E3779B9));
      if (res) return res;
    }
    throw new Error('mapgen: no connected school for seed "' + seedKey + '"');
  }

  function tryBuild(seedNum) {
    const rnd = SeedRng.mulberry32(seedNum ^ 0x5A17F1);
    const rndTree = SeedRng.mulberry32(SeedRng.derive(seedNum, 'trees'));

    const k = rnd() < 0.6 ? 3 : 4;                  // 3 or 4 vertical corridors
    const corr = pickColumns(11, 37, k, 4, rnd);
    if (!corr) return null;

    // room slots between the corridor columns
    const slots = [];
    for (let i = 0; i <= k; i++) {
      slots.push({ x0: i === 0 ? 8 : corr[i - 1] + 1, x1: i === k ? 40 : corr[i] - 1 });
    }

    // ---- seed a grid and lay outer walls ----
    const rows = [];
    for (let z = 0; z < H; z++) rows.push(('g'.repeat(W)).split(''));
    const set = (x, z, c) => { rows[z][x] = c; };

    for (let x = 7; x <= 41; x++) { set(x, 4, '%'); set(x, 36, '%'); }
    for (let z = 5; z <= 36; z++) { set(7, z, '%'); }

    // ---- hallway bands ----
    for (let z = 9; z <= 11; z++) for (let x = 8; x <= 40; x++) set(x, z, '.');
    for (let z = 21; z <= 22; z++) for (let x = 8; x <= 40; x++) set(x, z, '.');
    for (let z = 31; z <= 32; z++) for (let x = 8; x <= 40; x++) set(x, z, '.');

    // wall rows (carved below)
    const wallZOf = [8, 12, 20, 23, 30, 33];
    for (const wz of wallZOf) for (let x = 8; x <= 40; x++) set(x, wz, '#');

    // ---- vertical corridors (passable full height, 'O' through wall rows) ----
    for (const c of corr) {
      for (let z = 8; z <= 35; z++) {
        if (wallZOf.includes(z)) set(c, z, 'O');
        else if (z >= 13 && z <= 19) set(c, z, '.');
        else if (z >= 24 && z <= 29) set(c, z, '.');
        else if (z >= 34 && z <= 35) set(c, z, '.');
        else if (z >= 5 && z <= 7) set(c, z, '#');   // north band is sealed rooms
      }
    }

    // ---- band room types ----
    function shuffle(pool) {
      const a = pool.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    const northPool = shuffle(['pomp', 'janitor', 'lobby', 'office']
      .concat(Array(Math.max(0, k + 1 - 4)).fill('storage')));
    const middlePool = shuffle(['classroom', 'classroom', 'faculty']
      .concat(Array(Math.max(0, k + 1 - 3)).fill('storage')));
    const cafPool = shuffle(['cafeteria', 'classroom', 'classroom']
      .concat(Array(Math.max(0, k + 1 - 3)).fill('storage')));
    const southPool = shuffle(['library', 'classroom']
      .concat(Array(Math.max(0, k + 1 - 2)).fill('storage')));

    const bands = [
      { name: 'north', z0: 5, z1: 7, pool: northPool },
      { name: 'middle', z0: 13, z1: 19, pool: middlePool },
      { name: 'caf', z0: 24, z1: 29, pool: cafPool },
      { name: 'south', z0: 34, z1: 35, pool: southPool },
    ];

    const rooms = [];            // {type, name, r:[x0,z0,x1,z1]}
    const roomDoors = {};        // name -> primary door {x,z}
    const classCounters = {};

    for (const band of bands) {
      const doorRowsForBand = band.name === 'north' ? [8]
        : band.name === 'middle' ? [12, 20]
        : band.name === 'caf' ? [23, 30]
        : [33];

      for (let i = 0; i <= k; i++) {
        const type = band.pool[i];
        const ch = ROOM_CHARS[type] || '.';
        for (let z = band.z0; z <= band.z1; z++) {
          for (let x = slots[i].x0; x <= slots[i].x1; x++) set(x, z, ch);
        }
        const r0 = slots[i].x0, r1 = slots[i].x1;
        const doorX = r0 + 1 + Math.floor(rnd() * (r1 - r0 - 1));
        for (const wz of doorRowsForBand) set(doorX, wz, 'D');

        let name = type;
        if (type === 'classroom') {
          // classrooms are labeled B/C/D/E/F like the classic school
          if (!classCounters[band.name]) classCounters[band.name] = 0;
          const letter = band.name === 'middle' ? ['B', 'F']
            : band.name === 'caf' ? ['C', 'E']
            : ['D'];
          name = 'class' + letter[classCounters[band.name] % letter.length];
          classCounters[band.name]++;
        }
        rooms.push({ type, name, r: [r0, band.z0, r1, band.z1] });
        roomDoors[name] = { x: doorX, z: doorRowsForBand[0] };
      }
    }

    // ---- exits ----
    const lobby = rooms.find(r => r.type === 'lobby');
    const frontX = Math.floor((lobby.r[0] + lobby.r[2]) / 2);
    const southX = corr[Math.floor(rnd() * corr.length)];
    const eastBand = rnd() < 0.5 ? [13, 19] : [24, 29];
    const eastDoorZ = eastBand[0] + Math.floor(rnd() * (eastBand[1] - eastBand[0] + 1));

    set(frontX, 4, 'D');
    set(7, 19, 'D');
    set(southX, 36, 'D');
    set(48, 23, 'D');             // playground gate

    // east school wall; one door leads into the playground sand
    for (let z = 5; z <= 36; z++) set(41, z, '%');
    set(41, eastDoorZ, 'D');

    const exits = [
      { x: frontX, z: 4 },
      { x: 7, z: 19 },
      { x: southX, z: 36 },
      { x: 48, z: 23 },
    ];

    // ---- playground (fixed region: sand, fences, gate at (48,23)) ----
    for (let z = 13; z <= 30; z++) {
      for (let x = 42; x <= 47; x++) set(x, z, 'p');
      set(48, z, z === 23 ? 'D' : 'F');
    }
    for (let x = 42; x <= 48; x++) { set(x, 12, 'F'); set(x, 31, 'F'); }

    // a couple of playground trees (never near the trophy room or the gate)
    let treesPlaced = 0;
    let guard = 80;
    while (treesPlaced < 2 && guard-- > 0) {
      const tx = 42 + Math.floor(rndTree() * 6);
      const tz = 14 + Math.floor(rndTree() * 16);
      if (tx >= 43 && tx <= 47 && tz >= 15 && tz <= 19) continue; // trophy room area
      if (rows[tz][tx] === 'p') { set(tx, tz, 'x'); treesPlaced++; }
    }

    // ---- hidden trophy room annex (same spot on every map) ----
    // 3x3 room at x45-47 / z16-18, hidden passage tile at (45,17)
    for (let x = 45; x <= 47; x++) { set(x, 15, '#'); set(x, 19, '#'); }
    set(45, 16, '#'); set(46, 16, 's'); set(47, 16, '#');
    set(45, 17, 'S'); set(46, 17, 's'); set(47, 17, '#');
    set(45, 18, '#'); set(46, 18, 's'); set(47, 18, '#');

    // ---- derived placements ----

    const secret = { entry: { x: 45, z: 17 }, poster: { x: 44.6, z: 17 }, trophy: { x: 46, z: 17 }, tv: { x: 46, z: 15.7 }, clock: { x: 46, z: 19.05 } };

    const classrooms = rooms.filter(r => r.type === 'classroom');
    let spawnRoom = classrooms[0], spawnDist = Infinity;
    for (const c of classrooms) {
      const d = Math.abs((c.r[0] + c.r[2]) / 2 - frontX);
      if (d < spawnDist) { spawnDist = d; spawnRoom = c; }
    }
    let artsRoom = classrooms[0], artsDist = -1;
    for (const c of classrooms) {
      const d = Math.abs((c.r[0] + c.r[2]) / 2 - frontX);
      if (d > artsDist) { artsDist = d; artsRoom = c; }
    }

    const office = rooms.find(r => r.type === 'office');
    const pomp = rooms.find(r => r.type === 'pomp');
    const cafeteria = rooms.find(r => r.type === 'cafeteria');
    const library = rooms.find(r => r.type === 'library');
    const janitor = rooms.find(r => r.type === 'janitor');
    const ctr = (r) => ({ x: (r.r[0] + r.r[2]) / 2 + 0.5, z: (r.r[1] + r.r[3]) / 2 + 0.5 });

    const spawns = {
      player: { x: (spawnRoom.r[0] + spawnRoom.r[2]) / 2 + 0.5, z: spawnRoom.r[3] - 1.0, rot: 0 },
      baldi: { x: 12 + Math.floor(rnd() * 26) + 0.5, z: 10.5 },
      principal: { x: ctr(office).x, z: ctr(office).z },
      playtime: { x: 44.5, z: 20.5 },
      bully: { x: corr[0] + 0.5, z: 15.5 },
      sweep: { x: ctr(janitor).x, z: ctr(janitor).z },
      firstprize: { x: Math.min(ctr(cafeteria).x + 2, cafeteria.r[2] - 0.5), z: ctr(cafeteria).z },
      arts: { x: (artsRoom.r[0] + artsRoom.r[2]) / 2 + 0.5, z: artsRoom.r[1] + 1.6, y: 0.55 },
      mrsPomp: { x: ctr(pomp).x, z: ctr(pomp).z - 0.6 },
    };

    // 7 notebooks: 5 classrooms (front desk row, or the floor in shallow
    // rooms) + library reading table + cafeteria table
    const notebooks = classrooms.map(c => {
      const shallow = (c.r[3] - c.r[1]) < 3;
      return shallow
        ? { x: ctr(c).x, z: ctr(c).z, y: 0.05 }
        : { x: (c.r[0] + c.r[2]) / 2 + 0.5, z: c.r[1] + 2.6, y: 0.55 };
    });
    notebooks.push({ x: library.r[2] - 1.2, z: library.r[1] + 0.6, y: 0.5 });
    notebooks.push({ x: cafeteria.r[0] + 3.2, z: cafeteria.r[1] + 2.6, y: 0.5 });

    const vending = [
      { x: cafeteria.r[0] + 1.6, z: cafeteria.r[1] + 0.42, rot: 0, kind: 'bsoda' },
      { x: cafeteria.r[2] - 1.6, z: cafeteria.r[1] + 0.42, rot: 0, kind: 'zesty' },
    ];

    const teleports = {
      detentionIn: { x: ctr(office).x, z: office.r[1] + 1.6, rot: Math.PI / 2 },
      detentionOut: { x: roomDoors.office.x + 0.5, z: 9.3, rot: Math.PI },
      pompIn: { x: ctr(pomp).x, z: ctr(pomp).z, rot: Math.PI },
      pompOut: { x: roomDoors.pomp.x + 0.5, z: 9.3, rot: Math.PI },
      entrance: { x: frontX + 0.5, z: 9.2, rot: Math.PI },
    };

    const sweepRoutes = [
      { x0: 8.5, z0: 10.0, x1: 40.5, z1: 10.0 },
      { x0: 8.5, z0: 21.5, x1: 40.5, z1: 21.5 },
      { x0: 8.5, z0: 31.5, x1: 40.5, z1: 31.5 },
    ];
    for (const c of corr) {
      sweepRoutes.push({ x0: c + 0.5, z0: 9.5, x1: c + 0.5, z1: 31.5 });
    }

    const bullySpots = [
      { x: corr[0] + 0.5, z: 15.5 },
      { x: corr[Math.floor(k / 2)] + 0.5, z: 18.5 },
      { x: corr[k - 1] + 0.5, z: 27.5 },
    ];

    // ground items: per-room templates placed clear of the furniture layout
    // (templates match the fixed offsets used by map.js furnishRoom)
    const rndItems = SeedRng.mulberry32(SeedRng.derive(seedNum, 'items'));
    const itemKinds = {
      classroom: ['quarter', 'quarter', 'scissors', 'eraser', 'wd'],
      library: ['clock', 'keys', 'quarter'],
      cafeteria: ['bsoda', 'zesty', 'quarter'],
      faculty: ['keys', 'zesty'],
      janitor: ['wd', 'boots'],
      office: ['quarter', 'clock'],
      pomp: ['eraser', 'quarter'],
    };
    const itemSlots = {
      classroom: [
        (r) => ({ x: r[0] + 1.1, z: r[3] - 0.4 }),
        (r) => ({ x: r[0] + 2.5, z: r[3] - 0.4 }),
        (r) => ({ x: r[2] - 1.0, z: r[3] - 0.4 }),
      ],
      library: [(r) => ({ x: (r[0] + r[2]) / 2 + 0.5, z: r[3] - 0.6 })],
      cafeteria: [(r) => ({ x: r[2] - 2.2, z: r[3] - 0.5 })],
      faculty: [(r) => ({ x: r[0] + 0.8, z: r[3] - 0.6 })],
      janitor: [(r) => ({ x: r[0] + 1.0, z: r[1] + 1.0 })],
      office: [(r) => ({ x: r[0] + 1.0, z: r[3] - 0.5 })],
      pomp: [(r) => ({ x: (r[0] + r[2]) / 2 + 0.5, z: r[3] - 0.4 })],
    };
    const itemSpawns = [];
    for (const room of rooms) {
      const kinds = itemKinds[room.type];
      const slots = itemSlots[room.type];
      if (!kinds || !slots) continue;
      const count = room.type === 'classroom' ? 3 : 1;
      for (let i = 0; i < count; i++) {
        const p = slots[i % slots.length](room.r);
        if (!walkTile(p.x, p.z, rows)) continue;
        itemSpawns.push({ kind: kinds[Math.floor(rndItems() * kinds.length)], x: p.x, z: p.z });
      }
    }
    for (const v of vending) itemSpawns.push({ kind: v.kind, x: v.x, z: v.z + 0.6 });

    const lights = [];
    for (const r of rooms) lights.push({ x: (r.r[0] + r.r[1]) / 2 + 0.5, z: (r.r[2] + r.r[3]) / 2 + 0.5 });
    for (const c of corr) { lights.push({ x: c + 0.5, z: 10.5 }, { x: c + 0.5, z: 21.5 }, { x: c + 0.5, z: 31.5 }); }

    const result = {
      rows: rows.map(r => r.join('')),
      rooms, secret, spawns, notebooks, vending, teleports,
      exits, sweepRoutes, bullySpots, lights, itemSpawns,
      seedNum,
    };

    if (!validate(result, rows)) return null;
    return result;
  }

  // true if the tile under (x, z) is walkable floor (items must sit on floor)
  function walkTile(x, z, rows) {
    const c = rows[Math.floor(z)][Math.floor(x)];
    return c === '.' || c === ',' || c === ';' || c === '=' || c === 'c' || c === 'p' ||
      c === 'm' || c === 'f' || c === 'j' || c === 'd' || c === 'v';
  }

  // BFS: every walkable tile (school interior + grass + playground) must be
  // reachable from the player spawn, including all notebooks, exits, spawns.
  // The un-revealed secret floor 's' and passage wall 'S' are excluded.
  function validate(res, rows) {
    const walk = (c) => c !== 'S' && c !== '#' && c !== '%' && c !== 'F' && c !== 's' && c !== ' ';
    const sp = res.spawns.player;
    const seen = new Set([`${Math.floor(sp.x)},${Math.floor(sp.z)}`]);
    const q = [...seen];
    while (q.length) {
      const [x, z] = q.shift().split(',').map(Number);
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, nz = z + dz;
        if (nx < 0 || nx >= W || nz < 0 || nz >= H) continue;
        const k = `${nx},${nz}`;
        if (seen.has(k)) continue;
        if (walk(rows[nz][nx])) {
          seen.add(k);
          q.push(k);
        }
      }
    }
    let total = 0;
    for (let z = 0; z < H; z++) for (let x = 0; x < W; x++) if (walk(rows[z][x])) total++;
    if (total !== seen.size) return false;

    const reach = (x, z) => seen.has(`${Math.floor(x)},${Math.floor(z)}`);
    for (const n of res.notebooks) if (!reach(n.x, n.z)) return false;
    for (const e of res.exits) if (!reach(e.x, e.z)) return false;
    for (const [name, p] of Object.entries(res.spawns)) if (!reach(p.x, p.z)) return false;
    for (const s of res.sweepRoutes) if (!reach(s.x0, s.z0) || !reach(s.x1, s.z1)) return false;
    return true;
  }

  return { build, tryBuild, W, H };
})();