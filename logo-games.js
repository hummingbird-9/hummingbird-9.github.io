(() => {
  'use strict';

  const LOGO_URL = 'https://uploads.onecompiler.io/447kr4gf2/44f9wbztv/humming%5Bbird%5DTech%20logo%20(4).png';
  const WIDTH = 960;
  const HEIGHT = 540;
  const FLOOR = 445;
  let heroLogo = null;
  let logoImage = null;
  let logoFallback = null;
  let imageWasHidden = false;
  let fallbackWasHidden = true;
  let canvas = null;
  let context = null;
  let snakeTouchStart = null;
  let mode = 'flappy';
  let state = null;
  let frame = 0;
  let previousTime = 0;
  let pointerY = HEIGHT / 2;
  const birdImage = new Image();
  birdImage.src = LOGO_URL;

  const titles = {
    flappy: 'Flappy Bird',
    dino: 'Dino Run',
    snake: 'Snake',
    pong: 'Pong'
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
    imageWasHidden = !!logoImage?.hidden;
    fallbackWasHidden = !!logoFallback?.hidden;
    if (logoImage) logoImage.hidden = true;
    if (logoFallback) logoFallback.hidden = true;

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
      canvas.setPointerCapture?.(event.pointerId);
      const point = pointerPosition(event);
      if (point.x >= WIDTH - 76 && point.y <= 76) {
        close();
        return;
      }
      if (state?.over) reset();
      if (mode === 'flappy') flap();
      else if (mode === 'dino') jump();
      else if (mode === 'snake') snakeTouchStart = point;
      else if (mode === 'pong') state.playerY = clamp(point.y - 48, 20, HEIGHT - 116);
    });

    canvas.addEventListener('pointerup', event => {
      event.stopPropagation();
      if (mode !== 'snake' || !snakeTouchStart || !state || state.over) {
        snakeTouchStart = null;
        return;
      }
      const point = pointerPosition(event);
      const dx = point.x - snakeTouchStart.x;
      const dy = point.y - snakeTouchStart.y;
      snakeTouchStart = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
      setSnakeDirection(Math.abs(dx) > Math.abs(dy)
        ? (dx > 0 ? 'right' : 'left')
        : (dy > 0 ? 'down' : 'up'));
    });

    canvas.addEventListener('pointercancel', () => { snakeTouchStart = null; });
    canvas.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
    });
    canvas.addEventListener('pointermove', event => {
      if (mode !== 'pong' || !state) return;
      const point = pointerPosition(event);
      state.playerY = clamp(point.y - 48, 20, HEIGHT - 116);
    });
    document.addEventListener('keydown', onKeyDown, true);
    return true;
  }

  function pointerPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (WIDTH / rect.width),
      y: (event.clientY - rect.top) * (HEIGHT / rect.height)
    };
  }

  function open(nextMode) {
    if (!titles[nextMode] || !buildInlineGame()) return;
    mode = nextMode;
    reset();
    canvas.focus({ preventScroll: true });
    previousTime = performance.now();
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(loop);
  }

  function close() {
    if (!canvas) return;
    cancelAnimationFrame(frame);
    canvas.remove();
    heroLogo?.classList.remove('is-playing-game');
    if (logoImage) logoImage.hidden = imageWasHidden;
    if (logoFallback) logoFallback.hidden = fallbackWasHidden;
    canvas = null;
    context = null;
    state = null;
    snakeTouchStart = null;
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
      const hit = runner.x + 34 > obstacle.x &&
        runner.x + 8 < obstacle.x + obstacle.width &&
        runner.y + 48 > FLOOR - obstacle.height;
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
    if (ball.vx < 0 && ball.x < 75 && ball.y > state.playerY && ball.y < state.playerY + 100) {
      ball.x = 75; ball.vx = Math.abs(ball.vx) * 1.04; ball.vy += (ball.y - (state.playerY + 50)) * 2.8;
    }
    if (ball.vx > 0 && ball.x > WIDTH - 75 && ball.y > state.cpuY && ball.y < state.cpuY + 100) {
      ball.x = WIDTH - 75; ball.vx = -Math.abs(ball.vx) * 1.03; ball.vy += (ball.y - (state.cpuY + 50)) * 2.4;
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
    drawInlineClose();
    if (state.over) drawGameOver();
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
    if (birdImage.complete && birdImage.naturalWidth) {
      context.drawImage(birdImage, -25, -25, 50, 50);
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
    context.fillStyle = '#ffffff'; context.fillRect(state.ball.x-8,state.ball.y-8,16,16);
    context.fillStyle = '#ffffff'; context.font = 'bold 56px monospace'; context.textAlign = 'center';
    context.fillText(state.player,WIDTH/2-65,82); context.fillText(state.cpu,WIDTH/2+65,82);
    context.textAlign = 'left'; context.font = 'bold 20px monospace'; context.fillText('PONG',28,34);
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
    context.fillText('PRESS KEY / TAP TO RETRY', WIDTH/2, boxY + 100);
    context.textAlign = 'left';
  }

  window.HummingbirdLogoGames = { open, close };
})();