import { CONFIG, PRAISE_PHRASES, ENCOURAGE_PHRASES } from '../config.js';

export class MissionManager {
  constructor(missions = [], callbacks = {}) {
    this.missions = missions.map((m) => ({
      ...m,
      started: false,
      completed: false,
      progress: 0,
      holdProgress: 0,
      graceTimer: 0,
      stepIndex: 0,
      timeLeft: m.timeLimit || 0,
    }));
    this.callbacks = callbacks;

    this.activeMission = null;
    this.bossBanner = null;
    this.hintTimer = 0;
    this.checkpointX = 60;
    this.praiseIndex = 0;
    this.encourageIndex = 0;
  }

  get currentDisplay() {
    if (this.bossBanner) {
      return {
        text: this.bossBanner.text,
        jp: this.bossBanner.jp,
        progressText: '',
        timeLeft: 0,
        timeLimit: 0,
        isBoss: true,
        showHint: this.hintTimer > 0,
      };
    }
    if (!this.activeMission) return null;
    const m = this.activeMission;
    let progressText = '';
    if (m.type === 'dont_move' || m.type === 'stay_on_object' || m.type === 'dodge_shots') {
      const target = m.holdSeconds || 3;
      const rem = Math.max(0, target - m.holdProgress);
      progressText = `${rem.toFixed(1)}s`;
    } else if (m.type === 'sequence' && Array.isArray(m.steps)) {
      progressText = `${m.stepIndex} / ${m.steps.length}`;
    } else if (m.targetCount && m.targetCount > 1) {
      progressText = `${m.progress} / ${m.targetCount}`;
    }
    return {
      text: m.text,
      jp: m.jp,
      progressText,
      timeLeft: m.timeLeft,
      timeLimit: m.timeLimit || 0,
      isBoss: false,
      showHint: this.hintTimer > 0,
    };
  }

  showHint() {
    if (!this.activeMission && !this.bossBanner) return;
    this.hintTimer = CONFIG.HINT_DISPLAY_SECONDS;
  }

  replayVoice() {
    const disp = this.currentDisplay;
    if (disp) {
      this.callbacks.onSpeak(disp.text, 3);
    }
  }

  setBossInstruction(instruction) {
    this.activeMission = null;
    this.bossBanner = { text: instruction.text, jp: instruction.jp };
    this.hintTimer = 0;
    this.callbacks.onSpeak(instruction.text, 3);
  }

  clearBossBanner() {
    this.bossBanner = null;
    this.hintTimer = 0;
  }

  update(dt, player, objects) {
    if (this.hintTimer > 0) {
      this.hintTimer = Math.max(0, this.hintTimer - dt);
    }

    // Check if any unstarted mission should trigger
    if (!this.activeMission && !this.bossBanner) {
      for (const m of this.missions) {
        if (!m.started && !m.completed && player.x >= m.triggerX) {
          this.startMission(m);
          break;
        }
      }
    }

    if (!this.activeMission) return;
    const m = this.activeMission;

    // Countdown timer for active mission
    if (m.timeLimit > 0) {
      m.timeLeft -= dt;
      if (m.timeLeft <= 0) {
        m.timeLeft = m.timeLimit;
        this.triggerFail('Time up!');
        return;
      }
    }

    // Positional / hold / sequence checks
    if (m.type === 'jump_on_tree' || m.type === 'jump_on_object') {
      if (player.stoodOnObjectId === m.targetId) {
        this.completeActiveMission();
      }
    } else if (m.type === 'jump_over_box' || m.type === 'jump_over_object') {
      const target = objects.find((o) => o.id === m.targetId);
      if (target && player.x > target.x + target.w + 6) {
        this.completeActiveMission();
      }
    } else if (m.type === 'dont_move') {
      if (m.graceTimer > 0) {
        m.graceTimer -= dt;
      } else if (Math.abs(player.vx) > 5 || !player.onGround) {
        m.holdProgress = 0;
      } else {
        m.holdProgress += dt;
        if (m.holdProgress >= (m.holdSeconds || 3)) {
          this.completeActiveMission();
        }
      }
    } else if (m.type === 'stay_on_object') {
      if (player.stoodOnObjectId === m.targetId) {
        m.holdProgress += dt;
        if (m.holdProgress >= (m.holdSeconds || 3)) {
          this.completeActiveMission();
        }
      } else {
        m.holdProgress = 0;
      }
    } else if (m.type === 'dodge_shots') {
      m.holdProgress += dt;
      if (m.holdProgress >= (m.holdSeconds || 5)) {
        this.completeActiveMission();
      }
    } else if (m.type === 'sequence' && m.subType === 'jump_objects') {
      const expectedId = m.steps[m.stepIndex];
      if (player.stoodOnObjectId === expectedId) {
        m.stepIndex += 1;
        if (m.stepIndex >= m.steps.length) {
          this.completeActiveMission();
        }
      }
    }
  }

