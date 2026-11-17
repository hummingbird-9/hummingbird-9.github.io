'use strict';

// School exits: 4 doors. All 7 notebooks must be solved before leaving;
// two exits are locked and require the Principal's Keys.

const Exits = (() => {

  const exits = [];

  function init() {
    exits.length = 0;
    for (const d of DoorSystem.allDoors()) {
      if (d.type === 'exit') {
        exits.push({ door: d, x: d.x + 0.5, z: d.z + 0.5 });
      }
    }
  }

  function all() { return exits; }

  function tryExit(exit) {
    const door = exit.door;
    if (door.locked) {
      // need keys
      if (Player.hasItem('keys')) {
        DoorSystem.openDoor(door, Player);
        UI.announce(I18n.t('ann.unlockedExit'));
        return 'unlocked';
      }
      AudioSys.SFX.doorLocked();
      AudioSys.Voice.baldi(I18n.t('voice.locked'));
      UI.announce(I18n.t('ann.exitLockedMsg'));
      return 'locked';
    }
    if (Notebooks.getSolvedCount() >= 7) {
      return 'win';
    }
    AudioSys.SFX.doorLocked();
    AudioSys.Voice.baldi(I18n.t('voice.notebooksFirst'));
    UI.announce(I18n.t('ann.moreNotebooks', { n: 7 - Notebooks.getSolvedCount() }));
    return 'notready';
  }

  return { init, all, tryExit };
})();
