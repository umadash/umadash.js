import Event from "./Event";

export type EventListener = (event: Event) => void;

export class EventDispatcher {
  // --------------------------------------------------
  //
  // MEMBER
  //
  // --------------------------------------------------
  private listeners: any;

  // --------------------------------------------------
  //
  // CONSTRUCTOR
  //
  // --------------------------------------------------
  constructor() {
    this.listeners = {};
  }

  // --------------------------------------------------
  //
  // METHOD
  //
  // --------------------------------------------------
  public addEventListener(eventName: string, listener: EventListener): void {
    if (this.listeners[eventName] == null) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listener);
  }

  public removeEventListener(eventName: string, listener: EventListener = null): void {
    if (listener) {
      const eventListeners = this.listeners[eventName];
      if (eventListeners) {
        for (let i = 0, length = eventListeners.length; i < length; i += 1) {
          const l = eventListeners[i];
          if (l === listener) {
            eventListeners.splice(i, 1);
          }
        }
      }
    } else {
      if (this.listeners[eventName]) {
        this.listeners[eventName] = null;
      }
    }
  }

  public dispatchEvent(event: Event): void {
    event.setTarget(this);
    let listeners = this.listeners[event.getName()];
    if (listeners == null) return;

    for (var i = 0, length = listeners.length; i < length; i += 1) {
      var listener = listeners[i];
      if (listener) {
        listener(event);
      }
    }
  }

  public dispatchEventType(type: string, data: any = null): void {
    this.dispatchEvent(new Event(type, data));
  }
}
