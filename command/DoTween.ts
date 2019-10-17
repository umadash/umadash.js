import { Tween } from "./../tween/Tween";
import Easing, { EasingFunction } from "./../tween/Easing";
import Command from "./Command";

export default class DoTween extends Command {
  private target: any;
  private to: any;
  private from: any;
  private duration: number;
  private easing: EasingFunction;
  private onStart: () => void;
  private onUpdate: () => void;
  private onComplete: () => void;
  private tween: Tween;

  constructor(target: any, to: any, from: any = null, duration = 1000, easing = Easing.linear, onStart = null, onUpdate = null, onComplete = null) {
    super();

    this.target = target;
    this.to = to;
    this.from = from;
    this.duration = duration;
    this.easing = easing;
    this.onStart = onStart;
    this.onUpdate = onUpdate;
    this.onComplete = onComplete;

    if (onComplete === null) {
      if (onUpdate) this.onComplete = onUpdate;
    }
  }

  execute() {
    if (this.onStart) this.onStart();

    if (this.duration > 0) {
      this.tween = new Tween(this.target, this.to, this.from, this.duration, this.easing, this.onStart, this.onUpdate, this.onComplete);
      this.tween.start();
    } else {
      const keys = Object.keys(this.to);
      for (let i = 0, len = keys.length; i < len; i += 1) {
        const key = keys[i];
        this.target[key] = this.to[key];
      }
      if (this.onComplete) this.onComplete();
    }

    this.complete();
  }

  interrupt() {
    if (this.tween) {
      this.tween.stop();
      this.tween = null;
    }
  }
}
