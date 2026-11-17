'use strict';

// localStorage persistence: settings + endless mode unlock.

const Saves = (() => {
  const KEY = 'baldis_basics_save_v1';

  const defaults = {
    endlessUnlocked: false,
    sensitivity: 0.9,
    sfxVolume: 0.9,
    musicVolume: 0.32,
    musicEnabled: true,
    voiceEnabled: true,
    pixelQuality: 1, // 0 = low, 1 = normal
    bestTime: null,
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return Object.assign({}, defaults);
      return Object.assign({}, defaults, JSON.parse(raw));
    } catch (e) {
      return Object.assign({}, defaults);
    }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) { /* ignore */ }
  }

  return { load, save, defaults };
})();
