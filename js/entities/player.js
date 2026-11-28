import { CONFIG } from '../config.js';
import { getPlayerSprite, drawPlayerCape, drawPlayerFrontAccessory } from '../render/sprites.js';

export class Player {
  constructor(x, y, charType = 'boy', equipped = {}) {
    this.x = x;
    this.y = y;
    this.w = CONFIG.PLAYER_WIDTH;
    this.h = CONFIG.PLAYER_HEIGHT;
    this.vx = 0;
    this.vy = 0;
    this.facing = 1; // 1 = right, -1 = left
    this.onGround = false;
    this.charType = charType;
    this.equipped = {
      weapon: equipped.weapon || 'weapon_normal',
      suit: equipped.suit || 'suit_red',
      accessory: equipped.accessory || 'acc_none',
    };

    this.lives = CONFIG.PLAYER_MAX_LIVES;
    this.invulnTimer = 0;

    // Charge shot state
    this.chargeTime = 0;
    this.isCharging = false;
    this.chargeStartedSpoken = false;
    this.chargeReadyPlayed = false;

    // Animation & action voice tracking
    this.animTimer = 0;
    this.wasMoving = false;
    this.stoodOnObjectId = null;
  }

  resetPosition(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.chargeTime = 0;
    this.isCharging = false;
    this.chargeStartedSpoken = false;
    this.chargeReadyPlayed = false;
    this.invulnTimer = 1.0;
  }

  update(dt, input, callbacks) {
    if (this.invulnTimer > 0) {
      this.invulnTimer = Math.max(0, this.invulnTimer - dt);
    }

    // Horizontal movement
    let moveDir = 0;
    if (input.left) moveDir -= 1;
    if (input.right) moveDir += 1;

    this.vx = moveDir * CONFIG.PLAYER_SPEED;
    if (moveDir !== 0) {
      this.facing = moveDir;
      this.animTimer += dt;
      if (!this.wasMoving && this.onGround) {
        callbacks.onActionVoice('Run!', 'RUN!', this.x + this.w / 2, this.y - 10);
      }
    } else {
      this.animTimer = 0;
    }
    this.wasMoving = moveDir !== 0;

    // Jump
    if (input.jumpPressed && this.onGround) {
      this.vy = CONFIG.PLAYER_JUMP_VELOCITY;
      this.onGround = false;
      callbacks.onJump();
      callbacks.onActionVoice('Jump!', 'JUMP!', this.x + this.w / 2, this.y - 12);
    }
    if (input.jumpReleased && this.vy < 0) {
      this.vy *= CONFIG.PLAYER_JUMP_CUT;
    }

    // Gravity
    this.vy = Math.min(CONFIG.MAX_FALL_SPEED, this.vy + CONFIG.GRAVITY * dt);

    // Shoot & Charge Shot
    if (input.shootPressed) {
      this.chargeTime = 0;
      this.isCharging = true;
      this.chargeStartedSpoken = false;
      this.chargeReadyPlayed = false;
    }

    const hasFastCharge =
      this.equipped.weapon === 'weapon_charge' || this.equipped.weapon === 'weapon_nova';
    const chargeReadyTime = hasFastCharge
      ? CONFIG.CHARGE_READY_TIME * 0.55
      : CONFIG.CHARGE_READY_TIME;

    if (this.isCharging && input.shootHeld) {
      this.chargeTime += dt;
      if (!this.chargeStartedSpoken && this.chargeTime >= CONFIG.CHARGE_START_TIME) {
        this.chargeStartedSpoken = true;
        callbacks.onActionVoice('Charge!', 'CHARGE!', this.x + this.w / 2, this.y - 14);
      }
      if (!this.chargeReadyPlayed && this.chargeTime >= chargeReadyTime) {
        this.chargeReadyPlayed = true;
        callbacks.onChargeReady();
      }
    }

    if (this.isCharging && input.shootReleased) {
      const isCharged = this.chargeTime >= chargeReadyTime;
      this.isCharging = false;
      this.chargeTime = 0;
      this.chargeStartedSpoken = false;
      this.chargeReadyPlayed = false;

      const fired = callbacks.onFireBullet(isCharged);
      if (fired) {
        if (isCharged) {
          callbacks.onActionVoice('Big shot!', 'BIG SHOT!', this.x + this.w / 2, this.y - 16);
        } else {
          callbacks.onActionVoice('Shoot!', 'SHOOT!', this.x + this.w / 2, this.y - 12);
        }
      }
    }
  }

  takeDamage() {
    if (this.invulnTimer > 0) return false;
    this.lives = Math.max(0, this.lives - 1);
    this.invulnTimer = CONFIG.PLAYER_INVULN_TIME;
    this.vy = -260;
    return true;
  }

  draw(ctx, cameraX, time) {
    // Blink while invulnerable
    if (this.invulnTimer > 0 && Math.floor(this.invulnTimer * 14) % 2 === 0) {
      return;
    }

    const sx = Math.floor(this.x - cameraX);
    const sy = Math.floor(this.y);

    const hasFastCharge =
      this.equipped.weapon === 'weapon_charge' || this.equipped.weapon === 'weapon_nova';
    const chargeReadyTime = hasFastCharge
      ? CONFIG.CHARGE_READY_TIME * 0.55
      : CONFIG.CHARGE_READY_TIME;

    // Charge aura
    if (this.isCharging && this.chargeTime >= CONFIG.CHARGE_START_TIME) {
      const ready = this.chargeTime >= chargeReadyTime;
      const pulse = 22 + Math.sin(time * 24) * 4;
      ctx.save();
      ctx.strokeStyle = ready ? '#ffd24c' : '#4cc9f0';
      ctx.lineWidth = ready ? 4 : 2;
      ctx.globalAlpha = 0.78;
      ctx.beginPath();
      ctx.arc(sx + this.w / 2, sy + this.h / 2, pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    let state = 'idle';
    if (!this.onGround) {
      state = 'jump';
    } else if (Math.abs(this.vx) > 10 && Math.floor(this.animTimer * 10) % 2 === 1) {
      state = 'run';
    }

    const sprite = getPlayerSprite(this.charType, state, this.facing < 0, 2, this.equipped.suit);
    const drawX = sx + Math.floor((this.w - sprite.width) / 2);
    const drawY = sy + this.h - sprite.height;

    drawPlayerCape(ctx, this.equipped.accessory, drawX, drawY, sprite.width, sprite.height, this.facing, time);
    ctx.drawImage(sprite, drawX, drawY);
    drawPlayerFrontAccessory(ctx, this.equipped.accessory, drawX, drawY, sprite.width, sprite.height, this.facing, time);
  }
}
