'use strict';

// World renderer: builds the school from tile data, low-res retro pipeline.

const GameRenderer = (() => {

  let scene, camera, renderer;
  let spriteGroup, furnitureGroup, worldGroup;
  let WALL_H = 1.6;

  function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8fb8e0);
    scene.fog = new THREE.Fog(0x9db8d8, 9, 26);

    camera = new THREE.PerspectiveCamera(70, 16 / 9, 0.05, 100);
    camera.rotation.order = 'YXZ';

    renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
    renderer.setSize(960, 540, false);
    renderer.setPixelRatio(1);
    const canvas = renderer.domElement;
    canvas.id = 'game-canvas';
    const old = document.getElementById('game-canvas');
    if (old) old.parentNode.replaceChild(canvas, old);

    // lighting (balanced so floors don't clip to pure white)
    const ambient = new THREE.AmbientLight(0xffffff, 0.52);
    scene.add(ambient);
    const hemi = new THREE.HemisphereLight(0xd8e8ff, 0x504030, 0.38);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff2d8, 0.18);
    sun.position.set(15, 25, 10);
    scene.add(sun);

    spriteGroup = new THREE.Group();
    furnitureGroup = new THREE.Group();
    worldGroup = new THREE.Group();
    scene.add(spriteGroup);
    scene.add(furnitureGroup);
    scene.add(worldGroup);
  }

  // tear down the world meshes (used when switching maps/seed)
  function disposeObject(obj) {
    obj.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        for (const m of mats) {
          if (m.map) m.map.dispose();
          m.dispose();
        }
      }
    });
  }

  function rebuildWorld() {
    disposeObject(worldGroup);
    while (worldGroup.children.length) worldGroup.remove(worldGroup.children[0]);
    buildWorld();
  }

  function buildWorld() {
    const W = MapData.W, H = MapData.H;
    MapData.validate();

    // ---- ground (large grass field) ----
    const grassTex = TextureGen.grassFloor();
    grassTex.wrapS = grassTex.wrapT = THREE.RepeatWrapping;
    grassTex.repeat.set(40, 40);
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(240, 240),
      new THREE.MeshLambertMaterial({ map: grassTex })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(24.5, -0.02, 20);
    worldGroup.add(ground);

    // ---- floors per tile (merged per texture to cut draw calls) ----
    const floorBuckets = {};
    for (let z = 0; z < H; z++) {
      for (let x = 0; x < W; x++) {
        const c = MapData.tile(x, z);
        if (!MapData.isWalkableFloor(c)) continue;
        const tex = MapData.floorTextureFor(c);
        if (!floorBuckets[tex.uuid]) floorBuckets[tex.uuid] = { tex, quads: [] };
        floorBuckets[tex.uuid].quads.push([x, z]);
      }
    }
    for (const key of Object.keys(floorBuckets)) {
      const { tex, quads } = floorBuckets[key];
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(quads.length * 12);
      const uvs = new Float32Array(quads.length * 8);
      const indices = new Uint16Array(quads.length * 6);
      quads.forEach(([x, z], i) => {
        const x0 = x, x1 = x + 1, z0 = z, z1 = z + 1;
        const v = i * 12, u = i * 8, idx = i * 6;
        positions[v] = x0; positions[v + 1] = 0.001; positions[v + 2] = z0;
        positions[v + 3] = x1; positions[v + 4] = 0.001; positions[v + 5] = z0;
        positions[v + 6] = x1; positions[v + 7] = 0.001; positions[v + 8] = z1;
        positions[v + 9] = x0; positions[v + 10] = 0.001; positions[v + 11] = z1;
        uvs[u] = 0; uvs[u + 1] = 0;
        uvs[u + 2] = 1; uvs[u + 3] = 0;
        uvs[u + 4] = 1; uvs[u + 5] = 1;
        uvs[u + 6] = 0; uvs[u + 7] = 1;
        // upward-facing winding
        indices[idx] = i * 4; indices[idx + 1] = i * 4 + 2; indices[idx + 2] = i * 4 + 1;
        indices[idx + 3] = i * 4; indices[idx + 4] = i * 4 + 3; indices[idx + 5] = i * 4 + 2;
      });
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
      geo.setIndex(new THREE.BufferAttribute(indices, 1));
      geo.computeVertexNormals();
      const m = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: tex }));
      worldGroup.add(m);
    }

    // ---- walls ----
    const wallMatCache = {};
    function wallMat(c) {
      if (!wallMatCache[c]) wallMatCache[c] = new THREE.MeshLambertMaterial({ map: MapData.wallTextureFor(c) });
      return wallMatCache[c];
    }

    for (let z = 0; z < H; z++) {
      for (let x = 0; x < W; x++) {
        const c = MapData.tile(x, z);
        if (c === 'F') {
          // fence: full-tile chain-link box so the visual matches the collision
          // (a thin line at the tile edge looked like an invisible wall)
          const mat = new THREE.MeshLambertMaterial({
            map: TextureGen.fenceTileTexture(), transparent: true, alphaTest: 0.5, side: THREE.DoubleSide,
          });
          const m = new THREE.Mesh(new THREE.BoxGeometry(1, 1.05, 1), mat);
          m.position.set(x + 0.5, 0.5, z + 0.5);
          worldGroup.add(m);
          continue;
        }
        if (c !== '%' && c !== '#' && c !== 'S') continue;

        const n = MapData.tile(x, z - 1), s = MapData.tile(x, z + 1);
        const e = MapData.tile(x + 1, z), w = MapData.tile(x - 1, z);
        const nf = MapData.isWalkableFloor(n) || n === 'D' || n === 'O';
        const sf = MapData.isWalkableFloor(s) || s === 'D' || s === 'O';
        const ef = MapData.isWalkableFloor(e) || e === 'D' || e === 'O';
        const wf = MapData.isWalkableFloor(w) || w === 'D' || w === 'O';

        const isExt = c === '%';
        let texN, texS, texE, texW;
        const ext = isExt ? TextureGen.brickWall(7) : TextureGen.cinderBlock();
        texN = isExt ? (nf ? TextureGen.outsideWall() : ext) : (nf ? MapData.wallTextureFor(n) : ext);
        texS = isExt ? (sf ? TextureGen.outsideWall() : ext) : (sf ? MapData.wallTextureFor(s) : ext);
        texE = isExt ? (ef ? TextureGen.outsideWall() : ext) : (ef ? MapData.wallTextureFor(e) : ext);
        texW = isExt ? (wf ? TextureGen.outsideWall() : ext) : (wf ? MapData.wallTextureFor(w) : ext);

        // the hidden passage wall: sand on the outer face, secret room on the inner
        if (c === 'S') {
          texE = (e === 'p') ? TextureGen.brickWall(7) : (ef ? MapData.wallTextureFor('S') : ext);
          texW = (w === 'p') ? TextureGen.brickWall(7) : (wf ? MapData.wallTextureFor('S') : ext);
          texN = (n === 'p') ? TextureGen.brickWall(7) : (nf ? MapData.wallTextureFor('S') : ext);
          texS = (s === 'p') ? TextureGen.brickWall(7) : (sf ? MapData.wallTextureFor('S') : ext);
        }

        // run orientation
        if ((nf && sf) || (!ef && !wf)) {
          // wall runs east-west (blocks north/south); full-tile footprint
          const geo = new THREE.BoxGeometry(1, WALL_H, 1);
          const mat = [
            new THREE.MeshLambertMaterial({ map: texE || ext }),
            new THREE.MeshLambertMaterial({ map: texW || ext }),
            new THREE.MeshLambertMaterial({ color: 0x333333 }),
            new THREE.MeshLambertMaterial({ color: 0x333333 }),
            new THREE.MeshLambertMaterial({ map: texS || ext }),
            new THREE.MeshLambertMaterial({ map: texN || ext }),
          ];
          const m = new THREE.Mesh(geo, mat);
          m.position.set(x + 0.5, WALL_H / 2, z + 0.5);
          worldGroup.add(m);
        } else {
          // wall runs north-south (blocks east/west); full-tile footprint
          const geo = new THREE.BoxGeometry(1, WALL_H, 1);
          const mat = [
            new THREE.MeshLambertMaterial({ map: texE || ext }),
            new THREE.MeshLambertMaterial({ map: texW || ext }),
            new THREE.MeshLambertMaterial({ color: 0x333333 }),
            new THREE.MeshLambertMaterial({ color: 0x333333 }),
            new THREE.MeshLambertMaterial({ map: texS || ext }),
            new THREE.MeshLambertMaterial({ map: texN || ext }),
          ];
          const m = new THREE.Mesh(geo, mat);
          m.position.set(x + 0.5, WALL_H / 2, z + 0.5);
          worldGroup.add(m);
        }
      }
    }

    // ---- ceiling (single plane over the building interior) ----
    const ceilTex = TextureGen.ceilingTile();
    ceilTex.wrapS = ceilTex.wrapT = THREE.RepeatWrapping;
    ceilTex.repeat.set(33, 31);
    const ceilMat = new THREE.MeshLambertMaterial({ map: ceilTex, side: THREE.BackSide });
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(33, 31), ceilMat);
    ceiling.rotation.x = Math.PI / 2; // faces down
    ceiling.position.set(24.5, WALL_H + 0.02, 20.5);
    worldGroup.add(ceiling);

    // ceiling lights (simple glowing boxes) - positions come from the map
    const lightGeo = new THREE.BoxGeometry(0.9, 0.05, 0.2);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xfff8d8 });
    for (const [lx, lz] of MapData.LIGHTS) {
      const m = new THREE.Mesh(lightGeo, lightMat);
      m.position.set(lx, WALL_H - 0.04, lz);
      worldGroup.add(m);
    }

    // ---- doors ----
    DoorSystem.clearAll();
    DoorSystem.init(scene);

    // ---- furniture ----
    buildFurnitureMeshes();

    // ---- sky decorations: distant hills ----
    const hillGeo = new THREE.SphereGeometry(30, 8, 6);
    const hillMat = new THREE.MeshLambertMaterial({ color: 0x6a9a5a });
    const hills = [[-25, -30, 0], [70, -40, 0], [80, 25, 0], [-30, 60, 0], [20, 75, 0]];
    for (const [hx, hz, hr] of hills) {
      const m = new THREE.Mesh(hillGeo, hillMat);
      m.position.set(hx, -8, hz);
      m.scale.set(1, 0.4, 1);
      worldGroup.add(m);
    }
  }

  // ---------- furniture meshes ----------

  const posterVariants = [
    () => TextureGen.poster(1, 'MATH IS FUN!', ['2 + 2 = 4', 'YOU CAN DO IT!'], '#e8e0a0', '#333'),
    () => TextureGen.poster(2, 'READING CORNER', ['BOOKS ARE', 'YOUR FRIENDS'], '#a0c8e8', '#222'),
    () => TextureGen.poster(3, 'NO RUNNING', ['IN THE HALLS', '- The Principal'], '#e8a0a0', '#333'),
    () => TextureGen.poster(4, 'SCIENCE!', ['E = MC^2', 'WOW!'], '#a8e0a0', '#222'),
    () => TextureGen.poster(5, 'BE KIND', ['SHARE YOUR', 'SNACKS'], '#e8c8a0', '#333'),
  ];

  function buildFurnitureMeshes() {
    // wipe previous furniture (rebuild on map switches)
    while (furnitureGroup.children.length) furnitureGroup.remove(furnitureGroup.children[0]);
    const { solid, visual } = MapData.FURNITURE;
    const solidSet = new Set(solid.map(s => `${s.x0},${s.z0},${s.x1},${s.z1}`));

    for (const v of visual) {
      let mesh = null;
      switch (v.kind) {
        case 'chalkboard': {
          mesh = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 1.1), [
            new THREE.MeshLambertMaterial({ color: 0x5a4632 }),
            new THREE.MeshLambertMaterial({ color: 0x5a4632 }),
            new THREE.MeshLambertMaterial({ color: 0x5a4632 }),
            new THREE.MeshLambertMaterial({ color: 0x5a4632 }),
            new THREE.MeshLambertMaterial({ map: TextureGen.chalkboardTexture() }),
            new THREE.MeshLambertMaterial({ color: 0x5a4632 }),
          ]);
          mesh.position.set(v.x, 1.05, v.z);
          mesh.rotation.y = v.rot || 0;
          break;
        }
        case 'teacherDesk': {
          const tex = TextureGen.teacherDeskTexture();
          mesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.8, 0.9), [
            new THREE.MeshLambertMaterial({ map: tex }),
            new THREE.MeshLambertMaterial({ map: tex }),
            new THREE.MeshLambertMaterial({ map: tex }),
            new THREE.MeshLambertMaterial({ map: tex }),
            new THREE.MeshLambertMaterial({ map: tex }),
            new THREE.MeshLambertMaterial({ map: tex }),
          ]);
          mesh.position.set(v.x, 0.4, v.z);
          break;
        }
        case 'desk': {
          const tex = TextureGen.deskTexture();
          const mat = new THREE.MeshLambertMaterial({ map: tex });
          mesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 0.8), mat);
          mesh.position.set(v.x, 0.25, v.z);
          break;
        }
        case 'roundTable': {
          const tex = TextureGen.tableRound();
          mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.6, 12), [
            new THREE.MeshLambertMaterial({ map: tex }),
            new THREE.MeshLambertMaterial({ map: tex }),
            new THREE.MeshLambertMaterial({ color: 0x5a4632 }),
          ]);
          mesh.position.set(v.x, 0.3, v.z);
          break;
        }
        case 'chair': {
          mesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5),
            new THREE.MeshLambertMaterial({ color: 0x8a5a2a }));
          mesh.position.set(v.x, 0.25, v.z);
          mesh.rotation.y = v.rot || 0;
          break;
        }
        case 'shelfRow': {
          const tex = TextureGen.bookshelfTexture();
          mesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.4, 0.5), [
            new THREE.MeshLambertMaterial({ map: tex }),
            new THREE.MeshLambertMaterial({ map: tex }),
            new THREE.MeshLambertMaterial({ map: tex }),
            new THREE.MeshLambertMaterial({ map: tex }),
            new THREE.MeshLambertMaterial({ color: 0x4a3018 }),
            new THREE.MeshLambertMaterial({ color: 0x4a3018 }),
          ]);
          mesh.position.set(v.x, 0.7, v.z);
          mesh.rotation.y = v.rot || 0;
          break;
        }
        case 'lockers': {
          mesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 1.2), [
            new THREE.MeshLambertMaterial({ color: 0x777 }),
            new THREE.MeshLambertMaterial({ color: 0x777 }),
            new THREE.MeshLambertMaterial({ color: 0x777 }),
            new THREE.MeshLambertMaterial({ color: 0x777 }),
            new THREE.MeshLambertMaterial({ map: TextureGen.lockersTexture() }),
            new THREE.MeshLambertMaterial({ color: 0x777 }),
          ]);
          mesh.position.set(v.x, 0.6, v.z);
          mesh.rotation.y = v.rot || 0;
          break;
        }
        case 'poster': {
          const tex = posterVariants[Math.floor(Math.abs(v.x * 7 + v.z * 13)) % posterVariants.length]();
          mesh = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.06, 1.0), [
            new THREE.MeshLambertMaterial({ color: 0x999 }),
            new THREE.MeshLambertMaterial({ color: 0x999 }),
            new THREE.MeshLambertMaterial({ color: 0x999 }),
            new THREE.MeshLambertMaterial({ color: 0x999 }),
            new THREE.MeshLambertMaterial({ map: tex }),
            new THREE.MeshLambertMaterial({ color: 0x999 }),
          ]);
          mesh.position.set(v.x, 1.15, v.z);
          mesh.rotation.y = v.rot || 0;
          break;
        }
        case 'bulletin': {
          mesh = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.06, 1.4), [
            new THREE.MeshLambertMaterial({ color: 0x6a4a2a }),
            new THREE.MeshLambertMaterial({ color: 0x6a4a2a }),
            new THREE.MeshLambertMaterial({ color: 0x6a4a2a }),
            new THREE.MeshLambertMaterial({ color: 0x6a4a2a }),
            new THREE.MeshLambertMaterial({ map: TextureGen.bulletinTexture() }),
            new THREE.MeshLambertMaterial({ color: 0x6a4a2a }),
          ]);
          mesh.position.set(v.x, 1.1, v.z);
          mesh.rotation.y = v.rot || 0;
          break;
        }
        case 'clock': {
          mesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.7), [
            new THREE.MeshLambertMaterial({ color: 0x333 }),
            new THREE.MeshLambertMaterial({ color: 0x333 }),
            new THREE.MeshLambertMaterial({ color: 0x333 }),
            new THREE.MeshLambertMaterial({ color: 0x333 }),
            new THREE.MeshLambertMaterial({ map: TextureGen.clockTexture() }),
            new THREE.MeshLambertMaterial({ color: 0x333 }),
          ]);
          mesh.position.set(v.x, 1.45, v.z);
          mesh.rotation.y = v.rot || 0;
          break;
        }
        case 'secretPoster': {
          mesh = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.1, 0.8), [
            new THREE.MeshLambertMaterial({ color: 0x999 }),
            new THREE.MeshLambertMaterial({ map: TextureGen.secretPosterTexture() }),
            new THREE.MeshLambertMaterial({ color: 0x999 }),
            new THREE.MeshLambertMaterial({ color: 0x999 }),
            new THREE.MeshLambertMaterial({ color: 0x999 }),
            new THREE.MeshLambertMaterial({ color: 0x999 }),
          ]);
          mesh.position.set(v.x, 0.55, v.z);
          mesh.rotation.y = v.rot || 0;
          break;
        }
        case 'goldTrophy': {
          mesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.7),
            new THREE.MeshLambertMaterial({ color: 0x8a6a3a }));
          mesh.position.set(v.x, 0.45, v.z);
          const cup = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.5, 0.08), [
            new THREE.MeshLambertMaterial({ color: 0x555 }),
            new THREE.MeshLambertMaterial({ color: 0x555 }),
            new THREE.MeshLambertMaterial({ color: 0x555 }),
            new THREE.MeshLambertMaterial({ color: 0x555 }),
            new THREE.MeshLambertMaterial({ map: TextureGen.goldTrophyTexture() }),
            new THREE.MeshLambertMaterial({ color: 0x555 }),
          ]);
          cup.position.set(0, 0.55, 0);
          mesh.add(cup);
          break;
        }
        case 'tv': {
          mesh = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.06, 0.7), [
            new THREE.MeshLambertMaterial({ color: 0x333 }),
            new THREE.MeshLambertMaterial({ color: 0x333 }),
            new THREE.MeshLambertMaterial({ color: 0x333 }),
            new THREE.MeshLambertMaterial({ color: 0x333 }),
            new THREE.MeshLambertMaterial({ map: TextureGen.tvTexture() }),
            new THREE.MeshLambertMaterial({ color: 0x333 }),
          ]);
          mesh.position.set(v.x, 1.2, v.z);
          mesh.rotation.y = v.rot || 0;
          break;
        }
        case 'clock87': {
          mesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.7), [
            new THREE.MeshLambertMaterial({ color: 0x4a3210 }),
            new THREE.MeshLambertMaterial({ color: 0x4a3210 }),
            new THREE.MeshLambertMaterial({ color: 0x4a3210 }),
            new THREE.MeshLambertMaterial({ color: 0x4a3210 }),
            new THREE.MeshLambertMaterial({ map: TextureGen.clock87Texture() }),
            new THREE.MeshLambertMaterial({ color: 0x4a3210 }),
          ]);
          mesh.position.set(v.x, 1.45, v.z);
          mesh.rotation.y = v.rot || 0;
          break;
        }
        case 'flag': {
          mesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.3, 0.05),
            new THREE.MeshLambertMaterial({ color: 0x8a6a3a }));
          mesh.position.set(v.x, 0.65, v.z);
          const flag = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.05, 0.65), [
            new THREE.MeshLambertMaterial({ color: 0x999 }),
            new THREE.MeshLambertMaterial({ color: 0x999 }),
            new THREE.MeshLambertMaterial({ color: 0x999 }),
            new THREE.MeshLambertMaterial({ color: 0x999 }),
            new THREE.MeshLambertMaterial({ map: TextureGen.flagTexture() }),
            new THREE.MeshLambertMaterial({ color: 0x999 }),
          ]);
          flag.position.set(0.5, 0.5, 0);
          mesh.add(flag);
          break;
        }
        case 'trophyShelf': {
          mesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 0.35),
            new THREE.MeshLambertMaterial({ color: 0x5a3a1a }));
          mesh.position.set(v.x, 0.95, v.z);
          const trophy = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.35, 0.05), [
            new THREE.MeshLambertMaterial({ color: 0x555 }),
            new THREE.MeshLambertMaterial({ color: 0x555 }),
            new THREE.MeshLambertMaterial({ color: 0x555 }),
            new THREE.MeshLambertMaterial({ color: 0x555 }),
            new THREE.MeshLambertMaterial({ map: TextureGen.trophyTexture() }),
            new THREE.MeshLambertMaterial({ color: 0x555 }),
          ]);
          trophy.position.set(-0.4, 0.35, 0);
          mesh.add(trophy);
          const trophy2 = trophy.clone();
          trophy2.position.set(0.4, 0.35, 0);
          mesh.add(trophy2);
          break;
        }
        case 'trophyPedestal': {
          mesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.7),
            new THREE.MeshLambertMaterial({ color: 0x8a6a3a }));
          mesh.position.set(v.x, 0.45, v.z);
          const trophy = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.3, 0.05), [
            new THREE.MeshLambertMaterial({ color: 0x555 }),
            new THREE.MeshLambertMaterial({ color: 0x555 }),
            new THREE.MeshLambertMaterial({ color: 0x555 }),
            new THREE.MeshLambertMaterial({ color: 0x555 }),
            new THREE.MeshLambertMaterial({ map: TextureGen.trophyTexture() }),
            new THREE.MeshLambertMaterial({ color: 0x555 }),
          ]);
          trophy.position.set(0, 0.55, 0);
          mesh.add(trophy);
          break;
        }
        case 'waterFountain': {
          mesh = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.9, 0.55),
            new THREE.MeshLambertMaterial({ map: TextureGen.waterFountainTexture() }));
          mesh.position.set(v.x, 0.45, v.z);
          mesh.rotation.y = v.rot || 0;
          break;
        }
        case 'detentionDesk': {
          mesh = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 0.9),
            new THREE.MeshLambertMaterial({ map: TextureGen.detentionDeskTexture() }));
          mesh.position.set(v.x, 0.25, v.z);
          break;
        }
        case 'bucket': {
          mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.24, 0.45, 10),
            new THREE.MeshLambertMaterial({ color: 0x8899aa }));
          mesh.position.set(v.x, 0.22, v.z);
          break;
        }
        case 'tree': {
          mesh = makeSprite(TextureGen.treeSprite(1 + (v.x * 13) % 5), 1.3 * (v.scale || 1), 1.7 * (v.scale || 1));
          mesh.position.set(v.x, 0.85 * (v.scale || 1), v.z);
          break;
        }
        case 'bush': {
          mesh = makeSprite(TextureGen.bushSprite(2 + (v.z * 7) % 4), 0.9 * (v.scale || 1), 0.65 * (v.scale || 1));
          mesh.position.set(v.x, 0.32 * (v.scale || 1), v.z);
          break;
        }
      }
      if (mesh) {
        furnitureGroup.add(mesh);
      }
    }

    // vending machines
    for (const v of MapData.VENDING) {
      const color = v.kind === 'bsoda' ? '#2a5a8a' : '#8a6a2a';
      const label = v.kind === 'bsoda' ? 'BSODA' : 'ZESTY';
      const tex = TextureGen.vendingFront(label, color);
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, 0.8), [
        new THREE.MeshLambertMaterial({ color: 0x444 }),
        new THREE.MeshLambertMaterial({ color: 0x444 }),
        new THREE.MeshLambertMaterial({ color: 0x444 }),
        new THREE.MeshLambertMaterial({ color: 0x444 }),
        new THREE.MeshLambertMaterial({ map: tex }),
        new THREE.MeshLambertMaterial({ color: 0x444 }),
      ]);
      mesh.position.set(v.x, 0.8, v.z);
      mesh.rotation.y = v.rot || 0;
      mesh.userData.vending = v;
      furnitureGroup.add(mesh);
    }
  }

  // ---------- sprites ----------

  function makeSprite(tex, w, h, centerY = 0.5) {
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: false });
    const s = new THREE.Sprite(mat);
    s.scale.set(w, h, 1);
    s.center.set(0.5, centerY);
    return s;
  }

  function createCharacterSprite(frames, w, h) {
    const mat = new THREE.SpriteMaterial({ map: frames[0] });
    const s = new THREE.Sprite(mat);
    s.scale.set(w, h, 1);
    s.center.set(0.5, 0.02);
    return {
      sprite: s,
      frames,
      frame: 0,
      timer: 0,
      setFrame(i) {
        if (this.frames[i] && mat.map !== this.frames[i]) {
          mat.map = this.frames[i];
          mat.needsUpdate = true;
        }
        this.frame = i;
      },
      setFrames(f) { this.frames = f; this.timer = 0; },
      setFrameLoop(f) { this.frames = f; this.setFrame(0); },
      update(dt, fps = 8) {
        this.timer += dt;
        if (this.timer > 1 / fps) {
          this.timer = 0;
          this.setFrame((this.frame + 1) % Math.max(1, this.frames.length));
        }
      },
      setVisible(v) { s.visible = v; },
    };
  }

  function resize() { /* fixed resolution */ }

  function render() {
    renderer.render(scene, camera);
  }

  return {
    init, buildWorld, rebuildWorld, render, resize,
    makeSprite, createCharacterSprite,
    get scene() { return scene; },
    get camera() { return camera; },
    get renderer() { return renderer; },
    get spriteGroup() { return spriteGroup; },
    get WALL_H() { return WALL_H; },
  };
})();
