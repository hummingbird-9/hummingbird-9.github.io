'use strict';

// Notebooks: 7 collectable answer pads. Clicking one opens the You Can Think Pad.

const Notebooks = (() => {

  const notebooks = [];
  let solving = null;   // {notebook, problemIndex, wrongThisAnswer}
  let solvedCount = 0;

  function init(scene) {
    notebooks.length = 0;
    solving = null;
    solvedCount = 0;
    const group = GameRenderer.spriteGroup;
    MapData.NOTEBOOKS.forEach((pos, i) => {
      const mat = new THREE.SpriteMaterial({ map: TextureGen.notebookTexture() });
      const s = new THREE.Sprite(mat);
      s.scale.set(0.34, 0.34, 1);
      s.position.set(pos.x, pos.y + 0.17, pos.z);
      group.add(s);
      notebooks.push({
        x: pos.x, z: pos.z, y: pos.y,
        solved: false, index: i,
        problems: MathGen.generateNotebook(i),
        mesh: s,
      });
    });
  }

  function all() { return notebooks; }
  function getSolvedCount() { return solvedCount; }
  function isSolving() { return !!solving; }

  function startSolving(nb) {
    solving = { notebook: nb, problemIndex: 0 };
    Player.lookAt(nb.x, nb.z);
    return nb.problems[0];
  }

  function currentProblem() {
    if (!solving) return null;
    return solving.notebook.problems[solving.problemIndex];
  }

  // returns: 'correct' | 'wrong' | 'finished'
  function submitAnswer(value) {
    if (!solving) return 'finished';
    const p = solving.notebook.problems[solving.problemIndex];
    if (p.solvable && value === p.answer) {
      solving.problemIndex++;
      if (solving.problemIndex >= 3) {
        finishSolving();
        return 'finished';
      }
      return 'correct';
    }
    // wrong: anger Baldi, advance to next problem (no retry)
    solving.problemIndex++;
    if (solving.problemIndex >= 3) {
      finishSolving();
      return 'wrong-finished';
    }
    return 'wrong';
  }

  function finishSolving() {
    if (!solving) return;
    solving.notebook.solved = true;
    solvedCount++;
    solving.notebook.mesh.material.opacity = 0.35;
    solving.notebook.mesh.material.transparent = true;
    solving.notebook.mesh.material.needsUpdate = true;
    solving = null;
    UI.updateHud();
    GameEvents.emit('notebookSolved', { count: solvedCount });
  }

  function cancelSolving() {
    solving = null;
  }

  function resetForEndless() {
    notebooks.forEach(nb => {
      nb.solved = false;
      nb.problems = MathGen.generateNotebook(nb.index);
      nb.mesh.material.opacity = 1;
      nb.mesh.material.transparent = false;
      nb.mesh.material.needsUpdate = true;
      nb.mesh.visible = true;
    });
    solvedCount = 0;
  }

  function debugSolveAll() {
    notebooks.forEach(nb => { nb.solved = true; });
    solvedCount = 7;
    UI.updateHud();
    GameEvents.emit('notebookSolved', { count: 7 });
  }

  return { init, all, getSolvedCount, isSolving, startSolving, currentProblem, submitAnswer, finishSolving, cancelSolving, resetForEndless, debugSolveAll };
})();
