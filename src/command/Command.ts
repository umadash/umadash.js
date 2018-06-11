import { EventDispatcher } from './../event/EventDispatcher';
import { EventName } from '../var/EventName';

export class Command extends EventDispatcher {
  constructor() {
    super();
  }

  public execute(): void {}
  public interrupt(): void {}
  public complete(): void {
    this.notifyComplete();
  }

  protected notifyComplete() {
    this.dispatchEvent(EventName.Complete);
  }
}