import { CONFIG } from '../config.js';
import { getBossSprite } from '../render/sprites.js';

// Boss characters with unique attack personalities per world:
// - Always damageable by normal & charge shots (no invulnerable weak-point phase)
// - Kid-friendly HP (12–16) for ~30–60s action-packed English fights
// - Each boss triggers clear, contextual English instructions via Buddy

const BOSS_PATTERNS = {
  forest_guardian: ['shoot', 'jump', 'approach'],
  rock_golem: ['dash', 'jump', 'shoot'],
  ice_machine: ['double_shot', 'dash', 'jump'],
  mega_robot: ['spread_shot', 'dash', 'jump'],
  giant_octopus: ['spread_shot', 'big_jump', 'approach'],
  fire_dragon: ['hover_drop', 'shoot', 'swoop'],
  thunder_bird: ['hover_drop', 'dash', 'hover_pause'],
  candy_king: ['spread_shot', 'big_jump', 'double_shot'],
};

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

    this.actionState = 'idle';
    this.actionTimer = 1.6;
    this.patternIndex = 0;
    this.patterns = BOSS_PATTERNS[this.id] || ['shoot', 'jump', 'approach'];
    this.shotsFired = 0;
    this.isFlyingBoss = this.id === 'fire_dragon' || this.id === 'thunder_bird';
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

    let useGravity = true;

    if (this.actionState === 'idle') {
      this.vx = 0;
      if (this.actionTimer <= 0) {
        const next = this.patterns[this.patternIndex % this.patterns.length];
        this.patternIndex += 1;
        this.startAttack(next, player, onInstruction);
      }
    } else if (this.actionState === 'approach') {
      this.vx = this.facing * 145;
      if (this.actionTimer <= 0) {
        this.enterIdle(1.0);
      }
    } else if (this.actionState === 'dash') {
      // Keeps locked dash direction from startAttack
      if (this.actionTimer <= 0) {
        this.enterIdle(1.1);
      }
    } else if (this.actionState === 'jump' || this.actionState === 'big_jump') {
      if (this.onGround && this.actionTimer <= 0) {
        this.enterIdle(1.05);
      }
    } else if (this.actionState === 'shoot') {
      this.vx = 0;
      if (this.shotsFired === 0 && this.actionTimer <= 0.75) {
        this.shotsFired = 1;
        const bx = this.facing < 0 ? this.x - 10 : this.x + this.w + 4;
        const by = this.y + this.h - 24;
        spawnEnemyBullet(bx, by, this.facing * 300, 0, true);
      }
      if (this.actionTimer <= 0) {
        this.enterIdle(1.15);
      }
    } else if (this.actionState === 'double_shot') {
      this.vx = 0;
      if (this.shotsFired === 0 && this.actionTimer <= 1.05) {
        this.shotsFired = 1;
        const bx = this.facing < 0 ? this.x - 10 : this.x + this.w + 4;
        spawnEnemyBullet(bx, this.y + this.h - 24, this.facing * 310, 0, true);
      } else if (this.shotsFired === 1 && this.actionTimer <= 0.55) {
        this.shotsFired = 2;
        const bx = this.facing < 0 ? this.x - 10 : this.x + this.w + 4;
        spawnEnemyBullet(bx, this.y + this.h - 24, this.facing * 310, 0, true);
      }
      if (this.actionTimer <= 0) {
        this.enterIdle(1.15);
      }
    } else if (this.actionState === 'spread_shot') {
      this.vx = 0;
      if (this.shotsFired === 0 && this.actionTimer <= 0.8) {
        this.shotsFired = 1;
        const bx = this.facing < 0 ? this.x - 10 : this.x + this.w + 4;
        const by = this.y + this.h - 32;
        spawnEnemyBullet(bx, by, this.facing * 290, 0, true);
        spawnEnemyBullet(bx, by - 12, this.facing * 260, -110, true);
      }
      if (this.actionTimer <= 0) {
        this.enterIdle(1.2);
      }
    } else if (this.actionState === 'hover_drop') {
      useGravity = false;
      const targetY = CONFIG.GROUND_Y - 235;
      this.y += (targetY - this.y) * Math.min(1, dt * 5);
      this.vy = 0;
      const targetX = player.x;
      this.vx = Math.sign(targetX - this.x) * 190;

      if (this.shotsFired === 0 && this.actionTimer <= 1.2) {
        this.shotsFired = 1;
        spawnEnemyBullet(this.x + this.w / 2, this.y + this.h, 0, 290, true);
      } else if (this.shotsFired === 1 && this.actionTimer <= 0.55) {
        this.shotsFired = 2;
        spawnEnemyBullet(this.x + this.w / 2, this.y + this.h, 0, 290, true);
      }
      if (this.actionTimer <= 0) {
        this.enterIdle(1.1);
      }
    } else if (this.actionState === 'hover_pause') {
      useGravity = false;
      const targetY = CONFIG.GROUND_Y - 150;
      this.y += (targetY - this.y) * Math.min(1, dt * 5);
      this.vx = 0;
      this.vy = 0;
      if (this.actionTimer <= 0) {
        this.enterIdle(0.8);
      }
    } else if (this.actionState === 'swoop') {
      useGravity = false;
      const swoopY = CONFIG.GROUND_Y - 96;
      this.y += (swoopY - this.y) * Math.min(1, dt * 6);
      this.vy = 0;
      if (this.actionTimer <= 0) {
        this.enterIdle(1.1);
      }
    }

    // Physics
    if (useGravity) {
      this.vy = Math.min(CONFIG.MAX_FALL_SPEED, this.vy + CONFIG.GRAVITY * dt);
    }
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

  enterIdle(duration) {
    this.actionState = 'idle';
    this.actionTimer = duration;
    this.vx = 0;
  }

  startAttack(type, player, onInstruction) {
    this.actionState = type;
    this.shotsFired = 0;

    if (type === 'shoot') {
      this.actionTimer = 1.4;
      const fireWord = this.id === 'fire_dragon' ? 'Jump over the fire!' : 'Jump over the attack!';
      const fireJp = this.id === 'fire_dragon' ? '炎を飛びこえて！' : '攻撃を飛び越えて！';
      onInstruction({ text: fireWord, jp: fireJp });
    } else if (type === 'double_shot') {
      this.actionTimer = 1.65;
      onInstruction({
        text: 'Jump over the shots!',
        jp: '2発の弾を飛びこえて！',
      });
    } else if (type === 'spread_shot') {
      this.actionTimer = 1.45;
      const isOcto = this.id === 'giant_octopus';
      const isCandy = this.id === 'candy_king';
      onInstruction({
        text: isOcto ? 'Dodge the bubbles!' : isCandy ? 'Dodge the candy!' : 'Watch out! Jump!',
        jp: isOcto ? '泡の攻撃をよけて！' : isCandy ? 'キャンディ攻撃をよけて！' : '気をつけて！ジャンプ！',
      });
    } else if (type === 'dash') {
      this.actionTimer = 1.25;
      this.vx = this.facing * 290;
      onInstruction({
        text: 'Jump over the boss!',
        jp: '突進してくるボスを飛びこえて！',
      });
    } else if (type === 'swoop') {
      this.actionTimer = 1.25;
      this.vx = this.facing * 265;
      onInstruction({
        text: 'Watch out! Move away!',
        jp: '気をつけて！離れよう！',
      });
    } else if (type === 'jump' || type === 'big_jump') {
      this.actionTimer = 1.2;
      this.vy = type === 'big_jump' ? -670 : -560;
      this.vx = this.facing * 175;
      this.onGround = false;
      const moveAwayText = player.x < this.x ? 'Move left!' : 'Move right!';
      const moveAwayJp = player.x < this.x ? '左に移動して！' : '右に移動して！';
      onInstruction({
        text: `Watch out! ${moveAwayText}`,
        jp: `気をつけて！${moveAwayJp}`,
      });
    } else if (type === 'hover_drop') {
      this.actionTimer = 1.9;
      const moveAwayText = player.x < this.x ? 'Move left!' : 'Move right!';
      const moveAwayJp = player.x < this.x ? '左に移動して！' : '右に移動して！';
      onInstruction({
        text: `Look up! ${moveAwayText}`,
        jp: `上を見て！${moveAwayJp}`,
      });
    } else if (type === 'hover_pause') {
      this.actionTimer = 1.7;
      onInstruction({
        text: 'Jump and shoot!',
        jp: 'ジャンプして撃とう！',
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
      const barW = 116;
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
