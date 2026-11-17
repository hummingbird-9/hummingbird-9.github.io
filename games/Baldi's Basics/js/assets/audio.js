'use strict';

// Procedural audio engine. Every sound is synthesized with the Web Audio API.
// Character "voices" use speechSynthesis when available and enabled.

const AudioSys = (() => {
  let ctx = null;
  let master, musicGain, sfxGain;
  let enabled = true;
  let voiceEnabled = true;
  let musicEnabled = true;
  const listener = { x: 0, z: 0 }; // player position, for distance attenuation

  function setListener(x, z) {
    listener.x = x;
    listener.z = z;
  }

  // volume multiplier for a sound played at (x, z)
  function gainAt(x, z, range = 20, minVol = 0.12) {
    const d = Math.hypot(x - listener.x, z - listener.z);
    const v = 1 - d / range;
    return Math.max(minVol, Math.min(1, v));
  }

  const noiseBuffer = (() => {
    let buf = null;
    return function() {
      if (!buf) {
        const len = ctx.sampleRate * 2;
        buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      }
      return buf;
    };
  })();

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.8;
    master.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = 0.32;
    musicGain.connect(master);
    sfxGain = ctx.createGain();
    sfxGain.gain.value = 0.9;
    sfxGain.connect(master);
  }

  function unlock() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  function setMusicEnabled(on) {
    musicEnabled = on;
    if (musicGain) musicGain.gain.value = on ? 0.32 : 0;
  }
  function setVoiceEnabled(on) { voiceEnabled = on; }
  function setEnabled(on) {
    enabled = on;
    if (master) master.gain.value = on ? 0.8 : 0;
  }
  function setSfxVolume(v) { if (sfxGain) sfxGain.gain.value = v; }
  function setMusicVolume(v) { if (musicGain) musicGain.gain.value = musicEnabled ? v : 0; }

  // ---------- low level helpers ----------

  function osc(type, freq, dur, gain = 0.3, when = 0, dest = null, vol = 1) {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain * vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(dest || sfxGain);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  function noise(dur, filterType, freq, gain = 0.3, when = 0, freqEnd = null, vol = 1) {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime + when;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer();
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = filterType;
    f.frequency.setValueAtTime(freq, t);
    if (freqEnd) f.frequency.exponentialRampToValueAtTime(freqEnd, t + dur);
    f.Q.value = 0.8;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain * vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f); f.connect(g); g.connect(sfxGain);
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  function jingle(notes, noteDur = 0.12, type = 'square') {
    notes.forEach((n, i) => {
      if (n === 0) return;
      osc(type, n, noteDur, 0.22, i * noteDur);
    });
  }

  // ---------- sound effects ----------

  const SFX = {
    slap(pitch = 1, vol = 1) {
      noise(0.09, 'bandpass', 1500 * pitch, 0.5, 0, 900 * pitch, vol);
      osc('square', 220 * pitch, 0.05, 0.18, 0, null, vol);
      osc('triangle', 1800 * pitch, 0.04, 0.12, 0, null, vol);
    },
    step() {
      noise(0.06, 'lowpass', 300, 0.18);
    },
    doorOpen(x, z) {
      const vol = x !== undefined ? gainAt(x, z, 16) : 1;
      noise(0.4, 'bandpass', 500, 0.25 * vol, 0, 1200);
      osc('sine', 180, 0.3, 0.08 * vol, 0, null);
    },
    doorClose(x, z) {
      const vol = x !== undefined ? gainAt(x, z, 16) : 1;
      noise(0.25, 'bandpass', 700, 0.28 * vol, 0, 200);
      osc('square', 90, 0.12, 0.15 * vol);
    },
    doorLocked() {
      jingle([300, 260, 220], 0.09, 'square');
    },
    unlock() {
      jingle([440, 660, 880], 0.07, 'triangle');
    },
    whistle(vol = 1) {
      osc('square', 2600, 0.12, 0.2 * vol);
      osc('square', 3000, 0.12, 0.2 * vol, 0.13);
      osc('square', 2600, 0.18, 0.2 * vol, 0.26);
    },
    uhoh() {
      jingle([520, 420, 300], 0.14, 'square');
      osc('sawtooth', 180, 0.3, 0.12, 0.05);
    },
    wow() {
      jingle([400, 520, 660, 880], 0.12, 'triangle');
    },
    great() {
      jingle([660, 880, 1100, 1320], 0.1, 'square');
    },
    wrong() {
      jingle([300, 240, 180], 0.15, 'sawtooth');
    },
    correct() {
      jingle([520, 660, 880], 0.09, 'triangle');
    },
    notebookPickup() {
      noise(0.15, 'highpass', 800, 0.3);
      jingle([660, 880], 0.09, 'triangle');
    },
    pageFlip() {
      noise(0.12, 'highpass', 1200, 0.2);
    },
    quarter() {
      osc('square', 2100, 0.05, 0.2);
      osc('square', 2800, 0.08, 0.15, 0.04);
    },
    vendThud() {
      noise(0.12, 'lowpass', 500, 0.4);
      osc('sine', 120, 0.15, 0.2, 0.05);
    },
    gulp() {
      osc('sine', 300, 0.12, 0.25, 0, null);
      osc('sine', 200, 0.15, 0.25, 0.12, null);
    },
    crunch() {
      noise(0.1, 'highpass', 2000, 0.3);
      noise(0.1, 'highpass', 1800, 0.3, 0.1);
      noise(0.1, 'highpass', 2200, 0.25, 0.2);
    },
    jumpRope() {
      noise(0.05, 'bandpass', 900, 0.2);
      noise(0.04, 'bandpass', 700, 0.25, 0.3);
    },
    jumpRopeFail() {
      jingle([400, 300, 200], 0.12, 'sawtooth');
    },
    scissors() {
      noise(0.06, 'highpass', 3000, 0.35);
      noise(0.06, 'highpass', 2600, 0.35, 0.08);
      noise(0.06, 'highpass', 3000, 0.35, 0.16);
    },
    robotHumStart(vol = 1) {
      osc('sawtooth', 90, 0.5, 0.12 * vol);
      osc('square', 45, 0.5, 0.08 * vol);
    },
    robotBeep(vol = 1) {
      osc('square', 1200, 0.07, 0.16 * vol);
      osc('square', 900, 0.07, 0.16 * vol, 0.08);
    },
    robotDisabled() {
      jingle([500, 400, 300, 200, 100], 0.1, 'square');
      noise(0.5, 'lowpass', 400, 0.2);
    },
    sweepPush() {
      noise(0.3, 'lowpass', 500, 0.25);
    },
    robotPush(vol = 1) {
      noise(0.15, 'lowpass', 350, 0.35 * vol);
      osc('square', 150, 0.1, 0.2 * vol);
    },
    sweepSpin() {
      osc('triangle', 500, 0.4, 0.15, 0, null);
      osc('triangle', 800, 0.4, 0.12, 0.1, null);
    },
    alarmRing() {
      for (let i = 0; i < 8; i++) {
        osc('square', 1800, 0.1, 0.25, i * 0.2);
        osc('square', 1400, 0.1, 0.25, i * 0.2 + 0.1);
      }
    },
    chalkPuff() {
      noise(0.6, 'lowpass', 700, 0.3);
    },
    tick() {
      osc('square', 1200, 0.03, 0.18);
    },
    detentionBell() {
      osc('square', 800, 0.4, 0.25);
      osc('square', 1000, 0.4, 0.2, 0.05);
    },
    heartbeat() {
      osc('sine', 60, 0.16, 0.4, 0, null);
      osc('sine', 55, 0.14, 0.3, 0.22, null);
    },
    staticBurst(dur = 0.8, gain = 0.5) {
      noise(dur, 'bandpass', 2000, gain);
      noise(dur, 'highpass', 4000, gain * 0.5);
    },
    exitOpen() {
      jingle([440, 550, 660, 880, 1100], 0.1, 'triangle');
    },
    win() {
      jingle([523, 659, 784, 1046, 784, 1046], 0.18, 'triangle');
    },
    lose() {
      jingle([400, 300, 220, 150], 0.25, 'sawtooth');
      noise(1.2, 'lowpass', 400, 0.4);
    },
    teleport() {
      noise(0.6, 'bandpass', 1500, 0.5, 0, 3000);
      jingle([800, 400, 200], 0.12, 'sawtooth');
    },
    bullySteal() {
      jingle([600, 400, 250], 0.1, 'sawtooth');
    },
    pompHappy(vol = 1) {
      jingle([500, 650, 800, 950], 0.1, 'triangle');
    },
  };

  // ---------- voice lines (speechSynthesis) ----------

  function say(text, pitch = 1, rate = 1, vol = 1) {
    if (!voiceEnabled || !window.speechSynthesis) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.pitch = pitch;
      u.rate = rate;
      u.volume = Math.max(0.05, Math.min(1, vol));
      const voices = window.speechSynthesis.getVoices();
      const prefix = I18n.lang === 'zh' ? 'zh' : (I18n.lang === 'ja' ? 'ja' : 'en');
      const v = voices.find(x => x.lang && x.lang.toLowerCase().startsWith(prefix));
      if (v) u.voice = v;
      else {
        const en = voices.find(x => x.lang && x.lang.toLowerCase().startsWith('en'));
        if (en) u.voice = en;
      }
      u.lang = prefix + (prefix === 'zh' ? '-CN' : prefix === 'ja' ? '-JP' : '-US');
      window.speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }

  // voices attenuate with distance: pass the speaker's position
  const Voice = {
    baldi(text, x, z) { say(text, 1.4, 1.1, x !== undefined ? gainAt(x, z, 22) : 1); },
    principal(text, x, z) { say(text, 0.7, 0.9, x !== undefined ? gainAt(x, z, 20) : 1); },
    playtime(text, x, z) { say(text, 1.9, 1.05, x !== undefined ? gainAt(x, z, 18) : 1); },
    pomp(text, x, z) { say(text, 1.2, 1, x !== undefined ? gainAt(x, z, 20) : 1); },
    robot(text, x, z) { say(text, 0.4, 0.8, x !== undefined ? gainAt(x, z, 20) : 1); },
    bully(text, x, z) { say(text, 0.55, 0.85, x !== undefined ? gainAt(x, z, 18) : 1); },
  };

  // ---------- music sequencer ----------

  let musicTimer = null;
  let currentTrack = null;
  let stepIndex = 0;
  let nextNoteTime = 0;
  const STEP = 0.14;

  const TRACKS = {
    menu: {
      bpm: 132,
      bass: [55, 55, 65.4, 55, 55, 65.4, 49, 55, 55, 65.4, 55, 55, 73.4, 65.4, 49, 43.6],
      lead: [220, 0, 261.6, 293.7, 0, 261.6, 220, 0, 196, 0, 220, 261.6, 293.7, 0, 329.6, 0,
             220, 0, 261.6, 293.7, 0, 349.2, 329.6, 293.7, 261.6, 0, 293.7, 261.6, 220, 0, 196, 0],
      hat: [1, 0, 1, 0, 1, 1, 1, 0],
    },
    game: {
      bpm: 120,
      bass: [49, 49, 55, 49, 49, 49, 58.3, 49, 49, 49, 55, 49, 43.6, 43.6, 49, 43.6],
      lead: [196, 0, 0, 220, 0, 0, 233.1, 0, 220, 0, 0, 196, 0, 0, 174.6, 0,
             196, 0, 0, 220, 0, 0, 261.6, 0, 246.9, 0, 0, 220, 0, 0, 196, 0],
      hat: [1, 0, 1, 0, 1, 0, 1, 1],
    },
    chase: {
      bpm: 156,
      bass: [55, 55, 55, 55, 58.3, 58.3, 55, 55, 55, 55, 55, 55, 65.4, 61.7, 58.3, 55],
      lead: [440, 0, 466.2, 0, 440, 0, 523.3, 0, 0, 466.2, 440, 0, 392, 0, 0, 0,
             440, 0, 466.2, 0, 440, 0, 587.3, 0, 0, 523.3, 466.2, 0, 440, 0, 392, 0],
      hat: [1, 1, 1, 1, 1, 1, 1, 1],
    },
    detention: {
      bpm: 80,
      bass: [41.2, 0, 0, 0, 41.2, 0, 0, 0],
      lead: [164.8, 0, 0, 0, 174.6, 0, 0, 0],
      hat: [1, 0, 0, 0, 1, 0, 0, 0],
    },
  };

  function musicNote(freq, dur, type, gain, when, dest) {
    if (!ctx) return;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(dest || musicGain);
    o.start(t); o.stop(t + dur + 0.05);
  }

  function scheduleStep() {
    if (!ctx || !musicEnabled) return;
    const track = TRACKS[currentTrack];
    if (!track) return;
    while (nextNoteTime < ctx.currentTime + 0.4) {
      const i = stepIndex % track.bass.length;
      const j = stepIndex % track.lead.length;
      const k = stepIndex % track.hat.length;
      const when = nextNoteTime - ctx.currentTime;
      musicNote(track.bass[i], STEP * 2.4, 'triangle', 0.5, when);
      if (track.lead[j]) musicNote(track.lead[j], STEP * 1.9, 'square', 0.22, when);
      if (track.hat[k]) noise(0.03, 'highpass', 6000, 0.08, when);
      stepIndex++;
      nextNoteTime += STEP;
    }
  }

  function playMusic(trackName) {
    if (!ctx) return;
    stopMusic();
    currentTrack = trackName;
    stepIndex = 0;
    nextNoteTime = ctx.currentTime + 0.1;
    musicTimer = setInterval(scheduleStep, 60);
    scheduleStep();
  }

  function stopMusic() {
    if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
    currentTrack = null;
  }

  function crossfadeMusic(trackName) {
    if (currentTrack === trackName) return;
    playMusic(trackName);
  }

  return {
    init, unlock, playMusic, stopMusic, crossfadeMusic,
    SFX, Voice, say, setListener, gainAt,
    setMusicEnabled, setVoiceEnabled, setEnabled, setSfxVolume, setMusicVolume,
    get ctx() { return ctx; },
  };
})();
