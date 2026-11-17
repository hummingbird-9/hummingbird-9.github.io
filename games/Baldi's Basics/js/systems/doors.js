'use strict';

// Door system: meshes, swing animation, auto-close, locks, wedges.

const DoorSystem = (() => {

  const doors = []; // door state records
  const doorByKey = {};
  const OPEN_ANGLE = Math.PI * 0.62; // 111 degrees fully open
  const AUTO_CLOSE = 3.0; // seconds
  const OPEN_SPEED = 4.5; // rad/s
  const CLOSE_SPEED = 3.0;

  function init(scene) {
    const defs = MapData.findDoors();
    for (const d of defs) {
      const door = createDoor(scene, d);
      doorByKey[`${d.x},${d.z}`] = door;
      doors.push(door);
    }
  }

  // drop every door (map switch) - disposes meshes and clears state
  function clearAll() {
    for (const door of doors) {
      if (door.group) {
        door.group.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            for (const m of mats) {
              if (m.map) m.map.dispose();
              m.dispose();
            }
          }
        });
        if (door.group.parent) door.group.parent.remove(door.group);
      }
    }
    doors.length = 0;
    for (const k of Object.keys(doorByKey)) delete doorByKey[k];
  }

  function isRoomChar(c) {
    return ',=;fcmjd'.includes(c);
  }

  function createDoor(scene, d) {
    const group = new THREE.Group();
    const wx = d.x + 0.5, wz = d.z + 0.5;

    // decide swing side (toward room; exit doors swing toward outside)
    let swingToNorth = false, swingToEast = false; // swing direction for EW / NS doors
    if (d.orient === 'EW') {
      const n = MapData.tile(d.x, d.z - 1), s = MapData.tile(d.x, d.z + 1);
      const roomN = isRoomChar(n), roomS = isRoomChar(s);
      const outsideN = n === 'g' || n === ' ', outsideS = s === 'g' || s === ' ';
      if (d.type === 'exit') {
        if (outsideN && !outsideS) swingToNorth = false; // swing south (outdoors)
        else if (outsideS && !outsideN) swingToNorth = true; // swing north (outdoors)
        else swingToNorth = !roomN;
      } else {
        swingToNorth = roomN && !roomS;
      }
    } else {
      const e = MapData.tile(d.x + 1, d.z), w = MapData.tile(d.x - 1, d.z);
      const roomE = isRoomChar(e), roomW = isRoomChar(w);
      const outsideE = e === 'g' || e === ' ', outsideW = w === 'g' || w === ' ';
      if (d.type === 'exit') {
        if (outsideE && !outsideW) swingToEast = false; // swing west (outdoors)
        else if (outsideW && !outsideE) swingToEast = true; // swing east (outdoors)
        else swingToEast = !roomE;
      } else {
        swingToEast = roomE && !roomW;
      }
    }

    // panel + pivot
    const pivot = new THREE.Group();
    const isLocked = d.locked && !d.unlocked;
    const tex = d.type === 'exit' ? TextureGen.exitDoorTexture() : TextureGen.doorTexture(isLocked);
    const mat = new THREE.MeshLambertMaterial({ map: tex });
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.94, 1.52, 0.1), mat);
    panel.castShadow = false;
    const handle = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.12, 0.08),
      new THREE.MeshLambertMaterial({ color: 0xccaa33 })
    );
    handle.position.set(0.36, 0.95, 0.11);
    panel.add(handle);

    // orient panel within pivot
    if (d.orient === 'EW') {
      // panel spans x, pivot hinge at west end
      panel.position.set(0.47, 0, 0);
      pivot.position.set(wx - 0.5, 0, wz);
    } else {
      // panel spans z, pivot hinge at south end
      panel.position.set(0, 0, -0.47);
      pivot.position.set(wx, 0, wz + 0.5);
    }
    pivot.add(panel);
    group.add(pivot);

    // door frame: two thin side jambs + a lintel (no fill block,
    // so the doorway stays open and the panel never clips a solid frame)
    const frameMat = new THREE.MeshLambertMaterial({ color: 0x5a4632 });
    let jambA, jambB, lintel;
    if (d.orient === 'EW') {
      // wall runs east-west: jambs at the tile's west/east ends, lintel across the top
      jambA = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.6, 0.3), frameMat);
      jambA.position.set(wx - 0.5 + 0.07, 0, wz);
      jambB = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.6, 0.3), frameMat);
      jambB.position.set(wx + 0.5 - 0.07, 0, wz);
      lintel = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.16, 0.3), frameMat);
      lintel.position.set(wx, 1.52, wz);
    } else {
      // wall runs north-south: jambs at the tile's north/south ends
      jambA = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.6, 0.14), frameMat);
      jambA.position.set(wx, 0, wz - 0.5 + 0.07);
      jambB = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.6, 0.14), frameMat);
      jambB.position.set(wx, 0, wz + 0.5 - 0.07);
      lintel = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.16, 1.0), frameMat);
      lintel.position.set(wx, 1.52, wz);
    }
    group.add(jambA);
    group.add(jambB);
    group.add(lintel);

    scene.add(group);

    const door = {
      x: d.x, z: d.z, orient: d.orient, type: d.type,
      locked: isLocked, unlocked: !!d.unlocked, origLocked: isLocked,
      wedged: false,
      angle: 0, target: 0,
      swingToNorth, swingToEast,
      autoCloseTimer: 0,
      group, pivot, panel,
      blocked: true,
    };
    return door;
  }

  function resetAll() {
    for (const door of doors) {
      door.target = 0;
      door.angle = 0;
      door.blocked = true;
      door.locked = door.origLocked;
      door.unlocked = false;
      door.wedged = false;
      door.autoCloseTimer = 0;
      door.pivot.rotation.y = 0;
      door.panel.material.map = door.type === 'exit'
        ? TextureGen.exitDoorTexture()
        : TextureGen.doorTexture(door.locked);
      door.panel.material.needsUpdate = true;
    }
  }

  function doorKey(x, z) { return `${x},${z}`; }

  function getDoor(x, z) {
    return doorByKey[doorKey(x, z)] || null;
  }

  function angleDir(door) {
    // sign of the swing
    if (door.orient === 'EW') return door.swingToNorth ? 1 : -1;
    return door.swingToEast ? -1 : 1;
  }

  function update(dt, game) {
    for (const door of doors) {
      const dir = angleDir(door);
      const target = door.target * dir * OPEN_ANGLE;
      const maxStep = (door.target > 0.5 ? OPEN_SPEED : CLOSE_SPEED) * dt;
      const diff = target - door.angle;
      if (Math.abs(diff) < 1e-4) {
        door.angle = target;
      } else {
        door.angle += Math.sign(diff) * Math.min(Math.abs(diff), maxStep);
      }
      door.pivot.rotation.y = door.angle;

      // audio feedback on state change
      if (Math.abs(door.angle) > OPEN_ANGLE * 0.55 && door.blocked) {
        door.blocked = false;
      } else if (Math.abs(door.angle) < OPEN_ANGLE * 0.3 && !door.blocked) {
        door.blocked = true;
        if (door.wasOpenForSound) {
          AudioSys.SFX.doorClose(door.x + 0.5, door.z + 0.5);
          GameEvents.onDoorClosed(door);
          door.wasOpenForSound = false;
        }
      }
      if (door.target > 0.5 && door.wasClosedForSound && Math.abs(door.angle) > OPEN_ANGLE * 0.3) {
        AudioSys.SFX.doorOpen(door.x + 0.5, door.z + 0.5);
        GameEvents.onDoorOpened(door);
        door.wasClosedForSound = false;
        door.wasOpenForSound = true;
      }
      if (door.target < 0.5 && Math.abs(door.angle) < OPEN_ANGLE * 0.2) {
        door.wasClosedForSound = true;
        door.wasOpenForSound = false;
      }

      // auto-close (not if the player is standing in the doorway)
      if (door.target > 0.5 && !door.wedged && door.type !== 'exit') {
        door.autoCloseTimer -= dt;
        if (door.autoCloseTimer <= 0) {
          const p = Player.getPos();
          const dd = Math.hypot((door.x + 0.5) - p.x, (door.z + 0.5) - p.z);
          if (dd < 0.55) {
            door.autoCloseTimer = 1.2; // wait for the player to move on
          } else {
            door.target = 0;
          }
        }
      }
    }
  }

  function isDoorBlocked(x, z) {
    const door = getDoor(x, z);
    if (!door) return true;
    return door.blocked;
  }

  function anyDoorBlockedBetween(x0, z0, x1, z1) {
    // conservative: check door tiles overlapping movement AABB
    const minX = Math.floor(Math.min(x0, x1)), maxX = Math.floor(Math.max(x0, x1));
    const minZ = Math.floor(Math.min(z0, z1)), maxZ = Math.floor(Math.max(z0, z1));
    for (let z = minZ; z <= maxZ; z++) {
      for (let x = minX; x <= maxX; x++) {
        if (MapData.tile(x, z) === 'D' && isDoorBlocked(x, z)) return true;
      }
    }
    return false;
  }

  // Actor wants to pass/use a door.
  // returns true if the door was opened (or already open)
  function openDoor(door, actor) {
    if (!door) return false;
    if (door.target > 0.5) {
      door.autoCloseTimer = AUTO_CLOSE;
      return true;
    }
    if (door.locked) {
      // only the player can unlock with keys
      if (actor && actor.isPlayer && actor.tryUseKeys(door)) {
        door.locked = false;
        door.unlocked = true;
        door.panel.material.map = door.type === 'exit'
          ? TextureGen.exitDoorTexture()
          : TextureGen.doorTexture(false);
        door.panel.material.needsUpdate = true;
        AudioSys.SFX.unlock();
        UI.updateHud(); // keys were consumed - refresh the item bar
      } else {
        if (actor && actor.isPlayer) AudioSys.SFX.doorLocked();
        return false;
      }
    }
    door.target = 1;
    door.autoCloseTimer = AUTO_CLOSE;
    return true;
  }

  function openDoorAt(x, z, actor) {
    return openDoor(getDoor(x, z), actor);
  }

  function wedgeDoor(x, z) {
    const door = getDoor(x, z);
    if (!door) return false;
    door.wedged = true;
    door.target = 1;
    door.autoCloseTimer = 9999;
    return true;
  }

  function allDoors() { return doors; }

  function doorPositionsForBaldi() {
    // door tile positions (for Baldi's "hearing" mechanic)
    return doors.map(d => ({ x: d.x, z: d.z, key: doorKey(d.x, d.z) }));
  }

  return {
    init, clearAll, update, getDoor, isDoorBlocked, anyDoorBlockedBetween,
    openDoor, openDoorAt, wedgeDoor, allDoors, doorPositionsForBaldi, resetAll,
  };
})();
