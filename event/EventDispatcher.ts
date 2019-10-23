import Event from "./Event";

export type EventListener = (event: Event) => void;

export class EventDispatcher {
  // --------------------------------------------------
  //
  // CONSTRUCTOR
  //
  // --------------------------------------------------
  constructor(target: any = null) {
    this.target = target || this;
    this.listeners = {};
  }

  // --------------------------------------------------
  //
  // METHOD
  //
  // --------------------------------------------------
  public addEventListener(eventName: string, listener: EventListener): void {
    let listeners: EventListener[] = this.listeners[eventName];
    if (listeners) {
      const length: number = listeners.length;
      for (let i: number = 0; i < length; i++) {
        if (listeners[i] === listener) return;
      }
    } else {
      this.listeners[eventName] = listeners = [];
    }

    listeners.push(listener);
  }

  public removeEventListener(eventName: string, listener: EventListener): void {
    let listeners: EventListener[] = this.listeners[eventName];
    if (listeners) {
      const length: number = listeners.length;
      for (let i: number = 0; i < length; i++) {
        if (listeners[i] === listener) {
          listeners.splice(i, 1);
          break;
        }
      }

      if (listeners.length === 0) {
        delete this.listeners[eventName];
      }
    }
  }

  public removeAllEventListener(eventName: string = null): void {
    if (eventName) {
      delete this.listeners[eventName];
    } else {
      this.listeners = {};
    }
  }

  public hasEventListener(eventName: string): boolean {
    return this.listeners[eventName] !== null;
  }

  public dispatchEvent(event: Event): void {
    let listeners: EventListener[] = this.listeners[event.getName()];

    if (listeners) {
      const length: number = listeners.length;
      for (let i: number = 0; i < length; i++) {
        listeners[i].call(this.target, event);
      }
    }
  }

  public dispatchEventType<T = any>(type: string, target: Object = null, data: T = null): void {
    this.dispatchEvent(new Event<T>(type, target, data));
  }

  // --------------------------------------------------
  //
  // MEMBER
  //
  // --------------------------------------------------
  private target: any;
  private listeners: any;
}
