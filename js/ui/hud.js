import { getPlayerSprite, getBuddySprite } from '../render/sprites.js';

export class HudController {
  constructor(handlers) {
    this.handlers = handlers;

    // HUD elements
    this.hudEl = document.getElementById('hud');
    this.heartsEl = document.getElementById('hud-hearts');
    this.playerIconCanvas = document.getElementById('hud-player-icon');
    this.coinsEl = document.getElementById('hud-coins');
    this.scoreEl = document.getElementById('hud-score');
    this.highEl = document.getElementById('hud-high');
    this.timerEl = document.getElementById('hud-timer');
    this.btnSettings = document.getElementById('btn-settings');

    // Mission Banner
    this.bannerEl = document.getElementById('mission-banner');
    this.bannerBuddyCanvas = document.getElementById('banner-buddy-icon');
    this.missionTextEl = document.getElementById('mission-text');
    this.missionProgressEl = document.getElementById('mission-progress');
    this.missionJpEl = document.getElementById('mission-jp');
    this.timerWrapEl = document.getElementById('mission-timer-wrap');
    this.timerBarEl = document.getElementById('mission-timer-bar');
    this.timerSecEl = document.getElementById('mission-timer-sec');
    this.btnReplayVoice = document.getElementById('btn-replay-voice');
    this.btnHint = document.getElementById('btn-hint');

    // Screens & Modals
    this.screenTitle = document.getElementById('screen-title');
    this.screenStages = document.getElementById('screen-stages');
    this.modalSettings = document.getElementById('modal-settings');
    this.screenClear = document.getElementById('screen-clear');

    // Settings controls
    this.btnSpeedSlow = document.getElementById('btn-speed-slow');
    this.btnSpeedNormal = document.getElementById('btn-speed-normal');
    this.btnVoiceOn = document.getElementById('btn-voice-on');
    this.btnVoiceOff = document.getElementById('btn-voice-off');

    // Clear Screen elements
    this.clearBuddyCanvas = document.getElementById('clear-buddy-icon');
    this.clearPraiseEl = document.getElementById('clear-praise');
    this.clearTitleEl = document.getElementById('clear-title');
    this.clearScoreEl = document.getElementById('clear-score');
    this.clearHighEl = document.getElementById('clear-high');
    this.clearTimeEl = document.getElementById('clear-time');
    this.clearCoinsEl = document.getElementById('clear-coins');
    this.clearUnlockEl = document.getElementById('clear-unlock-msg');
    this.btnNextStage = document.getElementById('btn-next-stage');

    this.bindEvents();
    this.renderStaticIcons();
  }

  bindEvents() {
    // Character selection on Title
    document.querySelectorAll('.char-card').forEach((card) => {
      card.addEventListener('click', () => {
        const char = card.dataset.char;
        this.selectCharCard(char);
        this.handlers.onSelectChar(char);
      });
    });

    document.getElementById('btn-go-stages').addEventListener('click', () => {
      this.handlers.onOpenStageSelect();
    });

    document.getElementById('btn-back-title').addEventListener('click', () => {
      this.handlers.onBackToTitle();
    });

    this.btnSettings.addEventListener('click', () => this.handlers.onTogglePause());
    this.btnReplayVoice.addEventListener('click', () => this.handlers.onReplayVoice());
    this.btnHint.addEventListener('click', () => this.handlers.onShowHint());

    // Settings toggles
    this.btnSpeedSlow.addEventListener('click', () => this.handlers.onChangeSpeed('slow'));
    this.btnSpeedNormal.addEventListener('click', () => this.handlers.onChangeSpeed('normal'));
    this.btnVoiceOn.addEventListener('click', () => this.handlers.onChangeVoice(true));
    this.btnVoiceOff.addEventListener('click', () => this.handlers.onChangeVoice(false));

    document.getElementById('btn-resume').addEventListener('click', () => this.handlers.onResume());
    document.getElementById('btn-restart').addEventListener('click', () => this.handlers.onRestart());
    document.getElementById('btn-to-stages').addEventListener('click', () => this.handlers.onOpenStageSelect());

    this.btnNextStage.addEventListener('click', () => this.handlers.onNextStage());
    document.getElementById('btn-replay-stage').addEventListener('click', () => this.handlers.onRestart());
    document.getElementById('btn-clear-stages').addEventListener('click', () => this.handlers.onOpenStageSelect());
  }

  renderStaticIcons() {
    this.drawToCanvas(document.getElementById('preview-boy'), getPlayerSprite('boy', 'idle', false, 3));
    this.drawToCanvas(document.getElementById('preview-girl'), getPlayerSprite('girl', 'idle', false, 3));
    this.drawToCanvas(this.bannerBuddyCanvas, getBuddySprite(0, 'normal', false, 2));
    this.drawToCanvas(this.clearBuddyCanvas, getBuddySprite(0, 'happy', false, 3));
  }

  drawToCanvas(targetCanvas, sprite) {
    if (!targetCanvas || !sprite) return;
    const ctx = targetCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    const scale = Math.min(targetCanvas.width / sprite.width, targetCanvas.height / sprite.height);
    const dw = Math.floor(sprite.width * scale);
    const dh = Math.floor(sprite.height * scale);
    const dx = Math.floor((targetCanvas.width - dw) / 2);
    const dy = Math.floor((targetCanvas.height - dh) / 2);
    ctx.drawImage(sprite, dx, dy, dw, dh);
  }

  selectCharCard(charType) {
    document.querySelectorAll('.char-card').forEach((card) => {
      card.classList.toggle('selected', card.dataset.char === charType);
    });
    this.drawToCanvas(this.playerIconCanvas, getPlayerSprite(charType, 'idle', false, 1));
  }

