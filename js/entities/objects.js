import { CONFIG } from '../config.js';
import { getCoinSprite, getKeySprite } from '../render/sprites.js';

export class Bullet {
  constructor(x, y, vx, vy, isPlayer = true, charged = false, hyper = false) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.isPlayer = isPlayer;
    this.charged = charged;
    this.hyper = hyper;
    this.w = hyper ? 38 : charged ? 28 : 12;
    this.h = hyper ? 24 : charged ? 18 : 8;
    this.damage = hyper
      ? CONFIG.CHARGE_BULLET_DAMAGE + 1
      : charged
      ? CONFIG.CHARGE_BULLET_DAMAGE
      : CONFIG.NORMAL_BULLET_DAMAGE;
    this.alive = true;
    this.life = 2.2;
    this.hitIds = new Set();
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
    if (this.life <= 0) this.alive = false;
  }

  draw(ctx, cameraX) {
    if (!this.alive) return;
    const sx = Math.floor(this.x - cameraX);
    const sy = Math.floor(this.y);

    if (this.isPlayer) {
      if (this.charged) {
        ctx.fillStyle = '#ff9f1c';
        ctx.fillRect(sx - 2, sy - 2, this.w + 4, this.h + 4);
        ctx.fillStyle = '#ffe66d';
        ctx.fillRect(sx + 2, sy + 2, this.w - 4, this.h - 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(sx + 6, sy + 5, this.w - 12, this.h - 10);
      } else {
        ctx.fillStyle = '#4cc9f0';
        ctx.fillRect(sx, sy, this.w, this.h);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(sx + 2, sy + 2, this.w - 4, this.h - 4);
      }
    } else {
      ctx.fillStyle = '#ff4d6d';
      ctx.beginPath();
      ctx.arc(sx + this.w / 2, sy + this.h / 2, this.w / 2 + 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffe5ec';
      ctx.beginPath();
      ctx.arc(sx + this.w / 2, sy + this.h / 2, this.w / 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export class FloatingText {
  constructor(text, x, y, color = '#ffffff') {
    this.text = text;
    this.x = x;
    this.y = y;
    this.color = color;
    this.life = CONFIG.FLOATING_TEXT_SECONDS;
    this.maxLife = CONFIG.FLOATING_TEXT_SECONDS;
  }

  update(dt) {
    this.y -= 34 * dt;
    this.life -= dt;
  }

  get alive() {
    return this.life > 0;
  }

  draw(ctx, cameraX) {
    if (!this.alive) return;
    const alpha = Math.min(1, this.life / 0.45);
    const sx = Math.floor(this.x - cameraX);
    const sy = Math.floor(this.y);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = '900 18px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(12, 18, 34, 0.9)';
    ctx.strokeText(this.text, sx, sy);
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, sx, sy);
    ctx.restore();
  }
}

export class Particle {
  constructor(x, y, vx, vy, color, size = 5, life = 0.45) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.life = life;
    this.maxLife = life;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += 420 * dt;
    this.life -= dt;
  }

  get alive() {
    return this.life > 0;
  }

  draw(ctx, cameraX) {
    if (!this.alive) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
    ctx.fillStyle = this.color;
    ctx.fillRect(Math.floor(this.x - cameraX), Math.floor(this.y), this.size, this.size);
    ctx.restore();
  }
}

const COLOR_MAP = {
  red: { fill: '#f24b59', light: '#ff9aa2', dark: '#9e1c28' },
  blue: { fill: '#3a86ff', light: '#90c2ff', dark: '#1b498a' },
  green: { fill: '#45d17a', light: '#98f5b8', dark: '#1e7a43' },
  yellow: { fill: '#ffd24c', light: '#fff2a6', dark: '#b58300' },
};

export function drawWorldObjects(ctx, objects, cameraX, time) {
  const coinSprite = getCoinSprite(3);
  const keySprite = getKeySprite(3);

  for (const obj of objects) {
    if (obj.collected || obj.broken) continue;
    const sx = Math.floor(obj.x - cameraX);
    const sy = Math.floor(obj.y);

    if (obj.type === 'coin') {
      const bob = Math.sin(time * 5 + obj.x * 0.05) * 3;
      ctx.drawImage(coinSprite, sx, sy + bob);
    } else if (obj.type === 'key') {
      const bob = Math.sin(time * 4.5) * 4;
      ctx.drawImage(keySprite, sx, sy + bob);
      drawObjectLabel(ctx, 'KEY', sx + obj.w / 2, sy - 6 + bob);
    } else if (obj.type === 'star') {
      const bob = Math.sin(time * 5 + obj.x * 0.03) * 4;
      const c = COLOR_MAP[obj.color] || COLOR_MAP.yellow;
      drawStarShape(ctx, sx + obj.w / 2, sy + obj.h / 2 + bob, 14, 6, c.fill, c.light);
      drawObjectLabel(ctx, `${(obj.color || 'star').toUpperCase()} STAR`, sx + obj.w / 2, sy - 8 + bob);
    } else if (obj.type === 'switch') {
      const c = COLOR_MAP[obj.color] || COLOR_MAP.green;
      ctx.fillStyle = '#2d374c';
      ctx.fillRect(sx, sy, obj.w, obj.h);
      ctx.strokeStyle = '#9fb0cc';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx + 1, sy + 1, obj.w - 2, obj.h - 2);

      // Colored button core
      ctx.fillStyle = obj.activated ? '#ffffff' : c.fill;
      ctx.fillRect(sx + 6, sy + 6, obj.w - 12, obj.h - 12);
      ctx.fillStyle = c.light;
      ctx.fillRect(sx + 9, sy + 9, obj.w - 18, 6);

      const label = obj.label || `${(obj.color || '').toUpperCase()} SWITCH`;
      drawObjectLabel(ctx, label.trim(), sx + obj.w / 2, sy - 6);
    } else if (obj.type === 'box') {
      ctx.fillStyle = '#b07232';
      ctx.fillRect(sx, sy, obj.w, obj.h);
      ctx.strokeStyle = '#6b3e14';
      ctx.lineWidth = 3;
      ctx.strokeRect(sx + 1.5, sy + 1.5, obj.w - 3, obj.h - 3);
      ctx.beginPath();
      ctx.moveTo(sx + 4, sy + 4);
      ctx.lineTo(sx + obj.w - 4, sy + obj.h - 4);
      ctx.moveTo(sx + obj.w - 4, sy + 4);
      ctx.lineTo(sx + 4, sy + obj.h - 4);
      ctx.stroke();
      drawObjectLabel(ctx, obj.label || 'BOX', sx + obj.w / 2, sy - 6);
    } else if (obj.type === 'cactus') {
      ctx.fillStyle = '#2f8f46';
      ctx.fillRect(sx + 10, sy, obj.w - 20, obj.h);
      ctx.fillRect(sx, sy + 14, 10, 10);
      ctx.fillRect(sx, sy + 6, 8, 16);
      ctx.fillRect(sx + obj.w - 10, sy + 20, 10, 10);
      ctx.fillRect(sx + obj.w - 8, sy + 10, 8, 18);
      ctx.fillStyle = '#6ee06b';
      ctx.fillRect(sx + 14, sy + 6, 4, obj.h - 12);
      drawObjectLabel(ctx, 'CACTUS', sx + obj.w / 2, sy - 6);
    } else if (obj.type === 'tree') {
      const trunkW = 24;
      const trunkX = sx + Math.floor((obj.w - trunkW) / 2);
      ctx.fillStyle = '#754624';
      ctx.fillRect(trunkX, sy + 20, trunkW, CONFIG.GROUND_Y - (sy + 20));
      ctx.fillStyle = '#2d8a47';
      ctx.fillRect(sx, sy, obj.w, obj.h);
      ctx.fillStyle = '#52c46c';
      ctx.fillRect(sx + 4, sy + 2, obj.w - 8, 8);
      drawObjectLabel(ctx, 'TREE', sx + obj.w / 2, sy - 6);
    } else if (obj.type === 'rock') {
      ctx.fillStyle = '#6c757d';
      ctx.fillRect(sx + 4, sy + 4, obj.w - 8, obj.h - 4);
      ctx.fillRect(sx, sy + 14, obj.w, obj.h - 14);
      ctx.fillStyle = '#9aa5b1';
      ctx.fillRect(sx + 8, sy + 8, obj.w - 22, 10);
      ctx.strokeStyle = '#343a40';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx + obj.w * 0.45, sy + 10);
      ctx.lineTo(sx + obj.w * 0.55, sy + obj.h * 0.5);
      ctx.lineTo(sx + obj.w * 0.35, sy + obj.h * 0.78);
      ctx.stroke();
      drawObjectLabel(ctx, 'ROCK', sx + obj.w / 2, sy - 6);
    } else if (obj.type === 'ice') {
      ctx.fillStyle = '#72d4ff';
      ctx.fillRect(sx, sy, obj.w, obj.h);
      ctx.fillStyle = '#c9f2ff';
      ctx.fillRect(sx + 5, sy + 5, obj.w - 14, 14);
      ctx.fillRect(sx + 8, sy + 26, 12, obj.h - 34);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.strokeRect(sx + 1.5, sy + 1.5, obj.w - 3, obj.h - 3);
      drawObjectLabel(ctx, 'ICE', sx + obj.w / 2, sy - 6);
    } else if (obj.type === 'laser') {
      if (obj.active === false) {
        ctx.fillStyle = '#495057';
        ctx.fillRect(sx, sy, obj.w, 12);
        drawObjectLabel(ctx, 'OFF', sx + obj.w / 2, sy - 6);
      } else {
        const pulse = 0.7 + Math.sin(time * 22) * 0.3;
        ctx.save();
        ctx.fillStyle = '#343a40';
        ctx.fillRect(sx - 4, sy, obj.w + 8, 12);
        ctx.globalAlpha = pulse;
        ctx.fillStyle = '#ff2a55';
        ctx.fillRect(sx + 2, sy + 12, obj.w - 4, obj.h - 12);
        ctx.fillStyle = '#ffd6e0';
        ctx.fillRect(sx + obj.w / 2 - 2, sy + 12, 4, obj.h - 12);
        ctx.restore();
        drawObjectLabel(ctx, 'LASER', sx + obj.w / 2, sy - 6);
      }
    } else if (obj.type === 'gate') {
      if (obj.open) {
        ctx.fillStyle = '#45d17a';
        ctx.fillRect(sx, sy, obj.w, 16);
        drawObjectLabel(ctx, 'OPEN', sx + obj.w / 2, sy - 6);
      } else {
        ctx.fillStyle = '#3c4b6e';
        ctx.fillRect(sx, sy, obj.w, obj.h);
        ctx.fillStyle = '#ff8c2b';
        for (let gy = sy + 12; gy < sy + obj.h - 8; gy += 22) {
          ctx.fillRect(sx + 4, gy, obj.w - 8, 6);
        }
        drawObjectLabel(ctx, 'GATE', sx + obj.w / 2, sy - 6);
      }
    } else if (obj.type === 'goal') {
      ctx.fillStyle = '#e9ecef';
      ctx.fillRect(sx + 10, sy, 6, obj.h);
      const wave = Math.sin(time * 6) * 3;
      ctx.fillStyle = '#ff8c2b';
      ctx.fillRect(sx + 16, sy + 6, 42, 26 + wave * 0.3);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('GOAL', sx + 20, sy + 23);
    }
  }
}

function drawStarShape(ctx, cx, cy, outerR, innerR, fill, stroke) {
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = stroke;
  ctx.stroke();
  ctx.restore();
}

function drawObjectLabel(ctx, text, cx, y) {
  ctx.save();
  ctx.font = '800 11px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(15, 22, 38, 0.78)';
  const w = ctx.measureText(text).width + 10;
  ctx.fillRect(cx - w / 2, y - 11, w, 14);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, cx, y);
  ctx.restore();
}
