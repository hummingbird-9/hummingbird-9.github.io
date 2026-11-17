'use strict';

// Seeded randomness: string seeds -> uint32 hashes -> mulberry32 streams.
// Map generation derives several independent streams from one seed number so
// every aspect is reproducible from a single short seed string.

const SeedRng = (() => {

  // xmur3: string -> hash function producing uint32 values
  function hash(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      h ^= h >>> 16;
      return h >>> 0;
    };
  }

  function mulberry32(seed) {
    let a = seed | 0;
    return function () {
      a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // Derive a fresh uint32 value for a tagged aspect of a seed number.
  function derive(seedNum, tag) {
    return (seedNum ^ hash(tag)()) >>> 0;
  }

  // Build an independent mulberry32 stream for a tagged aspect.
  function stream(seedNum, tag) {
    return mulberry32(derive(seedNum, tag));
  }

  // Normalize user input: blank / "0" / "classic" -> null (use the classic
  // fixed map). Anything else is a seed string.
  function normalize(input) {
    if (input === undefined || input === null) return null;
    const s = String(input).trim();
    if (s === '') return null;
    if (s === '0') return null;
    if (/^classic$/i.test(s)) return null;
    return s.slice(0, 32);
  }

  function toNumber(s) {
    return hash(s)();
  }

  return { hash, mulberry32, derive, stream, normalize, toNumber };
})();