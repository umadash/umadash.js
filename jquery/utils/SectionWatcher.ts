const $ = jQuery;

import { EventDispatcher } from "../../events/EventDispatcher";
import Event from "../../events/Event";

export class SectionWatcher extends EventDispatcher {
  public static Change: string = "change";

  private $sections: JQuery;
  private sections: JQuery[];
  private currentIndex: number;
  private prevScrollTop: number;

  constructor($sections: JQuery) {
    super();

    this.$sections = $sections;

    this.sections = [];
    this.currentIndex = -1;
    this.prevScrollTop = 0;

    this.init();
  }

  public updateByScroll(scrollTop: number): void {
    const down: boolean = scrollTop - this.prevScrollTop >= 0;

    if (down) {
      this.checkDown(scrollTop);
    } else {
      this.checkUp(scrollTop);
    }

    this.prevScrollTop = scrollTop;
  }

  public resize(): void {
    this.sort();
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  private getCenterPosition(scrollTop): number {
    return window.innerHeight * 0.5 + scrollTop;
  }

  private checkDown(scrollTop: number): void {
    const nextIndex: number = this.currentIndex + 1;
    if (nextIndex >= this.sections.length) return;

    const $next: JQuery = this.sections[nextIndex];
    const center: number = this.getCenterPosition(scrollTop);
    const over: boolean = center > $next.offset().top;

    if (over) {
      this.currentIndex = nextIndex;
      this.dispatchEvent(new Event(SectionWatcher.Change));

      this.checkDown(scrollTop);
    }
  }

  private checkUp(scrollTop: number): void {
    const nextIndex: number = this.currentIndex;
    if (nextIndex <= 0) return;

    const $next: JQuery = this.sections[nextIndex];
    const center: number = this.getCenterPosition(scrollTop);
    const over: boolean = center < $next.offset().top;

    if (over) {
      this.currentIndex = nextIndex - 1;
      this.dispatchEvent(new Event(SectionWatcher.Change));

      this.checkUp(scrollTop);
    }
  }

  private init(): void {
    this.$sections.each((index: number, element: HTMLElement) => {
      const $element: JQuery = $(element);
      this.sections.push($element);
    });

    this.sort();
  }

  private sort(): void {
    this.sections.sort((a: JQuery, b: JQuery) => {
      return a.offset().top < b.offset().top ? -1 : 1;
    });
  }
}
