import { CONFIG } from '../config.js';
import { drawWorldBackground } from '../render/background.js';
import { Player } from '../entities/player.js';
import { Buddy } from '../entities/buddy.js';
import { Enemy } from '../entities/enemy.js';
import { Boss } from '../entities/boss.js';
import { Bullet, FloatingText, Particle, drawWorldObjects } from '../entities/objects.js';
import { rectsOverlap, resolvePlayerWorldCollision } from '../systems/collision.js';
import { MissionManager } from '../systems/mission.js';

export class Game {
  constructor({ canvas, input, speech, audio, hud, onStageClear, onPauseToggle }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.input = input;
    this.speech = speech;
    this.audio = audio;
    this.hud = hud;
    this.onStageClear = onStageClear;
    this.onPauseToggle = onPauseToggle;

    this.running = false;
    this.paused = false;
    this.rafId = null;
    this.lastTime = 0;

    this.stage = null;
    this.highScore = 0;
    this.resetRuntimeState();
  }

  resetRuntimeState() {
    this.time = 0;
    this.elapsed = 0;
    this.score = 0;
    this.coins = 0;
    this.cameraX = 0;
    this.player = null;
    this.buddy = null;
    this.objects = [];
    this.enemies = [];
    this.boss = null;
    this.bullets = [];
    this.floatingTexts = [];
    this.particles = [];
    this.missionManager = null;
    this.stageCleared = false;
    this.bossArenaLocked = false;
  }

  startStage(stageData, charType, highScore = 0, equipped = {}) {
    this.stop();
    this.resetRuntimeState();

    this.stage = stageData;
    this.highScore = highScore;

    this.player = new Player(
      stageData.startX || 60,
      CONFIG.GROUND_Y - CONFIG.PLAYER_HEIGHT,
      charType,
      equipped
    );
    this.buddy = new Buddy(this.player.x - 42, this.player.y - 36);
    this.objects = (stageData.objects || []).map((o) => ({ ...o }));
    this.enemies = (stageData.enemies || []).map((e) => new Enemy(e));
    this.boss = stageData.boss ? new Boss(stageData.boss) : null;

    this.missionManager = new MissionManager(stageData.missions || [], {
      onSpeak: (text, priority) => this.speech.speak(text, priority),
      onMissionStart: (mission) => this.handleMissionStart(mission),
      onMissionSuccess: (mission, praise) => this.handleMissionSuccess(mission, praise),
      onMissionFail: (encourage, reason) => this.handleMissionFail(encourage, reason),
    });

    this.running = true;
    this.paused = false;
    this.lastTime = performance.now();

    this.updateHud();
    this.loop(this.lastTime);
  }

  setPaused(paused) {
    this.paused = paused;
    if (paused) {
      this.speech.stop();
    } else {
      this.lastTime = performance.now();
    }
  }

  stop() {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.speech.stop();
  }

  replayVoice() {
    if (this.missionManager) {
      this.missionManager.replayVoice();
    }
  }

  showHint() {
    if (this.missionManager) {
      this.missionManager.showHint();
    }
  }

