'use strict';

// School floor plan, tile grid, collision, furniture, waypoint graph.
//
// Tile legend:
//   % exterior wall     # interior wall     D door tile (auto-oriented)
//   O open doorway      . hall floor        , classroom floor (wood)
//   = cafeteria floor   ; library floor     f faculty room floor
//   c lobby carpet      m Mrs Pomp room     d detention room floor
//   j janitor closet    v storage room      s secret room floor
//   S secret passage wall (opens when the hint poster is explored)
//   p playground sand   x tree (on grass)   g grass
//   F fence
//
// MapData.reset(seed):
//   - seed null / "0" / "classic" -> the classic fixed "Here School" map
//   - any other seed string      -> procedural school from js/mapgen.js
// The secret trophy room annex in the playground exists on every map.

const MapData = (() => {

  const W = 50, H = 42;

  const CLASSIC_ROWS = [
    // z=0..3 north grass
    'gggggggggggggggggggggggggggggggggggggggggggggggggg',
    'ggggggggggggggxggggggggggggggggggggggggggggggggggg',
    'gggxgggggggggggggggggggggggggggggggggggggggggggggg',
    'gggggggggggggggggggggggggggggggggggggggggggggggggg',
    // z=4 (north exterior wall, front door at x=24)
    'ggggggg%%%%%%%%%%%%%%%%%D%%%%%%%%%%%%%%%%%gggggggg',
    // z=5..7 north band: mrs pomp / janitor / lobby / detention
    'ggggggg%mmmmmmm#jjj#cccccccccc#dddddddddd%gggggggg',
    'ggggggg%mmmmmmm#jjj#cccccccccc#dddddddddd%gggggggg',
    'ggggggg%mmmmmmm#jjj#cccccccccc#dddddddddd%gggggggg',
    // z=8 wall row (doors: mrs pomp x11, janitor x17, lobby opening x24, detention x35)
    'ggggggg%###D#####D######O##########D#####%gggggggg',
    // z=9..11 north hall
    'ggggggg%.................................%gggggggg',
    'ggggggg%.................................%gggggggg',
    'ggggggg%.................................%gggggggg',
    // z=12 wall row (west hall x9, open area x20, center x23-24, class B x28, class F x35)
    'ggggggg%#O##########O##OO###D######D###OO%gggggggg',
    // z=13..19 middle band (faculty x12-19, open x21-24, class B x26-31, class F x33-38)
    'ggggggg%...#ffffffff#....#,,,,,,#,,,,,#..%FFFFFFFg',
    'ggggggg%...#ffffffff#....#,,,,,,#,,,,,#..%ppppppFg',
    'ggggggg%...#ffffffffD....#,,,,,,#,,,,,#..%ppppppFg',
    'ggggggg%...#ffffffff#....#,,,,,,#,,,,,#..%ppxpppFg',
    'ggggggg%...#ffffffff#....#,,,,,,#,,,,,#..%ppppppFg',
    'ggggggg%...#ffffffff#....#,,,,,,#,,,,,#..%ppppppFg',
    'gggggggD...#ffffffff#....#,,,,,,#,,,,,#..%ppppppFg',
    // z=20 wall row (west hall x9, open area x20, center x23-24)
    'ggggggg%#O##########O##OO##############OO%ppppppFg',
    // z=21..22 middle hall
    'ggggggg%.................................%ppppppFg',
    'ggggggg%.................................%ppppppFg',
    // z=23 wall row (west hall x9, cafeteria x16, center x23-24, playground gate x48)
    'ggggggg%#O#############OO##############OO%ppppppDg',
    // z=24..29 bottom-mid band (cafeteria x12-22, class C x26-31, class E x33-38)
    'ggggggg%...#==========#..#,,,,,,#,,,,,#..%ppppppFg',
    'ggggggg%...#==========#..#,,,,,,#,,,,,#..DppppppFg',
    'ggggggg%...#==========D..#,,,,,,#,,,,,#..%ppppppFg',
    'ggggggg%...#==========#..#,,,,,,#,,,,,#..%ppppppFg',
    'ggggggg%...#==========#..#,,,,,,#,,,,,#..%ppppppFg',
    'ggggggg%...#==========#..#,,,,,,#,,,,,#..%ppppppFg',
    // z=30 wall row (west hall x9, center x23-24, class C x28, class E x35)
    'ggggggg%#O#############OO###D######D###OO%ppppxpFg',
    // z=31..32 south hall
    'ggggggg%.................................%FFFFFFFg',
    'ggggggg%.................................%FFFFFFFg',
    // z=33 wall row (library x17, corridor x23-24, class D x31)
    'ggggggg%#########D#####..######D#########%gggggggg',
    // z=34..35 south rooms (library x12-22, corridor x23-24, class D x26-36)
    'ggggggg%####;;;;;;;;;;;..#,,,,,,,,,,,####%gggggggg',
    'ggggggg%####;;;;;;;;;;;..#,,,,,,,,,,,####%gggggggg',
    // z=36 south exterior wall, exit at x=24
    'ggggggg%%%%%%%%%%%%%%%%%D%%%%%%%%%%%%%%%%%gggggggg',
    // z=37..41 south grass
    'gggggggggggggggggggggggggggggggggggggggggggggggggg',
    'ggggggggggxggggggggggggggggggggggggggggxgggggggggg',
    'gggggggggggggggggggggggggggggggggggggggggggggggggg',
    'gggggggggggggggggggggggggggggggggggggggggggggggggg',
    'gggggggggggggggggggggggggggggggggggggggggggggggggg',
  ];

  const CLASSIC_EXITS = [
    { x: 24, z: 4, locked: true },    // front door
    { x: 7, z: 19, locked: true },    // west exit
    { x: 24, z: 36, locked: true },   // south exit
    { x: 48, z: 23, locked: true },   // playground gate
  ];

  const CLASSIC_SPAWNS = {
    player: { x: 29.15, z: 28.7, rot: 0.62 }, // classroom C, facing the notebook desk
    baldi: { x: 24.5, z: 10.5 },
    principal: { x: 24.5, z: 6.5 },
    playtime: { x: 45.5, z: 20.5 },
    bully: { x: 9.5, z: 15.5 },
    sweep: { x: 17.5, z: 10.5 },
    firstprize: { x: 39.5, z: 25.5 },
    arts: { x: 36.35, z: 17.0, y: 0.55 }, // on desk in classroom F
    mrsPomp: { x: 13.5, z: 6.2 },
  };

  const CLASSIC_NOTEBOOKS = [
    { x: 27.65, z: 26.6, y: 0.55 }, // classroom C (spawn), on desk
    { x: 27.65, z: 15.6, y: 0.55 }, // classroom B, on desk
    { x: 34.65, z: 15.6, y: 0.55 }, // classroom F, on desk
    { x: 34.65, z: 26.6, y: 0.55 }, // classroom E, on desk
    { x: 30.5, z: 34.5, y: 0.05 },  // classroom D (shallow)
    { x: 20.8, z: 34.6, y: 0.5 },   // library, on reading table
    { x: 15.2, z: 26.6, y: 0.5 },   // cafeteria, on table
  ];

  const CLASSIC_ITEM_SPAWNS = [
    // classrooms
    { kind: 'quarter', x: 26.6, z: 18.6 }, { kind: 'quarter', x: 30.4, z: 18.6 }, { kind: 'scissors', x: 28.5, z: 18.8 },
    { kind: 'eraser', x: 35.5, z: 18.8 }, { kind: 'quarter', x: 33.6, z: 18.6 }, { kind: 'quarter', x: 37.4, z: 18.6 },
    { kind: 'quarter', x: 26.5, z: 28.6 }, { kind: 'quarter', x: 30.4, z: 28.6 },
    { kind: 'wd', x: 35.5, z: 28.6 }, { kind: 'quarter', x: 33.6, z: 28.6 }, { kind: 'quarter', x: 37.4, z: 28.6 },
    { kind: 'quarter', x: 28.5, z: 34.6 }, { kind: 'bsoda', x: 32.5, z: 34.6 }, { kind: 'quarter', x: 34.5, z: 34.6 },
    // library
    { kind: 'clock', x: 15.0, z: 34.3 }, { kind: 'keys', x: 18.3, z: 35.4 }, { kind: 'quarter', x: 21.9, z: 35.4 },
    // cafeteria
    { kind: 'bsoda', x: 12.7, z: 28.6 }, { kind: 'zesty', x: 21.5, z: 28.8 }, { kind: 'quarter', x: 16.6, z: 24.6 },
    // faculty
    { kind: 'keys', x: 12.7, z: 13.6 }, { kind: 'zesty', x: 19.2, z: 18.6 },
    // janitor
    { kind: 'wd', x: 16.5, z: 5.6 }, { kind: 'boots', x: 18.5, z: 6.9 },
    // detention
    { kind: 'clock', x: 39.5, z: 6.6 }, { kind: 'quarter', x: 30.6, z: 6.8 }, { kind: 'quarter', x: 31.4, z: 5.5 },
    // mrs pomp room
    { kind: 'eraser', x: 8.6, z: 6.8 }, { kind: 'quarter', x: 13.9, z: 5.6 },
    // playground
    { kind: 'scissors', x: 44.5, z: 18.5 }, { kind: 'boots', x: 45.5, z: 27.5 },
  ];

  const CLASSIC_VENDING = [
    { x: 13.5, z: 24.42, rot: 0, kind: 'bsoda' },   // cafeteria north wall
    { x: 19.5, z: 24.42, rot: 0, kind: 'zesty' },   // cafeteria north wall
  ];

  const CLASSIC_ROOMS = [
    { type: 'classroom', r: [26, 13, 31, 19] },   // classroom B
    { type: 'classroom', r: [33, 13, 38, 19] },   // classroom F (Arts & Crafters)
    { type: 'classroom', r: [26, 24, 31, 29] },   // classroom C (spawn)
    { type: 'classroom', r: [33, 24, 38, 29] },   // classroom E
    { type: 'classroom', r: [26, 34, 36, 35] },   // classroom D (shallow)
    { type: 'faculty', r: [12, 13, 19, 19] },
    { type: 'cafeteria', r: [12, 24, 21, 29] },
    { type: 'library', r: [12, 34, 22, 35] },
    { type: 'pomp', r: [8, 5, 14, 7] },
    { type: 'office', r: [31, 5, 40, 7] },
    { type: 'janitor', r: [16, 5, 18, 7] },
    { type: 'lobby', r: [20, 5, 29, 7] },
  ];

  // detention / pomp flows use these teleport points (classic values)
  const CLASSIC_TELEPORTS = {
    detentionIn: { x: 31.0, z: 6.5, rot: Math.PI / 2 },
    detentionOut: { x: 35.5, z: 9.7, rot: Math.PI },
    pompIn: { x: 9.6, z: 6.9, rot: Math.PI },
    pompOut: { x: 11.5, z: 9.7, rot: Math.PI },
    entrance: { x: 24.5, z: 8.8, rot: 0 },
  };

  const CLASSIC_SWEEP_ROUTES = [
    { x0: 8.5, z0: 10.0, x1: 40.5, z1: 10.0 },   // 0 north hall
    { x0: 8.5, z0: 21.5, x1: 40.5, z1: 21.5 },   // 1 middle hall
    { x0: 8.5, z0: 31.5, x1: 40.5, z1: 31.5 },   // 2 south hall
    { x0: 9.0, z0: 9.5, x1: 9.0, z1: 31.5 },     // 3 west hall
    { x0: 23.5, z0: 9.5, x1: 23.5, z1: 31.5 },   // 4 center hall
    { x0: 39.5, z0: 9.5, x1: 39.5, z1: 31.5 },   // 5 east hall
  ];

  const CLASSIC_BULLY_SPOTS = [
    { x: 9.5, z: 15.5 },   // west hall
    { x: 23.5, z: 18.5 },  // center hall
    { x: 39.5, z: 27.5 },  // east hall
  ];

  const CLASSIC_LIGHTS = [
    [24.5, 10], [16.5, 10], [34, 10], [24.5, 21.5], [16.5, 21.5], [34, 21.5],
    [24.5, 31.5], [9.5, 21.5], [39.5, 21.5], [9.5, 31.5], [24.5, 6], [35, 6],
    [28.5, 16], [35.5, 16], [28.5, 26], [35.5, 26], [30.5, 34.5], [16.5, 34.5],
    [16.5, 26.5], [16, 16.5], [11.5, 6.5], [17.5, 6.5], [24.5, 34.5],
  ];

  // ---- hidden trophy room annex (same spot on every map) ----
  const CLASSIC_SECRET = {
    entry: { x: 45, z: 17 },
    poster: { x: 44.6, z: 17 },
    trophy: { x: 46, z: 17 },
    tv: { x: 46, z: 15.7 },
    clock: { x: 46, z: 19.35 },
  };

  // ================= runtime state =================

  let seedKey = null;
  let ROWS = CLASSIC_ROWS;
  let seedInfo = null;             // placement data from MapGen (null = classic)
  let SECRET_REVEALED = false;
  let FURNITURE = null;
  let WAYPOINTS = [];
  let LIGHTS = CLASSIC_LIGHTS;
  let SWEEP_ROUTES = CLASSIC_SWEEP_ROUTES;
  let BULLY_SPOTS = CLASSIC_BULLY_SPOTS;
  let TELEPORTS = CLASSIC_TELEPORTS;
  let EXITS = CLASSIC_EXITS;

  // ================= tiles =================

  function validate() {
    for (let z = 0; z < ROWS.length; z++) {
      if (ROWS[z].length !== W) {
        throw new Error(`Map row ${z} has length ${ROWS[z].length}, expected ${W}`);
      }
    }
  }

  function tile(x, z) {
    if (x < 0 || x >= W || z < 0 || z >= H) return ' ';
    return ROWS[z][x];
  }

  function isWalkableFloor(c) {
    if (c === 's') return SECRET_REVEALED; // the trophy room floor hides until found
    return '.,=;fcmdjpgxv'.includes(c);
  }

  function isSolidChar(c) {
    return c === '%' || c === '#' || c === 'F' || c === 'D' || c === 'S' || c === ' ';
  }

  // ---------- doors ----------

  function doorType(x, z) {
    return EXITS.some(e => e.x === x && e.z === z) ? 'exit' : 'normal';
  }

  function doorLocked(x, z) {
    const e = EXITS.find(e => e.x === x && e.z === z);
    return !!e && e.locked;
  }

  // Find all door tiles with orientation derived from neighbors.
  function findDoors() {
    const doors = [];
    for (let z = 0; z < H; z++) {
      for (let x = 0; x < W; x++) {
        if (tile(x, z) !== 'D') continue;
        const n = tile(x, z - 1), s = tile(x, z + 1), e = tile(x + 1, z), w = tile(x - 1, z);
        const nf = isWalkableFloor(n) || n === 'O' || n === 'D', sf = isWalkableFloor(s) || s === 'O' || s === 'D';
        const ef = isWalkableFloor(e) || e === 'O' || e === 'D', wf = isWalkableFloor(w) || w === 'O' || w === 'D';
        let orient = 'NS'; // door sits in east-west wall line
        if (nf && sf) orient = 'EW';
        else if (ef && wf) orient = 'NS';
        doors.push({ x, z, orient, type: doorType(x, z), locked: doorLocked(x, z) });
      }
    }
    return doors;
  }

  // ---------- room data ----------

  function getRoom(x, z) {
    const c = tile(x, z);
    switch (c) {
      case '.': return 'hall';
      case ',': return 'classroom';
      case '=': return 'cafeteria';
      case ';': return 'library';
      case 'f': return 'faculty';
      case 'c': return 'lobby';
      case 'm': return 'pomp';
      case 'd': return 'office';
      case 'j': return 'janitor';
      case 'v': return 'storage';
      case 's': return 'secret';
      case 'p': return 'playground';
      case 'g': return 'outside';
      default: return null;
    }
  }

  function wallTextureFor(c) {
    switch (c) {
      case ',': return TextureGen.classroomWall(41);
      case '=': return TextureGen.cafeteriaWall();
      case ';': return TextureGen.libraryWall();
      case 'f': return TextureGen.classroomWall(42);
      case 'c': return TextureGen.classroomWall(43);
      case 'm': return TextureGen.classroomWall(44);
      case 'd': return TextureGen.classroomWall(45);
      case 'j': return TextureGen.cinderBlock();
      case '.': return TextureGen.cinderBlock();
      case 'S': return TextureGen.cinderBlock();
      default: return TextureGen.brickWall(2);
    }
  }

  function floorTextureFor(c) {
    switch (c) {
      case '.': return TextureGen.checkeredFloor(50);
      case ',': return TextureGen.woodFloor(51);
      case '=': return TextureGen.cafeteriaFloor();
      case ';': return TextureGen.woodFloor(52);
      case 'f': return TextureGen.redCarpet();
      case 'c': return TextureGen.redCarpet();
      case 'm': return TextureGen.woodFloor(53);
      case 'd': return TextureGen.redCarpet();
      case 'j': return TextureGen.checkeredFloor(55);
      case 'v': return TextureGen.checkeredFloor(56);
      case 's': return TextureGen.redCarpet();
      case 'p': return TextureGen.playgroundFloor();
      case 'g': return TextureGen.grassFloor();
      default: return TextureGen.grassFloor();
    }
  }

  // ---------- secret room ----------

  function secret() {
    return seedInfo ? seedInfo.secret : CLASSIC_SECRET;
  }

  // Open the hidden passage. Returns true if it was actually closed.
  function revealSecret() {
    if (SECRET_REVEALED) return false;
    SECRET_REVEALED = true;
    const e = secret().entry;
    ROWS[e.z] = ROWS[e.z].slice(0, e.x) + 'O' + ROWS[e.z].slice(e.x + 1);
    return true;
  }

  // ================= seed switching =================

  function reset(key) {
    seedKey = SeedRng.normalize(key);
    SECRET_REVEALED = false;
    if (seedKey === null) {
      ROWS = CLASSIC_ROWS.slice();
      seedInfo = null;
      EXITS = CLASSIC_EXITS;
      TELEPORTS = CLASSIC_TELEPORTS;
      SWEEP_ROUTES = CLASSIC_SWEEP_ROUTES;
      BULLY_SPOTS = CLASSIC_BULLY_SPOTS;
      LIGHTS = CLASSIC_LIGHTS;
    } else {
      const gen = MapGen.build(seedKey);
      ROWS = gen.rows;
      seedInfo = gen;
      EXITS = gen.exits.map(e => ({ ...e, locked: true }));
      TELEPORTS = gen.teleports;
      SWEEP_ROUTES = gen.sweepRoutes;
      BULLY_SPOTS = gen.bullySpots;
      LIGHTS = gen.lights;
    }
    validate();
    WAYPOINTS = buildWaypoints();
    FURNITURE = buildFurniture();
  }

  // ---------- waypoints for wandering NPCs ----------

  function buildWaypoints() {
    const pts = new Set();
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (let z = 0; z < H; z++) {
      for (let x = 0; x < W; x++) {
        const c = tile(x, z);
        if (c === 'D' || c === 'O') {
          dirs.forEach(([dx, dz]) => {
            const nc = tile(x + dx, z + dz);
            if (isWalkableFloor(nc)) pts.add(`${x + dx},${z + dz}`);
          });
        } else if (isWalkableFloor(c)) {
          let walkable = 0;
          dirs.forEach(([dx, dz]) => {
            const nc = tile(x + dx, z + dz);
            if (isWalkableFloor(nc) || nc === 'O' || nc === 'D') walkable++;
          });
          if (walkable >= 3) pts.add(`${x},${z}`);
        }
      }
    }
    return Array.from(pts).map(s => {
      const [x, z] = s.split(',').map(Number);
      return { x: x + 0.5, z: z + 0.5 };
    });
  }

  function randomWaypoint(rnd = Math.random) {
    return WAYPOINTS[Math.floor(rnd() * WAYPOINTS.length)];
  }

  function nearestWaypoint(x, z) {
    let best = WAYPOINTS[0], bd = Infinity;
    for (const p of WAYPOINTS) {
      const d = (p.x - x) ** 2 + (p.z - z) ** 2;
      if (d < bd) { bd = d; best = p; }
    }
    return best;
  }

  // ---------- furniture ----------

  // Returns {solid: [{x0,z0,x1,z1}], visual: [{kind,x,z,rot,scale}]}
  function buildFurniture() {
    const solid = [];
    const visual = [];

    function addSolid(x0, z0, x1, z1) {
      solid.push({ x0: Math.min(x0, x1), z0: Math.min(z0, z1), x1: Math.max(x0, x1), z1: Math.max(z0, z1) });
    }
    function addVisual(kind, x, z, rot = 0, scale = 1) {
      visual.push({ kind, x, z, rot, scale });
    }
    // wall-mount helpers: place decorations flush against wall faces
    // (walls occupy their full tile, so faces sit exactly at room boundaries)
    function wallN(z0, depth) { return z0 - depth / 2 - 0.02; }  // north wall of room
    function wallS(z1, depth) { return z1 + 1 + depth / 2 + 0.02; }  // south wall of room
    function wallW(x0, depth) { return x0 - depth / 2 - 0.02; }  // west wall of room
    function wallE(x1, depth) { return x1 + 1 + depth / 2 + 0.02; }  // east wall of room

    function furnishRoom(room) {
      const [x0, z0, x1, z1] = room.r;
      const cx = (x0 + x1) / 2 + 0.5, cz = (z0 + z1) / 2 + 0.5;
      const w = x1 - x0 + 1, d = z1 - z0 + 1;

      // keep every solid inside its room (narrow seed rooms must never
      // spill furniture into the corridors)
      const clip = (s) => {
        s.x0 = Math.max(s.x0, x0 + 0.05); s.x1 = Math.min(s.x1, x1 + 0.95);
        s.z0 = Math.max(s.z0, z0 + 0.05); s.z1 = Math.min(s.z1, z1 + 0.95);
        return s;
      };
      const solidIn = (x0s, z0s, x1s, z1s) => {
        const s = clip({ x0: x0s, z0: z0s, x1: x1s, z1: z1s });
        solid.push({ x0: Math.min(s.x0, s.x1), z0: Math.min(s.z0, s.z1), x1: Math.max(s.x0, s.x1), z1: Math.max(s.z0, s.z1) });
      };

      if (room.type === 'classroom') {
        // chalkboard on north wall
        addVisual('chalkboard', cx, wallN(z0, 0.08), 0);
        if (d >= 5) {
          // teacher desk
          solidIn(cx - 0.7, z0 + 1.2, cx + 0.7, z0 + 2.0);
          addVisual('teacherDesk', cx, z0 + 1.6, 0);
          // student desks: cols x rows
          const cols = w >= 10 ? 4 : 2;
          const rows = 2;
          for (let r = 0; r < rows; r++) {
            const pz = z0 + 2.6 + r * 1.4;
            if (pz + 0.4 > z1 - 0.4) continue;
            for (let c = 0; c < cols; c++) {
              const px = x0 + 1.0 + (w - cols * 1.7) / 2 + c * 1.7;
              solidIn(px - 0.6, pz - 0.4, px + 0.6, pz + 0.4);
              addVisual('desk', px, pz, 0);
            }
          }
        }
        // wall deco
        addVisual('poster', wallW(x0, 0.06), z0 + Math.min(4, d / 2), Math.PI / 2);
        addVisual('poster', wallE(x1, 0.06), z1 - Math.min(4, d / 2), -Math.PI / 2);
        addVisual('clock', cx, wallS(z1, 0.05), Math.PI);
      }

      if (room.type === 'pomp') {
        addVisual('chalkboard', cx, wallN(z0, 0.08), 0);
        solidIn(cx - 0.7, z0 + 1.0, cx + 0.7, z0 + 1.8);
        addVisual('teacherDesk', cx, z0 + 1.4, 0);
        // two student desks (mrs pomp spawns clear of these)
        solidIn(cx - 1.3, cz - 1.1, cx - 0.1, cz - 0.3);
        addVisual('desk', cx - 0.7, cz - 0.7, 0);
        solidIn(cx + 0.5, cz - 1.1, cx + 1.7, cz - 0.3);
        addVisual('desk', cx + 1.1, cz - 0.7, 0);
        addVisual('poster', wallW(x0, 0.06), z0 + 1.2, Math.PI / 2);
      }

      if (room.type === 'faculty') {
        // big round table + chairs
        solidIn(cx - 1.1, cz - 1.1, cx + 1.1, cz + 1.1);
        addVisual('roundTable', cx, cz, 0);
        solidIn(cx - 0.3, cz - 2.05, cx + 0.3, cz - 1.55); addVisual('chair', cx, cz - 1.8, 0);
        solidIn(cx - 0.3, cz + 1.55, cx + 0.3, cz + 2.05); addVisual('chair', cx, cz + 1.8, Math.PI);
        solidIn(cx - 2.05, cz - 0.3, cx - 1.55, cz + 0.3); addVisual('chair', cx - 1.8, cz, Math.PI / 2);
        solidIn(cx + 1.55, cz - 0.3, cx + 2.05, cz + 0.3); addVisual('chair', cx + 1.8, cz, -Math.PI / 2);
        addVisual('poster', wallW(x0, 0.06), z0 + 2, Math.PI / 2);
        addVisual('poster', wallE(x1, 0.06), z1 - 2, -Math.PI / 2);
        addVisual('trophyShelf', cx, wallN(z0, 0.35), 0);
        addVisual('waterFountain', wallE(x1, 0.55), z1 - 1.5, -Math.PI / 2);
      }

      if (room.type === 'cafeteria') {
        const txs = [x0 + 3.2, x0 + 6.4, x0 + 9.6];
        const tzs = [z0 + 2.6, z0 + 4.4]; // spaced so walkways stay open
        txs.forEach((tx) => tzs.forEach((tz) => {
          if (tx > x1 - 2) return;
          solidIn(tx - 0.8, tz - 0.8, tx + 0.8, tz + 0.8);
          addVisual('roundTable', tx, tz, 0);
          // chairs are decorative (visual only) - solid chairs sealed the
          // walkways between tables and made the room impassable
          addVisual('chair', tx, tz - 1.4, 0);
          addVisual('chair', tx, tz + 1.4, Math.PI);
          addVisual('chair', tx - 1.4, tz, Math.PI / 2);
          addVisual('chair', tx + 1.4, tz, -Math.PI / 2);
        }));
        addVisual('bulletin', wallW(x0, 0.06), z0 + 2.5, Math.PI / 2);
        addVisual('clock', cx, wallS(z1, 0.05), Math.PI);
      }

      if (room.type === 'library') {
        // shelf rows along west and north inner walls
        solidIn(x0 + 0.9, z0 + 0.9, x0 + 1.7, z1 - 0.4);
        addVisual('shelfRow', x0 + 1.3, (z0 + z1) / 2 + 0.5, Math.PI / 2);
        if (d >= 4) {
          solidIn(x0 + 4.25, z0 + 0.9, x0 + 5.75, z0 + 1.7);
          addVisual('shelfRow', x0 + 5.0, z0 + 1.3, 0);
        }
        // reading table (notebook sits here)
        solidIn(x1 - 2.0, z0 + 0.1, x1 - 0.4, z0 + 1.1);
        addVisual('roundTable', x1 - 1.2, z0 + 0.6, 0);
      }

      if (room.type === 'office') {
        // the Principal's office - detention happens right here
        // big wooden desk against the north wall
        solidIn(cx - 1.4, z0 + 0.4, cx + 0.4, z0 + 1.2);
        addVisual('teacherDesk', cx - 0.5, z0 + 0.8, 0);
        // office chair behind the desk
        solidIn(cx - 0.75, z0 + 0.05, cx - 0.25, z0 + 0.35);
        addVisual('chair', cx - 0.5, z0 + 0.2, Math.PI);
        // student chair facing the desk (where the punished kid sits)
        solidIn(cx - 0.75, z0 + 1.75, cx - 0.25, z0 + 2.25);
        addVisual('chair', cx - 0.5, z0 + 2.0, 0);
        // bookshelves along the north wall
        addVisual('shelfRow', x0 + 0.5, z0 + 0.27, 0);
        addVisual('shelfRow', x1 - 1.5, z0 + 0.27, 0);
        // decor
        addVisual('clock', x0 + 0.5, wallS(z1, 0.05), Math.PI);
        addVisual('poster', wallW(x0, 0.06), z0 + 1.5, Math.PI / 2);
        addVisual('flag', x0 + 1.5, wallN(z0, 0.1), 0);
      }

      if (room.type === 'janitor') {
        solidIn(cx - 0.275, cz - 0.275, cx + 0.275, cz + 0.275);
        addVisual('bucket', cx, cz, 0);
        addVisual('shelfRow', wallE(x1, 0.5), cz, -Math.PI / 2);
      }

      if (room.type === 'lobby') {
        addVisual('flag', cx + 1, wallN(z0, 0.1), 0);
        addVisual('bulletin', wallW(x0, 0.06), z0 + 1.5, Math.PI / 2);
        solidIn(cx - 3.5, z1 - 1.2, cx - 2.7, z1 - 0.3);
        addVisual('trophyPedestal', cx - 3.1, z1 - 0.75, 0);
        solidIn(cx + 2.7, z1 - 1.2, cx + 3.5, z1 - 0.3);
        addVisual('trophyPedestal', cx + 3.1, z1 - 0.75, 0);
      }
    }

    function furnSecretRoom() {
      const s = secret();
      // hint poster on the sand side of the hidden passage
      addVisual('secretPoster', s.poster.x, s.poster.z, -Math.PI / 2);
      // golden trophy on its pedestal
      addSolid(s.trophy.x - 0.35, s.trophy.z - 0.35, s.trophy.x + 0.35, s.trophy.z + 0.35);
      addVisual('goldTrophy', s.trophy.x, s.trophy.z, 0);
      // static TV + a suspicious clock on the north/south walls
      addVisual('tv', s.tv.x, s.tv.z, Math.PI);
      addVisual('clock87', s.clock.x, s.clock.z, Math.PI);
    }

    const rooms = seedInfo ? seedInfo.rooms : CLASSIC_ROOMS;
    for (const room of rooms) furnishRoom(room);

    if (seedInfo) {
      // generated maps: lockers along wall rows facing halls + a poster
      // beside the north band doors
      const wallRows = [12, 20, 23, 30, 33];
      for (const wz of wallRows) {
        let run = 0;
        for (let x = 8; x <= 40; x++) {
          const c = tile(x, wz);
          if (c === '#' || c === '%') {
            run++;
            const hallAbove = (wz - 1 === 11 || wz - 1 === 22 || wz - 1 === 32);
            const hallBelow = (wz + 1 === 9 || wz + 1 === 21 || wz + 1 === 31);
            if (hallAbove && run % 3 === 1) {
              addVisual('lockers', x + 0.5, wz - 0.07, 0);
            } else if (hallBelow && run % 3 === 1) {
              addVisual('lockers', x + 0.5, wz + 1.07, Math.PI);
            }
          } else {
            run = 0;
          }
        }
      }
      for (let x = 8; x <= 40; x++) {
        if (tile(x, 8) === 'D') {
          addVisual('poster', Math.min(x + 2.2, 40) >= x ? Math.min(x + 2.2, 40) : x - 2.2, 9.07, Math.PI);
        }
      }
    } else {
      // classic layout keeps its original scenic details
      classicDeco(addVisual, addSolid);
    }

    furnSecretRoom();

    // vending machines: solid (player cannot walk through them)
    for (const v of (seedInfo ? seedInfo.vending : CLASSIC_VENDING)) {
      addSolid(v.x - 0.45, v.z - 0.42, v.x + 0.45, v.z + 0.42);
    }

    return { solid, visual };
  }

  // classic map's hand-placed hall decoration / trees / bushes
  function classicDeco(addVisual) {
    // lockers along west hall east wall (x=11) z 13..19 and z 24..29
    for (let z = 14; z <= 18; z += 2) {
      addVisual('lockers', 10.93, z + 0.5, -Math.PI / 2);
    }
    for (let z = 25; z <= 28; z += 2) {
      addVisual('lockers', 10.93, z + 0.5, -Math.PI / 2);
    }
    // lockers in middle hall south wall segments
    for (let x = 10; x <= 38; x += 4) {
      if (tile(x, 23) !== '#' && tile(x, 23) !== 'D') continue;
      if (x === 9) continue;
      addVisual('lockers', x + 0.5, 23.07, Math.PI);
    }
    // posters in north hall on classroom walls
    addVisual('poster', 14.5, 8.95, 0);
    addVisual('poster', 20.5, 8.95, 0);
    addVisual('poster', 29.5, 8.95, 0);
    // water fountains
    addVisual('waterFountain', 8.3, 13.5, -Math.PI / 2);
    addVisual('waterFountain', 40.7, 28.5, Math.PI / 2);
    // clock above center hall
    addVisual('clock', 23.5, 12.96, 0);

    // trees & bushes on the grass around the school
    const trees = [[3, 2], [14, 1], [27, 1], [46, 2], [3, 18], [2, 32], [49, 8], [49, 33],
                   [8, 40], [21, 39], [37, 39], [44, 38], [44, 16], [46, 30]];
    trees.forEach(([x, z], i) => {
      addVisual('tree', x + 0.5, z + 0.5, 0, 0.8 + (i % 3) * 0.15);
    });
    // bushes along the exterior
    for (let x = 8; x <= 40; x += 3) {
      addVisual('bush', x + 0.5, 3.5, 0, 0.7 + (x % 5) * 0.1);
    }
    for (let z = 5; z <= 35; z += 4) {
      addVisual('bush', 6.5, z + 0.5, 0, 0.7 + (z % 5) * 0.1);
    }
    // a few trees at the playground sand edges
    addVisual('tree', 43.5, 29.5, 0, 1.0);
    addVisual('tree', 42.5, 14.5, 0, 0.9);
  }

  // ---------- A* pathfinding ----------

  // Passable for pathing: walkable floors plus open/closed door tiles
  // (NPCs open closed doors as they walk).
  function passableForPath(c) {
    return isWalkableFloor(c) || c === 'D' || c === 'O';
  }

  // Grid A* over tile centers. Returns array of {x, z} world points
  // (cell centers), or null if unreachable / out of budget.
  // ctx is ignored (kept for API compat).
  function findPath(x0, z0, x1, z1, ctx = null, maxSteps = 4000) {
    const sx = Math.floor(x0), sz = Math.floor(z0);
    const gx = Math.floor(x1), gz = Math.floor(z1);
    const key = (x, z) => z * W + x;
    const inB = (x, z) => x >= 0 && x < W && z >= 0 && z < H;
    if (!inB(sx, sz) || !inB(gx, gz)) return null;
    if (!passableForPath(tile(gx, gz))) return null;

    const gScore = new Float32Array(W * H).fill(Infinity);
    const came = new Int32Array(W * H).fill(-1);
    // simple open list ordered by f = g + h
    const open = [];
    const push = (x, z, g, h) => {
      // binary insert (list stays small in practice)
      const f = g + h;
      let lo = 0, hi = open.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (open[mid].f > f) hi = mid; else lo = mid + 1;
      }
      open.splice(lo, 0, { x, z, f, g });
    };

    const startKey = key(sx, sz);
    gScore[startKey] = 0;
    push(sx, sz, 0, Math.abs(gx - sx) + Math.abs(gz - sz));

    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let expanded = 0;
    while (open.length) {
      if (++expanded > maxSteps) return null;
      const cur = open.shift();
      const ck = key(cur.x, cur.z);
      if (ck === key(gx, gz)) {
        const path = [];
        let k = ck;
        while (k !== -1) {
          path.push({ x: (k % W) + 0.5, z: Math.floor(k / W) + 0.5 });
          k = came[k];
        }
        path.reverse();
        return path;
      }
      for (const [dx, dz] of dirs) {
        const nx = cur.x + dx, nz = cur.z + dz;
        if (!inB(nx, nz)) continue;
        if (!passableForPath(tile(nx, nz))) continue;
        const nk = key(nx, nz);
        const ng = cur.g + 1;
        if (ng < gScore[nk]) {
          gScore[nk] = ng;
          came[nk] = ck;
          push(nx, nz, ng, Math.abs(gx - nx) + Math.abs(gz - nz));
        }
      }
    }
    return null;
  }

  // ================= exports =================

  reset(null); // classic map ready at load (matches the pre-refactor contract)

  return {
    W, H,
    reset,
    seedKeyOf: () => seedKey,
    validate,
    tile,
    isWalkableFloor,
    isSolidChar,
    getRoom,
    findDoors,
    wallTextureFor,
    floorTextureFor,
    randomWaypoint,
    nearestWaypoint,
    findPath,
    WAYPOINTS,
    FURNITURE,
    LIGHTS,
    SWEEP_ROUTES,
    BULLY_SPOTS,
    TELEPORTS,
    EXITS,
    secret,
    revealSecret,
    SECRET_REVEALED,
    get ROWS() { return ROWS; },
    // computed views so the live values can't go stale
    get SPAWNS() { return seedInfo ? seedInfo.spawns : CLASSIC_SPAWNS; },
    get NOTEBOOKS() { return seedInfo ? seedInfo.notebooks : CLASSIC_NOTEBOOKS; },
    get VENDING() { return seedInfo ? seedInfo.vending : CLASSIC_VENDING; },
    get ITEM_SPAWNS() { return seedInfo ? seedInfo.itemSpawns : CLASSIC_ITEM_SPAWNS; },
  };
})();