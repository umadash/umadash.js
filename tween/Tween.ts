import Easing, { EasingFunction } from "./../tween/Easing";
import { EventDispatcher } from "../event/EventDispatcher";

export default class Tween extends EventDispatcher {
  public static FPS: number = 60;

  // --------------------------------------------------
  //
  // CONSTRUCTOR
  //
  // --------------------------------------------------
  constructor(object: Object, to: object, from: object = null, duration: number = 1000, easing: any = Easing.linear, onStart: any = null, onUpdate: any = null, onComplete: any = null) {
    super();

    this.object = object;
    this.to = to;
    this.from = from;
    this.duration = duration;
    this.easing = easing;

    this.progressRate = 0;

    this.timer = -1;
    this.onStart = onStart;
    this.onUpdate = onUpdate;

    if (onComplete) {
      this.onComplete = onComplete;
    } else {
      if (onUpdate) this.onComplete = onUpdate;
    }
  }

  // --------------------------------------------------
  //
  // METHOD
  //
  // --------------------------------------------------
  public start(): void {
    // すでに開始されていたらストップ
    this.stop();
    if (this.onStart) this.onStart();

    const duration: number = this.duration;
    const keys = Object.keys(this.to);
    const nKeys = keys.length;

    if (duration > 0) {
      // オブジェクト更新要素

      // スタート時の値の保存
      this.begin = this.from;
      let first: any = this.object;
      if (this.from) {
        first = this.from;
      }
      for (let i = 0; i < nKeys; i += 1) {
        const key = keys[i];
        this.begin[key] = first[key];
      }

      // スタート
      // 開始時間
      this.startTime = Date.now();

      const update: () => void = () => {
        // 経過時間
        const past = Date.now() - this.startTime;

        // 進行度
        const rate = past / duration;
        this.progressRate = rate;

        // 途中か完了か
        const isComplete = rate >= 1;

        if (isComplete) {
          this.stop();

          for (let i = 0; i < nKeys; i += 1) {
            const key = keys[i];
            this.object[key] = this.to[key];
          }

          if (this.onUpdate) this.onUpdate();
          if (this.onComplete) this.onComplete();
        } else {
          const t = past * 0.001;
          const d = duration * 0.001;

          for (let i = 0; i < nKeys; i += 1) {
            const key = keys[i];
            const b = this.begin[key];
            const c = this.to[key] - b;
            const value = this.easing(t, b, c, d);
            this.object[key] = value;
          }

          if (this.onUpdate) this.onUpdate();
          this.timer = setInterval(update, 1000 / Tween.FPS);
        }
      };
    } else {
      for (let i = 0; i < nKeys; i += 1) {
        const key = keys[i];
        this.object[key] = this.to[key];
      }
      if (this.onComplete) this.onComplete();
    }
  }

  public stop(): void {
    if (this.timer !== -1) {
      clearInterval(this.timer);
      this.timer = -1;
    }
  }

  public getIsComplete(): boolean {
    return this.progressRate >= 1;
  }

  private object: Object;
  public getObject(): Object {
    return this.object;
  }
  public setObject(object: Object): void {
    this.object = object;
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

  private onStart: any;
  private onUpdate: any;
  private onComplete: any;

  private begin: any;
  private startTime: number;
  private timer: any;
  private progressRate: number;
}
