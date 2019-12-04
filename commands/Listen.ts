import Command from "./Command";
import { EventDispatcher } from "../events/EventDispatcher";
import Event from "../events/Event";

export default class Listen extends Command {
  constructor(eventDispatcher: EventDispatcher, eventName: string) {
    super();

    this.eventDispatcher = eventDispatcher;
    this.eventName = eventName;
  }

  // --------------------------------------------------
  //
  // METHODS
  //
  // --------------------------------------------------
  protected implExecuteFunction(command: Command): void {
    this.eventDispatcher.addEventListener(this.eventName, this.completeHandler);
  }

  protected implDestroyFunction(command: Command): void {
    this.eventDispatcher.removeEventListener(this.eventName, this.completeHandler);

    this.eventDispatcher = null;
    this.eventName = null;
  }

  private completeHandler = (event: Event): void => {
    this.notifyComplete();
  };

  // --------------------------------------------------
  //
  // MEMBER
  //
  // --------------------------------------------------
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
