import { EventDispatcher } from "../events/EventDispatcher";
import Event from "../events/Event";

export class KeyboardWatcher extends EventDispatcher {
  private constructor() {
    super();

    this.init();
  }

  private init(): void {
    this.enableKeyboardControl = true;
  }

  public start(): void {
    window.addEventListener(KeyboardEvent.KeyDown, this.keyDownHandler);
  }

  public stop(): void {
    window.removeEventListener(KeyboardEvent.KeyDown, this.keyDownHandler);
  }

  private enableKeyboardControl: boolean;
  public setEnableKeyboardControl(enable: boolean) {
    this.enableKeyboardControl = enable;
  }

  private keyDownHandler = e => {
    this.dispatchEvent(new KeyboardEvent(KeyboardEvent.KeyDown, { keyCode: e.keyCode }));
  };

  private static instance: KeyboardWatcher;
  public static getInstance(): KeyboardWatcher {
    if (!this.instance) {
      this.instance = new KeyboardWatcher();
    }
    return this.instance;
  }
}

export interface IKeyboardEventData {
  keyCode: number;
}

export class KeyboardEvent<IKeyboardEventData> extends Event {
  public static KeyDown: string = "keydown";

  constructor(eventName: string, data: IKeyboardEventData) {
    super(eventName, null, data);
  }
}
