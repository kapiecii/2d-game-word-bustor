import { CONFIG } from '../config.js';
import { getBossSprite } from '../render/sprites.js';

// Boss character (Phase 1: Forest Guardian)
// - Always damageable by normal & charge shots (no invulnerable weak-point phase)
// - Low HP (12 = ~12 normal shots or 4 charge shots, ~30-60s fight)
// - 3 simple attack patterns:
//   1. approach (left/right movement)
//   2. jump (jump attack)
//   3. shoot (projectile shot)
// - Triggers contextual English instructions via Buddy on each attack

export class Boss {
  constructor(def) {
    this.id = def.id || 'forest_guardian';
    this.name = def.name || 'Forest Guardian';
    this.x = def.x;
    this.y = CONFIG.GROUND_Y - 84;
    this.w = 92;
    this.h = 84;
    this.arenaLeft = def.arenaLeft;
    this.arenaRight = def.arenaRight;

    this.maxHp = def.hp || 12;
    this.hp = this.maxHp;
    this.alive = true;
    this.active = false;

    this.vx = 0;
    this.vy = 0;
    this.facing = -1;
    this.onGround = true;

    this.hitFlash = 0;
    this.animTimer = 0;

    // Simple cyclic attack AI
    this.actionState = 'idle'; // 'idle' | 'approach' | 'jump' | 'shoot'
    this.actionTimer = 1.8;
    this.patternIndex = 0;
    this.patterns = ['shoot', 'jump', 'approach'];
    this.hasShotInState = false;
  }

  activate(onInstruction) {
    if (this.active) return;
    this.active = true;
    this.actionState = 'idle';
    this.actionTimer = 1.4;
    onInstruction({
      text: 'Watch out! Shoot the boss!',
      jp: '気をつけて！ボスを撃とう！',
    });
  }

  update(dt, player, spawnEnemyBullet, onInstruction) {
    if (!this.alive || !this.active) return;
    this.animTimer += dt;
    if (this.hitFlash > 0) this.hitFlash = Math.max(0, this.hitFlash - dt);

    this.facing = player.x + player.w / 2 < this.x + this.w / 2 ? -1 : 1;
    this.actionTimer -= dt;

    if (this.actionState === 'idle') {
      this.vx = 0;
      if (this.actionTimer <= 0) {
        const next = this.patterns[this.patternIndex % this.patterns.length];
        this.patternIndex += 1;
        this.startAttack(next, player, onInstruction);
      }
    } else if (this.actionState === 'approach') {
      this.vx = this.facing * 135;
      if (this.actionTimer <= 0) {
        this.actionState = 'idle';
        this.actionTimer = 1.1;
      }
    } else if (this.actionState === 'jump') {
      if (this.onGround && this.actionTimer <= 0) {
        this.actionState = 'idle';
        this.actionTimer = 1.1;
      }
    } else if (this.actionState === 'shoot') {
      this.vx = 0;
      if (!this.hasShotInState && this.actionTimer <= 0.75) {
        this.hasShotInState = true;
        const bx = this.facing < 0 ? this.x - 10 : this.x + this.w + 4;
        const by = this.y + this.h - 24;
        spawnEnemyBullet(bx, by, this.facing * 290, 0, true);
      }
      if (this.actionTimer <= 0) {
        this.actionState = 'idle';
        this.actionTimer = 1.25;
      }
    }

    // Physics
    this.vy = Math.min(CONFIG.MAX_FALL_SPEED, this.vy + CONFIG.GRAVITY * dt);
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Arena bounds
    if (this.x < this.arenaLeft) {
      this.x = this.arenaLeft;
      this.vx = 0;
    } else if (this.x + this.w > this.arenaRight) {
      this.x = this.arenaRight - this.w;
      this.vx = 0;
    }

    // Ground clamp
    if (this.y + this.h >= CONFIG.GROUND_Y) {
      this.y = CONFIG.GROUND_Y - this.h;
      this.vy = 0;
      this.onGround = true;
    }
  }

  startAttack(type, player, onInstruction) {
    this.actionState = type;

    if (type === 'shoot') {
      this.actionTimer = 1.4;
      this.hasShotInState = false;
      onInstruction({
        text: 'Jump over the attack!',
        jp: '攻撃を飛び越えて！',
      });
    } else if (type === 'jump') {
      this.actionTimer = 1.2;
      this.vy = -560;
      this.vx = this.facing * 155;
      this.onGround = false;
      const moveAwayText = player.x < this.x ? 'Move left!' : 'Move right!';
      const moveAwayJp = player.x < this.x ? '左に移動して！' : '右に移動して！';
      onInstruction({
        text: `Watch out! ${moveAwayText}`,
        jp: `気をつけて！${moveAwayJp}`,
      });
    } else if (type === 'approach') {
      this.actionTimer = 1.35;
      onInstruction({
        text: 'Shoot the weak point!',
        jp: '弱点を撃って！',
      });
    }
  }

  takeDamage(amount) {
    if (!this.alive || !this.active) return false;
    this.hp = Math.max(0, this.hp - amount);
    this.hitFlash = 0.14;
    if (this.hp <= 0) {
      this.alive = false;
      return true;
    }
    return false;
  }

  draw(ctx, cameraX) {
    if (!this.alive) return;
    const sx = Math.floor(this.x - cameraX);
    const sy = Math.floor(this.y);

    const frame = Math.floor(this.animTimer * 4) % 2;
    const sprite = getBossSprite(this.id, frame, this.facing > 0, 6);

    ctx.save();
    if (this.hitFlash > 0) {
      ctx.filter = 'brightness(2.2)';
    }
    ctx.drawImage(sprite, sx - 2, sy);
    ctx.restore();

    // Boss HP bar above boss
    if (this.active) {
      const barW = 110;
      const barH = 10;
      const bx = sx + Math.floor((this.w - barW) / 2);
      const by = sy - 22;
      ctx.fillStyle = 'rgba(15, 22, 38, 0.85)';
      ctx.fillRect(bx - 2, by - 2, barW + 4, barH + 4);
      ctx.fillStyle = '#3a4663';
      ctx.fillRect(bx, by, barW, barH);
      ctx.fillStyle = '#f24b59';
      ctx.fillRect(bx, by, Math.floor(barW * (this.hp / this.maxHp)), barH);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.name.toUpperCase(), bx + barW / 2, by - 6);
    }
  }
}
