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
      return this.normalizeData(JSON.parse(raw));
    } catch {
      return structuredClone(DEFAULT_SAVE);
    }
  }

  normalizeData(parsed) {
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Invalid save object');
    }
    const unlocked = new Set(
      Array.isArray(parsed.unlockedStages)
        ? parsed.unlockedStages.filter((s) => typeof s === 'string')
        : DEFAULT_SAVE.unlockedStages
    );
    unlocked.add('forest-1');
    // Backward compatibility: if a player already unlocked <world>-3, also unlock newly inserted <world>-2b
    ['forest', 'desert', 'snow', 'robot', 'ocean', 'volcano', 'sky'].forEach((w) => {
      if (unlocked.has(`${w}-3`)) {
        unlocked.add(`${w}-2b`);
      }
    });

    const cleared = Array.isArray(parsed.clearedStages)
      ? Array.from(new Set(parsed.clearedStages.filter((s) => typeof s === 'string')))
      : [];

    const highScores = {};
    if (parsed.highScores && typeof parsed.highScores === 'object' && !Array.isArray(parsed.highScores)) {
      for (const [k, v] of Object.entries(parsed.highScores)) {
        if (typeof v === 'number' && Number.isFinite(v) && v >= 0) {
          highScores[k] = Math.floor(v);
        }
      }
    }

    const totalCoins =
      typeof parsed.totalCoins === 'number' && Number.isFinite(parsed.totalCoins) && parsed.totalCoins >= 0
        ? Math.floor(parsed.totalCoins)
        : 0;

    const ownedItems = Array.from(
      new Set([
        ...DEFAULT_SAVE.ownedItems,
        ...(Array.isArray(parsed.ownedItems)
          ? parsed.ownedItems.filter((s) => typeof s === 'string')
          : []),
      ])
    );

    const rawEq = parsed.equipped && typeof parsed.equipped === 'object' ? parsed.equipped : {};
    const equipped = {
      weapon: ownedItems.includes(rawEq.weapon) ? rawEq.weapon : DEFAULT_SAVE.equipped.weapon,
      suit: ownedItems.includes(rawEq.suit) ? rawEq.suit : DEFAULT_SAVE.equipped.suit,
      accessory: ownedItems.includes(rawEq.accessory) ? rawEq.accessory : DEFAULT_SAVE.equipped.accessory,
    };

    const rawSet = parsed.settings && typeof parsed.settings === 'object' ? parsed.settings : {};
    const settings = {
      voiceEnabled: typeof rawSet.voiceEnabled === 'boolean' ? rawSet.voiceEnabled : DEFAULT_SAVE.settings.voiceEnabled,
      voiceSpeed: rawSet.voiceSpeed === 'slow' ? 'slow' : 'normal',
    };

    return {
      character: parsed.character === 'girl' ? 'girl' : 'boy',
      unlockedStages: Array.from(unlocked),
      clearedStages: cleared,
      highScores,
      totalCoins,
      ownedItems,
      equipped,
      settings,
    };
  }

  exportData() {
    const payload = {
      format: 'word-buster-save',
      version: 1,
      exportedAt: new Date().toISOString(),
      data: this.data,
    };
    return JSON.stringify(payload, null, 2);
  }

  importData(rawText) {
    try {
      const parsed = JSON.parse(rawText);
      const source =
        parsed && parsed.format === 'word-buster-save' && parsed.data
          ? parsed.data
          : parsed;
      const normalized = this.normalizeData(source);
      this.data = normalized;
      this.save();
      return { ok: true };
    } catch {
      return { ok: false, error: 'Invalid save data format.' };
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
