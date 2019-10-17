import { EventDispatcher } from "./../event/EventDispatcher";

export default abstract class Command extends EventDispatcher {
  // --------------------------------------------------
  //
  // MEMBER
  //
  // --------------------------------------------------
  public static Complete: string = "complete";

  // --------------------------------------------------
  //
  // CONSTRUCTOR
  //
  // --------------------------------------------------
  constructor() {
    super();
  }

  // --------------------------------------------------
  //
  // METHOD
  //
  // --------------------------------------------------
  public execute(): void {}
  public interrupt(): void {}
  public complete(): void {
    this.notifyComplete();
  }

  protected notifyComplete() {
    this.dispatchEventType(Command.Complete);
  }
}
