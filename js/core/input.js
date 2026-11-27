export class InputManager {
  constructor() {
    this.keys = new Set();
    this.justPressed = new Set();
    this.justReleased = new Set();

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onBlur = this.onBlur.bind(this);

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
  }

  onKeyDown(e) {
    const prevented = [
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Space',
    ];
    if (prevented.includes(e.code)) {
      e.preventDefault();
    }
    if (!this.keys.has(e.code)) {
      this.justPressed.add(e.code);
    }
    this.keys.add(e.code);
  }

  onKeyUp(e) {
    if (this.keys.has(e.code)) {
      this.justReleased.add(e.code);
    }
    this.keys.delete(e.code);
  }

  onBlur() {
    this.keys.clear();
    this.justPressed.clear();
    this.justReleased.clear();
  }

  endFrame() {
    this.justPressed.clear();
    this.justReleased.clear();
  }

  isDown(codes) {
    return codes.some((c) => this.keys.has(c));
  }

  wasPressed(codes) {
    return codes.some((c) => this.justPressed.has(c));
  }

  wasReleased(codes) {
    return codes.some((c) => this.justReleased.has(c));
  }

  get left() {
    return this.isDown(['ArrowLeft', 'KeyA']);
  }

  get right() {
    return this.isDown(['ArrowRight', 'KeyD']);
  }

  get jumpHeld() {
    return this.isDown(['Space', 'ArrowUp', 'KeyW']);
  }

  get jumpPressed() {
    return this.wasPressed(['Space', 'ArrowUp', 'KeyW']);
  }

  get jumpReleased() {
    return this.wasReleased(['Space', 'ArrowUp', 'KeyW']);
  }

  get shootHeld() {
    return this.isDown(['KeyZ']);
  }

  get shootPressed() {
    return this.wasPressed(['KeyZ']);
  }

  get shootReleased() {
    return this.wasReleased(['KeyZ']);
  }

  get replayPressed() {
    return this.wasPressed(['KeyR']);
  }

  get hintPressed() {
    return this.wasPressed(['KeyH']);
  }

  get pausePressed() {
    return this.wasPressed(['Escape', 'KeyP']);
  }
}
