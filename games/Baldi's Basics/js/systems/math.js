'use strict';

// Math problem generator.
// Notebook #1..#7 contain 3 problems each. The third problem of the
// 2nd and 4th notebook is deliberately unsolvable (wrong no matter what),
// reproducing the classic "corrupted problem" joke.

const MathGen = (() => {

  function randInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  function makeAddSub(noNeg = true) {
    let a, b, op, ans;
    const useAdd = Math.random() < 0.6;
    if (useAdd) {
      a = randInt(15, 45); b = randInt(15, 45);
      ans = a + b; op = '+';
    } else {
      a = randInt(35, 70); b = randInt(12, a - 1);
      ans = a - b; op = '-';
    }
    return { text: `${a} ${op} ${b} = ?`, answer: ans, solvable: true };
  }

  function makeMul() {
    const a = randInt(3, 12), b = randInt(3, 12);
    return { text: `${a} x ${b} = ?`, answer: a * b, solvable: true };
  }

  function makeImpossible() {
    // Corrupted problem: garbled glyphs, no valid answer (like the original).
    const glyphs = ['&', '%', '#', '@', '?', '!', '\u00a7', '\u2620', '4', '9', 'x', 'y', 'z', '\u26a0', 'no', '??'];
    const rnd = () => glyphs[Math.floor(Math.random() * glyphs.length)];
    const parts = [];
    for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
      parts.push(rnd() + rnd());
    }
    return { text: `${parts.join(' ')} = ?`, answer: NaN, solvable: false };
  }

  // notebookIndex: 0..6
  function generateNotebook(notebookIndex) {
    const problems = [];
    for (let i = 0; i < 3; i++) {
      const isThird = i === 2;
      // Classic behavior: 3rd problem of notebooks 2 and 4 (0-based 1 and 3) is corrupted.
      if (isThird && (notebookIndex === 1 || notebookIndex === 3)) {
        problems.push(makeImpossible());
      } else if (i === 1 && Math.random() < 0.35) {
        problems.push(makeMul());
      } else {
        problems.push(makeAddSub());
      }
    }
    return problems;
  }

  // Subtraction problems for Mrs. Pomp's classroom.
  function generateSubtraction() {
    const a = randInt(12, 40), b = randInt(4, a - 1);
    return { text: `${a} - ${b} = ?`, answer: a - b };
  }

  return { generateNotebook, generateSubtraction };
})();
