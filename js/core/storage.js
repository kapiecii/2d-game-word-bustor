const STORAGE_KEY = 'word_buster_save_v1';

const DEFAULT_SAVE = {
  character: 'boy',
  unlockedStages: ['forest-1'],
  clearedStages: [],
  highScores: {},
  totalCoins: 0,
  ownedItems: ['weapon_normal', 'suit_red', 'acc_none'],
  equipped: {
    weapon: 'weapon_normal',
    suit: 'suit_red',
    accessory: 'acc_none',
  },
  settings: {
    voiceEnabled: true,
    voiceSpeed: 'normal',
  },
};

export class StorageManager {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(DEFAULT_SAVE);
      const parsed = JSON.parse(raw);
      return {
        ...structuredClone(DEFAULT_SAVE),
        ...parsed,
        ownedItems: Array.from(
          new Set([...DEFAULT_SAVE.ownedItems, ...(parsed.ownedItems || [])])
        ),
        equipped: {
          ...DEFAULT_SAVE.equipped,
          ...(parsed.equipped || {}),
        },
        settings: {
          ...DEFAULT_SAVE.settings,
          ...(parsed.settings || {}),
        },
      };
    } catch {
      return structuredClone(DEFAULT_SAVE);
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch {
      // Ignore storage quota errors
    }
  }

  getCharacter() {
    return this.data.character;
  }

  setCharacter(char) {
    this.data.character = char === 'girl' ? 'girl' : 'boy';
    this.save();
  }

  getSettings() {
    return this.data.settings;
  }

  updateSettings(partial) {
    this.data.settings = { ...this.data.settings, ...partial };
    this.save();
  }

  getTotalCoins() {
    return this.data.totalCoins || 0;
  }

  addCoins(amount) {
    if (!amount || amount <= 0) return;
    this.data.totalCoins = (this.data.totalCoins || 0) + amount;
    this.save();
  }

  isOwned(itemId) {
    return this.data.ownedItems.includes(itemId);
  }

  getEquipped() {
    return { ...this.data.equipped };
  }

  buyItem(itemId, price) {
    if (this.isOwned(itemId)) return false;
    if (this.getTotalCoins() < price) return false;
    this.data.totalCoins -= price;
    this.data.ownedItems.push(itemId);
    this.save();
    return true;
  }

  equipItem(slot, itemId) {
    if (!this.isOwned(itemId)) return false;
    if (!['weapon', 'suit', 'accessory'].includes(slot)) return false;
    this.data.equipped[slot] = itemId;
    this.save();
    return true;
  }

  isUnlocked(stageId) {
    return this.data.unlockedStages.includes(stageId);
  }

  isCleared(stageId) {
    return this.data.clearedStages.includes(stageId);
  }

  getHighScore(stageId) {
    return this.data.highScores[stageId] || 0;
  }

  recordStageClear(stageId, score, nextStageId = null) {
    if (!this.data.clearedStages.includes(stageId)) {
      this.data.clearedStages.push(stageId);
    }
    if (score > (this.data.highScores[stageId] || 0)) {
      this.data.highScores[stageId] = score;
    }
    let newlyUnlocked = false;
    if (nextStageId && !this.data.unlockedStages.includes(nextStageId)) {
      this.data.unlockedStages.push(nextStageId);
      newlyUnlocked = true;
    }
    this.save();
    return newlyUnlocked;
  }
}
