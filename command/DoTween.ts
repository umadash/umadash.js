import Tween from "./../tween/Tween";
import Easing, { EasingFunction } from "./../tween/Easing";
import Command from "./Command";

export default class DoTween extends Command {
  constructor(
    object: Object,
    to: any,
    from: any = null,
    duration = 1000,
    easing: EasingFunction = Easing.linear,
    startFunction: Function = null,
    updateFunction: Function = null,
    completeFunction: Function = null
  ) {
    super();

    this.object = object;
    this.to = to;
    this.from = from;
    this.duration = duration;
    this.easing = easing;
    this.startFunction = startFunction;
    this.updateFunction = updateFunction;
    this.completeFunction = completeFunction;
  }

  protected implExecuteFunction(command: Command): void {
    this.tween = new Tween(this.object, this.to, this.from, this.duration, this.easing, this.startFunction, this.updateFunction, this.completeFunction);
    this.tween.start();
    this.notifyComplete();
  }

  protected implInterruptFunction(command: Command): void {
    if (this.tween) {
      this.tween.stop();
    }
  }

  protected implDestroyFunction(command: Command): void {
    if (this.tween) {
      this.tween.stop();
      this.tween = null;
    }

    this.object = null;
    this.to = null;
    this.from = null;
    this.duration = null;
    this.easing = null;
    this.startFunction = null;
    this.updateFunction = null;
    this.completeFunction = null;
  }

  // --------------------------------------------------
  //
  // MEMBER
  //
  // --------------------------------------------------
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

  private startFunction: Function;
  public getStartFunction(): Function {
    return this.startFunction;
  }
  public setStartFunction(func: Function): void {
    this.startFunction = func;
  }

  private updateFunction: Function;
  public getUpdateFunction(): Function {
    return this.updateFunction;
  }
  public setUpdateFunction(func: Function): void {
    this.updateFunction = func;
  }

  private completeFunction: Function;
  public getCompleteFunction(): Function {
    return this.completeFunction;
  }
  public setCompleteFunction(func: Function): void {
    this.completeFunction = func;
  }

  private tween: Tween;
  public getTween(): Tween {
    return this.tween;
  }
}
