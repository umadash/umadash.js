import { EventDispatcher } from "../event/EventDispatcher";

export default class Slideshow extends EventDispatcher {
  public static Change: string = "Change";

  public $elm: JQuery;
  private srcs: string[];
  private interval: number;
  private shuffle: boolean;

  private loaded: number;
  private currentIndex: number;
  private timer: any;
  private loader: HTMLImageElement;

  private wait: boolean;
  private parameters: any;

  constructor($elm: JQuery, srcs: string[], interval: number = 5, shuffle: boolean = false) {
    super();

    this.$elm = $elm;
    this.srcs = srcs;
    this.interval = interval;
    this.shuffle = shuffle;

    this.init();
  }

  private init(): void {
    this.currentIndex = -1;
    this.loaded = 0;
    this.wait = false;

    // shuffle
    if (this.shuffle) {
      this.srcs.sort(() => {
        return Math.random() - 0.5;
      });
    }
  }

  public preload(onComplete: () => void, onError: () => void = null): void {
    if (this.srcs.length > 0) {
      this.loadImage(this.srcs[0], onComplete, () => {
        this.srcs.splice(0, 1);
        this.preload(onComplete);
      });
    } else {
      onError();
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
    this.stopTimer();

    this.timer = setTimeout(() => {
      // 次がすでにロード完了していたら遷移
      if (this.wait) {
        this.next();
      } else {
        // 完了していなかったらロード完了を待機
        this.wait = true;
      }
    }, this.interval * 1000);
  }

  private stopTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
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

  public run(): void {
    this.next();
  }

  public stop(): void {
    this.stopTimer();
  }

  public next(): void {
    let nextIndex: number = this.currentIndex + 1;
    if (nextIndex >= this.srcs.length) nextIndex = 0;
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
