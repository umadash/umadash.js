import Command from "./Command";
import { EventDispatcher } from "../events/EventDispatcher";
import Event from "../events/Event";

export default class Func extends Command {
  constructor(func: Function, args: any[] = [], eventDispatcher: EventDispatcher = null, eventName: string = null) {
    super();

    this.func = func;
    this.args = args;
    this.eventDispatcher = eventDispatcher;
    this.eventName = eventName;
  }

  protected implExecuteFunction(command: Command): void {
    if (this.eventDispatcher && this.eventName) {
      this.eventDispatcher.addEventListener(this.eventName, this.completeHandler);
      this.func.call(this, this.args);
    } else {
      this.func.call(this, this.args);
      this.notifyComplete();
    }
  }

  protected implInterruptFunction(command: Command): void {
    if (this.eventDispatcher && this.eventName) {
      this.eventDispatcher.removeEventListener(this.eventName, this.completeHandler);
    }
  }

  protected implDestroyFunction(command: Command): void {
    if (this.eventDispatcher && this.eventName) {
      this.eventDispatcher.removeEventListener(this.eventName, this.completeHandler);
    }

    this.eventDispatcher = null;
    this.eventName = null;
    this.func = null;
    this.args = null;
  }

  private completeHandler = (event: Event): void => {
    this.notifyComplete();
  };

  // --------------------------------------------------
  //
  // MEMBER
  //
  // --------------------------------------------------
  private func: Function;
  public getFunction(): Function {
    return this.func;
  }
  public setFunction(func: Function): void {
    this.func = func;
  }

  private args: any[];
  public getArguments(): any[] {
    return this.args;
  }
  public setArguments(args: any[]): void {
    this.args = args;
  }

  private eventDispatcher: EventDispatcher;
  public getEventDispatcher(): EventDispatcher {
    return this.eventDispatcher;
  }
  public setEventDispatcher(eventDispatcher: EventDispatcher): void {
    this.eventDispatcher = eventDispatcher;
  }

  private eventName: string;
  public getEventName(): string {
    return this.eventName;
  }
  public setEventName(eventName: string): void {
    this.eventName = eventName;
  }
}
