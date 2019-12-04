import { Tween, TweenCallbackFunction } from "./../tween/Tween";
import { Easing, EasingFunction } from "./../tween/Easing";
import Command from "./Command";

export default class DoTween extends Command {
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
    super();

    this.tweenTarget = tweenTarget;
    this.to = to;
    this.from = from;
    this.duration = duration;
    this.easing = easing;
    this.onStart = onStart;
    this.onUpdate = onUpdate;
    this.onComplete = onComplete;
  }

  protected implExecuteFunction(command: Command): void {
    this.tween = new Tween(this.tweenTarget, this.to, this.from, this.duration, this.easing, this.onStart, this.onUpdate, (progressTime: number, progressValue: number) => {
      if (this.onComplete) this.onComplete(progressTime, progressValue);
      this.notifyComplete();
    });
    this.tween.start();
  }

  protected implInterruptFunction(command: Command): void {
    if (this.tween) {
      this.tween.cancel();
      this.tween = null;
    }
  }

  protected implDestroyFunction(command: Command): void {
    if (this.tween) {
      this.tween.cancel();
      this.tween = null;
    }

    this.tweenTarget = null;
    this.to = null;
    this.from = null;
    this.duration = null;
    this.easing = null;
    this.onStart = null;
    this.onUpdate = null;
    this.onComplete = null;
  }

  // --------------------------------------------------
  //
  // MEMBER
  //
  // --------------------------------------------------
  private tween: Tween;

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
}
