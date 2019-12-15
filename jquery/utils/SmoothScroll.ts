import { Easing, EasingFunction } from "../../tween/Easing";
import Command from "../../commands/Command";
import DoTween from "../../commands/DoTween";
import { EventDispatcher } from "../../events/EventDispatcher";

const $ = jQuery;

export default class SmoothScroll extends EventDispatcher {
  private static instance: SmoothScroll;
  public static Move: string = "Move";

  private constructor() {
    super();

    this.offset = 0;
    this.scrollTop = 0;
  }

  public static getInstance(): SmoothScroll {
    if (!SmoothScroll.instance) {
      SmoothScroll.instance = new SmoothScroll();
    }
    return SmoothScroll.instance;
  }

  public attach(duration: number = 1000, easing: EasingFunction = Easing.easeInOutQuart): void {
    const currentUrl: string = window.location.href.replace(/\#[0-9a-zA-Z]+$/, "");
    const $anchors = $("a").each((index: number, element: HTMLElement) => {
      const href: string = element.getAttribute("href");

      // ハッシュタグを保持しているか
      const hashResult = href.match(/\#[0-9a-zA-Z]+$/);
      if (hashResult) {
        // URLを保持しているかどうか
        const result = href.match(/^((https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%]+))/);

        if (result) {
          // URLを保持していれば、ハッシュを抜いた状態で
          // 現在開いているページと同じURLか調べる

          if (result[0] + "/" === currentUrl) {
            element.setAttribute("href", hashResult[0]);
          } else return;
        }

        const $target: JQuery = $(element);
        $target.on("click", e => {
          // クリックしたaタグのhref属性（リンク先URI）を取得し、変数に格納
          const href: string = $(e.currentTarget).attr("href");
          const $target: JQuery = $(href);
          if ($target.length > 0) {
            const top: number = $target.offset().top;
            const position: number = top + this.offset;

            // 現在のスクロール位置を取得
            this.scrollTop = window.scrollY;
            if (this.moveCommand) {
              this.moveCommand.interrupt();
              this.moveCommand = null;
            }
            this.moveCommand = new DoTween(this, { scrollTop: position }, null, duration, easing, null, () => {
              window.scrollTo(0, this.scrollTop);
            });
            this.moveCommand.execute();
            // 移動イベントを通知
            this.dispatchEventType(SmoothScroll.Move);
          }

          // a要素のデフォルトの機能を無効化する;
          return false;
        });
      }
    });
  }

  private offset: number;
  public setOffset(offset) {
    this.offset = offset;
  }

  private moveCommand?: Command;
  private scrollTop: number;
}
