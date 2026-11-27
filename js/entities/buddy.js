import { getBuddySprite } from '../render/sprites.js';

// Navigator robot "Buddy":
// - White & orange mechanical mini-drone
// - Always floats diagonally behind and slightly above the player
// - Smoothly switches sides when the player turns, never obstructing attacks/jumps
// - Simple floating bobbing, propeller animation, and glow color for emotions

export class Buddy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.facing = 1;
    this.mood = 'normal'; // 'normal' | 'happy' | 'encourage'
    this.moodTimer = 0;
    this.bobTimer = 0;
  }

  setMood(mood, duration = 2.0) {
    this.mood = mood;
    this.moodTimer = duration;
  }

  update(dt, player) {
    this.bobTimer += dt;
    if (this.moodTimer > 0) {
      this.moodTimer -= dt;
      if (this.moodTimer <= 0) {
        this.mood = 'normal';
      }
    }

    // Target position: diagonally behind and slightly above the player
    const targetX = player.x + player.w / 2 - player.facing * 46;
    const targetY = player.y - 36;

    const lerpFactor = Math.min(1, dt * 6.5);
    this.x += (targetX - this.x) * lerpFactor;
    this.y += (targetY - this.y) * lerpFactor;
    this.facing = player.facing;
  }

  draw(ctx, cameraX) {
    const bobOffset = Math.sin(this.bobTimer * 4.2) * 5;
    const happyHop = this.mood === 'happy' ? Math.abs(Math.sin(this.bobTimer * 12)) * -7 : 0;

    const frame = Math.floor(this.bobTimer * 16) % 2;
    const sprite = getBuddySprite(frame, this.mood, this.facing < 0, 2);

    const sx = Math.floor(this.x - cameraX - sprite.width / 2);
    const sy = Math.floor(this.y + bobOffset + happyHop - sprite.height / 2);

    // Soft glow under Buddy
    ctx.save();
    ctx.fillStyle =
      this.mood === 'happy'
        ? 'rgba(69, 242, 143, 0.28)'
        : this.mood === 'encourage'
        ? 'rgba(255, 224, 102, 0.28)'
        : 'rgba(255, 140, 43, 0.24)';
    ctx.beginPath();
    ctx.arc(sx + sprite.width / 2, sy + sprite.height / 2, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.drawImage(sprite, sx, sy);
  }
}