  loop(now) {
    if (!this.running) return;
    const dt = Math.min(0.05, Math.max(0, (now - this.lastTime) / 1000));
    this.lastTime = now;

    if (this.input.pausePressed && !this.stageCleared) {
      this.onPauseToggle();
    }

    if (!this.paused && !this.stageCleared) {
      if (this.input.replayPressed) {
        this.replayVoice();
      }
      if (this.input.hintPressed) {
        this.showHint();
      }
      this.update(dt);
    }

    this.render();
    this.input.endFrame();
    this.rafId = requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    this.time += dt;
    this.elapsed += dt;

    // Player update
    this.player.update(dt, this.input, {
      onJump: () => {
        this.audio.jump();
        this.missionManager.onPlayerJump();
      },
      onChargeReady: () => this.audio.chargeReady(),
      onActionVoice: (spoken, label, x, y) => {
        this.speech.speak(spoken, 1);
        this.spawnFloatingText(label, x, y, '#ffffff');
      },
      onFireBullet: (charged) => this.spawnPlayerBullet(charged),
    });

    // Boss arena activation
    if (this.boss && !this.boss.active && this.player.x >= this.stage.boss.triggerX) {
      this.bossArenaLocked = true;
      this.boss.activate((inst) => this.missionManager.setBossInstruction(inst));
    }

    const arenaClamp =
      this.bossArenaLocked && this.boss
        ? { left: this.boss.arenaLeft, right: this.boss.arenaRight }
        : null;

    // Collision with terrain & solids
    resolvePlayerWorldCollision(this.player, this.objects, this.stage.width, dt, arenaClamp);

    // Update Buddy
    this.buddy.update(dt, this.player);

    // Update Mission Manager
    this.missionManager.update(dt, this.player, this.objects);

    // Update Enemies
    for (const enemy of this.enemies) {
      enemy.update(dt, this.player, (x, y, vx, vy) => this.spawnEnemyBullet(x, y, vx, vy));
    }

    // Update Boss
    if (this.boss && this.boss.alive) {
      this.boss.update(
        dt,
        this.player,
        (x, y, vx, vy) => this.spawnEnemyBullet(x, y, vx, vy),
        (inst) => this.missionManager.setBossInstruction(inst)
      );
    }

    // Update Bullets
    for (const b of this.bullets) {
      b.update(dt);
      if (b.x < this.cameraX - 60 || b.x > this.cameraX + CONFIG.CANVAS_WIDTH + 60) {
        b.alive = false;
      }
    }

    this.handleCollisions();

    // Clean up bullets, texts, particles
    this.bullets = this.bullets.filter((b) => b.alive);
    for (const ft of this.floatingTexts) ft.update(dt);
    this.floatingTexts = this.floatingTexts.filter((ft) => ft.alive);
    for (const p of this.particles) p.update(dt);
    this.particles = this.particles.filter((p) => p.alive);

    // Camera follow
    const targetCam = this.bossArenaLocked && this.boss
      ? this.boss.arenaLeft
      : this.player.x - CONFIG.CANVAS_WIDTH * 0.35;
    const clampedCam = Math.max(0, Math.min(this.stage.width - CONFIG.CANVAS_WIDTH, targetCam));
    this.cameraX += (clampedCam - this.cameraX) * Math.min(1, dt * 8);

    this.updateHud();
  }

  spawnPlayerBullet(charged) {
    const weapon = this.player.equipped.weapon;
    const activePlayerBullets = this.bullets.filter((b) => b.isPlayer && b.alive).length;

    const maxBullets =
      weapon === 'weapon_nova'
        ? 15
        : weapon === 'weapon_spread'
        ? 9
        : weapon === 'weapon_twin' || weapon === 'weapon_wave'
        ? 6
        : weapon === 'weapon_rapid'
        ? 5
        : CONFIG.MAX_PLAYER_BULLETS;

    if (!charged && activePlayerBullets >= maxBullets) {
      return false;
    }

    const speed =
      weapon === 'weapon_laser'
        ? 860
        : weapon === 'weapon_rapid'
        ? 720
        : CONFIG.BULLET_SPEED;
    const vx = this.player.facing * speed;

    if (charged) {
      const hyper = weapon === 'weapon_charge' || weapon === 'weapon_nova';
      const bw = hyper ? 38 : 28;
      const bx = this.player.facing > 0 ? this.player.x + this.player.w : this.player.x - bw;
      const by = this.player.y + (hyper ? 12 : 14);
      this.bullets.push(new Bullet(bx, by, vx, 0, true, true, hyper));
      this.audio.chargeShot();
      this.missionManager.onPlayerShoot(true, !this.player.onGround);
      return true;
    }

    const bx = this.player.facing > 0 ? this.player.x + this.player.w : this.player.x - 12;
    const by = this.player.y + 20;

    if (weapon === 'weapon_twin') {
      this.bullets.push(new Bullet(bx, by - 7, vx, 0, true, false));
      this.bullets.push(new Bullet(bx, by + 7, vx, 0, true, false));
    } else if (weapon === 'weapon_spread') {
      this.bullets.push(new Bullet(bx, by, vx, 0, true, false));
      this.bullets.push(new Bullet(bx, by - 4, vx * 0.94, -155, true, false));
      this.bullets.push(new Bullet(bx, by + 4, vx * 0.94, 155, true, false));
    } else if (weapon === 'weapon_laser') {
      const lbx = this.player.facing > 0 ? this.player.x + this.player.w : this.player.x - 34;
      this.bullets.push(
        new Bullet(lbx, by, vx, 0, true, false, false, {
          style: 'laser',
          piercing: true,
          damage: 2,
        })
      );
    } else if (weapon === 'weapon_wave') {
      this.bullets.push(
        new Bullet(bx, by, vx * 0.9, 0, true, false, false, { style: 'wave', wavePhase: 0 })
      );
      this.bullets.push(
        new Bullet(bx, by, vx * 0.9, 0, true, false, false, { style: 'wave', wavePhase: Math.PI })
      );
    } else if (weapon === 'weapon_bounce') {
      this.bullets.push(
        new Bullet(bx, by - 4, vx * 0.78, -220, true, false, false, {
          style: 'bounce',
          damage: 2,
          life: 2.8,
        })
      );
    } else if (weapon === 'weapon_nova') {
      [-220, -110, 0, 110, 220].forEach((vy) => {
        this.bullets.push(new Bullet(bx, by, vx * 0.95, vy, true, false));
      });
    } else {
      this.bullets.push(new Bullet(bx, by, vx, 0, true, false));
    }
    this.audio.shoot();
    this.missionManager.onPlayerShoot(false, !this.player.onGround);
    return true;
  }

