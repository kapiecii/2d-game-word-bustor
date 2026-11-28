import { CONFIG } from '../config.js';

export function drawWorldBackground(ctx, worldId, cameraX, stageWidth, time) {
  if (worldId === 'desert') {
    drawDesertBackground(ctx, cameraX, stageWidth, time);
  } else if (worldId === 'snow') {
    drawSnowBackground(ctx, cameraX, stageWidth, time);
  } else if (worldId === 'robot') {
    drawRobotBackground(ctx, cameraX, stageWidth, time);
  } else if (worldId === 'ocean') {
    drawOceanBackground(ctx, cameraX, stageWidth, time);
  } else if (worldId === 'volcano') {
    drawVolcanoBackground(ctx, cameraX, stageWidth, time);
  } else if (worldId === 'sky') {
    drawSkyBackground(ctx, cameraX, stageWidth, time);
  } else if (worldId === 'candy') {
    drawCandyBackground(ctx, cameraX, stageWidth, time);
  } else if (worldId === 'space') {
    drawSpaceBackground(ctx, cameraX, stageWidth, time);
  } else if (worldId === 'castle') {
    drawCastleBackground(ctx, cameraX, stageWidth, time);
  } else if (worldId === 'dino') {
    drawDinoBackground(ctx, cameraX, stageWidth, time);
  } else if (worldId === 'ghost') {
    drawGhostBackground(ctx, cameraX, stageWidth, time);
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

function drawOceanBackground(ctx, cameraX, stageWidth, time) {
  const w = ctx.canvas.width || CONFIG.CANVAS_WIDTH;
  const h = ctx.canvas.height || CONFIG.CANVAS_HEIGHT;
  const groundTop = CONFIG.GROUND_Y;

  // Underwater aqua gradient
  const sea = ctx.createLinearGradient(0, 0, 0, groundTop);
  sea.addColorStop(0, '#0096c7');
  sea.addColorStop(0.55, '#0077b6');
  sea.addColorStop(1, '#023e8a');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 0, w, h);

  // Diagonal sunlight rays from surface
  ctx.fillStyle = 'rgba(144, 224, 239, 0.12)';
  for (let i = 0; i < 6; i++) {
    const rx = ((i * 280 - cameraX * 0.15) % (w + 260) + (w + 260)) % (w + 260) - 100;
    ctx.beginPath();
    ctx.moveTo(rx, 0);
    ctx.lineTo(rx + 75, 0);
    ctx.lineTo(rx - 40, groundTop);
    ctx.lineTo(rx - 115, groundTop);
    ctx.closePath();
    ctx.fill();
  }

  // Distant coral reefs & kelp (0.35x)
  const reefOffset = -(cameraX * 0.35) % 260;
  for (let i = -1; i < 8; i++) {
    const cx = reefOffset + i * 260 + 30;
    ctx.fillStyle = i % 2 === 0 ? '#ff6b9d' : '#ff9f43';
    ctx.fillRect(cx + 10, groundTop - 95, 16, 95);
    ctx.fillRect(cx - 8, groundTop - 70, 18, 12);
    ctx.fillRect(cx + 26, groundTop - 80, 18, 12);
    ctx.fillStyle = '#2ec4b6';
    const sway = Math.sin(time * 2.5 + i) * 6;
    ctx.fillRect(cx + 120 + sway, groundTop - 140, 12, 140);
    ctx.fillRect(cx + 138 - sway, groundTop - 105, 10, 105);
  }

  drawTiledGround(ctx, w, h, groundTop, cameraX, stageWidth, {
    top1: '#e9c46a',
    top2: '#d4a34f',
    tuft: '#f4e2a8',
    body: '#b08238',
    line: '#876022',
    speck: '#cf9e4c',
  });

  // Rising bubbles
  ctx.strokeStyle = 'rgba(202, 240, 248, 0.65)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 16; i++) {
    const bx = ((i * 130 + Math.sin(time * 2 + i) * 14 - cameraX * 0.4) % w + w) % w;
    const by = ((groundTop - ((time * (38 + (i % 4) * 12) + i * 85) % groundTop)) + groundTop) % groundTop;
    ctx.beginPath();
    ctx.arc(bx, by, 4 + (i % 3) * 2, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawVolcanoBackground(ctx, cameraX, stageWidth, time) {
  const w = ctx.canvas.width || CONFIG.CANVAS_WIDTH;
  const h = ctx.canvas.height || CONFIG.CANVAS_HEIGHT;
  const groundTop = CONFIG.GROUND_Y;

  // Fiery volcanic sky
  const sky = ctx.createLinearGradient(0, 0, 0, groundTop);
  sky.addColorStop(0, '#2b0b18');
  sky.addColorStop(0.5, '#7a1c24');
  sky.addColorStop(1, '#e85d04');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Distant volcanoes (0.2x)
  const vOffset = -(cameraX * 0.2) % 480;
  for (let i = -1; i < 5; i++) {
    const vx = vOffset + i * 480;
    ctx.fillStyle = '#3d1c22';
    ctx.beginPath();
    ctx.moveTo(vx, groundTop);
    ctx.lineTo(vx + 145, groundTop - 270);
    ctx.lineTo(vx + 205, groundTop - 270);
    ctx.lineTo(vx + 350, groundTop);
    ctx.closePath();
    ctx.fill();

    // Glowing crater rim
    ctx.fillStyle = '#ff9f1c';
    ctx.fillRect(vx + 150, groundTop - 272, 50, 10);
  }

  // Basalt rock spires (0.45x)
  const rockOffset = -(cameraX * 0.45) % 240;
  ctx.fillStyle = '#26141a';
  for (let i = -1; i < 9; i++) {
    const rx = rockOffset + i * 240 + 40;
    ctx.fillRect(rx, groundTop - 130, 34, 130);
    ctx.fillRect(rx + 28, groundTop - 80, 26, 80);
  }

  drawTiledGround(ctx, w, h, groundTop, cameraX, stageWidth, {
    top1: '#59343b',
    top2: '#3b1f25',
    tuft: '#ff6d00',
    body: '#2b171b',
    line: '#1a0c0f',
    speck: '#ff4800',
  });

  // Rising glowing embers
  ctx.fillStyle = 'rgba(255, 200, 60, 0.8)';
  for (let i = 0; i < 18; i++) {
    const ex = ((i * 110 + Math.sin(time * 3 + i) * 20 - cameraX * 0.5) % w + w) % w;
    const ey = ((groundTop - ((time * (52 + (i % 3) * 20) + i * 67) % groundTop)) + groundTop) % groundTop;
    ctx.fillRect(ex, ey, 4, 4);
  }
}

function drawSkyBackground(ctx, cameraX, stageWidth, time) {
  const w = ctx.canvas.width || CONFIG.CANVAS_WIDTH;
  const h = ctx.canvas.height || CONFIG.CANVAS_HEIGHT;
  const groundTop = CONFIG.GROUND_Y;

  // Bright sky-high gradient
  const sky = ctx.createLinearGradient(0, 0, 0, groundTop);
  sky.addColorStop(0, '#1e88e5');
  sky.addColorStop(0.55, '#64b5f6');
  sky.addColorStop(1, '#e3f2fd');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Soft distant rainbow arc
  const colors = ['#ff6b6b', '#ffd166', '#45d17a', '#4cc9f0', '#9b5de5'];
  ctx.save();
  ctx.globalAlpha = 0.25;
  colors.forEach((col, idx) => {
    ctx.strokeStyle = col;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(w * 0.55, groundTop + 120, 440 - idx * 12, Math.PI, 0);
    ctx.stroke();
  });
  ctx.restore();

  // Floating cloud banks (0.25x)
  const cloudOffset = -(cameraX * 0.25) % 340;
  for (let i = -1; i < 7; i++) {
    const cx = cloudOffset + i * 340 + 40;
    const cy = 120 + ((i * 67) % 240) + Math.sin(time * 1.5 + i) * 6;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.fillRect(cx, cy, 130, 32);
    ctx.fillRect(cx + 22, cy - 18, 86, 22);
    ctx.fillStyle = 'rgba(187, 222, 251, 0.8)';
    ctx.fillRect(cx + 6, cy + 26, 118, 8);
  }

  drawTiledGround(ctx, w, h, groundTop, cameraX, stageWidth, {
    top1: '#ffffff',
    top2: '#d6ecff',
    tuft: '#ffd166',
    body: '#90caf9',
    line: '#64b5f6',
    speck: '#e3f2fd',
  });
}

function drawCandyBackground(ctx, cameraX, stageWidth, time) {
  const w = ctx.canvas.width || CONFIG.CANVAS_WIDTH;
  const h = ctx.canvas.height || CONFIG.CANVAS_HEIGHT;
  const groundTop = CONFIG.GROUND_Y;

  // Pastel cotton-candy sky
  const sky = ctx.createLinearGradient(0, 0, 0, groundTop);
  sky.addColorStop(0, '#ff9ec7');
  sky.addColorStop(0.55, '#ffd1e6');
  sky.addColorStop(1, '#fff3c4');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Fluffy pastel clouds (0.15x)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  const cloudOffset = -(cameraX * 0.15) % 320;
  for (let i = -1; i < 7; i++) {
    const cx = cloudOffset + i * 320 + 40;
    const cy = 95 + ((i * 53) % 85);
    ctx.fillRect(cx, cy, 92, 26);
    ctx.fillRect(cx + 18, cy - 14, 56, 18);
  }

  // Pastel frosting hills (0.25x)
  const hillOffset = -(cameraX * 0.25) % 420;
  for (let i = -1; i < 6; i++) {
    const hx = hillOffset + i * 420;
    ctx.fillStyle = i % 2 === 0 ? '#f78fb3' : '#a2d2ff';
    ctx.beginPath();
    ctx.arc(hx + 180, groundTop + 60, 240, Math.PI, 0);
    ctx.fill();
  }

  // Giant lollipops & candy canes (0.45x)
  const lolliOffset = -(cameraX * 0.45) % 220;
  const lolliColors = ['#ff5d9e', '#4cc9f0', '#ffd166', '#45d17a'];
  for (let i = -1; i < 10; i++) {
    const lx = lolliOffset + i * 220 + 40;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(lx + 22, groundTop - 135, 10, 135);
    ctx.fillStyle = lolliColors[(i + 10) % lolliColors.length];
    ctx.beginPath();
    ctx.arc(lx + 27, groundTop - 155, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(lx + 27, groundTop - 155, 20, 0, Math.PI * 1.5);
    ctx.stroke();
  }

  // Pink frosting & biscuit wafer ground
  drawTiledGround(ctx, w, h, groundTop, cameraX, stageWidth, {
    top1: '#ff70a6',
    top2: '#ff97b7',
    tuft: '#fff08a',
    body: '#c98a52',
    line: '#9c6234',
    speck: '#e0a972',
  });

  // Floating sugar sparkles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  for (let i = 0; i < 10; i++) {
    const sx = ((i * 180 + time * 20 - cameraX * 0.5) % w + w) % w;
    const sy = 160 + Math.sin(time * 2.5 + i) * 50 + (i % 3) * 80;
    ctx.fillRect(sx, sy, 5, 5);
  }
}

function drawSpaceBackground(ctx, cameraX, stageWidth, time) {
  const w = ctx.canvas.width || CONFIG.CANVAS_WIDTH;
  const h = ctx.canvas.height || CONFIG.CANVAS_HEIGHT;
  const groundTop = CONFIG.GROUND_Y;

  const sky = ctx.createLinearGradient(0, 0, 0, groundTop);
  sky.addColorStop(0, '#050816');
  sky.addColorStop(0.6, '#10183a');
  sky.addColorStop(1, '#1d2b5c');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Twinkling starfield
  for (let i = 0; i < 42; i++) {
    const sx = ((i * 97 - cameraX * 0.1) % w + w) % w;
    const sy = (i * 53) % (groundTop - 40);
    const alpha = 0.45 + 0.55 * Math.abs(Math.sin(time * 2.2 + i));
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
    const size = i % 5 === 0 ? 4 : 2;
    ctx.fillRect(sx, sy, size, size);
  }

  // Ringed planet
  const px = w - 260;
  const py = 155;
  ctx.save();
  ctx.fillStyle = '#9b5de5';
  ctx.beginPath();
  ctx.arc(px, py, 56, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.ellipse(px, py, 102, 20, -0.22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Lunar ridges (0.3x)
  ctx.fillStyle = '#2c3a63';
  const ridgeOffset = -(cameraX * 0.3) % 420;
  for (let i = -1; i < 6; i++) {
    const rx = ridgeOffset + i * 420;
    ctx.beginPath();
    ctx.arc(rx + 180, groundTop + 80, 220, Math.PI, 0);
    ctx.fill();
  }

  drawTiledGround(ctx, w, h, groundTop, cameraX, stageWidth, {
    top1: '#7d8fb3',
    top2: '#556585',
    tuft: '#4cc9f0',
    body: '#35415e',
    line: '#222b42',
    speck: '#5c6e94',
  });
}

function drawCastleBackground(ctx, cameraX, stageWidth, time) {
  const w = ctx.canvas.width || CONFIG.CANVAS_WIDTH;
  const h = ctx.canvas.height || CONFIG.CANVAS_HEIGHT;
  const groundTop = CONFIG.GROUND_Y;

  const sky = ctx.createLinearGradient(0, 0, 0, groundTop);
  sky.addColorStop(0, '#1f1638');
  sky.addColorStop(0.55, '#422c6b');
  sky.addColorStop(1, '#7a4988');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Castle towers & banners (0.35x)
  const towerOffset = -(cameraX * 0.35) % 280;
  for (let i = -1; i < 8; i++) {
    const tx = towerOffset + i * 280 + 20;
    const th = 210 + ((i * 41) % 90);
    ctx.fillStyle = '#2d2642';
    ctx.fillRect(tx, groundTop - th, 110, th);
    // Battlements
    for (let b = 0; b < 4; b++) {
      ctx.fillRect(tx + b * 28, groundTop - th - 16, 18, 16);
    }
    // Glowing arched windows
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(tx + 24, groundTop - th + 38, 18, 30);
    ctx.fillRect(tx + 68, groundTop - th + 38, 18, 30);
    // Waving banner
    const wave = Math.sin(time * 4 + i) * 3;
    ctx.fillStyle = '#e63946';
    ctx.fillRect(tx + 46, groundTop - th - 40, 24, 18 + wave * 0.3);
  }

  drawTiledGround(ctx, w, h, groundTop, cameraX, stageWidth, {
    top1: '#8b8ca3',
    top2: '#64667d',
    tuft: '#ffd166',
    body: '#48495e',
    line: '#2e2f40',
    speck: '#6a6c85',
  });
}

function drawDinoBackground(ctx, cameraX, stageWidth, time) {
  const w = ctx.canvas.width || CONFIG.CANVAS_WIDTH;
  const h = ctx.canvas.height || CONFIG.CANVAS_HEIGHT;
  const groundTop = CONFIG.GROUND_Y;

  const sky = ctx.createLinearGradient(0, 0, 0, groundTop);
  sky.addColorStop(0, '#3a86a8');
  sky.addColorStop(0.55, '#8ac99b');
  sky.addColorStop(1, '#e9f5c9');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Distant misty volcano peaks (0.2x)
  const pkOffset = -(cameraX * 0.2) % 480;
  ctx.fillStyle = '#4e7d63';
  for (let i = -1; i < 5; i++) {
    const px = pkOffset + i * 480;
    ctx.beginPath();
    ctx.moveTo(px, groundTop);
    ctx.lineTo(px + 160, groundTop - 250);
    ctx.lineTo(px + 340, groundTop);
    ctx.closePath();
    ctx.fill();
  }

  // Giant prehistoric ferns & palms (0.45x)
  const fernOffset = -(cameraX * 0.45) % 210;
  for (let i = -1; i < 10; i++) {
    const fx = fernOffset + i * 210 + 30;
    const sway = Math.sin(time * 2 + i) * 4;
    ctx.fillStyle = '#6f4e37';
    ctx.fillRect(fx + 22, groundTop - 155, 16, 155);
    ctx.fillStyle = '#2d8a47';
    ctx.fillRect(fx - 12 + sway, groundTop - 180, 84, 28);
    ctx.fillRect(fx + 4 + sway, groundTop - 204, 52, 24);
  }

  drawTiledGround(ctx, w, h, groundTop, cameraX, stageWidth, {
    top1: '#52b755',
    top2: '#368a39',
    tuft: '#a7e866',
    body: '#7a5230',
    line: '#57391f',
    speck: '#996a42',
  });
}

function drawGhostBackground(ctx, cameraX, stageWidth, time) {
  const w = ctx.canvas.width || CONFIG.CANVAS_WIDTH;
  const h = ctx.canvas.height || CONFIG.CANVAS_HEIGHT;
  const groundTop = CONFIG.GROUND_Y;

  const sky = ctx.createLinearGradient(0, 0, 0, groundTop);
  sky.addColorStop(0, '#0c0b1d');
  sky.addColorStop(0.55, '#1e1b3a');
  sky.addColorStop(1, '#3b2e5a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Huge glowing full moon
  ctx.fillStyle = 'rgba(255, 245, 200, 0.92)';
  ctx.beginPath();
  ctx.arc(w - 220, 130, 62, 0, Math.PI * 2);
  ctx.fill();

  // Spooky dead trees & haunted rooftops (0.35x)
  const hOffset = -(cameraX * 0.35) % 300;
  ctx.fillStyle = '#17142b';
  for (let i = -1; i < 7; i++) {
    const hx = hOffset + i * 300 + 30;
    ctx.fillRect(hx, groundTop - 160, 120, 160);
    ctx.beginPath();
    ctx.moveTo(hx - 14, groundTop - 160);
    ctx.lineTo(hx + 60, groundTop - 235);
    ctx.lineTo(hx + 134, groundTop - 160);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#c77dff';
    ctx.fillRect(hx + 28, groundTop - 120, 20, 28);
    ctx.fillRect(hx + 72, groundTop - 120, 20, 28);
    ctx.fillStyle = '#17142b';
  }

  drawTiledGround(ctx, w, h, groundTop, cameraX, stageWidth, {
    top1: '#5a4e78',
    top2: '#3f3559',
    tuft: '#c77dff',
    body: '#2a233d',
    line: '#1a1529',
    speck: '#463b63',
  });

  // Floating ghostly wisps
  ctx.fillStyle = 'rgba(199, 125, 255, 0.55)';
  for (let i = 0; i < 10; i++) {
    const wx = ((i * 170 + Math.sin(time * 2 + i) * 24 - cameraX * 0.45) % w + w) % w;
    const wy = 200 + Math.cos(time * 2.3 + i) * 60 + (i % 3) * 80;
    ctx.beginPath();
    ctx.arc(wx, wy, 6, 0, Math.PI * 2);
    ctx.fill();
  }
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
