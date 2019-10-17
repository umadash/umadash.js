const $ = jQuery;

import Command from "../command/Command";
import { JqueryUtil } from "../util/JqueryUtil";
import DOMRecycleViewItem from "./DOMRecycleViewItem";
import DOMRecycleView from "./DOMRecycleView";
import DoTween from "../command/DoTween";
import Easing from "../tween/Easing";

export default class DOMSlider<T extends DOMRecycleViewItem> extends DOMRecycleView<T> {
  private duration: number;
  private easing: any;
  private centerItem: DOMRecycleViewItem;
  private moveCommand: Command;
  private moveAmount: number;

  constructor($elm: JQuery, margin: number, duration: number, easing: any, onRequireItem: () => T) {
    super($elm, margin, onRequireItem);

    this.duration = duration;
    this.easing = easing;

    this.init();
  }

  private init(): void {
    this.moveAmount = 0;

    this.resize();
  }

  public start(): void {}

  public stop(): void {}

  public resize(): void {
    super.resize();

    this.centerize(this.items[0], false);
  }

  public centerize(item: DOMRecycleViewItem, animated: boolean = true) {
    if (this.moveCommand) return;

    this.moveAmount = 0;

    if (animated) {
      const moveAmount: number = (this.width - item.width) / 2 - item.x;

      if (moveAmount > 0) {
        this.checkLeftItem(moveAmount);
      } else {
        this.checkRightItem(moveAmount);
      }

      // 動かすすべてのアイテムの現在位置を保存
      let positions: { x: number }[] = [];
      const length = this.items.length;
      for (let i = 0; i < length; i += 1) {
        const item: DOMRecycleViewItem = this.items[i];
        positions.push({
          x: item.x
        });
      }

      this.moveCommand = new DoTween(
        this,
        { moveAmount: moveAmount },
        null,
        this.duration,
        this.easing,
        null,
        () => {
          for (let i = 0; i < length; i += 1) {
            const position: { x: number } = positions[i];
            const x: number = position.x + this.moveAmount;

            const item: DOMRecycleViewItem = this.items[i];
            item.setX(x);
          }
        },
        () => {
          this.checkLeftItem(moveAmount > 0 ? 1 : -1);
          this.checkRightItem(moveAmount > 0 ? 1 : -1);
          positions = null;
          this.moveCommand = null;
        }
      );
      this.moveCommand.execute();
    } else {
      const tx: number = (this.width - item.width) / 2;
      this.checkLeftItem(tx);
      this.checkRightItem(tx);
      this.updateAllItems(tx);
    }

    this.centerItem = item;
  }

  public moveRight(): void {
    let nextCenterItem: DOMRecycleViewItem = this.centerItem.leftItem;
    if (nextCenterItem) {
      this.centerize(nextCenterItem);
    } else {
      this.checkLeftItem(-1);
    }
  }

  public moveLeft(): void {
    let nextCenterItem: DOMRecycleViewItem = this.centerItem.rightItem;

    if (nextCenterItem) {
      this.centerize(nextCenterItem);
    } else {
      this.checkRightItem(-1);
    }
  }

  protected getShowCommand(): Command {
    return JqueryUtil.fadeIn(this.$elm, 0, Easing.linear, "block", true, false);
  }

  protected getHideCommand(): Command {
    return JqueryUtil.fadeOut(this.$elm, 0, Easing.linear, "none", true, false);
  }
}