  spawnEnemyBullet(x, y, vx, vy) {
    this.bullets.push(new Bullet(x, y, vx, vy, false, false));
  }

  handleCollisions() {
    // Player vs Objects (coins, keys, stars, cactus, goal)
    for (const obj of this.objects) {
      if (obj.collected || obj.broken) continue;
      if (!rectsOverlap(this.player, obj)) continue;

      if (obj.type === 'coin') {
        obj.collected = true;
        this.coins += 1;
        this.score += CONFIG.SCORE_COIN;
        this.audio.coin();
        this.speech.speak('Coin!', 2);
        this.spawnFloatingText('COIN!', obj.x + 12, obj.y - 6, '#ffe66d');
        this.spawnBurst(obj.x + 12, obj.y + 12, '#ffe66d', 6);
        this.missionManager.onCoinCollected(obj);
      } else if (obj.type === 'star') {
        const ok = this.missionManager.onStarCollected(obj);
        if (ok) {
          obj.collected = true;
          this.score += 300;
          this.audio.coin();
          this.speech.speak(`${obj.color} star!`, 2);
          this.spawnFloatingText(`${obj.color.toUpperCase()} STAR!`, obj.x + 12, obj.y - 8, '#ffe66d');
          this.spawnBurst(obj.x + 12, obj.y + 12, '#ffe66d', 10);
        } else {
          // Gently push away so wrong star doesn't trigger every frame
          this.player.vy = -240;
          this.player.invulnTimer = 1.0;
        }
      } else if (obj.type === 'key') {
        obj.collected = true;
        this.score += 300;
        this.audio.coin();
        this.speech.speak('Key!', 2);
        this.spawnFloatingText('KEY!', obj.x + 12, obj.y - 6, '#ffd24c');
        this.spawnBurst(obj.x + 12, obj.y + 12, '#ffd24c', 10);
        this.missionManager.onKeyCollected(obj.id);
      } else if (obj.type === 'cactus') {
        this.damagePlayer();
      } else if (obj.type === 'goal') {
        this.completeStage();
        return;
      }
    }

    // Player Bullets vs Objects (Rocks, Ice, Switches, Boxes, Closed Gates, Lasers)
    for (const b of this.bullets) {
      if (!b.alive || !b.isPlayer) continue;
      for (const obj of this.objects) {
        if (obj.broken || obj.open) continue;
        if ((obj.type === 'rock' || obj.type === 'ice') && rectsOverlap(b, obj)) {
          if (b.charged) {
            obj.broken = true;
            this.score += 300;
            this.audio.rockBreak();
            const word = obj.type === 'ice' ? 'Ice!' : 'Rock!';
            this.speech.speak(word, 2);
            this.spawnFloatingText(
              obj.type === 'ice' ? 'ICE BREAK!' : 'ROCK BREAK!',
              obj.x + obj.w / 2,
              obj.y - 10,
              obj.type === 'ice' ? '#c9f2ff' : '#ffd24c'
            );
            this.spawnBurst(obj.x + obj.w / 2, obj.y + obj.h / 2, obj.type === 'ice' ? '#72d4ff' : '#9aa5b1', 14);
            this.missionManager.onObjectBroken(obj.id);
          } else {
            b.alive = false;
            this.audio.hit();
            this.spawnFloatingText('CHARGE!', obj.x + obj.w / 2, obj.y - 10, '#4cc9f0');
          }
        } else if (obj.type === 'switch' && !obj.activated && rectsOverlap(b, obj)) {
          b.alive = false;
          const ok = this.missionManager.onSwitchHit(obj);
          if (ok) {
            this.audio.gateOpen();
            this.spawnFloatingText('SWITCH!', obj.x + obj.w / 2, obj.y - 10, '#45f28f');
            this.spawnBurst(obj.x + obj.w / 2, obj.y + obj.h / 2, '#45f28f', 10);
            if (obj.controlsLaserId) {
              const laser = this.objects.find((o) => o.id === obj.controlsLaserId);
              if (laser) {
                laser.active = false;
                this.spawnFloatingText('LASER OFF!', laser.x + laser.w / 2, laser.y - 10, '#4cc9f0');
              }
            }
          } else {
            // Reset any partially activated switches in sequence
            this.objects.forEach((o) => {
              if (o.type === 'switch' && o.resetOnFail) o.activated = false;
            });
          }
        } else if (obj.type === 'shape_target' && !obj.activated && rectsOverlap(b, obj)) {
          b.alive = false;
          const ok = this.missionManager.onShapeHit(obj);
          if (ok) {
            this.audio.gateOpen();
            this.spawnFloatingText(`${obj.shape.toUpperCase()}!`, obj.x + obj.w / 2, obj.y - 10, '#45f28f');
            this.spawnBurst(obj.x + obj.w / 2, obj.y + obj.h / 2, '#45f28f', 10);
          }
        } else if (obj.type === 'number_target' && !obj.activated && rectsOverlap(b, obj)) {
          b.alive = false;
          const ok = this.missionManager.onNumberHit(obj);
          if (ok) {
            this.audio.gateOpen();
            this.spawnFloatingText(`${obj.num}!`, obj.x + obj.w / 2, obj.y - 10, '#ffd24c');
            this.spawnBurst(obj.x + obj.w / 2, obj.y + obj.h / 2, '#ffd24c', 10);
          } else {
            this.objects.forEach((o) => {
              if (o.type === 'number_target' && o.resetOnFail) o.activated = false;
            });
          }
        } else if (obj.type === 'letter_target' && !obj.activated && rectsOverlap(b, obj)) {
          b.alive = false;
          const ok = this.missionManager.onLetterHit(obj);
          if (ok) {
            this.audio.gateOpen();
            this.spawnFloatingText(`${obj.letter}!`, obj.x + obj.w / 2, obj.y - 10, '#ff9ec7');
            this.spawnBurst(obj.x + obj.w / 2, obj.y + obj.h / 2, '#ff9ec7', 10);
          } else {
            this.objects.forEach((o) => {
              if (o.type === 'letter_target' && o.resetOnFail) o.activated = false;
            });
          }
        } else if (obj.type === 'word_target' && !obj.activated && rectsOverlap(b, obj)) {
          b.alive = false;
          const ok = this.missionManager.onWordTargetHit(obj);
          if (ok) {
            this.audio.gateOpen();
            this.speech.speak(`${obj.word}!`, 2);
            this.spawnFloatingText(`${obj.word.toUpperCase()}!`, obj.x + obj.w / 2, obj.y - 10, '#45f28f');
            this.spawnBurst(obj.x + obj.w / 2, obj.y + obj.h / 2, '#45f28f', 10);
          }
        } else if ((obj.type === 'box' || obj.type === 'gate' || (obj.type === 'laser' && obj.active !== false)) && rectsOverlap(b, obj)) {
          if (!b.charged) b.alive = false;
        }
      }
    }

    // Player Bullets vs Enemies
    for (const b of this.bullets) {
      if (!b.alive || !b.isPlayer) continue;
      for (const enemy of this.enemies) {
        if (!enemy.alive || b.hitIds.has(enemy.id)) continue;
        if (rectsOverlap(b, enemy)) {
          b.hitIds.add(enemy.id);
          if (!b.piercing) b.alive = false;

          this.missionManager.onEnemyHit(enemy);
          const defeated = enemy.takeDamage(b.damage);
          if (defeated) {
            this.score += CONFIG.SCORE_ENEMY;
            this.audio.enemyDefeat();
            this.speech.speak(enemy.word, 2);
            this.spawnFloatingText(enemy.word.toUpperCase() + '!', enemy.x + enemy.w / 2, enemy.y - 10, '#ff8fa3');
            this.spawnBurst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, '#ff6b6b', 10);
            this.missionManager.onEnemyDefeated(enemy);
          } else {
            this.audio.hit();
          }
        }
      }
    }

