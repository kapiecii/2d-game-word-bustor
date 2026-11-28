import { InputManager } from './core/input.js';
import { SpeechManager } from './core/speech.js';
import { AudioManager } from './core/audio.js';
import { StorageManager } from './core/storage.js';
import { Game } from './core/game.js';
import { HudController } from './ui/hud.js';
import { WORLDS, getStageData, getNextPlayableStageId } from './data/worlds.js';

const storage = new StorageManager();
const audio = new AudioManager();
const speech = new SpeechManager(storage.getSettings());
const input = new InputManager();

let currentStageId = null;
let screenState = 'title'; // 'title' | 'stages' | 'shop' | 'play' | 'pause' | 'clear'

const hud = new HudController({
  onSelectChar(char) {
    storage.setCharacter(char);
    hud.selectCharCard(char, storage.getEquipped());
    audio.coin();
  },
  onOpenStageSelect() {
    game.stop();
    screenState = 'stages';
    hud.renderWorldSelect(WORLDS, storage);
    hud.showScreen('stages');
  },
  onOpenShop() {
    game.stop();
    screenState = 'shop';
    hud.renderShop(storage);
    hud.showScreen('shop');
  },
  onShopTabChange() {
    hud.renderShop(storage);
  },
  onBuyItem(item) {
    if (storage.buyItem(item.id, item.price)) {
      storage.equipItem(item.slot, item.id);
      audio.missionSuccess();
      speech.speak(`Nice choice! ${item.name}!`, 3);
      hud.selectCharCard(storage.getCharacter(), storage.getEquipped());
      hud.renderShop(storage);
    }
  },
  onEquipItem(item) {
    if (storage.equipItem(item.slot, item.id)) {
      audio.coin();
      speech.speak(item.name, 2);
      hud.selectCharCard(storage.getCharacter(), storage.getEquipped());
      hud.renderShop(storage);
    }
  },
  onBackToTitle() {
    game.stop();
    screenState = 'title';
    hud.showScreen('title');
  },
  onSelectStage(stageId) {
    launchStage(stageId);
  },
  onTogglePause() {
    togglePause();
  },
  onResume() {
    if (screenState === 'pause') togglePause();
  },
  onRestart() {
    if (currentStageId) launchStage(currentStageId);
  },
  onNextStage() {
    const nextId = getNextPlayableStageId(currentStageId);
    if (nextId) launchStage(nextId);
  },
  onReplayVoice() {
    game.replayVoice();
  },
  onShowHint() {
    game.showHint();
  },
  onChangeSpeed(speed) {
    storage.updateSettings({ voiceSpeed: speed });
    speech.setSpeed(speed);
    hud.syncSettingsUI(storage.getSettings());
    speech.speak(speed === 'slow' ? 'Slow voice.' : 'Normal voice.', 3);
  },
  onChangeVoice(enabled) {
    storage.updateSettings({ voiceEnabled: enabled });
    speech.setEnabled(enabled);
    hud.syncSettingsUI(storage.getSettings());
    if (enabled) speech.speak('Voice on!', 3);
  },
});

const game = new Game({
  canvas: document.getElementById('game-canvas'),
  input,
  speech,
  audio,
  hud,
  onPauseToggle: () => togglePause(),
  onStageClear: ({ stageId, stageName, score, elapsed, coins }) => {
    const earnedCoins = coins + 3; // Stage coins + 3 clear bonus coins
    storage.addCoins(earnedCoins);
    const nextStageId = getNextPlayableStageId(stageId);
    const newlyUnlocked = storage.recordStageClear(stageId, score, nextStageId);
    const highScore = storage.getHighScore(stageId);
    screenState = 'clear';
    hud.showClearScreen({
      stageName,
      score,
      highScore,
      elapsed,
      coins: earnedCoins,
      praise: 'Awesome!',
      nextStageId,
      newlyUnlocked,
    });
  },
});

function launchStage(stageId) {
  const stageData = getStageData(stageId);
  if (!stageData) return;

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  currentStageId = stageId;
  screenState = 'play';
  const equipped = storage.getEquipped();
  hud.selectCharCard(storage.getCharacter(), equipped);
  hud.showScreen('play');
  audio.ensureContext();
  game.startStage(stageData, storage.getCharacter(), storage.getHighScore(stageId), equipped);
}

function togglePause() {
  if (screenState === 'play') {
    screenState = 'pause';
    game.setPaused(true);
    hud.showScreen('pause');
  } else if (screenState === 'pause') {
    screenState = 'play';
    game.setPaused(false);
    hud.showScreen('play');
  }
}

// Initial setup
hud.selectCharCard(storage.getCharacter(), storage.getEquipped());
hud.syncSettingsUI(storage.getSettings());
hud.showScreen('title');
