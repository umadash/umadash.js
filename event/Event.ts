import { EventDispatcher } from "./EventDispatcher";

export default class Event {
  private name: string;
  private data: any | null;
  private target: EventDispatcher;

  constructor(name: string, data: any | null = null) {
    this.name = name;
    this.data = data;
  }

  public setTarget(target): void {
    this.target = target;
  }

  public getName(): string {
    return this.name;
  }

  public getData(): any | null {
    return this.data;
  }
}
