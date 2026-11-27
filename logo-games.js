(() => {
  'use strict';

  const LOGO_URL = 'https://uploads.onecompiler.io/447kr4gf2/44f9wbztv/humming%5Bbird%5DTech%20logo%20(5).png';
  const WIDTH = 960;
  const HEIGHT = 540;
  const FLOOR = 445;
  const overlayId = 'hummingbirdLogoGame';
  let overlay = null;
  let canvas = null;
  let context = null;
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

  function buildOverlay() {
    if (overlay) return;
    overlay = document.createElement('section');
    overlay.id = overlayId;
    overlay.className = 'logo-game-overlay';
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = [
      '<div class="logo-game-dialog" role="dialog" aria-modal="true" aria-labelledby="logoGameTitle">',
      '  <header class="logo-game-header">',
      '    <div><p class="logo-game-kicker">humming[bird]Tech mini game</p><h2 id="logoGameTitle">Flappy Bird</h2></div>',
      '    <button class="logo-game-close" type="button" aria-label="Close mini game" title="Back to logo">×</button>',
      '  </header>',
      '  <canvas class="logo-game-canvas" width="960" height="540" tabindex="0" aria-label="Mini game area"></canvas>',
      '  <div class="logo-game-toolbar"><span class="logo-game-score" aria-live="polite">Score: 0</span><button class="logo-game-restart" type="button">Restart</button></div>',
      '  <div class="logo-game-dpad" aria-label="Snake controls">',
      '    <button type="button" data-direction="up" aria-label="Up">↑</button>',
      '    <div><button type="button" data-direction="left" aria-label="Left">←</button><button type="button" data-direction="down" aria-label="Down">↓</button><button type="button" data-direction="right" aria-label="Right">→</button></div>',
      '  </div>',
      '  <p class="logo-game-help">Close to return to the normal logo. Press Escape at any time.</p>',
      '</div>'
    ].join('');
    document.body.appendChild(overlay);
    canvas = overlay.querySelector('canvas');
    context = canvas.getContext('2d');
    overlay.querySelector('.logo-game-close').addEventListener('click', close);
    overlay.querySelector('.logo-game-restart').addEventListener('click', reset);
    overlay.querySelectorAll('[data-direction]').forEach(button => {
      button.addEventListener('click', () => setSnakeDirection(button.dataset.direction));
    });
    canvas.addEventListener('pointerdown', event => {
      canvas.setPointerCapture?.(event.pointerId);
      const point = pointerPosition(event);
      pointerY = point.y;
      if (mode === 'flappy') flap();
      else if (mode === 'dino') jump();
      else if (mode === 'pong') state.playerY = clamp(point.y - 48, 20, HEIGHT - 116);
    });
    canvas.addEventListener('pointermove', event => {
      if (mode !== 'pong' || !event.buttons) return;
      const point = pointerPosition(event);
      state.playerY = clamp(point.y - 48, 20, HEIGHT - 116);
    });
    overlay.addEventListener('click', event => {
      if (event.target === overlay) close();
    });
    document.addEventListener('keydown', onKeyDown, true);
  }

  function pointerPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (WIDTH / rect.width),
      y: (event.clientY - rect.top) * (HEIGHT / rect.height)
    };
  }

  function open(nextMode) {
    if (!titles[nextMode]) return;
    buildOverlay();
    mode = nextMode;
    overlay.querySelector('#logoGameTitle').textContent = titles[mode];
    overlay.querySelector('.logo-game-dpad').hidden = mode !== 'snake';
    overlay.querySelector('.logo-game-help').textContent = helpText(mode);
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('logo-game-open');
    reset();
    canvas.focus({ preventScroll: true });
    previousTime = performance.now();
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(loop);
  }

  function close() {
    if (!overlay || overlay.hidden) return;
    cancelAnimationFrame(frame);
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('logo-game-open');
    state = null;
  }

  function helpText(which) {
    return ({
      flappy: 'Click, tap, or press Space to flap. Close to return to the normal logo.',
      dino: 'Click, tap, or press Space / ↑ to jump. Close to return to the normal logo.',
      snake: 'Use arrow keys or the on-screen arrows. Close to return to the normal logo.',
      pong: 'Move your pointer or use ↑ / ↓ to control the paddle. First to 5 wins.'
    })[which];
  }

  function reset() {
    if (overlay) overlay.querySelector('.logo-game-help').textContent = helpText(mode);
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
    if (!overlay || !state) return;
    const label = mode === 'pong'
      ? 'You ' + state.player + ' — ' + state.cpu + ' CPU'
      : 'Score: ' + state.score;
    overlay.querySelector('.logo-game-score').textContent = label;
  }

  function gameOver(message) {
    if (!state || state.over) return;
    state.over = true;
    overlay.querySelector('.logo-game-help').textContent = message + ' Press Restart or tap the game to try again.';
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
    if (!overlay || overlay.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
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
    if (!overlay || overlay.hidden || !state) return;
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
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
    context.fill();
  }

  function draw() {
    if (!context || !state) return;
    if (mode === 'flappy') drawFlappy();
    else if (mode === 'dino') drawDino();
    else if (mode === 'snake') drawSnake();
    else if (mode === 'pong') drawPong();
    if (state.over) drawGameOver();
  }

  function drawSky() {
    const gradient = context.createLinearGradient(0, 0, 0, HEIGHT);
    gradient.addColorStop(0, '#c7ecff');
    gradient.addColorStop(1, '#eaf8ff');
    context.fillStyle = gradient;
    context.fillRect(0, 0, WIDTH, HEIGHT);
  }

  function drawFlappy() {
    drawSky();
    context.fillStyle = 'rgba(255,255,255,.82)';
    [[140,95,46],[330,160,34],[630,86,48],[825,175,34]].forEach(cloud => {
      context.beginPath(); context.arc(cloud[0],cloud[1],cloud[2],0,Math.PI*2); context.fill();
      context.beginPath(); context.arc(cloud[0]+cloud[2],cloud[1]+8,cloud[2]*.75,0,Math.PI*2); context.fill();
    });
    state.pipes.forEach(pipe => {
      const top = pipe.gap - 92, bottom = pipe.gap + 92;
      roundedRect(pipe.x, -8, 92, top - 8, 9, '#4d9e58');
      roundedRect(pipe.x - 8, top - 24, 108, 25, 6, '#387d43');
      roundedRect(pipe.x, bottom, 92, FLOOR - bottom, 9, '#4d9e58');
      roundedRect(pipe.x - 8, bottom, 108, 25, 6, '#387d43');
    });
    context.fillStyle = '#d7c38c'; context.fillRect(0, FLOOR, WIDTH, HEIGHT-FLOOR);
    context.fillStyle = '#7fae50'; context.fillRect(0, FLOOR, WIDTH, 12);
    const bird = state.bird;
    context.save();
    context.translate(bird.x, bird.y);
    context.rotate(clamp(bird.vy / 900, -.4, .65));
    if (birdImage.complete && birdImage.naturalWidth) {
      context.drawImage(birdImage, -25, -25, 50, 50);
    } else {
      context.fillStyle = '#3da66b'; context.beginPath(); context.arc(0,0,21,0,Math.PI*2); context.fill();
    }
    context.restore();
    context.fillStyle = '#355047'; context.font = '700 24px system-ui'; context.fillText('FLAP', 28, 42);
  }

  function drawDino() {
    context.fillStyle = '#f7f5ec'; context.fillRect(0,0,WIDTH,HEIGHT);
    context.fillStyle = '#d8d5c7'; context.font = '20px system-ui';
    context.fillText('HI  ' + String(Math.floor(state.score)).padStart(5,'0'), WIDTH - 190, 46);
    context.strokeStyle = '#9a9a8c'; context.lineWidth = 3;
    context.beginPath(); context.moveTo(0,FLOOR); context.lineTo(WIDTH,FLOOR); context.stroke();
    for (let i=0;i<6;i++) {
      const x = (i*220 - state.cloud*0.4) % (WIDTH+220);
      context.fillStyle = '#deddd5'; context.fillRect(x, 110 + (i%2)*45, 52, 4);
    }
    state.obstacles.forEach(obstacle => drawCactus(obstacle.x, FLOOR-obstacle.height, obstacle.width, obstacle.height));
    drawDinoRunner(state.runner.x, state.runner.y);
    context.fillStyle = '#8a897d'; context.font = '700 21px system-ui'; context.fillText('DINO RUN', 28, 42);
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
    context.fillStyle = '#f7f5ec'; context.fillRect(x+43,y+7,4,4);
    const leg = Math.sin(performance.now()/65) > 0 ? 0 : 1;
    context.fillStyle = color;
    context.fillRect(x+16,y+40,9,leg?14:10);
    context.fillRect(x+33,y+40,9,leg?10:14);
  }

  function drawSnake() {
    context.fillStyle = '#0c1711'; context.fillRect(0,0,WIDTH,HEIGHT);
    context.strokeStyle = 'rgba(255,255,255,.035)'; context.lineWidth = 1;
    for (let x=0;x<=WIDTH;x+=24) { context.beginPath();context.moveTo(x,30);context.lineTo(x,HEIGHT-30);context.stroke(); }
    for (let y=30;y<=HEIGHT-30;y+=24) { context.beginPath();context.moveTo(0,y);context.lineTo(WIDTH,y);context.stroke(); }
    state.snake.forEach((part,index) => {
      roundedRect(part.x*24+2,part.y*24+34,20,20,6,index===0?'#9af0ae':'#4fc477');
    });
    context.fillStyle = '#ff8b73';
    context.beginPath(); context.arc(state.food.x*24+12,state.food.y*24+44,9,0,Math.PI*2); context.fill();
    context.fillStyle = '#e5f6e9'; context.font = '700 20px system-ui'; context.fillText('SNAKE', 26, 28);
  }

  function drawPong() {
    context.fillStyle = '#081521'; context.fillRect(0,0,WIDTH,HEIGHT);
    context.strokeStyle = 'rgba(255,255,255,.22)'; context.setLineDash([12,16]); context.lineWidth = 4;
    context.beginPath(); context.moveTo(WIDTH/2,20); context.lineTo(WIDTH/2,HEIGHT-20); context.stroke(); context.setLineDash([]);
    roundedRect(48,state.playerY,18,100,9,'#9af0ae');
    roundedRect(WIDTH-66,state.cpuY,18,100,9,'#8fc8ef');
    context.fillStyle = '#f6fbff'; context.beginPath(); context.arc(state.ball.x,state.ball.y,12,0,Math.PI*2); context.fill();
    context.fillStyle = '#e8f4ff'; context.font = '700 56px system-ui'; context.textAlign = 'center';
    context.fillText(state.player,WIDTH/2-65,82); context.fillText(state.cpu,WIDTH/2+65,82);
    context.textAlign = 'left'; context.font = '700 20px system-ui'; context.fillText('PONG',28,34);
  }

  function drawGameOver() {
    context.fillStyle = 'rgba(5,12,9,.64)'; context.fillRect(0,0,WIDTH,HEIGHT);
    context.textAlign = 'center';
    context.fillStyle = '#fff'; context.font = '800 48px system-ui'; context.fillText('Game over',WIDTH/2,HEIGHT/2-8);
    context.font = '500 22px system-ui'; context.fillText('Press Restart to play again',WIDTH/2,HEIGHT/2+38);
    context.textAlign = 'left';
  }

  window.HummingbirdLogoGames = { open, close };
})();