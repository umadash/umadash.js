import { EventDispatcher } from './../event/EventDispatcher';

export class Command extends EventDispatcher {

  // --------------------------------------------------
  //
  // MEMBER
  //
  // --------------------------------------------------
  public static Complete: string = 'complete';


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
    this.dispatchEvent(Command.Complete);
  }
}