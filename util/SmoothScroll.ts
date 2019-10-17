import { Easing } from "../tween/Easing";
import { Command } from "../command/Command";
import { DoTween } from "../command/DoTween";
import { EventDispatcher } from "../event/EventDispatcher";
import Event from "../event/Event";

const $ = jQuery;

export class SmoothScroll {
  public static Move: string = "move";
  private static dispatcher: EventDispatcher = new EventDispatcher();

  public static offset: number = 0;
  public static moveCommand?: Command;
  public static scrollTop: number = 0;

  public static getDispatcher(): EventDispatcher {
    return this.dispatcher;
  }

  public static attach($anchors: JQuery = $('a[href^="#"]'), duration: number = 800, easing: any = Easing.easeInOutQuart): void {
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

      // 移動イベントを通知
      this.dispatcher.dispatchEvent(new Event(this.Move));

      this.moveCommand.execute();

      // a要素のデフォルトの機能を無効化する
      return false;
    });
  }
}
