import { CONFIG } from '../config.js';

export function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

export function resolvePlayerWorldCollision(player, objects, stageWidth, dt, arenaClamp = null) {
  const prevBottom = player.y + player.h;
  player.stoodOnObjectId = null;

  // Horizontal movement + solid collisions
  player.x += player.vx * dt;

  const minX = arenaClamp ? arenaClamp.left : 0;
  const maxX = arenaClamp ? arenaClamp.right - player.w : stageWidth - player.w;
  if (player.x < minX) player.x = minX;
  if (player.x > maxX) player.x = maxX;

  for (const obj of objects) {
    if (!isSolidBlock(obj)) continue;
    if (rectsOverlap(player, obj)) {
      if (player.vx > 0) {
        player.x = obj.x - player.w;
      } else if (player.vx < 0) {
        player.x = obj.x + obj.w;
      }
    }
  }

  // Vertical movement + solid/platform collisions
  player.y += player.vy * dt;
  player.onGround = false;

  for (const obj of objects) {
    if (isSolidBlock(obj)) {
      if (rectsOverlap(player, obj)) {
        if (player.vy >= 0) {
          player.y = obj.y - player.h;
          player.vy = 0;
          player.onGround = true;
          player.stoodOnObjectId = obj.id;
        } else {
          player.y = obj.y + obj.h;
          player.vy = 0;
        }
      }
    } else if (obj.type === 'tree') {
      // One-way platform: land on top when falling
      if (
        player.vy >= 0 &&
        prevBottom <= obj.y + 10 &&
        player.x + player.w > obj.x + 4 &&
        player.x < obj.x + obj.w - 4 &&
        player.y + player.h >= obj.y &&
        player.y + player.h <= obj.y + obj.h + 12
      ) {
        player.y = obj.y - player.h;
        player.vy = 0;
        player.onGround = true;
        player.stoodOnObjectId = obj.id;
      }
    }
  }

  // Ground floor
  if (player.y + player.h >= CONFIG.GROUND_Y) {
    player.y = CONFIG.GROUND_Y - player.h;
    player.vy = 0;
    player.onGround = true;
  }
}

function isSolidBlock(obj) {
  if (obj.type === 'box') return true;
  if ((obj.type === 'rock' || obj.type === 'ice') && !obj.broken) return true;
  if (obj.type === 'gate' && !obj.open) return true;
  if (obj.type === 'laser' && obj.active !== false) return true;
  return false;
}