  syncSettingsUI(settings) {
    this.btnSpeedSlow.classList.toggle('active', settings.voiceSpeed === 'slow');
    this.btnSpeedNormal.classList.toggle('active', settings.voiceSpeed !== 'slow');
    this.btnVoiceOn.classList.toggle('active', settings.voiceEnabled);
    this.btnVoiceOff.classList.toggle('active', !settings.voiceEnabled);
  }

  showScreen(name) {
    this.screenTitle.classList.toggle('hidden', name !== 'title');
    this.screenStages.classList.toggle('hidden', name !== 'stages');
    this.screenClear.classList.toggle('hidden', name !== 'clear');
    this.modalSettings.classList.toggle('hidden', name !== 'pause');

    const playing = name === 'play' || name === 'pause' || name === 'clear';
    this.hudEl.classList.toggle('hidden', !playing);
    if (!playing) {
      this.bannerEl.classList.add('hidden');
    }
  }

  renderWorldSelect(worlds, storage) {
    const grid = document.getElementById('worlds-grid');
    grid.innerHTML = '';

    for (const world of worlds) {
      const card = document.createElement('div');
      card.className = `world-card ${world.implemented ? '' : 'coming-soon'}`;

      const title = document.createElement('div');
      title.className = 'world-title';
      title.innerHTML = `
        <span>${world.name}</span>
        <span class="world-tag ${world.implemented ? '' : 'soon'}">
          ${world.implemented ? 'PLAYABLE' : 'COMING SOON'}
        </span>
      `;
      card.appendChild(title);

      const btnRow = document.createElement('div');
      btnRow.className = 'stage-buttons';

      for (const stage of world.stages) {
        const unlocked = world.implemented && storage.isUnlocked(stage.id);
        const cleared = storage.isCleared(stage.id);
        const high = storage.getHighScore(stage.id);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `stage-btn ${cleared ? 'cleared' : ''}`;
        btn.disabled = !unlocked;
        btn.innerHTML = `
          <span class="stage-btn-name">${stage.label}${stage.isBoss ? ' ★' : ''}</span>
          <span class="stage-btn-meta">${
            !world.implemented
              ? 'Locked'
              : !unlocked
              ? '🔒 Locked'
              : cleared
              ? `★ ${high}`
              : 'Play'
          }</span>
        `;
        if (unlocked) {
          btn.addEventListener('click', () => this.handlers.onSelectStage(stage.id));
        }
        btnRow.appendChild(btn);
      }

      card.appendChild(btnRow);
      grid.appendChild(card);
    }
  }

  updateHud({ lives, maxLives, coins, score, highScore, elapsed }) {
    // Hearts
    let heartsHtml = '';
    for (let i = 0; i < maxLives; i++) {
      heartsHtml += `<span class="heart ${i < lives ? 'full' : 'empty'}">♥</span>`;
    }
    this.heartsEl.innerHTML = heartsHtml;

    this.coinsEl.textContent = String(coins);
    this.scoreEl.textContent = String(score).padStart(5, '0');
    this.highEl.textContent = String(Math.max(score, highScore)).padStart(5, '0');
    this.timerEl.textContent = formatTime(elapsed);
  }

  updateMissionBanner(display, buddyMood = 'normal') {
    if (!display) {
      this.bannerEl.classList.add('hidden');
      return;
    }

    this.bannerEl.classList.remove('hidden');
    this.bannerEl.classList.toggle('boss-mode', Boolean(display.isBoss));
    this.missionTextEl.textContent = display.text;
    this.missionProgressEl.textContent = display.progressText || '';

    if (display.showHint && display.jp) {
      this.missionJpEl.textContent = display.jp;
      this.missionJpEl.classList.remove('hidden');
    } else {
      this.missionJpEl.classList.add('hidden');
    }

    if (display.timeLimit > 0) {
      this.timerWrapEl.classList.remove('hidden');
      const pct = Math.max(0, Math.min(100, (display.timeLeft / display.timeLimit) * 100));
      this.timerBarEl.style.width = `${pct}%`;
      this.timerBarEl.classList.toggle('urgent', display.timeLeft <= 6);
      this.timerSecEl.textContent = `${Math.ceil(display.timeLeft)}s`;
    } else {
      this.timerWrapEl.classList.add('hidden');
    }

    this.drawToCanvas(this.bannerBuddyCanvas, getBuddySprite(0, buddyMood, false, 2));
  }

  showClearScreen({ stageName, score, highScore, elapsed, coins, praise, nextStageId, newlyUnlocked }) {
    this.clearPraiseEl.textContent = praise || 'Awesome!';
    this.clearTitleEl.textContent = `${stageName} CLEAR!`;
    this.clearScoreEl.textContent = String(score);
    this.clearHighEl.textContent = String(Math.max(score, highScore));
    this.clearTimeEl.textContent = formatTime(elapsed);
    this.clearCoinsEl.textContent = String(coins);

    if (newlyUnlocked && nextStageId) {
      this.clearUnlockEl.textContent = `NEW STAGE UNLOCKED: ${nextStageId.toUpperCase()}!`;
      this.clearUnlockEl.classList.remove('hidden');
    } else if (!nextStageId) {
      this.clearUnlockEl.textContent = 'ALL 7 WORLDS COMPLETE! YOU ARE A WORD BUSTER!';
      this.clearUnlockEl.classList.remove('hidden');
    } else {
      this.clearUnlockEl.classList.add('hidden');
    }

    this.btnNextStage.classList.toggle('hidden', !nextStageId);
    this.showScreen('clear');
  }
}

export function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
