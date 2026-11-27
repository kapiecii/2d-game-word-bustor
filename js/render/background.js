import { CONFIG } from '../config.js';

export function drawWorldBackground(ctx, worldId, cameraX, stageWidth, time) {
  if (worldId === 'desert') {
    drawDesertBackground(ctx, cameraX, stageWidth, time);
  } else if (worldId === 'snow') {
    drawSnowBackground(ctx, cameraX, stageWidth, time);
  } else if (worldId === 'robot') {
    drawRobotBackground(ctx, cameraX, stageWidth, time);
  } else {
    drawForestBackground(ctx, cameraX, stageWidth, time);
  }
}

export function drawForestBackground(ctx, cameraX, stageWidth, time) {
  const w = ctx.canvas.width || CONFIG.CANVAS_WIDTH;
  const h = ctx.canvas.height || CONFIG.CANVAS_HEIGHT;
  const groundTop = CONFIG.GROUND_Y;

  // Sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, groundTop);
  sky.addColorStop(0, '#4ca6ff');
  sky.addColorStop(0.65, '#8bd1ff');
  sky.addColorStop(1, '#d7f3ff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Soft sun
  ctx.fillStyle = 'rgba(255, 245, 180, 0.9)';
  ctx.beginPath();
  ctx.arc(w - 180, 108, 44, 0, Math.PI * 2);
  ctx.fill();

  // Parallax clouds (0.15x)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  const cloudOffset = -(cameraX * 0.15) % 320;
  for (let i = -1; i < 7; i++) {
    const cx = cloudOffset + i * 320 + 60;
    const cy = 90 + ((i * 47) % 80);
    ctx.fillRect(cx, cy, 88, 26);
    ctx.fillRect(cx + 16, cy - 14, 54, 18);
  }

  // Far hills (0.25x)
  ctx.fillStyle = '#6ec284';
  const hillOffset = -(cameraX * 0.25) % 420;
  for (let i = -1; i < 6; i++) {
    const hx = hillOffset + i * 420;
    ctx.beginPath();
    ctx.arc(hx + 180, groundTop + 50, 260, Math.PI, 0);
    ctx.fill();
  }

  // Distant forest trees (0.45x)
  const treeOffset = -(cameraX * 0.45) % 180;
  for (let i = -1; i < 11; i++) {
    const tx = treeOffset + i * 180 + 20;
    ctx.fillStyle = '#4e8c57';
    ctx.fillRect(tx + 24, groundTop - 140, 20, 140);
    ctx.fillStyle = '#3c8c53';
    ctx.fillRect(tx, groundTop - 205, 72, 74);
    ctx.fillRect(tx + 12, groundTop - 235, 48, 36);
  }

  drawTiledGround(ctx, w, h, groundTop, cameraX, stageWidth, {
    top1: '#46b54f',
    top2: '#2d8a39',
    tuft: '#6ee06b',
    body: '#8b5a2b',
    line: '#70451f',
    speck: '#a36c39',
  });

  // Subtle floating fireflies
  ctx.fillStyle = 'rgba(255, 255, 200, 0.55)';
  for (let i = 0; i < 6; i++) {
    const px = ((i * 250 + time * 18 - cameraX * 0.6) % w + w) % w;
    const py = 220 + Math.sin(time * 2 + i) * 55 + (i % 3) * 60;
    ctx.fillRect(px, py, 4, 4);
  }
}

function drawDesertBackground(ctx, cameraX, stageWidth, time) {
  const w = ctx.canvas.width || CONFIG.CANVAS_WIDTH;
  const h = ctx.canvas.height || CONFIG.CANVAS_HEIGHT;
  const groundTop = CONFIG.GROUND_Y;

  // Warm desert sunset sky
  const sky = ctx.createLinearGradient(0, 0, 0, groundTop);
  sky.addColorStop(0, '#ff8c42');
  sky.addColorStop(0.55, '#ffc46b');
  sky.addColorStop(1, '#fff0b8');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Large desert sun
  ctx.fillStyle = 'rgba(255, 248, 200, 0.92)';
  ctx.beginPath();
  ctx.arc(w - 220, 140, 58, 0, Math.PI * 2);
  ctx.fill();

  // Far pyramids (0.2x)
  const pyrOffset = -(cameraX * 0.2) % 480;
  for (let i = -1; i < 5; i++) {
    const px = pyrOffset + i * 480 + 80;
    ctx.fillStyle = '#d49a4a';
    ctx.beginPath();
    ctx.moveTo(px, groundTop);
    ctx.lineTo(px + 130, groundTop - 210);
    ctx.lineTo(px + 260, groundTop);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#b97f34';
    ctx.beginPath();
    ctx.moveTo(px + 130, groundTop - 210);
    ctx.lineTo(px + 260, groundTop);
    ctx.lineTo(px + 150, groundTop);
    ctx.closePath();
    ctx.fill();
  }

  // Rolling sand dunes (0.35x)
  ctx.fillStyle = '#e5b25d';
  const duneOffset = -(cameraX * 0.35) % 440;
  for (let i = -1; i < 6; i++) {
    const dx = duneOffset + i * 440;
    ctx.beginPath();
    ctx.arc(dx + 200, groundTop + 110, 250, Math.PI, 0);
    ctx.fill();
  }

  // Distant cacti (0.5x)
  const cactusOffset = -(cameraX * 0.5) % 260;
  ctx.fillStyle = '#4e944f';
  for (let i = -1; i < 8; i++) {
    const cx = cactusOffset + i * 260 + 50;
    ctx.fillRect(cx + 12, groundTop - 86, 16, 86);
    ctx.fillRect(cx, groundTop - 64, 12, 12);
    ctx.fillRect(cx, groundTop - 80, 10, 22);
    ctx.fillRect(cx + 28, groundTop - 52, 12, 12);
    ctx.fillRect(cx + 30, groundTop - 72, 10, 24);
  }

  drawTiledGround(ctx, w, h, groundTop, cameraX, stageWidth, {
    top1: '#f0c36d',
    top2: '#d9a44a',
    tuft: '#ffe099',
    body: '#c4873b',
    line: '#996523',
    speck: '#dba053',
  });

  // Drifting sand motes
  ctx.fillStyle = 'rgba(255, 240, 190, 0.5)';
  for (let i = 0; i < 8; i++) {
    const sx = ((i * 190 - time * 55 - cameraX * 0.6) % w + w) % w;
    const sy = 260 + (i % 4) * 90 + Math.sin(time * 3 + i) * 14;
    ctx.fillRect(sx, sy, 6, 3);
  }
}

function drawSnowBackground(ctx, cameraX, stageWidth, time) {
  const w = ctx.canvas.width || CONFIG.CANVAS_WIDTH;
  const h = ctx.canvas.height || CONFIG.CANVAS_HEIGHT;
  const groundTop = CONFIG.GROUND_Y;

  // Crisp winter sky
  const sky = ctx.createLinearGradient(0, 0, 0, groundTop);
  sky.addColorStop(0, '#2c538c');
  sky.addColorStop(0.55, '#6aa2d9');
  sky.addColorStop(1, '#d8f0ff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Pale winter moon/sun
  ctx.fillStyle = 'rgba(240, 250, 255, 0.9)';
  ctx.beginPath();
  ctx.arc(w - 200, 110, 42, 0, Math.PI * 2);
  ctx.fill();

  // Snowy mountain peaks (0.2x)
  const mtOffset = -(cameraX * 0.2) % 420;
  for (let i = -1; i < 6; i++) {
    const mx = mtOffset + i * 420;
    ctx.fillStyle = '#89aed1';
    ctx.beginPath();
    ctx.moveTo(mx, groundTop);
    ctx.lineTo(mx + 160, groundTop - 270);
    ctx.lineTo(mx + 320, groundTop);
    ctx.closePath();
    ctx.fill();

    // Snow cap
    ctx.fillStyle = '#eef8ff';
    ctx.beginPath();
    ctx.moveTo(mx + 112, groundTop - 190);
    ctx.lineTo(mx + 160, groundTop - 270);
    ctx.lineTo(mx + 208, groundTop - 190);
    ctx.lineTo(mx + 180, groundTop - 175);
    ctx.lineTo(mx + 160, groundTop - 195);
    ctx.lineTo(mx + 140, groundTop - 175);
    ctx.closePath();
    ctx.fill();
  }

  // Snow-covered pine trees (0.45x)
  const pineOffset = -(cameraX * 0.45) % 190;
  for (let i = -1; i < 10; i++) {
    const tx = pineOffset + i * 190 + 30;
    ctx.fillStyle = '#5c4b3b';
    ctx.fillRect(tx + 24, groundTop - 55, 14, 55);
    ctx.fillStyle = '#2d6a6b';
    ctx.fillRect(tx, groundTop - 105, 62, 55);
    ctx.fillRect(tx + 10, groundTop - 145, 42, 42);
    ctx.fillStyle = '#eef8ff';
    ctx.fillRect(tx + 10, groundTop - 150, 42, 10);
    ctx.fillRect(tx, groundTop - 110, 62, 10);
  }

  drawTiledGround(ctx, w, h, groundTop, cameraX, stageWidth, {
    top1: '#f0f9ff',
    top2: '#b8e0f7',
    tuft: '#ffffff',
    body: '#5a8bb8',
    line: '#3d6991',
    speck: '#82b3de',
  });

  // Falling snowflakes
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  for (let i = 0; i < 24; i++) {
    const sx = ((i * 117 - time * 24 - cameraX * 0.35) % w + w) % w;
    const sy = ((i * 79 + time * (45 + (i % 3) * 18)) % groundTop + groundTop) % groundTop;
    const size = i % 3 === 0 ? 5 : 3;
    ctx.fillRect(sx, sy, size, size);
  }
}

function drawRobotBackground(ctx, cameraX, stageWidth, time) {
  const w = ctx.canvas.width || CONFIG.CANVAS_WIDTH;
  const h = ctx.canvas.height || CONFIG.CANVAS_HEIGHT;
  const groundTop = CONFIG.GROUND_Y;

  // Cyber night sky
  const sky = ctx.createLinearGradient(0, 0, 0, groundTop);
  sky.addColorStop(0, '#0f162b');
  sky.addColorStop(0.6, '#1c2a4d');
  sky.addColorStop(1, '#2b3f6e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Subtle neon grid lines
  ctx.strokeStyle = 'rgba(76, 201, 240, 0.12)';
  ctx.lineWidth = 1;
  const gridShift = -(cameraX * 0.25) % 80;
  for (let x = gridShift; x < w; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, groundTop);
    ctx.stroke();
  }
  for (let y = 80; y < groundTop; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Futuristic factory towers (0.35x)
  const bldgOffset = -(cameraX * 0.35) % 240;
  for (let i = -1; i < 9; i++) {
    const bx = bldgOffset + i * 240 + 20;
    const bh = 180 + ((i * 67) % 140);
    ctx.fillStyle = '#1b2640';
    ctx.fillRect(bx, groundTop - bh, 110, bh);
    ctx.strokeStyle = '#334873';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, groundTop - bh, 110, bh);

    // Glowing factory windows
    const blink = Math.floor(time * 2 + i) % 2 === 0;
    ctx.fillStyle = blink ? '#4cc9f0' : '#ff8c2b';
    for (let wy = groundTop - bh + 22; wy < groundTop - 24; wy += 32) {
      ctx.fillRect(bx + 16, wy, 18, 10);
      ctx.fillRect(bx + 46, wy, 18, 10);
      ctx.fillRect(bx + 76, wy, 18, 10);
    }
  }

  drawTiledGround(ctx, w, h, groundTop, cameraX, stageWidth, {
    top1: '#64789c',
    top2: '#3f5070',
    tuft: '#4cc9f0',
    body: '#2a354d',
    line: '#1b2336',
    speck: '#45577a',
  });
}

function drawTiledGround(ctx, w, h, groundTop, cameraX, stageWidth, colors) {
  ctx.fillStyle = colors.top1;
  ctx.fillRect(0, groundTop, w, 14);
  ctx.fillStyle = colors.top2;
  ctx.fillRect(0, groundTop + 14, w, 6);

  ctx.fillStyle = colors.body;
  ctx.fillRect(0, groundTop + 20, w, h - (groundTop + 20));

  const tile = CONFIG.TILE_SIZE;
  const startTile = Math.floor(cameraX / tile);
  const visibleTiles = Math.ceil(w / tile) + 2;

  for (let i = 0; i < visibleTiles; i++) {
    const worldX = (startTile + i) * tile;
    if (worldX < -tile || worldX > stageWidth + tile) continue;
    const sx = Math.floor(worldX - cameraX);

    ctx.fillStyle = colors.tuft;
    ctx.fillRect(sx + 4, groundTop + 2, 10, 4);
    ctx.fillRect(sx + 22, groundTop + 4, 8, 4);

    ctx.fillStyle = colors.line;
    ctx.fillRect(sx, groundTop + 20, tile, 2);
    ctx.fillRect(sx, groundTop + 20, 2, h - groundTop);
    ctx.fillStyle = colors.speck;
    ctx.fillRect(sx + 8, groundTop + 30, 10, 8);
    ctx.fillRect(sx + 24, groundTop + 48, 8, 6);
  }
}
