import Easing from "../tween/Easing";
import Command from "../command/Command";
import DoTween from "../command/DoTween";
import { EventDispatcher } from "../event/EventDispatcher";

const $ = jQuery;

export default class SmoothScroll extends EventDispatcher {
  private static instance: SmoothScroll;
  public static Move: string = "move";

  private offset: number = 0;
  private moveCommand?: Command;
  private scrollTop: number = 0;

  private constructor() {
    super();
  }

  public static getInstance(): SmoothScroll {
    if (!SmoothScroll.instance) {
      SmoothScroll.instance = new SmoothScroll();
    }
    return SmoothScroll.instance;
  }

  public attach(duration: number = 1000, easing: any = Easing.easeInOutQuart, $anchors: JQuery = $('a[href^="#"]')): void {
    $anchors.on("click", e => {
      // クリックしたaタグのhref属性（リンク先URI）を取得し、変数に格納
      const href: string = $(e.currentTarget).attr("href");
      const $target: JQuery = $(href);

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

      // a要素のデフォルトの機能を無効化する
      return false;
    });
  }

  setOffset(offset) {
    this.offset = offset;
  }
}
