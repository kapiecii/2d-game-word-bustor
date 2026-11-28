// Web Speech API controller with en-US priority, Slow/Normal speed, and strict mission lock:
// Priority 3: Navigator mission instructions, praise, encouragement (highest, interrupts all)
// Priority 2: Object interactions (Coin, Key, Slime, Bat, Rock, Open, Goal)
// Priority 1: Player action voices (Run, Jump, Shoot, Charge, Big shot)
// While a Priority 3 (mission/navigator) voice is playing, ALL other voices (Priority 1 & 2) are muted.

export class SpeechManager {
  constructor(settings = { voiceEnabled: true, voiceSpeed: 'normal' }) {
    this.supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    this.voiceEnabled = settings.voiceEnabled ?? true;
    this.voiceSpeed = settings.voiceSpeed ?? 'normal';
    this.selectedVoice = null;

    this.currentPriority = 0;
    this.isSpeaking = false;
    this.missionActive = false;
    this.missionSafetyTimer = null;
    this.utteranceSeq = 0;
    this.activeUtteranceId = 0;
    this.currentUtterance = null; // Prevent Chrome GC bug dropping onend

    this.lastActionSpokenAt = 0;
    this.lastActionWord = '';

    if (this.supported) {
      this.pickVoice();
      window.speechSynthesis.addEventListener('voiceschanged', () => this.pickVoice());
    }
  }

  pickVoice() {
    if (!this.supported) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    const enUS = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('en-us'));
    const preferredNames = [
      'Google US English',
      'Samantha',
      'Alex',
      'Aaron',
      'Microsoft Aria',
      'Microsoft Jenny',
    ];

    for (const name of preferredNames) {
      const match = enUS.find((v) => v.name.includes(name));
      if (match) {
        this.selectedVoice = match;
        return;
      }
    }
    this.selectedVoice =
      enUS[0] ||
      voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en')) ||
      voices[0];
  }

  setEnabled(enabled) {
    this.voiceEnabled = Boolean(enabled);
    if (!this.voiceEnabled) {
      this.stop();
    }
  }

  setSpeed(speed) {
    this.voiceSpeed = speed === 'slow' ? 'slow' : 'normal';
  }

  isMissionSpeaking() {
    if (!this.supported) return false;
    return this.missionActive;
  }

  clearMissionTimer() {
    if (this.missionSafetyTimer) {
      clearTimeout(this.missionSafetyTimer);
      this.missionSafetyTimer = null;
    }
  }

  stop() {
    if (!this.supported) return;
    this.clearMissionTimer();
    this.utteranceSeq += 1;
    this.activeUtteranceId = this.utteranceSeq;
    window.speechSynthesis.cancel();
    this.isSpeaking = false;
    this.missionActive = false;
    this.currentPriority = 0;
    this.currentUtterance = null;
  }

  speak(text, priority = 1) {
    if (!this.supported || !this.voiceEnabled || !text) return;

    const now = performance.now();

    // While a mission/navigator voice (priority >= 3) is speaking, mute ALL other voices
    if (priority < 3 && this.isMissionSpeaking()) {
      return;
    }

    // Do not interrupt an ongoing higher-priority utterance
    if (this.isSpeaking && priority < this.currentPriority) {
      return;
    }

    // Prevent rapid-fire action voice spam
    if (priority === 1) {
      if (now - this.lastActionSpokenAt < 380 && this.lastActionWord === text) {
        return;
      }
      this.lastActionSpokenAt = now;
      this.lastActionWord = text;
    }

    // Advance sequence ID BEFORE cancel() so stale onerror/onend callbacks are ignored
    const myId = ++this.utteranceSeq;
    this.activeUtteranceId = myId;
    this.clearMissionTimer();

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    const rate = this.voiceSpeed === 'slow' ? 0.78 : 1.0;
    utterance.rate = rate;
    utterance.pitch = priority === 3 ? 1.08 : 1.02;

    this.currentUtterance = utterance;
    this.isSpeaking = true;
    this.currentPriority = priority;
    this.missionActive = priority >= 3;

    const finish = () => {
      if (this.activeUtteranceId !== myId) return;
      this.clearMissionTimer();
      this.isSpeaking = false;
      this.missionActive = false;
      this.currentPriority = 0;
      this.currentUtterance = null;
    };

    utterance.onend = finish;
    utterance.onerror = finish;

    // Fallback safety timer in case the browser drops the onend event
    if (priority >= 3) {
      const estimatedMs = Math.max(2500, Math.ceil((text.length * 110) / rate) + 1200);
      this.missionSafetyTimer = setTimeout(finish, estimatedMs);
    }

    window.speechSynthesis.speak(utterance);
  }
}