    // Player Bullets vs Boss
    if (this.boss && this.boss.alive && this.boss.active) {
      for (const b of this.bullets) {
        if (!b.alive || !b.isPlayer || b.hitIds.has('boss')) continue;
        if (rectsOverlap(b, this.boss)) {
          b.hitIds.add('boss');
          if (!b.piercing) b.alive = false;

          const defeated = this.boss.takeDamage(b.damage);
          this.spawnBurst(b.x, b.y, '#ffd24c', 6);
          if (defeated) {
            this.score += CONFIG.SCORE_BOSS;
            this.audio.enemyDefeat();
            this.spawnBurst(this.boss.x + this.boss.w / 2, this.boss.y + this.boss.h / 2, '#7ae582', 24);
            this.missionManager.clearBossBanner();
            this.completeStage();
            return;
          } else {
            this.audio.hit();
          }
        }
      }
    }

    // Enemy Bullets vs Player
    for (const b of this.bullets) {
      if (!b.alive || b.isPlayer) continue;
      if (rectsOverlap(b, this.player)) {
        b.alive = false;
        this.damagePlayer();
      }
    }

    // Enemies & Boss contact vs Player
    for (const enemy of this.enemies) {
      if (!enemy.alive) continue;
      if (rectsOverlap(this.player, enemy)) {
        this.damagePlayer();
      }
    }

