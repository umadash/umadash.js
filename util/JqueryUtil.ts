import Command from "./../command/Command";
import DoTween from "../command/DoTween";
import Easing from "../tween/Easing";

export class JqueryUtil {
  public static fadeTo($target: JQuery, opacity: number, duration: number, easing = Easing.linear, switchDisplayTo = "", switchVisibility = false, execute = false): Command {
    const o = { value: parseFloat($target.css("opacity")) };
    const tween = new DoTween(
      o,
      { value: opacity },
      null,
      duration,
      easing,
      () => {
        if (opacity > 0) {
          if (switchDisplayTo != "") $target.css("display", switchDisplayTo);
          if (switchVisibility) $target.css("visibility", "visible");
        }
      },
      () => {
        $target.css("opacity", o.value);
      },
      () => {
        if (opacity <= 0) {
          if (switchDisplayTo != "") $target.css("display", switchDisplayTo);
          if (switchVisibility) $target.css("visibility", "hidden");
        }
      }
    );
    if (execute) tween.execute();
    return tween;
  }

  public static fadeOut(target: JQuery, duration: number, easing: any, switchDisplayTo = "", switchVisibility = false, execute = false): Command {
    return JqueryUtil.fadeTo(target, 0, duration, easing, switchDisplayTo, switchVisibility, execute);
  }

  public static fadeIn(target: JQuery, duration: number, easing: any, switchDisplayTo = "", switchVisibility = false, execute = false): Command {
    return JqueryUtil.fadeTo(target, 1, duration, easing, switchDisplayTo, switchVisibility, execute);
  }

  /**
   * 対象のDOMがスクリーン内に表示されているかどうかを確認(垂直方向のみ)
   * @param $elm
   * @param scrollTop
   * @param windowHeight
   */
  public static getIsInScreen($elm: JQuery, scrollTop: number, windowHeight: number) {
    const top: number = $elm.offset().top;
    const triggerNodePosition: number = $elm.offset().top - windowHeight;
    return top >= scrollTop && top < scrollTop + windowHeight;
  }

  /**
   * jQueryオブジェクトに付与されている、
   * 特定のパターンのclassを取り除く
   * @param $target
   * @param pattern
   */
  public static removeClass($target: JQuery, pattern: string): JQuery {
    $target.removeClass(function(index, className) {
      const str = "\\b" + pattern + "\\S+";
      const reg = new RegExp(str, "g");
      return (className.match(reg) || []).join(" ");
    });
    return $target;
  }

  /**
   * 自分自身の要素を含んだHTMLを取得
   * @param target
   */
  public static getSelfHTML(target: JQuery): string {
    return target.prop("outerHTML");
  }
}