  startMission(m) {
    m.started = true;
    m.progress = 0;
    m.holdProgress = 0;
    m.graceTimer = m.type === 'dont_move' ? 0.55 : 0;
    m.stepIndex = 0;
    m.timeLeft = m.timeLimit || 0;
    this.activeMission = m;
    this.hintTimer = 0;
    if (typeof m.checkpointX === 'number') {
      this.checkpointX = m.checkpointX;
    }
    this.callbacks.onSpeak(m.text, 3);
  }

  onPlayerJump() {
    if (!this.activeMission || this.activeMission.type !== 'jump_count') return;
    this.activeMission.progress += 1;
    if (this.activeMission.progress >= (this.activeMission.targetCount || 3)) {
      this.completeActiveMission();
    }
  }

  onPlayerDamaged() {
    if (!this.activeMission) return;
    if (this.activeMission.type === 'dodge_shots') {
      this.activeMission.holdProgress = 0;
    }
  }

  onCoinCollected(coinObj) {
    if (!this.activeMission) return;
    if (this.activeMission.type === 'collect_coins') {
      this.activeMission.progress += 1;
      if (this.activeMission.progress >= (this.activeMission.targetCount || 3)) {
        this.completeActiveMission();
      }
    } else if (this.activeMission.type === 'collect_specific_coin') {
      if (coinObj && coinObj.id === this.activeMission.targetId) {
        this.completeActiveMission();
      }
    }
  }

  onStarCollected(starObj) {
    if (!this.activeMission || this.activeMission.type !== 'collect_star') return true;
    if (starObj.color === this.activeMission.targetColor) {
      this.completeActiveMission();
      return true;
    }
    this.triggerFail('Wrong color!');
    return false;
  }

  onSwitchHit(switchObj) {
    if (!this.activeMission) return false;
    const m = this.activeMission;
    if (m.type === 'shoot_switch') {
      const matched =
        (m.targetId && switchObj.id === m.targetId) ||
        (m.targetColor && switchObj.color === m.targetColor);
      if (matched) {
        switchObj.activated = true;
        this.completeActiveMission();
        return true;
      }
      this.triggerFail('Wrong switch!');
      return false;
    }
    if (m.type === 'sequence' && m.subType === 'shoot_switches') {
      const expectedColor = m.steps[m.stepIndex];
      if (switchObj.color === expectedColor) {
        switchObj.activated = true;
        m.stepIndex += 1;
        if (m.stepIndex >= m.steps.length) {
          this.completeActiveMission();
        }
        return true;
      }
      // Reset sequence on wrong order
      m.stepIndex = 0;
      this.triggerFail('Wrong order!');
      return false;
    }
    return false;
  }

  onKeyCollected(keyId) {
    if (!this.activeMission || this.activeMission.type !== 'collect_key') return;
    if (!this.activeMission.targetId || this.activeMission.targetId === keyId) {
      this.completeActiveMission();
    }
  }

  onObjectBroken(objId) {
    if (!this.activeMission) return;
    if (this.activeMission.type !== 'break_rock' && this.activeMission.type !== 'break_object') {
      return;
    }
    if (!this.activeMission.targetId || this.activeMission.targetId === objId) {
      this.completeActiveMission();
    }
  }

  onEnemyHit(enemy) {
    if (!this.activeMission || this.activeMission.type !== 'defeat_enemy_type') return;
    const m = this.activeMission;
    if (m.forbiddenEnemyType && enemy.type === m.forbiddenEnemyType) {
      this.triggerFail('Wrong target!');
    } else if (m.forbiddenIds && m.forbiddenIds.includes(enemy.id)) {
      this.triggerFail('Wrong target!');
    }
  }

  onEnemyDefeated(enemy) {
    if (!this.activeMission || this.activeMission.type !== 'defeat_enemy_type') return;
    const m = this.activeMission;
    const idMatch = m.targetId ? enemy.id === m.targetId : true;
    const typeMatch = m.targetType ? enemy.type === m.targetType : true;
    if (idMatch && typeMatch) {
      m.progress += 1;
      if (m.progress >= (m.targetCount || 1)) {
        this.completeActiveMission();
      }
    }
  }

  completeActiveMission() {
    if (!this.activeMission) return;
    const m = this.activeMission;
    m.completed = true;
    this.activeMission = null;
    this.hintTimer = 0;

    const praise = PRAISE_PHRASES[this.praiseIndex % PRAISE_PHRASES.length];
    this.praiseIndex += 1;
    this.callbacks.onMissionSuccess(m, praise);
  }

  triggerFail(reason = '') {
    const encourage = ENCOURAGE_PHRASES[this.encourageIndex % ENCOURAGE_PHRASES.length];
    this.encourageIndex += 1;
    this.callbacks.onMissionFail(encourage, reason);
  }
}
