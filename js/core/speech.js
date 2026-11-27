// Web Speech API controller with en-US priority, Slow/Normal speed, and priority levels:
// Priority 3: Navigator mission instructions, praise, encouragement (highest, interrupts)
// Priority 2: Object interactions (Coin, Key, Slime, Bat, Rock, Open, Goal)
// Priority 1: Player action voices (Run, Jump, Shoot, Charge, Big shot) - suppressed during priority 3

export class SpeechManager {
  constructor(settings = { voiceEnabled: true, voiceSpeed: 'normal' }) {
    this.supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    this.voiceEnabled = settings.voiceEnabled ?? true;
    this.voiceSpeed = settings.voiceSpeed ?? 'normal';
    this.selectedVoice = null;
    this.currentPriority = 0;
    this.isSpeaking = false;
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
    const preferredNames = ['Google US English', 'Samantha', 'Alex', 'Aaron', 'Microsoft Aria', 'Microsoft Jenny'];

    for (const name of preferredNames) {
      const match = enUS.find((v) => v.name.includes(name));
      if (match) {
        this.selectedVoice = match;
        return;
      }
    }
    this.selectedVoice = enUS[0] || voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en')) || voices[0];
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

  stop() {
    if (!this.supported) return;
    window.speechSynthesis.cancel();
    this.isSpeaking = false;
    this.currentPriority = 0;
  }

  speak(text, priority = 1) {
    if (!this.supported || !this.voiceEnabled || !text) return;

    const now = performance.now();

    // Suppress player action voice while a mission/navigator voice is speaking
    if (priority === 1 && this.isSpeaking && this.currentPriority >= 3) {
      return;
    }

    // Prevent rapid-fire action spam
    if (priority === 1) {
      if (now - this.lastActionSpokenAt < 380 && this.lastActionWord === text) {
        return;
      }
      this.lastActionSpokenAt = now;
      this.lastActionWord = text;
    }

    // Do not interrupt a higher-priority utterance
    if (this.isSpeaking && priority < this.currentPriority) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = this.voiceSpeed === 'slow' ? 0.78 : 1.0;
    utterance.pitch = priority === 3 ? 1.08 : 1.02;

    this.isSpeaking = true;
    this.currentPriority = priority;

    utterance.onend = () => {
      if (this.currentPriority === priority) {
        this.isSpeaking = false;
        this.currentPriority = 0;
      }
    };
    utterance.onerror = () => {
      this.isSpeaking = false;
      this.currentPriority = 0;
    };

    window.speechSynthesis.speak(utterance);
  }
}