    if (this.boss && this.boss.alive && this.boss.active && rectsOverlap(this.player, this.boss)) {
      this.damagePlayer();
    }
  }

  damagePlayer() {
    const damaged = this.player.takeDamage();
    if (!damaged) return;

    this.missionManager.onPlayerDamaged();
    this.audio.hurt();
    this.buddy.setMood('encourage', 2.0);
    this.spawnFloatingText('OUCH!', this.player.x + this.player.w / 2, this.player.y - 12, '#ff6b6b');
    this.spawnBurst(this.player.x + this.player.w / 2, this.player.y + this.player.h / 2, '#ff6b6b', 8);

    if (this.player.lives <= 0) {
      this.retryFromCheckpoint();
    }
  }

  retryFromCheckpoint() {
    // Infinite lives: restore 3 hearts and respawn at checkpoint
    this.player.lives = CONFIG.PLAYER_MAX_LIVES;
    const respawnX = this.bossArenaLocked && this.boss ? this.boss.arenaLeft + 40 : this.missionManager.checkpointX;
    this.player.resetPosition(respawnX, CONFIG.GROUND_Y - CONFIG.PLAYER_HEIGHT - 20);
    this.bullets = this.bullets.filter((b) => b.isPlayer);
    this.buddy.setMood('encourage', 2.5);
    this.speech.speak('You can do it!', 3);
    this.spawnFloatingText('YOU CAN DO IT!', this.player.x + 20, this.player.y - 20, '#ffe066');
  }

  handleMissionStart(mission) {
    const gate = mission.gateId
      ? this.objects.find((o) => o.id === mission.gateId)
      : null;
    const areaMinX = (mission.triggerX ?? 0) - 80;
    const areaMaxX = gate ? gate.x : this.stage.width;

    // Respawn required enemies if they were already defeated before the mission started
    if (mission.type === 'defeat_enemy_type') {
      for (const enemy of this.enemies) {
        if (enemy.alive) continue;
        const inArea = enemy.startX >= areaMinX && enemy.startX <= areaMaxX;
        const isTarget =
          (mission.targetId && enemy.id === mission.targetId) ||
          (mission.targetType && enemy.type === mission.targetType && inArea);
        const isContrast =
          (mission.forbiddenIds && mission.forbiddenIds.includes(enemy.id)) ||
          (mission.forbiddenEnemyType && enemy.type === mission.forbiddenEnemyType && inArea);

        if (isTarget || isContrast) {
          enemy.respawn();
          this.spawnBurst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, '#4cc9f0', 10);
        }
      }
    } else if (mission.type === 'dodge_shots') {
      for (const enemy of this.enemies) {
        if (!enemy.alive && enemy.type === 'turret' && enemy.startX >= areaMinX && enemy.startX <= areaMaxX) {
          enemy.respawn();
          this.spawnBurst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, '#4cc9f0', 8);
        }
      }
    } else if ((mission.type === 'break_object' || mission.type === 'break_rock') && mission.targetId) {
      const target = this.objects.find((o) => o.id === mission.targetId);
      if (target && target.broken) {
        target.broken = false;
        this.spawnBurst(target.x + target.w / 2, target.y + target.h / 2, '#9aa5b1', 10);
      }
    }
  }

  handleMissionSuccess(mission, praise) {
    this.score += CONFIG.SCORE_MISSION;
    this.audio.missionSuccess();
    this.buddy.setMood('happy', 2.5);
    this.speech.speak(praise, 3);
    this.spawnFloatingText(praise.toUpperCase(), this.player.x + this.player.w / 2, this.player.y - 24, '#45f28f');

    if (mission.gateId) {
      const gate = this.objects.find((o) => o.id === mission.gateId);
      if (gate) {
        gate.open = true;
        this.audio.gateOpen();
        this.spawnFloatingText('OPEN!', gate.x + gate.w / 2, gate.y - 12, '#45f28f');
        this.spawnBurst(gate.x + gate.w / 2, gate.y + gate.h / 2, '#45f28f', 12);
      }
    }
  }

  handleMissionFail(encourage) {
    this.audio.missionFail();
    this.buddy.setMood('encourage', 2.5);
    this.speech.speak(encourage, 3);
    this.spawnFloatingText(encourage.toUpperCase(), this.player.x + this.player.w / 2, this.player.y - 24, '#ffe066');

    this.player.lives = Math.max(0, this.player.lives - 1);
    if (this.player.lives <= 0) {
      this.retryFromCheckpoint();
    }
  }

  completeStage() {
    if (this.stageCleared) return;
    this.stageCleared = true;
    this.score += CONFIG.SCORE_STAGE_CLEAR;
    this.audio.stageClear();
    this.buddy.setMood('happy', 5.0);
    this.speech.speak('Awesome! Stage clear!', 3);
    this.updateHud();

    setTimeout(() => {
      if (!this.running) return;
      this.onStageClear({
        stageId: this.stage.id,
        stageName: this.stage.name,
        score: this.score,
        elapsed: this.elapsed,
        coins: this.coins,
      });
    }, 850);
  }

  spawnFloatingText(text, x, y, color = '#ffffff') {
    this.floatingTexts.push(new FloatingText(text, x, y, color));
  }

  spawnBurst(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const speed = 70 + Math.random() * 140;
      this.particles.push(
        new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed - 60, color)
      );
    }
  }

  updateHud() {
    this.hud.updateHud({
      lives: this.player.lives,
      maxLives: CONFIG.PLAYER_MAX_LIVES,
      coins: this.coins,
      score: this.score,
      highScore: this.highScore,
      elapsed: this.elapsed,
    });
    this.hud.updateMissionBanner(this.missionManager.currentDisplay, this.buddy.mood);
  }

  render() {
    const ctx = this.ctx;
    drawWorldBackground(ctx, this.stage.world, this.cameraX, this.stage.width, this.time);
    drawWorldObjects(ctx, this.objects, this.cameraX, this.time);

    for (const enemy of this.enemies) {
      enemy.draw(ctx, this.cameraX);
    }
    if (this.boss) {
      this.boss.draw(ctx, this.cameraX);
    }
    this.buddy.draw(ctx, this.cameraX);
    this.player.draw(ctx, this.cameraX, this.time);

    for (const b of this.bullets) {
      b.draw(ctx, this.cameraX);
    }
    for (const p of this.particles) {
      p.draw(ctx, this.cameraX);
    }
    for (const ft of this.floatingTexts) {
      ft.draw(ctx, this.cameraX);
    }
  }
}
