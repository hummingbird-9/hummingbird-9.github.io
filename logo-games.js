(() => {
  'use strict';

  const GAME_SPRITE_URL = 'img/humming.png';
  const WIDTH = 960;
  const HEIGHT = 540;
  const FLOOR = 445;
  let heroLogo = null;
  let logoImage = null;
  let logoFallback = null;
  let imageVisibility = '';
  let fallbackVisibility = '';
  let canvas = null;
  let context = null;
  let snakeTouchStart = null;
  let mode = 'flappy';
  let state = null;
  let frame = 0;
  let previousTime = 0;
  let pointerY = HEIGHT / 2;
  let tetrisTouchStart = null;
  let pongScrollAnchor = null;
  const TETRIS_COLS = 10;
  const TETRIS_ROWS = 20;
  const TETRIS_CELL = 22;
  const TETRIS_X = (WIDTH - TETRIS_COLS * TETRIS_CELL) / 2;
  const TETRIS_Y = 50;
  const TETRIS_SHAPES = {
    I: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    J: [[1,0,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
    L: [[0,0,1,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
    O: [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
    S: [[0,1,1,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]],
    T: [[0,1,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
    Z: [[1,1,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]]
  };
  const tetrisBlockSprite = new Image();
  tetrisBlockSprite.src = 'img/hummingblock.png';
  const gameSprite = new Image();
  gameSprite.decoding = 'async';
  gameSprite.src = GAME_SPRITE_URL;
  const chessKingImage = new Image();
  chessKingImage.decoding = 'async';
  const chessDarkKingCanvas = document.createElement('canvas');
  chessDarkKingCanvas.width = 7;
  chessDarkKingCanvas.height = 7;
  chessKingImage.onload = () => {
    const darkContext = chessDarkKingCanvas.getContext('2d');
    darkContext.clearRect(0, 0, 7, 7);
    darkContext.drawImage(chessKingImage, 0, 0, 7, 7);
    darkContext.globalCompositeOperation = 'source-atop';
    darkContext.fillStyle = 'rgba(0, 0, 0, 0.48)';
    darkContext.fillRect(0, 0, 7, 7);
    darkContext.globalCompositeOperation = 'source-over';
    if (mode === 'chess') draw();
  };
  chessKingImage.src = 'img/hummingblock.png';

  const titles = {
    flappy: 'Flappy Bird',
    dino: 'Dino Run',
    snake: 'Snake',
    pong: 'Pong',
    tetris: 'Tetris',
    chess: 'Chess'
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function buildInlineGame() {
    heroLogo = document.querySelector('.home-hero-logo');
    if (!heroLogo) return false;
    if (canvas && canvas.isConnected) return true;

    logoImage = heroLogo.querySelector('.brand-logo');
    logoFallback = heroLogo.querySelector('.home-logo-fallback');
    imageVisibility = logoImage?.style.visibility || '';
    fallbackVisibility = logoFallback?.style.visibility || '';
    // visibility keeps the image's exact layout dimensions reserved underneath the canvas.
    if (logoImage && !logoImage.hidden) logoImage.style.visibility = 'hidden';
    if (logoFallback && !logoFallback.hidden) logoFallback.style.visibility = 'hidden';

    canvas = document.createElement('canvas');
    canvas.className = 'logo-game-inline-canvas';
    canvas.width = WIDTH / 2;
    canvas.height = HEIGHT / 2;
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Mini game. Press Escape to return to the logo.');
    heroLogo.classList.add('is-playing-game');
    heroLogo.appendChild(canvas);
    context = canvas.getContext('2d');
    if (context) {
      context.imageSmoothingEnabled = false;
      context.scale(0.5, 0.5);
    }
    if (!context) {
      close();
      return false;
    }

    canvas.addEventListener('pointerdown', event => {
      event.preventDefault();
      event.stopPropagation();
      canvas.focus({ preventScroll: true });
      if (mode !== 'pong' || event.pointerType !== 'mouse' || typeof canvas.requestPointerLock !== 'function') {
        canvas.setPointerCapture?.(event.pointerId);
      }
      const point = pointerPosition(event);
      if (point.x >= WIDTH - 76 && point.y <= 76) {
        close();
        return;
      }
      if (state?.over && mode !== 'chess') reset();
      if (mode === 'chess') {
        handleChessClick(point);
        return;
      }
      if (mode === 'flappy') flap();
      else if (mode === 'dino') jump();
      else if (mode === 'snake') snakeTouchStart = point;
      else if (mode === 'pong') {
        state.playerY = clamp(point.y - 50, 20, HEIGHT - 120);
        if (event.pointerType === 'mouse') requestPongPointerLock();
      }
      else if (mode === 'tetris') tetrisTouchStart = point;
    });

    canvas.addEventListener('pointerup', event => {
      event.stopPropagation();
      const point = pointerPosition(event);
      if (mode === 'tetris' && tetrisTouchStart && state && !state.over) {
        const dx = point.x - tetrisTouchStart.x;
        const dy = point.y - tetrisTouchStart.y;
        tetrisTouchStart = null;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) rotateTetrisPiece();
        else if (Math.abs(dx) > Math.abs(dy)) moveTetrisPiece(dx > 0 ? 1 : -1, 0);
        else if (dy > 0) softDropTetrisPiece();
        else hardDropTetrisPiece();
        return;
      }
      if (mode !== 'snake' || !snakeTouchStart || !state || state.over) {
        snakeTouchStart = null;
        return;
      }
      const dx = point.x - snakeTouchStart.x;
      const dy = point.y - snakeTouchStart.y;
      snakeTouchStart = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
      setSnakeDirection(Math.abs(dx) > Math.abs(dy)
        ? (dx > 0 ? 'right' : 'left')
        : (dy > 0 ? 'down' : 'up'));
    });

    canvas.addEventListener('pointercancel', () => {
      snakeTouchStart = null;
      tetrisTouchStart = null;
    });
    canvas.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
    });
    canvas.addEventListener('pointermove', event => {
      if (mode !== 'pong' || !state) return;
      if (document.pointerLockElement === canvas) {
        const rect = canvas.getBoundingClientRect();
        const scale = rect.height > 0 ? HEIGHT / rect.height : 1;
        state.playerY = clamp(state.playerY + (event.movementY || 0) * scale, 20, HEIGHT - 120);
        return;
      }
      const point = pointerPosition(event);
      state.playerY = clamp(point.y - 50, 20, HEIGHT - 120);
    });
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('wheel', onPongWheel, { passive: false, capture: true });
    return true;
  }

  function pointerPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (WIDTH / rect.width),
      y: (event.clientY - rect.top) * (HEIGHT / rect.height)
    };
  }

  function requestPongPointerLock() {
    if (!canvas || mode !== 'pong' || document.pointerLockElement === canvas ||
        typeof canvas.requestPointerLock !== 'function') return;
    try {
      const result = canvas.requestPointerLock();
      if (result && typeof result.catch === 'function') result.catch(() => {});
    } catch (_) {
      // Pointer Lock is unavailable or denied in some browsers; drag and wheel remain available.
    }
  }

  function onPongWheel(event) {
    if (!canvas || !canvas.isConnected || mode !== 'pong' || !state || state.over) return;
    event.preventDefault();
    let delta = event.deltaY;
    if (event.deltaMode === 1) delta *= 16;
    else if (event.deltaMode === 2) delta *= HEIGHT;
    const rect = canvas.getBoundingClientRect();
    const scale = rect.height > 0 ? HEIGHT / rect.height : 1;
    state.playerY = clamp(state.playerY + delta * scale * 0.65, 20, HEIGHT - 120);
  }

  function open(nextMode) {
    if (!titles[nextMode] || !buildInlineGame()) return;
    stopPongCrownScroll();
    mode = nextMode;
    canvas.setAttribute('aria-label', mode === 'pong'
      ? 'Pong. Click to lock the mouse, or turn the Digital Crown / scroll wheel to move your paddle. Press Escape to close.'
      : mode === 'tetris'
        ? 'Tetris. Use arrow keys or swipe to move, up arrow or tap to rotate, and space to hard drop.'
        : mode === 'chess'
          ? 'Chess. Tap or click a piece, then a highlighted destination. R restarts, U undoes.'
          : 'Mini game. Press Escape to return to the logo.');
    if (mode === 'pong') startPongCrownScroll();
    reset();
    if (mode === 'chess') ensureChessEngine();
    canvas.focus({ preventScroll: true });
    previousTime = performance.now();
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(loop);
  }

  function close() {
    if (!canvas) return;
    cancelAnimationFrame(frame);
    stopPongCrownScroll();
    if (document.pointerLockElement === canvas) document.exitPointerLock?.();
    document.removeEventListener('wheel', onPongWheel, true);
    canvas.remove();
    heroLogo?.classList.remove('is-playing-game');
    if (logoImage) logoImage.style.visibility = imageVisibility;
    if (logoFallback) logoFallback.style.visibility = fallbackVisibility;
    canvas = null;
    context = null;
    state = null;
    snakeTouchStart = null;
    tetrisTouchStart = null;
  }

  function startPongCrownScroll() {
    if (pongScrollAnchor) return;
    const x = window.scrollX || 0;
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    pongScrollAnchor = { x, y, lastY: y };
    window.addEventListener('scroll', onPongPageScroll, { passive: true, capture: true });
  }

  function stopPongCrownScroll() {
    if (!pongScrollAnchor) return;
    const anchor = pongScrollAnchor;
    window.removeEventListener('scroll', onPongPageScroll, true);
    pongScrollAnchor = null;
    const currentX = window.scrollX || 0;
    const currentY = window.scrollY || document.documentElement.scrollTop || 0;
    if (currentX !== anchor.x || currentY !== anchor.y) window.scrollTo(anchor.x, anchor.y);
  }

  function onPongPageScroll() {
    if (!pongScrollAnchor || mode !== 'pong' || !canvas || !state || state.over) return;
    const currentY = window.scrollY || document.documentElement.scrollTop || 0;
    const deltaY = currentY - pongScrollAnchor.lastY;
    pongScrollAnchor.lastY = currentY;
    if (deltaY) {
      const rect = canvas.getBoundingClientRect();
      const scale = rect.height > 0 ? HEIGHT / rect.height : 1;
      state.playerY = clamp(state.playerY + deltaY * scale * 1.15, 20, HEIGHT - 120);
    }
    const currentX = window.scrollX || 0;
    if (currentX !== pongScrollAnchor.x || currentY !== pongScrollAnchor.y) {
      // Digital Crown scrolling changes the page in some watch browsers instead of emitting wheel events.
      // Convert that scroll delta into paddle movement, then immediately pin the page back in place.
      pongScrollAnchor.lastY = pongScrollAnchor.y;
      window.scrollTo(pongScrollAnchor.x, pongScrollAnchor.y);
    }
  }

  function reset() {
    if (mode === 'flappy') {
      state = {
        score: 0, over: false, bird: { x: 210, y: 245, vy: 0 },
        pipes: [{ x: 760, gap: 245, passed: false }], spawn: 0
      };
    } else if (mode === 'dino') {
      state = {
        score: 0, over: false, runner: { x: 145, y: FLOOR - 54, vy: 0, grounded: true },
        obstacles: [], spawn: 1.0, speed: 350, cloud: 0
      };
    } else if (mode === 'snake') {
      state = {
        score: 0, over: false, tick: 0, direction: { x: 1, y: 0 }, nextDirection: { x: 1, y: 0 },
        snake: [{ x: 11, y: 10 }, { x: 10, y: 10 }, { x: 9, y: 10 }],
        food: { x: 25, y: 10 }
      };
    } else if (mode === 'pong') {
      state = {
        score: 0, over: false, player: 0, cpu: 0,
        playerY: 205, cpuY: 205, ball: { x: 480, y: 260, vx: 360, vy: 180 },
        up: false, down: false
      };
    } else if (mode === 'tetris') {
      state = {
        score: 0, lines: 0, level: 1, over: false,
        board: Array.from({ length: TETRIS_ROWS }, () => Array(TETRIS_COLS).fill(0)),
        bag: [], next: null, active: null, dropTimer: 0
      };
      state.next = takeTetrisPiece();
      spawnTetrisPiece();
    } else if (mode === 'chess') {
      cancelChessEngineSearch();
      state = createChessGame();
    }
    updateScore();
    draw();
  }

  function updateScore() {
    // Score text is painted into the game canvas.
  }

  function gameOver(message) {
    if (!state || state.over) return;
    state.over = true;
    state.endMessage = message;
  }

  function takeTetrisPiece() {
    if (!state.bag.length) {
      state.bag = Object.keys(TETRIS_SHAPES).sort(() => Math.random() - 0.5);
    }
    return state.bag.pop();
  }

  function spawnTetrisPiece() {
    const type = state.next || takeTetrisPiece();
    state.next = takeTetrisPiece();
    state.active = {
      type,
      matrix: TETRIS_SHAPES[type].map(row => row.slice()),
      x: 3,
      y: 0
    };
    if (!canPlaceTetris(state.active, 0, 0)) gameOver('The stack reached the top.');
  }

  function canPlaceTetris(piece, offsetX, offsetY, matrix = piece.matrix) {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (!matrix[row][col]) continue;
        const x = piece.x + col + offsetX;
        const y = piece.y + row + offsetY;
        if (x < 0 || x >= TETRIS_COLS || y >= TETRIS_ROWS) return false;
        if (y >= 0 && state.board[y][x]) return false;
      }
    }
    return true;
  }

  function moveTetrisPiece(dx, dy) {
    if (!state || !state.active || state.over) return false;
    if (!canPlaceTetris(state.active, dx, dy)) return false;
    state.active.x += dx;
    state.active.y += dy;
    return true;
  }

  function rotateTetrisPiece() {
    if (!state || !state.active || state.over) return;
    const matrix = state.active.matrix;
    const rotated = matrix[0].map((_, index) => matrix.map(row => row[index]).reverse());
    for (const kick of [0, -1, 1, -2, 2]) {
      if (canPlaceTetris(state.active, kick, 0, rotated)) {
        state.active.x += kick;
        state.active.matrix = rotated;
        return;
      }
    }
  }

  function lockTetrisPiece() {
    if (!state || !state.active) return;
    const piece = state.active;
    for (let row = 0; row < piece.matrix.length; row++) {
      for (let col = 0; col < piece.matrix[row].length; col++) {
        if (!piece.matrix[row][col]) continue;
        const x = piece.x + col;
        const y = piece.y + row;
        if (y < 0) {
          gameOver('The stack reached the top.');
          return;
        }
        state.board[y][x] = 1;
      }
    }

    const remaining = state.board.filter(row => row.some(cell => !cell));
    const cleared = TETRIS_ROWS - remaining.length;
    if (cleared) {
      while (remaining.length < TETRIS_ROWS) remaining.unshift(Array(TETRIS_COLS).fill(0));
      state.board = remaining;
      state.lines += cleared;
      state.score += [0, 100, 300, 500, 800][cleared] * state.level;
      state.level = 1 + Math.floor(state.lines / 10);
    }
    state.active = null;
    spawnTetrisPiece();
  }

  function softDropTetrisPiece() {
    if (!state || !state.active || state.over) return;
    if (moveTetrisPiece(0, 1)) state.score += 1;
    else lockTetrisPiece();
  }

  function hardDropTetrisPiece() {
    if (!state || !state.active || state.over) return;
    let distance = 0;
    while (moveTetrisPiece(0, 1)) distance++;
    state.score += distance * 2;
    lockTetrisPiece();
  }

  function flap() {
    if (!state) return;
    if (state.over) reset();
    state.bird.vy = -470;
  }

  function jump() {
    if (!state) return;
    if (state.over) reset();
    if (state.runner.grounded) {
      state.runner.vy = -730;
      state.runner.grounded = false;
    }
  }

  function setSnakeDirection(direction) {
    if (mode !== 'snake' || !state) return;
    const map = {
      up: { x: 0, y: -1 }, down: { x: 0, y: 1 },
      left: { x: -1, y: 0 }, right: { x: 1, y: 0 }
    };
    const next = map[direction];
    if (!next || (next.x + state.direction.x === 0 && next.y + state.direction.y === 0)) return;
    state.nextDirection = next;
  }

  function onKeyDown(event) {
    if (!canvas || !canvas.isConnected) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (!state) return;
    if (mode === 'chess') {
      const key = event.key.toLowerCase();
      if (key === 'r' || (state.over && key === 'enter')) {
        event.preventDefault();
        resetChess();
      } else if (key === '[' || key === '-') {
        event.preventDefault(); setChessEngineSkill(chessEngineSkill - 1);
      } else if (key === ']' || key === '=') {
        event.preventDefault(); setChessEngineSkill(chessEngineSkill + 1);
      } else if (key === 'u' || key === 'backspace') {
        event.preventDefault();
        undoChessMove();
      } else if (state.pendingPromotion && ['q', 'r', 'b', 'n'].includes(key)) {
        event.preventDefault();
        chooseChessPromotion(key);
      }
      return;
    }
    if (state.over && mode === 'tetris') {
      if ([' ', 'Enter', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown'].includes(event.key)) {
        event.preventDefault();
        reset();
      }
      return;
    }
    if (state.over && mode !== 'flappy' && mode !== 'dino') reset();

    if (mode === 'flappy' && [' ', 'ArrowUp', 'w', 'W'].includes(event.key)) {
      event.preventDefault();
      flap();
    } else if (mode === 'dino' && [' ', 'ArrowUp', 'w', 'W'].includes(event.key)) {
      event.preventDefault();
      jump();
    } else if (mode === 'snake') {
      const key = event.key.toLowerCase();
      const map = {
        arrowup: 'up', w: 'up', arrowdown: 'down', s: 'down',
        arrowleft: 'left', a: 'left', arrowright: 'right', d: 'right'
      };
      if (map[key]) {
        event.preventDefault();
        setSnakeDirection(map[key]);
      }
    } else if (mode === 'pong') {
      if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') {
        event.preventDefault(); state.up = true;
      }
      if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') {
        event.preventDefault(); state.down = true;
      }
    } else if (mode === 'tetris') {
      const key = event.key;
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' ', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D'].includes(key)) {
        event.preventDefault();
        if (key === 'ArrowLeft' || key.toLowerCase() === 'a') moveTetrisPiece(-1, 0);
        else if (key === 'ArrowRight' || key.toLowerCase() === 'd') moveTetrisPiece(1, 0);
        else if (key === 'ArrowDown' || key.toLowerCase() === 's') softDropTetrisPiece();
        else if (key === 'ArrowUp' || key.toLowerCase() === 'w') rotateTetrisPiece();
        else if (key === ' ') hardDropTetrisPiece();
      }
    }
  }

  document.addEventListener('keyup', event => {
    if (mode !== 'pong' || !state) return;
    if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') state.up = false;
    if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') state.down = false;
  }, true);

  function loop(now) {
    if (!canvas || !canvas.isConnected || !state) return;
    const dt = clamp((now - previousTime) / 1000, 0, 0.035);
    previousTime = now;
    update(dt);
    draw();
    frame = requestAnimationFrame(loop);
  }

  function update(dt) {
    if (!state || state.over) return;
    if (mode === 'flappy') updateFlappy(dt);
    else if (mode === 'dino') updateDino(dt);
    else if (mode === 'snake') updateSnake(dt);
    else if (mode === 'pong') updatePong(dt);
    else if (mode === 'tetris') updateTetris(dt);
  }

  function updateFlappy(dt) {
    const bird = state.bird;
    bird.vy += 1450 * dt;
    bird.y += bird.vy * dt;
    state.spawn -= dt;
    if (state.spawn <= 0) {
      state.pipes.push({ x: WIDTH + 90, gap: 140 + Math.random() * 190, passed: false });
      state.spawn = 1.55;
    }
    state.pipes.forEach(pipe => {
      pipe.x -= 255 * dt;
      if (!pipe.passed && pipe.x + 92 < bird.x) {
        pipe.passed = true;
        state.score++;
        updateScore();
      }
      const gapTop = pipe.gap - 92;
      const gapBottom = pipe.gap + 92;
      const overlapsX = bird.x + 22 > pipe.x && bird.x - 22 < pipe.x + 92;
      if (overlapsX && (bird.y - 18 < gapTop || bird.y + 18 > gapBottom)) {
        gameOver('Game over. Final score: ' + state.score + '.');
      }
    });
    state.pipes = state.pipes.filter(pipe => pipe.x > -120);
    if (bird.y < 15 || bird.y > FLOOR - 18) gameOver('Game over. Final score: ' + state.score + '.');
  }

  function updateDino(dt) {
    const runner = state.runner;
    runner.vy += 1950 * dt;
    runner.y += runner.vy * dt;
    if (runner.y >= FLOOR - 54) {
      runner.y = FLOOR - 54;
      runner.vy = 0;
      runner.grounded = true;
    }
    state.speed += 5 * dt;
    state.spawn -= dt;
    state.cloud += dt * 28;
    if (state.spawn <= 0) {
      const height = 38 + Math.random() * 38;
      state.obstacles.push({ x: WIDTH + 50, width: 24 + Math.random() * 22, height });
      state.spawn = 0.95 + Math.random() * 0.95;
    }
    state.obstacles.forEach(obstacle => {
      obstacle.x -= state.speed * dt;
      const hit = runner.x + 58 > obstacle.x &&
        runner.x + 2 < obstacle.x + obstacle.width &&
        runner.y + 54 > FLOOR - obstacle.height;
      if (hit) gameOver('Run ended. Score: ' + state.score + '.');
    });
    state.obstacles = state.obstacles.filter(item => item.x > -80);
    state.score = Math.floor(state.score + dt * 10);
    updateScore();
  }

  function updateSnake(dt) {
    state.tick += dt;
    if (state.tick < 0.115) return;
    state.tick = 0;
    state.direction = state.nextDirection;
    const head = {
      x: state.snake[0].x + state.direction.x,
      y: state.snake[0].y + state.direction.y
    };
    if (head.x < 0 || head.x >= 40 || head.y < 0 || head.y >= 20 ||
        state.snake.some((part, index) => index < state.snake.length - 1 && part.x === head.x && part.y === head.y)) {
      gameOver('Snake caught itself. Score: ' + state.score + '.');
      return;
    }
    state.snake.unshift(head);
    if (head.x === state.food.x && head.y === state.food.y) {
      state.score += 10;
      placeFood();
      updateScore();
    } else {
      state.snake.pop();
    }
  }

  function placeFood() {
    let tries = 0;
    do {
      state.food = { x: Math.floor(Math.random() * 40), y: Math.floor(Math.random() * 20) };
      tries++;
    } while (state.snake.some(part => part.x === state.food.x && part.y === state.food.y) && tries < 100);
  }

  function updateTetris(dt) {
    if (!state.active) return;
    state.dropTimer += dt;
    const interval = Math.max(0.12, 0.72 - (state.level - 1) * 0.055);
    while (state.dropTimer >= interval && !state.over) {
      state.dropTimer -= interval;
      if (!moveTetrisPiece(0, 1)) lockTetrisPiece();
    }
  }

  function updatePong(dt) {
    if (state.up) state.playerY -= 410 * dt;
    if (state.down) state.playerY += 410 * dt;
    state.playerY = clamp(state.playerY, 20, HEIGHT - 120);
    const target = state.ball.y - 48;
    state.cpuY += clamp(target - state.cpuY, -300 * dt, 300 * dt);
    const ball = state.ball;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    if (ball.y < 18 || ball.y > HEIGHT - 18) ball.vy *= -1;
    if (ball.vx < 0 && ball.x < 86 && ball.y + 20 > state.playerY && ball.y - 20 < state.playerY + 100) {
      ball.x = 86; ball.vx = Math.abs(ball.vx) * 1.04; ball.vy += (ball.y - (state.playerY + 50)) * 2.8;
    }
    if (ball.vx > 0 && ball.x > WIDTH - 86 && ball.y + 20 > state.cpuY && ball.y - 20 < state.cpuY + 100) {
      ball.x = WIDTH - 86; ball.vx = -Math.abs(ball.vx) * 1.03; ball.vy += (ball.y - (state.cpuY + 50)) * 2.4;
    }
    if (ball.x < 0) {
      state.cpu++; resetPongBall(1);
      updateScore();
    } else if (ball.x > WIDTH) {
      state.player++; resetPongBall(-1);
      updateScore();
    }
    if (state.player >= 5 || state.cpu >= 5) gameOver(state.player >= 5 ? 'You win!' : 'CPU wins!');
  }

  function resetPongBall(direction) {
    state.ball = { x: WIDTH / 2, y: HEIGHT / 2, vx: 360 * direction, vy: (Math.random() - .5) * 340 };
  }

  function roundedRect(x, y, width, height, radius, fill) {
    context.fillStyle = fill;
    context.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
  }

  function draw() {
    if (!context || !state) return;
    context.clearRect(0, 0, WIDTH, HEIGHT);
    if (mode === 'flappy') drawFlappy();
    else if (mode === 'dino') drawDino();
    else if (mode === 'snake') drawSnake();
    else if (mode === 'pong') drawPong();
    else if (mode === 'tetris') drawTetris();
    else if (mode === 'chess') drawChess();
    drawInlineClose();
    if (state.over && mode !== 'chess') drawGameOver();
  }

  function drawSky() {
    // Intentionally empty: let the site's existing background show through.
  }

  function drawFlappy() {
    drawSky();
    context.fillStyle = 'rgba(255,255,255,.28)';
    [[120,94,56,10],[315,154,42,8],[620,88,64,10],[820,174,46,8]].forEach(([x,y,w,h]) => {
      context.fillRect(x, y, w, h);
    });
    state.pipes.forEach(pipe => {
      const top = pipe.gap - 92, bottom = pipe.gap + 92;
      roundedRect(pipe.x, -8, 88, top - 8, 0, '#4f9b48');
      roundedRect(pipe.x - 8, top - 24, 104, 24, 0, '#367b38');
      roundedRect(pipe.x, bottom, 88, FLOOR - bottom, 0, '#4f9b48');
      roundedRect(pipe.x - 8, bottom, 104, 24, 0, '#367b38');
    });
    context.fillStyle = '#78934b'; context.fillRect(0, FLOOR, WIDTH, 5);
    context.fillStyle = 'rgba(255,255,255,.20)'; context.fillRect(0, FLOOR + 7, WIDTH, 2);
    const bird = state.bird;
    context.save();
    context.translate(bird.x, bird.y);
    context.rotate(clamp(bird.vy / 900, -.4, .65));
    if (gameSprite.complete && gameSprite.naturalWidth) {
      context.drawImage(gameSprite, -25, -25, 50, 50);
    } else {
      context.fillStyle = '#3da66b'; context.fillRect(-20,-20,40,40);
    }
    context.restore();
    context.fillStyle = '#ffffff'; context.font = 'bold 24px monospace'; context.fillText('FLAP', 28, 42);
    context.font = '700 22px system-ui'; context.textAlign = 'right'; context.fillText(String(state.score), WIDTH - 88, 42); context.textAlign = 'left';
  }

  function drawDino() {
    context.fillStyle = 'rgba(255,255,255,.68)'; context.font = '20px monospace';
    context.fillText('HI ' + String(Math.floor(state.score)).padStart(5,'0'), WIDTH - 190, 46);
    context.strokeStyle = 'rgba(255,255,255,.5)'; context.lineWidth = 3;
    context.beginPath(); context.moveTo(0,FLOOR); context.lineTo(WIDTH,FLOOR); context.stroke();
    for (let i=0;i<6;i++) {
      const x = (i*220 - state.cloud*0.4) % (WIDTH+220);
      context.fillStyle = 'rgba(255,255,255,.24)'; context.fillRect(x, 110 + (i%2)*45, 52, 4);
    }
    state.obstacles.forEach(obstacle => drawCactus(obstacle.x, FLOOR-obstacle.height, obstacle.width, obstacle.height));
    drawDinoRunner(state.runner.x, state.runner.y);
    context.fillStyle = 'rgba(255,255,255,.9)'; context.font = 'bold 21px monospace'; context.fillText('DINO', 28, 42);
  }

  function drawCactus(x,y,w,h) {
    context.fillStyle = '#60685c';
    context.fillRect(x+w*.34,y,w*.34,h);
    context.fillRect(x,y+h*.34,w*.42,h*.13);
    context.fillRect(x,y+h*.34,w*.16,h*.34);
    context.fillRect(x+w*.60,y+h*.2,w*.4,h*.13);
    context.fillRect(x+w*.82,y+h*.2,w*.16,h*.32);
  }

  function drawDinoRunner(x,y) {
    if (gameSprite.complete && gameSprite.naturalWidth) {
      context.drawImage(gameSprite, Math.round(x), Math.round(y - 4), 60, 58);
      return;
    }
    const color = '#4b554b';
    context.fillStyle = color;
    context.fillRect(x+10,y+13,31,30);
    context.fillRect(x+27,y,27,24);
    context.fillRect(x+47,y+9,17,8);
    context.fillRect(x+47,y+23,10,7);
    context.fillRect(x+5,y+23,12,7);
    context.fillStyle = '#e8e8df'; context.fillRect(x+43,y+7,4,4);
    const leg = Math.sin(performance.now()/65) > 0 ? 0 : 1;
    context.fillStyle = color;
    context.fillRect(x+16,y+40,9,leg?14:10);
    context.fillRect(x+33,y+40,9,leg?10:14);
  }

  function drawSnake() {
    context.strokeStyle = 'rgba(255,255,255,.13)'; context.lineWidth = 1;
    for (let x=0;x<=WIDTH;x+=24) { context.beginPath();context.moveTo(x,30);context.lineTo(x,HEIGHT-30);context.stroke(); }
    for (let y=30;y<=HEIGHT-30;y+=24) { context.beginPath();context.moveTo(0,y);context.lineTo(WIDTH,y);context.stroke(); }
    state.snake.forEach((part,index) => {
      roundedRect(part.x*24+2,part.y*24+34,20,20,0,index===0?'#a4df55':'#58a647');
    });
    context.fillStyle = '#e45b45';
    context.fillRect(state.food.x*24+4,state.food.y*24+36,16,16);
    context.fillStyle = '#ffffff'; context.font = 'bold 20px monospace'; context.fillText('SNAKE', 26, 28);
    context.textAlign = 'right'; context.fillText('Score: ' + state.score, WIDTH - 88, 28); context.textAlign = 'left';
  }

  function drawPong() {
    context.fillStyle = 'rgba(255,255,255,.32)';
    for (let y=24;y<HEIGHT-24;y+=34) context.fillRect(WIDTH/2-2,y,4,18);
    roundedRect(48,state.playerY,18,100,0,'#8ebd4f');
    roundedRect(WIDTH-66,state.cpuY,18,100,0,'#6f9cba');
    if (gameSprite.complete && gameSprite.naturalWidth) {
      context.drawImage(gameSprite, Math.round(state.ball.x - 20), Math.round(state.ball.y - 20), 40, 40);
    } else {
      context.fillStyle = '#ffffff'; context.fillRect(state.ball.x-10,state.ball.y-10,20,20);
    }
    context.fillStyle = '#ffffff'; context.font = 'bold 56px monospace'; context.textAlign = 'center';
    context.fillText(state.player,WIDTH/2-65,82); context.fillText(state.cpu,WIDTH/2+65,82);
    context.textAlign = 'left'; context.font = 'bold 20px monospace'; context.fillText('PONG',28,34);
    context.font = 'bold 15px monospace';
    context.fillText('CLICK: LOCK MOUSE   WHEEL / DRAG: MOVE', 28, HEIGHT - 20);
  }

  function drawTetrisCell(col, row, alpha = 1, cellSize = TETRIS_CELL) {
    const x = TETRIS_X + col * cellSize;
    const y = TETRIS_Y + row * cellSize;
    context.save();
    context.globalAlpha = alpha;
    context.fillStyle = 'rgba(120,160,100,.18)';
    context.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
    if (tetrisBlockSprite.complete && tetrisBlockSprite.naturalWidth) {
      context.drawImage(tetrisBlockSprite, x + 1, y + 1, cellSize - 2, cellSize - 2);
    } else {
      context.fillStyle = '#8ebd4f';
      context.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
    }
    context.strokeStyle = 'rgba(255,255,255,.18)';
    context.lineWidth = 1;
    context.strokeRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);
    context.restore();
  }

  function drawTetris() {
    const boardWidth = TETRIS_COLS * TETRIS_CELL;
    const boardHeight = TETRIS_ROWS * TETRIS_CELL;
    context.fillStyle = 'rgba(0,0,0,.24)';
    context.fillRect(TETRIS_X, TETRIS_Y, boardWidth, boardHeight);
    context.strokeStyle = 'rgba(255,255,255,.35)';
    context.lineWidth = 3;
    context.strokeRect(TETRIS_X - 2, TETRIS_Y - 2, boardWidth + 4, boardHeight + 4);

    for (let row = 0; row < TETRIS_ROWS; row++) {
      for (let col = 0; col < TETRIS_COLS; col++) {
        if (state.board[row][col]) drawTetrisCell(col, row);
        else {
          context.strokeStyle = 'rgba(255,255,255,.07)';
          context.lineWidth = 1;
          context.strokeRect(TETRIS_X + col * TETRIS_CELL + .5,
            TETRIS_Y + row * TETRIS_CELL + .5, TETRIS_CELL - 1, TETRIS_CELL - 1);
        }
      }
    }

    if (state.active) {
      const piece = state.active;
      // Ghost piece shows where the current shape will land.
      let ghostY = piece.y;
      while (canPlaceTetris(piece, 0, ghostY - piece.y + 1)) ghostY++;
      piece.matrix.forEach((line, row) => line.forEach((filled, col) => {
        if (!filled) return;
        const boardRow = ghostY + row;
        if (boardRow >= 0) drawTetrisCell(piece.x + col, boardRow, .22);
      }));
      piece.matrix.forEach((line, row) => line.forEach((filled, col) => {
        if (filled && piece.y + row >= 0) drawTetrisCell(piece.x + col, piece.y + row);
      }));
    }

    context.fillStyle = '#ffffff';
    context.font = 'bold 30px monospace';
    context.fillText('TETRIS', 118, 95);
    context.font = 'bold 20px monospace';
    context.fillText('SCORE', 120, 160);
    context.font = 'bold 28px monospace';
    context.fillText(String(state.score), 120, 195);
    context.font = 'bold 20px monospace';
    context.fillText('LINES', 120, 260);
    context.font = 'bold 28px monospace';
    context.fillText(String(state.lines), 120, 295);
    context.font = 'bold 20px monospace';
    context.fillText('LEVEL', 120, 360);
    context.font = 'bold 28px monospace';
    context.fillText(String(state.level), 120, 395);

    context.font = 'bold 20px monospace';
    context.fillText('NEXT', 650, 100);
    const nextMatrix = TETRIS_SHAPES[state.next];
    const previewCell = 20;
    const previewX = 650;
    const previewY = 125;
    nextMatrix.forEach((line, row) => line.forEach((filled, col) => {
      if (!filled) return;
      context.save();
      context.translate(previewX + col * previewCell, previewY + row * previewCell);
      context.fillStyle = 'rgba(120,160,100,.18)';
      context.fillRect(1, 1, previewCell - 2, previewCell - 2);
      if (tetrisBlockSprite.complete && tetrisBlockSprite.naturalWidth) {
        context.drawImage(tetrisBlockSprite, 1, 1, previewCell - 2, previewCell - 2);
      } else {
        context.fillStyle = '#8ebd4f';
        context.fillRect(2, 2, previewCell - 4, previewCell - 4);
      }
      context.restore();
    }));
    context.font = '16px monospace';
    context.fillText('ARROWS: MOVE / ROTATE', 650, 255);
    context.fillText('SPACE: HARD DROP', 650, 282);
    context.fillText('SWIPE: MOVE / DROP', 650, 309);
  }

  const CHESS_BOARD_X = 30;
  const CHESS_BOARD_Y = 42;
  const CHESS_SQUARE = 56;
  const CHESS_BOARD_SIZE = CHESS_SQUARE * 8;
  const CHESS_KNIGHT = [-33,-31,-18,-14,14,18,31,33];
  const CHESS_BISHOP = [-17,-15,15,17];
  const CHESS_ROOK = [-16,-1,1,16];
  const CHESS_KING = [-17,-16,-15,-1,1,15,16,17];
  const CHESS_GLYPH = {P:'♙',N:'♘',B:'♗',R:'♖',Q:'♕',p:'♟︎',n:'♞',b:'♝',r:'♜',q:'♛'};
  const CHESS_PROMOTIONS = ['q','r','b','n'];
  const STOCKFISH_WORKER_PATH = 'engine/stockfish/stockfish-19-lite-single.js';
  const STOCKFISH_WASM_URLS = [
    'https://cdn.jsdelivr.net/npm/stockfish@19.0.1/bin/stockfish-19-lite-single.wasm',
    'https://unpkg.com/stockfish@19.0.1/bin/stockfish-19-lite-single.wasm'
  ];
  const CHESS_SKILL_LEVELS = 21;
  let chessEngineMoveTimer = 0;
  let chessEngineStartupTimer = 0;
  let chessEngineWorker = null;
  let chessEngineWasmBlobUrl = null;
  let chessEngineStarting = false;
  let chessEngineReady = false;
  let chessEngineThinking = false;
  let chessEngineCancelRequested = false;
  let chessEngineExpectedState = null;
  let chessEngineSkill = 8;
  let chessEngineError = '';
  let chessEngineProgress = 'Not loaded';
  const chessOnBoard = i => i >= 0 && i < 128 && !(i & 0x88);
  const chessSide = p => p === '.' ? 0 : p === p.toUpperCase() ? 1 : -1;
  const chessName = i => 'abcdefgh'[i & 7] + (8 - (i >> 4));
  const chessIndex = (file,rank) => rank * 16 + file;

  function createChessGame() {
    const board = Array(128).fill('.');
    const back = 'RNBQKBNR';
    for (let file=0; file<8; file++) {
      board[file] = back[file].toLowerCase();
      board[16+file] = 'p';
      board[96+file] = 'P';
      board[112+file] = back[file];
    }
    return {
      board, turn:1, castle:15, ep:-1, halfmove:0, fullmove:1,
      selected:-1, pendingPromotion:null, lastMove:null,
      moveLog:[], past:[], over:false, status:'White to move'
    };
  }

  function chessSnapshot(s) {
    return {
      board:s.board.slice(), turn:s.turn, castle:s.castle, ep:s.ep,
      halfmove:s.halfmove, fullmove:s.fullmove, selected:-1,
      pendingPromotion:null, lastMove:s.lastMove ? {...s.lastMove} : null,
      moveLog:s.moveLog.slice(), over:s.over, status:s.status
    };
  }

  function chessAttacked(s,target,by) {
    for (let rank=0; rank<8; rank++) for (let file=0; file<8; file++) {
      const from=chessIndex(file,rank), piece=s.board[from];
      if (chessSide(piece)!==by) continue;
      const type=piece.toLowerCase();
      if (type==='p') {
        const next=from-16*by;
        if (target===next-1 || target===next+1) return true;
        continue;
      }
      const offsets=type==='n'?CHESS_KNIGHT:type==='b'?CHESS_BISHOP:
        type==='r'?CHESS_ROOK:type==='q'?CHESS_BISHOP.concat(CHESS_ROOK):CHESS_KING;
      for (const d of offsets) {
        let to=from+d;
        while(chessOnBoard(to)) {
          if(to===target) return true;
          if(s.board[to]!=='.'||type==='n'||type==='k') break;
          to+=d;
        }
      }
    }
    return false;
  }

  function chessInCheck(s,color) {
    const king=s.board.indexOf(color===1?'K':'k');
    return king<0 || chessAttacked(s,king,-color);
  }

  function chessPseudoMoves(s) {
    const out=[];
    const add=(from,to,flag)=>{
      const p=s.board[from];
      if(p.toLowerCase()==='p' && ((to>>4)===0 || (to>>4)===7)) {
        CHESS_PROMOTIONS.forEach(promotion=>out.push({from,to,promotion,flag:flag||''}));
      } else out.push({from,to,promotion:'',flag:flag||''});
    };
    for(let rank=0;rank<8;rank++) for(let file=0;file<8;file++) {
      const from=chessIndex(file,rank), piece=s.board[from];
      if(chessSide(piece)!==s.turn) continue;
      const type=piece.toLowerCase();
      if(type==='p') {
        const step=-16*s.turn, one=from+step;
        if(chessOnBoard(one)&&s.board[one]==='.') {
          add(from,one);
          const home=s.turn===1?6:1, two=from+step*2;
          if(rank===home&&s.board[two]==='.') add(from,two);
        }
        for(const sideStep of [-1,1]) {
          const to=one+sideStep;
          if(!chessOnBoard(to)) continue;
          if(chessSide(s.board[to])===-s.turn && s.board[to].toLowerCase()!=='k') add(from,to);
          else if(to===s.ep&&s.board[to]==='.'&&s.board[to+16*s.turn]===(s.turn===1?'p':'P')) add(from,to,'ep');
        }
        continue;
      }
      const offsets=type==='n'?CHESS_KNIGHT:type==='b'?CHESS_BISHOP:
        type==='r'?CHESS_ROOK:type==='q'?CHESS_BISHOP.concat(CHESS_ROOK):CHESS_KING;
      for(const d of offsets) {
        let to=from+d;
        while(chessOnBoard(to)) {
          if(chessSide(s.board[to])===s.turn) break;
          if(s.board[to].toLowerCase()!=='k') add(from,to);
          if(s.board[to]!=='.'||type==='n'||type==='k') break;
          to+=d;
        }
      }
      const home=s.turn===1?116:4, rook=s.turn===1?'R':'r';
      const kBit=s.turn===1?1:4, qBit=s.turn===1?2:8;
      if(type==='k'&&from===home&&!chessInCheck(s,s.turn)) {
        if((s.castle&kBit)&&s.board[home+3]===rook&&s.board[home+1]==='.'&&s.board[home+2]==='.'&&
          !chessAttacked(s,home+1,-s.turn)&&!chessAttacked(s,home+2,-s.turn)) add(from,home+2,'castle');
        if((s.castle&qBit)&&s.board[home-4]===rook&&s.board[home-1]==='.'&&s.board[home-2]==='.'&&s.board[home-3]==='.'&&
          !chessAttacked(s,home-1,-s.turn)&&!chessAttacked(s,home-2,-s.turn)) add(from,home-2,'castle');
      }
    }
    return out;
  }

  function chessApplyBare(s,m) {
    const board=s.board.slice(), piece=board[m.from], captured=board[m.to];
    board[m.from]='.';
    board[m.to]=m.promotion?(s.turn===1?m.promotion.toUpperCase():m.promotion):piece;
    if(m.flag==='ep') board[m.to+16*s.turn]='.';
    if(m.flag==='castle') {
      const rookFrom=m.to>m.from?m.from+3:m.from-4;
      const rookTo=m.to>m.from?m.from+1:m.from-1;
      board[rookTo]=board[rookFrom]; board[rookFrom]='.';
    }
    let castle=s.castle;
    const rookBits={119:1,112:2,7:4,0:8};
    if(piece==='K') castle&=~3;
    if(piece==='k') castle&=~12;
    if(piece.toLowerCase()==='r') castle&=~(rookBits[m.from]||0);
    if(captured.toLowerCase()==='r') castle&=~(rookBits[m.to]||0);
    return {
      board,turn:-s.turn,castle,
      ep:piece.toLowerCase()==='p'&&Math.abs(m.to-m.from)===32?(m.to+m.from)/2:-1,
      halfmove:piece.toLowerCase()==='p'||captured!=='.'||m.flag==='ep'?0:s.halfmove+1,
      fullmove:s.fullmove+(s.turn===-1?1:0)
    };
  }

  function chessLegalMoves(s) {
    return chessPseudoMoves(s).filter(m=>!chessInCheck(chessApplyBare(s,m),s.turn));
  }

  function chessSan(s,m) {
    if(m.flag==='castle') return m.to>m.from?'O-O':'O-O-O';
    const piece=s.board[m.from], type=piece.toUpperCase(), capture=s.board[m.to]!=='.'||m.flag==='ep';
    let out='';
    if(type!=='P') {
      out=type;
      const others=chessLegalMoves(s).filter(x=>x.to===m.to&&x.from!==m.from&&s.board[x.from]===piece);
      if(others.length) {
        const sameFile=others.some(x=>(x.from&7)===(m.from&7));
        const sameRank=others.some(x=>(x.from>>4)===(m.from>>4));
        out+=!sameFile?'abcdefgh'[m.from&7]:!sameRank?String(8-(m.from>>4)):chessName(m.from);
      }
    } else if(capture) out='abcdefgh'[m.from&7];
    out+=(capture?'x':'')+chessName(m.to);
    if(m.promotion) out+='='+m.promotion.toUpperCase();
    const next=chessApplyBare(s,m);
    if(chessInCheck(next,next.turn)) out+=chessLegalMoves(next).length?'+':'#';
    return out;
  }

  function chessSignature(s) { return s.board.join('')+'|'+s.turn+'|'+s.castle+'|'+s.ep; }

  function chessInsufficient(s) {
    const pieces=[];
    for(let rank=0;rank<8;rank++) for(let file=0;file<8;file++) {
      const i=chessIndex(file,rank), p=s.board[i];
      if(p!=='.'&&p.toLowerCase()!=='k') pieces.push({type:p.toLowerCase(),square:i});
    }
    if(!pieces.length) return true;
    if(pieces.length===1&&(pieces[0].type==='b'||pieces[0].type==='n')) return true;
    return pieces.every(p=>p.type==='b')&&new Set(pieces.map(p=>((p.square>>4)+(p.square&7))%2)).size===1;
  }

  function updateChessStatus() {
    const moves=chessLegalMoves(state), check=chessInCheck(state,state.turn);
    const repetitions=[state].concat(state.past).filter(s=>chessSignature(s)===chessSignature(state)).length;
    if(!moves.length) {
      state.over=true;
      state.status=check?'Checkmate — '+(state.turn===1?'Black':'White')+' wins.':'Draw — stalemate.';
    } else if(chessInsufficient(state)) {
      state.over=true; state.status='Draw — insufficient material.';
    } else if(state.halfmove>=100) {
      state.over=true; state.status='Draw — fifty-move rule.';
    } else if(repetitions>=3) {
      state.over=true; state.status='Draw — threefold repetition.';
    } else {
      state.over=false;
      state.status=(state.turn===1?'White':'Black')+' to move'+(check?' · Check':'');
    }
  }

  function chessToFen(s) {
    const rows=[];
    for(let rank=0;rank<8;rank++) {
      let row='',empty=0;
      for(let file=0;file<8;file++) {
        const piece=s.board[chessIndex(file,rank)];
        if(piece==='.') empty++;
        else { if(empty) row+=String(empty); empty=0; row+=piece; }
      }
      if(empty) row+=String(empty);
      rows.push(row);
    }
    let castling='';
    if(s.castle&1) castling+='K';
    if(s.castle&2) castling+='Q';
    if(s.castle&4) castling+='k';
    if(s.castle&8) castling+='q';
    return rows.join('/')+' '+(s.turn===1?'w':'b')+' '+(castling||'-')+' '+(s.ep<0?'-':chessName(s.ep))+' '+s.halfmove+' '+s.fullmove;
  }

  function cancelChessEngineSearch() {
    if(chessEngineMoveTimer) { clearTimeout(chessEngineMoveTimer); chessEngineMoveTimer=0; }
    if(chessEngineThinking && chessEngineWorker) {
      chessEngineCancelRequested=true;
      try { chessEngineWorker.postMessage('stop'); } catch(_) {}
    } else {
      chessEngineExpectedState=null;
    }
  }

  async function fetchStockfishWasm() {
    let lastError=null;
    for(const url of STOCKFISH_WASM_URLS) {
      try {
        chessEngineProgress='Downloading Stockfish…';
        if(mode==='chess'&&state){state.status='Downloading Stockfish 19…';draw();}
        const controller=new AbortController();
        const downloadTimer=setTimeout(()=>controller.abort(),18000);
        let response,buffer;
        try {
          response=await fetch(url,{mode:'cors',credentials:'omit',cache:'force-cache',signal:controller.signal});
          if(!response.ok) throw new Error('HTTP '+response.status+' from '+new URL(url).hostname);
          buffer=await response.arrayBuffer();
        } finally { clearTimeout(downloadTimer); }
        if(buffer.byteLength<500000) throw new Error('The Stockfish WASM download was incomplete ('+buffer.byteLength+' bytes).');
        return buffer;
      } catch(error) {
        lastError=error;
        console.warn('[Chess] Stockfish WASM source failed:',url,error);
      }
    }
    throw lastError||new Error('Could not download the Stockfish WASM file.');
  }

  function failStockfish(message,error) {
    chessEngineStarting=false;chessEngineReady=false;chessEngineThinking=false;
    if(chessEngineStartupTimer){clearTimeout(chessEngineStartupTimer);chessEngineStartupTimer=0;}
    chessEngineError=message;
    console.error('[Chess] Stockfish failed:',error||message);
    if(chessEngineWorker){try{chessEngineWorker.terminate();}catch(_){}chessEngineWorker=null;}
    if(mode==='chess'&&state){state.status=message;draw();}
  }

  async function ensureChessEngine() {
    if(chessEngineWorker||chessEngineStarting||chessEngineError) return;
    chessEngineStarting=true;chessEngineProgress='Starting Stockfish…';
    try {
      if(typeof WebAssembly!=='object') throw new Error('This browser does not support WebAssembly.');
      if(typeof Worker!=='function') throw new Error('This browser does not support Web Workers.');
      const wasmBuffer=await fetchStockfishWasm();
      if(!chessEngineStarting) return;
      chessEngineWasmBlobUrl=URL.createObjectURL(new Blob([wasmBuffer],{type:'application/wasm'}));
      const workerUrl=new URL(STOCKFISH_WORKER_PATH,document.baseURI);
      // The Stockfish.js worker reads the WASM URL from its URL fragment.
      workerUrl.hash=encodeURIComponent(chessEngineWasmBlobUrl)+',worker';
      const worker=new Worker(workerUrl.toString(),{name:'Stockfish 19'});
      chessEngineWorker=worker;
      chessEngineProgress='Starting Stockfish worker…';
      chessEngineStartupTimer=setTimeout(()=>{
        if(!chessEngineReady) failStockfish('Stockfish did not finish starting. Check that the engine worker and WASM file are reachable.',new Error('Stockfish startup timed out after 30 seconds.'));
      },30000);
      worker.onmessage=event=>{
        const rawLine=String(event.data||'').replace(/\0/g,'').trim();
        // The Stockfish.js lite worker separates letters in UCI keywords (e.g. "b e s t m o v e").
        const line=rawLine.replace(/\b(?:[a-z][ \t]){2,}[a-z]\b/gi,word=>word.replace(/[ \t]/g,''));
        if(line==='uciok') {
          chessEngineProgress='Configuring Stockfish…';
          if(mode==='chess'&&state){state.status='Configuring Stockfish 19…';draw();}
          worker.postMessage('setoption name Skill Level value '+chessEngineSkill);
          worker.postMessage('isready');
          return;
        }
        if(line==='readyok') {
          if(chessEngineStartupTimer){clearTimeout(chessEngineStartupTimer);chessEngineStartupTimer=0;}
          chessEngineStarting=false;chessEngineReady=true;chessEngineProgress='Ready';
          console.info('[Chess] Stockfish 19 ready.');
          if(mode==='chess'&&state&&state.turn===-1&&!state.over) requestStockfishMove();
          else if(mode==='chess') { state.status='Stockfish 19 ready · Level '+chessEngineSkill; draw(); }
          return;
        }
        if(line.startsWith('info ')) {
          const depth=line.match(/\\bdepth\\s+(\\d+)/);
          if(depth&&chessEngineThinking&&mode==='chess'&&state&&state.turn===-1) {
            state.status='Stockfish thinking · depth '+depth[1];
            draw();
          }
          return;
        }
        if(line.startsWith('bestmove ')) {
          const best=line.split(/\\s+/)[1];
          chessEngineThinking=false;
          if(chessEngineCancelRequested) {
            chessEngineCancelRequested=false;
            chessEngineExpectedState=null;
            if(mode==='chess'&&state&&state.turn===-1&&!state.over) requestStockfishMove();
            return;
          }
          const expected=chessEngineExpectedState;
          chessEngineExpectedState=null;
          if(mode!=='chess'||!state||state.over||state.turn!==-1) return;
          if(state!==expected) { requestStockfishMove(); return; }
          if(!best||best==='(none)') { updateChessStatus();draw();return; }
          const from=(8-Number(best[1]))*16+'abcdefgh'.indexOf(best[0]);
          const to=(8-Number(best[3]))*16+'abcdefgh'.indexOf(best[2]);
          const promotion=(best[4]||'').toLowerCase();
          const move=chessLegalMoves(state).find(m=>m.from===from&&m.to===to&&(m.promotion||'')===promotion);
          if(move) chessMove(move);
          else failStockfish('Stockfish returned an invalid move: '+best,new Error('Invalid UCI move: '+best));
          return;
        }
        if(rawLine.toLowerCase().includes('error')||rawLine.toLowerCase().includes('abort')) {
          failStockfish('Stockfish engine error. See the browser console for details.',new Error(rawLine));
        }
      };
      worker.onerror=event=>{
        const detail=event?.message||'The browser blocked or could not load the Stockfish worker.';
        failStockfish('Stockfish worker failed: '+detail,new Error(detail));
      };
      worker.onmessageerror=event=>{
        failStockfish('Stockfish sent a message the page could not read.',event);
      };
      chessEngineProgress='Handshaking with Stockfish…';
      worker.postMessage('uci');
    } catch(error) {
      failStockfish('Stockfish could not start: '+(error?.message||String(error)),error);
    }
  }

  function requestStockfishMove() {
    if(mode!=='chess'||!state||state.over||state.turn!==-1||chessEngineThinking) return;
    if(!chessEngineWorker) ensureChessEngine();
    if(chessEngineError) { state.status=chessEngineError;draw();return; }
    if(!chessEngineReady) { state.status=chessEngineProgress||'Loading Stockfish 19…';draw();ensureChessEngine();return; }
    chessEngineThinking=true;
    chessEngineExpectedState=state;
    state.status='Stockfish level '+chessEngineSkill+' is thinking…';
    draw();
    try {
      chessEngineWorker.postMessage('setoption name Skill Level value '+chessEngineSkill);
      chessEngineWorker.postMessage('ucinewgame');
      chessEngineWorker.postMessage('position fen '+chessToFen(state));
      chessEngineWorker.postMessage('go movetime 900');
    } catch(_) {
      chessEngineThinking=false;chessEngineExpectedState=null;
      state.status='Stockfish could not start the search.';draw();
    }
  }

  function setChessEngineSkill(level) {
    const next=clamp(Math.round(level),0,CHESS_SKILL_LEVELS-1);
    if(next===chessEngineSkill) return;
    chessEngineSkill=next;
    if(chessEngineWorker&&chessEngineReady) {
      if(chessEngineThinking) {
        chessEngineCancelRequested=true;
        try { chessEngineWorker.postMessage('stop'); } catch(_) {}
      } else {
        chessEngineWorker.postMessage('setoption name Skill Level value '+chessEngineSkill);
      }
    }
    if(state&&mode==='chess') draw();
  }

  function chessMove(m) {
    if(!state||state.over) return;
    if(chessEngineMoveTimer) { clearTimeout(chessEngineMoveTimer); chessEngineMoveTimer=0; }
    const san=chessSan(state,m), previous=chessSnapshot(state), next=chessApplyBare(state,m);
    state={
      ...next,selected:-1,pendingPromotion:null,lastMove:{from:m.from,to:m.to},
      moveLog:state.moveLog.concat([{number:state.fullmove,white:state.turn===1,text:san}]),
      past:state.past.concat([previous]),over:false,status:''
    };
    updateChessStatus();
    if(mode==='chess'&&!state.over&&state.turn===-1) {
      state.status=chessEngineReady?'Stockfish level '+chessEngineSkill+' is thinking…':'Loading Stockfish 19…';
      const expected=state;
      chessEngineMoveTimer=setTimeout(()=>{
        chessEngineMoveTimer=0;
        if(mode!=='chess'||state!==expected||state.over||state.turn!==-1)return;
        requestStockfishMove();
      },160);
    }
    draw();
  }

  function chooseChessPromotion(piece) {
    if(!state||!state.pendingPromotion) return;
    const m=state.pendingPromotion.find(x=>x.promotion===piece);
    if(m) chessMove(m);
  }

  function undoChessMove() {
    if(!state||!state.past.length) return;
    cancelChessEngineSearch();
    const past=state.past.slice();
    // After the bot has replied, undo both its move and the player's previous move.
    const steps=state.turn===1&&past.length>=2?2:1;
    let previous=null;
    for(let i=0;i<steps;i++) previous=past.pop();
    state={...previous,past,selected:-1,pendingPromotion:null};
    updateChessStatus(); draw();
  }

  function resetChess() {
    if(mode!=='chess') return;
    cancelChessEngineSearch();
    state=createChessGame(); updateChessStatus(); draw();
  }

  function handleChessClick(point) {
    if(!state) return;
    if(state.pendingPromotion) {
      const left=CHESS_BOARD_X+62, top=CHESS_BOARD_Y+176, width=324;
      if(point.y>=top&&point.y<=top+116&&point.x>=left&&point.x<=left+width) {
        chooseChessPromotion(CHESS_PROMOTIONS[Math.min(3,Math.floor((point.x-left)/81))]);
      }
      return;
    }
    if(point.y>=244&&point.y<=306&&point.x>=530&&point.x<=860) {
      const level=Math.round(clamp((point.x-545)/300,0,1)*(CHESS_SKILL_LEVELS-1));
      setChessEngineSkill(level);
      return;
    }
    if(point.y>=470&&point.y<=516) {
      if(point.x>=530&&point.x<=675) undoChessMove();
      else if(point.x>=690&&point.x<=860) resetChess();
      return;
    }
    if(state.over) return;
    if(state.turn!==1) { state.status='Stockfish is thinking…'; draw(); return; }
    const file=Math.floor((point.x-CHESS_BOARD_X)/CHESS_SQUARE);
    const rank=Math.floor((point.y-CHESS_BOARD_Y)/CHESS_SQUARE);
    if(file<0||file>=8||rank<0||rank>=8) return;
    const target=chessIndex(file,rank), legal=chessLegalMoves(state);
    if(state.selected>=0) {
      const candidates=legal.filter(m=>m.from===state.selected&&m.to===target);
      if(candidates.length>1&&candidates[0].promotion) { state.pendingPromotion=candidates; draw(); return; }
      if(candidates.length===1) { chessMove(candidates[0]); return; }
    }
    state.selected=chessSide(state.board[target])===state.turn?target:-1;
    draw();
  }

  function drawChessButton(x,y,width,label,disabled) {
    context.fillStyle=disabled?'rgba(255,255,255,.12)':'rgba(255,255,255,.22)';
    context.fillRect(x,y,width,42);
    context.strokeStyle='rgba(255,255,255,.55)'; context.lineWidth=2;
    context.strokeRect(x,y,width,42);
    context.fillStyle=disabled?'rgba(255,255,255,.4)':'#ffffff';
    context.font='bold 17px monospace'; context.textAlign='center';
    context.fillText(label,x+width/2,y+27); context.textAlign='left';
  }

  function drawChess() {
    const legal=state.over?[]:chessLegalMoves(state);
    const targets=state.selected>=0?legal.filter(m=>m.from===state.selected):[];
    for(let rank=0;rank<8;rank++) for(let file=0;file<8;file++) {
      const square=chessIndex(file,rank), x=CHESS_BOARD_X+file*CHESS_SQUARE, y=CHESS_BOARD_Y+rank*CHESS_SQUARE;
      context.fillStyle=(rank+file)%2?'#b58863':'#f0d9b5';
      context.fillRect(x,y,CHESS_SQUARE,CHESS_SQUARE);
      if(state.lastMove&&(square===state.lastMove.from||square===state.lastMove.to)) {
        context.fillStyle='rgba(250,204,21,.38)'; context.fillRect(x,y,CHESS_SQUARE,CHESS_SQUARE);
      }
      if(square===state.selected) {
        context.fillStyle='rgba(250,204,21,.62)'; context.fillRect(x,y,CHESS_SQUARE,CHESS_SQUARE);
      }
      if(targets.some(m=>m.to===square)) {
        context.strokeStyle='rgba(22,101,52,.85)'; context.lineWidth=4;
        context.beginPath();
        if(state.board[square]==='.') { context.arc(x+28,y+28,7,0,Math.PI*2); context.fillStyle='#166534'; context.fill(); }
        else { context.arc(x+28,y+28,23,0,Math.PI*2); context.stroke(); }
      }
      const piece=state.board[square];
      if(piece==='.') continue;
      const side=chessSide(piece);
      if(piece.toLowerCase()==='k') {
        context.fillStyle=side===1?'rgba(255,255,255,.8)':'rgba(15,23,42,.85)';
        context.beginPath(); context.arc(x+28,y+28,23,0,Math.PI*2); context.fill();
        if(chessKingImage.complete&&chessKingImage.naturalWidth) {
          context.imageSmoothingEnabled = false;
          context.drawImage(side === -1 && chessDarkKingCanvas ? chessDarkKingCanvas : chessKingImage,x+7,y+7,42,42);
          context.imageSmoothingEnabled = true;
        } else {
          context.font='bold 42px serif'; context.textAlign='center';
          context.fillStyle=side===1?'#fffdf4':'#171717'; context.fillText('♚',x+28,y+43); context.textAlign='left';
        }
      } else {
        context.font='48px "DejaVu Sans","Segoe UI Symbol",serif';
        context.textAlign='center'; context.textBaseline='middle'; context.lineWidth=2;
        context.strokeStyle=side===1?'#1b1b1b':'#f4eadb';
        context.fillStyle=side===1?'#fffdf4':'#171717';
        context.strokeText(CHESS_GLYPH[piece],x+28,y+29);
        context.fillText(CHESS_GLYPH[piece],x+28,y+29);
        context.textAlign='left'; context.textBaseline='alphabetic';
      }
    }
    context.fillStyle='#f0d9b5'; context.font='14px monospace';
    for(let file=0;file<8;file++) context.fillText('abcdefgh'[file],CHESS_BOARD_X+file*CHESS_SQUARE+25,CHESS_BOARD_Y+CHESS_BOARD_SIZE+18);
    for(let rank=0;rank<8;rank++) context.fillText(String(8-rank),CHESS_BOARD_X-17,CHESS_BOARD_Y+rank*CHESS_SQUARE+31);

    context.fillStyle='#ffffff'; context.font='bold 30px monospace'; context.fillText('CHESS',530,88);
    context.font='bold 17px monospace'; context.fillText(state.status,530,126);
    context.font='15px monospace';
    context.fillText('You (White) vs Stockfish 19.',530,164);
    context.fillText('Tap a piece, then a move.',530,190);
    context.font='bold 16px monospace'; context.fillText('STOCKFISH LEVEL  '+chessEngineSkill+'/20',530,225);
    const sliderLeft=545,sliderRight=845,sliderY=270;
    context.strokeStyle='rgba(255,255,255,.35)';context.lineWidth=6;
    context.beginPath();context.moveTo(sliderLeft,sliderY);context.lineTo(sliderRight,sliderY);context.stroke();
    for(let level=0;level<CHESS_SKILL_LEVELS;level++) {
      const x=sliderLeft+(sliderRight-sliderLeft)*level/(CHESS_SKILL_LEVELS-1);
      context.strokeStyle=level===chessEngineSkill?'#ffffff':'rgba(255,255,255,.55)';
      context.lineWidth=level===chessEngineSkill?4:2;
      context.beginPath();context.moveTo(x,sliderY-8);context.lineTo(x,sliderY+8);context.stroke();
    }
    const selectedX=sliderLeft+(sliderRight-sliderLeft)*chessEngineSkill/(CHESS_SKILL_LEVELS-1);
    context.fillStyle='#2f9b5b';context.strokeStyle='#ffffff';context.lineWidth=2;
    context.beginPath();context.arc(selectedX,sliderY,10,0,Math.PI*2);context.fill();context.stroke();
    context.fillStyle='#d7e8d4';context.font='12px monospace';
    context.fillText('0 · EASIEST',530,302);context.textAlign='right';
    context.fillText('20 · STRONGEST',860,302);context.textAlign='left';
    context.fillStyle='#ffffff';context.font='bold 16px monospace';context.fillText('MOVES',530,350);
    context.font='15px monospace';
    state.moveLog.slice(-5).forEach((m,i)=>{
      context.fillText(String(m.number)+(m.white?'. ':'... ')+m.text,530,375+i*19);
    });
    drawChessButton(530,470,145,'UNDO',!state.past.length);
    drawChessButton(690,470,170,'NEW GAME',false);
    if(state.pendingPromotion) {
      const left=CHESS_BOARD_X+62, top=CHESS_BOARD_Y+176;
      context.fillStyle='rgba(9,18,12,.95)'; context.fillRect(left,top,324,116);
      context.strokeStyle='#ffffff'; context.lineWidth=2; context.strokeRect(left,top,324,116);
      context.fillStyle='#ffffff'; context.font='bold 18px monospace'; context.textAlign='center';
      context.fillText('PROMOTE TO',left+162,top+31);
      ['♕','♖','♗','♘'].forEach((glyph,i)=>{
        context.font='38px serif'; context.fillStyle=state.turn===1?'#fffdf4':'#171717';
        context.fillText(glyph,left+40+i*81,top+88);
      });
      context.textAlign='left';
    }
  }

  function drawInlineClose() {
    context.fillStyle = 'rgba(0,0,0,.42)';
    context.fillRect(WIDTH - 78, 12, 62, 46);
    context.fillStyle = '#ffffff';
    context.font = 'bold 25px monospace';
    context.textAlign = 'center';
    context.fillText('[X]', WIDTH - 47, 43);
    context.textAlign = 'left';
  }

  function drawGameOver() {
    const boxX = 260, boxY = 196, boxW = 440, boxH = 142;
    context.fillStyle = 'rgba(12,20,12,.88)';
    context.fillRect(boxX, boxY, boxW, boxH);
    context.strokeStyle = '#ffffff';
    context.lineWidth = 4;
    context.strokeRect(boxX, boxY, boxW, boxH);
    context.textAlign = 'center';
    context.fillStyle = '#ffffff';
    context.font = 'bold 40px monospace';
    context.fillText('GAME OVER', WIDTH/2, boxY + 54);
    context.font = 'bold 17px monospace';
    context.fillText(mode === 'tetris' ? 'ARROWS / TAP TO RESTART' : 'PRESS KEY / TAP TO RETRY', WIDTH/2, boxY + 100);
    context.textAlign = 'left';
  }

  window.HummingbirdLogoGames = { open, close };
})();