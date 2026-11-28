import { getEnemySprite } from '../render/sprites.js';

export class Enemy {
  constructor(def) {
    this.id = def.id;
    this.type = def.type; // 'red_slime' | 'blue_slime' | 'bat' | 'turret' | 'robot'
    this.word = def.word || 'Enemy';
    this.scale = def.scale || 1;
    this.sizeTag = def.sizeTag || null; // 'big' | 'small'
    this.heightTag = def.heightTag || null; // 'high' | 'low'

    this.x = def.x;
    this.y = def.y;
    this.startX = def.x;
    this.startY = def.y;
    this.patrolRange = def.patrolRange || 90;
    this.speed = def.speed || (def.type === 'bat' ? 85 : 65);
    this.dir = def.dir || -1;

    let baseW = 36;
    let baseH = 24;
    if (this.type === 'bat') {
      baseW = 36;
      baseH = 20;
      this.hp = def.hp ?? 1;
    } else if (this.type === 'turret') {
      baseW = 36;
      baseH = 26;
      this.hp = def.hp ?? 2;
    } else {
      this.hp = def.hp ?? 2;
    }

    this.w = Math.round(baseW * this.scale);
    this.h = Math.round(baseH * this.scale);

    // Keep ground enemies planted on ground when scaled
    if (this.type !== 'bat' && this.scale !== 1) {
      const groundBottom = def.y + baseH;
      this.y = groundBottom - this.h;
      this.startY = this.y;
    }

    this.maxHp = this.hp;
    this.alive = true;
    this.hitFlash = 0;
    this.animTimer = 0;
    this.shootTimer = def.shootInterval || 2.4;
    this.shootInterval = def.shootInterval || 2.4;
  }

  update(dt, player, spawnEnemyBullet) {
    if (!this.alive) return;
    this.animTimer += dt;
    if (this.hitFlash > 0) this.hitFlash = Math.max(0, this.hitFlash - dt);

    if (this.type === 'red_slime' || this.type === 'blue_slime' || this.type === 'robot') {
      this.x += this.dir * this.speed * dt;
      if (this.x < this.startX - this.patrolRange) {
        this.x = this.startX - this.patrolRange;
        this.dir = 1;
      } else if (this.x > this.startX + this.patrolRange) {
        this.x = this.startX + this.patrolRange;
        this.dir = -1;
      }
    } else if (this.type === 'bat') {
      this.x += this.dir * this.speed * dt;
      if (this.x < this.startX - this.patrolRange) {
        this.x = this.startX - this.patrolRange;
        this.dir = 1;
      } else if (this.x > this.startX + this.patrolRange) {
        this.x = this.startX + this.patrolRange;
        this.dir = -1;
      }
      this.y = this.startY + Math.sin(this.animTimer * 3.8) * 22;
    } else if (this.type === 'turret') {
      this.dir = player.x < this.x ? -1 : 1;
      const dist = Math.abs(player.x - this.x);
      if (dist < 620) {
        this.shootTimer -= dt;
        if (this.shootTimer <= 0) {
          this.shootTimer = this.shootInterval;
          spawnEnemyBullet(this.x + (this.dir > 0 ? this.w : -8), this.y + 10, this.dir * 270, 0);
        }
      }
    }
  }

  takeDamage(amount) {
    if (!this.alive) return false;
    this.hp -= amount;
    this.hitFlash = 0.14;
    if (this.hp <= 0) {
      this.alive = false;
      return true;
    }
    return false;
  }

  respawn() {
    this.x = this.startX;
    this.y = this.startY;
    this.hp = this.maxHp;
    this.alive = true;
    this.hitFlash = 0;
    this.shootTimer = this.shootInterval;
  }

  draw(ctx, cameraX) {
    if (!this.alive) return;
    const sx = Math.floor(this.x - cameraX);
    const sy = Math.floor(this.y);

    const frame = Math.floor(this.animTimer * 8) % 2;
    const sprite = getEnemySprite(this.type, frame, this.dir > 0, 3);

    ctx.save();
    if (this.hitFlash > 0) {
      ctx.filter = 'brightness(2.2)';
    }
    ctx.drawImage(sprite, sx, sy, this.w, this.h);
    ctx.restore();
  }
}
