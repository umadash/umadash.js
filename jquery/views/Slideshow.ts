import { EventDispatcher } from "../../events/EventDispatcher";

export default class Slideshow extends EventDispatcher {
  public static Change: string = "Change";

  public $elm: JQuery;
  private srcs: string[];
  private interval: number;
  private shuffle: boolean;
  private attr: string;

  private currentIndex: number;
  private timer: number;
  private loader: HTMLImageElement;

  private wait: boolean;

  constructor($elm: JQuery, interval: number = 5000, shuffle: boolean = false, attr: string = "data-srcs") {
    super();

    this.$elm = $elm;
    this.interval = interval;
    this.shuffle = shuffle;
    this.attr = attr;

    this.init();
  }

  private init(): void {
    const srcs: string[] = this.$elm.attr(this.attr).split(",");
    this.srcs = srcs || [];

    this.currentIndex = -1;
    this.timer = -1;
    this.wait = false;

    // shuffle
    if (this.shuffle) {
      this.srcs.sort(() => {
        return Math.random() - 0.5;
      });
    }
  }

  private loadImage(url: string, onComplete: () => void, onError: () => void = null): HTMLImageElement {
    const image: HTMLImageElement = new Image();
    image.onload = onComplete;
    if (onError) {
      image.onerror = onError;
    }
    image.src = url;
    return image;
  }

  private startTimer(): void {
    this.timer = window.setTimeout(this.timerHandler, this.interval);
  }

  private timerHandler = (): void => {
    if (this.wait) {
      this.next();
    } else {
      this.wait = true;
    }
  };

  private stopTimer(): void {
    if (this.timer !== -1) {
      clearTimeout(this.timer);
      this.timer = -1;
    }
  }

  private loadNextImage(): void {
    const nextIndex: number = this.currentIndex + 1;
    if (nextIndex < this.srcs.length) {
      const url: string = this.srcs[nextIndex];
      this.loader = this.loadImage(
        url,
        // Success
        () => {
          // ロードよみ込完了で待機をしていたら次へ
          if (this.wait) {
            this.next();
          } else {
            this.wait = true;
          }
        },
        // Error
        () => {
          // 読み込みに失敗したurlを削除する
          this.srcs.splice(nextIndex, 1);

          // 更に次の画像を再読込
          this.loadNextImage();
        }
      );
    } else {
      this.wait = true;
    }
  }

  private getNextIndex(): number {
    const nextIndex: number = this.currentIndex + 1;
    if (nextIndex >= this.srcs.length) {
      return 0;
    }
    return nextIndex;
  }

  public start(): void {
    this.stop();

    if (this.srcs.length > 0) {
      this.next();
    } else {
      console.warn("Slideshow does not have img srcs. You must set img srcs by 'setSrcs' method.");
    }
  }

  public stop(): void {
    this.stopTimer();
  }

  public next(): void {
    const nextIndex: number = this.getNextIndex();

    this.show(this.srcs[nextIndex]);
    this.dispatchEventType<ISlideshowData>(Slideshow.Change, this, { next: nextIndex, prev: this.currentIndex });
    this.currentIndex = nextIndex;

    this.wait = false;
    this.loadNextImage();
    this.startTimer();
  }

  private show(url: string): void {
    this.$elm.css({
      "background-image": `url(${url})`
    });
  }

  public setSrcs(srcs: string[]): void {
    this.srcs = srcs;
  }
}

export interface ISlideshowData {
  next: number;
  prev: number;
}
