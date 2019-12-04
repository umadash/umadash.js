import { EventDispatcher } from "../events/EventDispatcher";
import Event from "../events/Event";

export class WindowWatcher extends EventDispatcher {
  public static Scroll: string = "scroll";
  public static Resize: string = "resize";
  public static VerticalResize: string = "verticalResize";
  public static HorizontalResize: string = "horizontalResize";

  private prevScrollTop: number;
  private prevWindowWidth: number;
  private prevWindowHeight: number;

  private hasStarted: boolean;

  private constructor() {
    super();

    this.init();
  }

  private init(): void {
    this.hasStarted = false;
    this.prevScrollTop = -1;
  }

  public start(): void {
    if (this.hasStarted) return;
    this.hasStarted = true;

    this.prevScrollTop = window.pageYOffset;
    this.prevWindowWidth = window.innerWidth;
    this.prevWindowHeight = window.innerHeight;

    window.addEventListener(WindowWatcher.Resize, this.resizeHandler);
    window.addEventListener(WindowWatcher.Scroll, this.scrollHandler);
  }

  private resizeHandler = (event): void => {
    const windowWidth: number = window.innerWidth;
    const windowHeight: number = window.innerHeight;

    const horizontalChange = windowWidth != this.prevWindowWidth;
    const verticalChange = windowHeight != this.prevWindowHeight;
    if (horizontalChange || verticalChange) this.dispatchEventType(WindowWatcher.Resize);
    if (horizontalChange) this.dispatchEventType(WindowWatcher.HorizontalResize);
    if (verticalChange) this.dispatchEventType(WindowWatcher.VerticalResize);

    this.prevWindowWidth = windowWidth;
    this.prevWindowHeight = windowHeight;
  };

  private scrollHandler = (event): void => {
    const scrollTop: number = window.pageYOffset;
    this.dispatchEvent(
      new ScrollEvent({
        scrollTop,
        prevScrollTop: this.prevScrollTop
      })
    );

    this.prevScrollTop = scrollTop;
  };

  public stop(): void {
    window.removeEventListener(WindowWatcher.Resize, this.resizeHandler);
    window.removeEventListener(WindowWatcher.Scroll, this.scrollHandler);

    this.prevScrollTop = -1;
    this.hasStarted = false;
  }

  private static instance: WindowWatcher;
  public static getInstance(): WindowWatcher {
    if (!this.instance) {
      this.instance = new WindowWatcher();
    }
    return this.instance;
  }
}

/**
 * Scroll
 */

interface IScrollEventData {
  scrollTop: number;
  prevScrollTop: number;
}

export class ScrollEvent extends Event {
  constructor(data: IScrollEventData) {
    super(WindowWatcher.Scroll, null, data);
  }

  public getScrollData(): IScrollEventData {
    return this.getData();
  }

  public getDiff(): number {
    const data: IScrollEventData = this.getScrollData();
    return data.scrollTop - data.prevScrollTop;
  }

  public getDown(): boolean {
    return this.getDiff() >= 0;
  }
}
