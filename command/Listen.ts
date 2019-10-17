import Command from "./Command";
import { EventDispatcher, EventListener } from "../event/EventDispatcher";

export class Listen extends Command {
  constructor(target: EventDispatcher, eventName: string) {
    super();

    this.target = target;
    this.eventName = eventName;
  }

  public execute(): void {
    this.listener = () => {
      this.target.removeEventListener(this.eventName, this.listener);
      this.complete();
    };
    this.target.addEventListener(this.eventName, this.listener);
  }

  public interrupt(): void {
    this.target.removeEventListener(this.eventName, this.listener);
  }

  private target: EventDispatcher;
  private eventName: string;
  private listener: () => void;
}
