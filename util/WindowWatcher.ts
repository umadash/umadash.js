import { EventDispatcher } from "../event/EventDispatcher";
import Event from "../event/Event";

export class WindowWatcher extends EventDispatcher {
  private static instance: WindowWatcher;
  public static Scroll: string = "scroll";
  public static Resize: string = "resize";

  private onResizeHandler: () => void;
  private onScrollHandler: () => void;
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
    this.prevScrollTop = 0;
  }

  private onScroll(): void {
    const scrollTop: number = window.pageYOffset;
    this.dispatchEvent(
      new ScrollEvent({
        scrollTop,
        prevScrollTop: this.prevScrollTop
      })
    );

    this.prevScrollTop = scrollTop;
  }

  private onResize(): void {
    const windowWidth: number = window.innerWidth;
    const windowHeight: number = window.innerHeight;

    this.dispatchEvent(
      new ResizeEvent({
        windowWidth,
        windowHeight,
        horizontalChange: windowWidth != this.prevWindowWidth,
        verticalChange: windowHeight != this.prevWindowHeight
      })
    );

    this.prevWindowWidth = windowWidth;
    this.prevWindowHeight = windowHeight;
  }

  public start(): void {
    if (this.hasStarted) return;
    this.hasStarted = true;

    this.prevScrollTop = window.pageYOffset;
    this.prevWindowWidth = window.innerWidth;
    this.prevWindowHeight = window.innerHeight;

    this.onResizeHandler = this.onResize.bind(this);
    this.onScrollHandler = this.onScroll.bind(this);

    window.addEventListener(WindowWatcher.Resize, this.onResizeHandler);
    window.addEventListener(WindowWatcher.Scroll, this.onScrollHandler);
  }

  public stop(): void {
    window.removeEventListener(WindowWatcher.Resize, this.onResizeHandler);
    window.removeEventListener(WindowWatcher.Scroll, this.onScrollHandler);
    WindowWatcher.instance = null;

    this.onResizeHandler = null;
    this.onScrollHandler = null;

    this.hasStarted = false;
  }

  public static getInstance(): WindowWatcher {
    if (!this.instance) {
      this.instance = new WindowWatcher();
    }
    return this.instance;
  }
}

/**
 * Resize
 */
interface IResizeEventData {
  windowWidth: number;
  windowHeight: number;
  verticalChange: boolean;
  horizontalChange: boolean;
}

export class ResizeEvent extends Event {
  constructor(data: IResizeEventData) {
    super(WindowWatcher.Resize, data);
  }

  public getVerticalChange(): boolean {
    const data: IResizeEventData = this.getData();
    return data.verticalChange;
  }

  public getHorizontalChange(): boolean {
    const data: IResizeEventData = this.getData();
    return data.horizontalChange;
  }

  public getWindowWidth(): number {
    const data: IResizeEventData = this.getData();
    return data.windowWidth;
  }

  public getWindowHeight(): number {
    const data: IResizeEventData = this.getData();
    return data.windowHeight;
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
    super(WindowWatcher.Scroll, data);
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
