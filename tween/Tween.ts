import { Easing, EasingFunction } from "./../tween/Easing";

export type TweenCallbackFunction = (progressTime: number, progressValue: number) => void;

export class Tween {
  public static FPS: number = 60;

  // --------------------------------------------------
  //
  // CONSTRUCTOR
  //
  // --------------------------------------------------
  constructor(
    tweenTarget: Object,
    to: Object,
    from: Object = null,
    duration: number = 1000,
    easing: EasingFunction = Easing.linear,
    onStart: TweenCallbackFunction = null,
    onUpdate: TweenCallbackFunction = null,
    onComplete: TweenCallbackFunction = null
  ) {
    this.tweenTarget = tweenTarget;
    this.to = to;
    this.from = from;
    this.duration = duration;
    this.easing = easing;
    this.onStart = onStart;
    this.onUpdate = onUpdate;
    this.onComplete = onComplete;

    this.startTime = 0;
    this.progressValue = 0;
    this.progressTime = 0;
    this.timer = -1;
  }

  // --------------------------------------------------
  //
  // METHOD
  //
  // --------------------------------------------------
  private apply(timeRatio: number): void {
    this.progressTime = timeRatio;
    const progressValue: number = this.easing(timeRatio);

    const keys: string[] = Object.keys(this.to);
    const nKeys: number = keys.length;

    for (let i: number = 0; i < nKeys; ++i) {
      const key: string = keys[i];
      const value0 = this.internalFrom[key];
      this.tweenTarget[key] = value0 + (this.to[key] - value0) * progressValue;
    }

    this.progressValue = progressValue;
  }

  public start(): void {
    this.cancel();

    // set initial values
    this.internalFrom = {};
    const keys: string[] = Object.keys(this.to);
    const nKeys: number = keys.length;
    for (let i: number = 0; i < nKeys; ++i) {
      const key: string = keys[i];
      this.internalFrom[key] = this.from && this.from[key] !== null ? this.from[key] : this.tweenTarget[key];
    }

    if (this.duration > 0) {
      this.timer = window.setInterval(this.intervalHandler, 1000 / Tween.FPS);
      this.startTime = Date.now();
      this.apply(0);
      if (this.onStart) this.onStart(this.progressTime, this.progressValue);
    } else {
      this.apply(0);
      if (this.onStart) this.onStart(this.progressTime, this.progressValue);
      this.apply(1);
      if (this.onUpdate) this.onUpdate(this.progressTime, this.progressValue);
      if (this.onComplete) this.onComplete(this.progressTime, this.progressValue);
    }
  }

  public cancel(): void {
    if (this.timer !== -1) {
      window.clearInterval(this.timer);
      this.timer = -1;
    }
  }

  private intervalHandler: () => void = () => {
    const elapsedTime: number = new Date().getTime() - this.startTime;
    if (elapsedTime < this.duration) {
      this.apply(elapsedTime / this.duration);
      if (this.onUpdate) this.onUpdate(this.progressTime, this.progressValue);
    } else {
      this.apply(1);
      this.cancel();
      if (this.onUpdate) this.onUpdate(this.progressTime, this.progressValue);
      if (this.onComplete) this.onComplete(this.progressTime, this.progressValue);
    }
  };

  // --------------------------------------------------
  //
  // MEMBER
  //
  // --------------------------------------------------
  private tweenTarget: Object;
  public getTweenTarget(): Object {
    return this.tweenTarget;
  }
  public setTweenTarget(object: Object): void {
    this.tweenTarget = object;
  }

  private to: any;
  public getTo(): any {
    return this.to;
  }
  public setTo(to: any): void {
    this.to = to;
  }

  private from: any;
  public getFrom(): any {
    return this.from;
  }
  public setFrom(from: any): void {
    this.from = from;
  }

  private duration: number;
  public getDuration(): number {
    return this.duration;
  }
  public setDuration(duration: number): void {
    this.duration = duration;
  }

  private easing: EasingFunction;
  public getEasing(): EasingFunction {
    return this.easing;
  }
  public setEasing(easing: EasingFunction): void {
    this.easing = easing;
  }

  private progressValue: number;
  public getProgressValue(): number {
    return this.progressValue;
  }

  private progressTime: number;
  public getProgressTime(): number {
    return this.progressTime;
  }

  private onStart: TweenCallbackFunction;
  public getOnStartCallbackFunction(): TweenCallbackFunction {
    return this.onStart;
  }
  public setOnStartCallbackFunction(callback: TweenCallbackFunction): void {
    this.onStart = callback;
  }

  private onUpdate: TweenCallbackFunction;
  public getOnUpdateCallbackFunction(): TweenCallbackFunction {
    return this.onUpdate;
  }
  public setOnUpdateCallbackFunction(callback: TweenCallbackFunction): void {
    this.onUpdate = callback;
  }

  private onComplete: TweenCallbackFunction;
  public getOnCompleteCallbackFunction(): TweenCallbackFunction {
    return this.onComplete;
  }
  public setOnCompleteCallbackFunction(callback: TweenCallbackFunction): void {
    this.onComplete = callback;
  }

  private internalFrom: any;
  private startTime: number;
  private timer: any;
}
