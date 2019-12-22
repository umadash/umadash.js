import Command from "../../commands/Command";
import JqueryUtil from "../utils/JqueryUtil";
import { Easing } from "../../tween/Easing";
import DOMRecycleViewItem from "./DOMRecycleViewItem";
import DOMRecycleView from "./DOMRecycleView";
import { KeyCode } from "../../browser/KeyCode";

const $ = jQuery;

// interface
export default abstract class DOMCarousel<T extends DOMRecycleViewItem> extends DOMRecycleView<T> {
  private speed: number;
  private defaultSpeed: number = 0;
  private request: number = -9999;

  private directionRight: boolean;
  private FRICTION: number = 0.92;

  private updateFunc: () => void;

  constructor($elm: JQuery, margin: number, speed: number, onRequireItem: () => T) {
    super($elm, margin, onRequireItem);

    this.speed = speed;

    this.init();
  }

  private init(): void {
    this.updateFunc = this.update.bind(this);

    this.defaultSpeed = this.speed;
    this.directionRight = this.speed > 0;

    this.resize();

    $(window).on("keydown", e => {
      switch (e.keyCode) {
        case KeyCode.LeftArrow:
          {
            const speed = -20;
            this.checkLeftItem(speed);
            this.checkRightItem(speed);
            this.moveAllItems(speed);
          }
          break;
        case KeyCode.RightArrow:
          const speed = 2;
          this.checkLeftItem(speed);
          this.checkRightItem(speed);
          this.moveAllItems(speed);
          break;
      }
    });
  }

  protected getShowCommand(): Command {
    return JqueryUtil.fadeIn(this.$elm, 0, Easing.linear, "block", true, false);
  }

  protected getHideCommand(): Command {
    return JqueryUtil.fadeOut(this.$elm, 0, Easing.linear, "none", true, false);
  }

  public start(): void {
    this.stop();
    this.update();
  }

  public stop(): void {
    if (this.request) {
      cancelAnimationFrame(this.request);
      this.request = null;
    }
  }

  public setMargin(value: number): void {
    this.margin = value;
  }

  private update(): void {
    if (this.directionRight) {
      this.speed = Math.max(this.defaultSpeed, this.speed * this.FRICTION);
    } else {
      this.speed = Math.min(this.defaultSpeed, this.speed * this.FRICTION);
    }

    this.checkLeftItem(this.speed);
    this.checkRightItem(this.speed);
    this.moveAllItems(this.speed);

    this.request = requestAnimationFrame(this.updateFunc);
  }
}
