const $ = jQuery;

import Command from "../../commands/Command";
import JqueryUtil from "../utils/JqueryUtil";
import DOMRecycleViewItem from "./DOMRecycleViewItem";
import DOMRecycleView from "./DOMRecycleView";
import DoTween from "../../commands/DoTween";
import { EasingFunction } from "../../tween/Easing";

export default abstract class DOMSlider<T extends DOMRecycleViewItem> extends DOMRecycleView<T> {
  private duration: number;
  private easing: any;
  private centerItem: DOMRecycleViewItem;
  private moveCommand: Command;
  private moveAmount: number;

  constructor($elm: JQuery, margin: number, duration: number, easing: EasingFunction, onRequireItem: () => T) {
    super($elm, margin, onRequireItem);

    this.duration = duration;
    this.easing = easing;

    this.moveAmount = 0;
    this.centerize(this.displayItems[0], false);
  }

  public resize(): void {
    super.resize();
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
      const length = this.displayItems.length;
      for (let i = 0; i < length; i += 1) {
        const item: DOMRecycleViewItem = this.displayItems[i];
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

            const item: DOMRecycleViewItem = this.displayItems[i];
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
      this.moveAllItems(tx);
    }

    this.centerItem = item;
  }

  public moveRight(): void {
    const index = Math.floor(this.displayItems.length / 2);
    const nextIndex = index - 1;
    const nextCenterItem: DOMRecycleViewItem = this.displayItems[nextIndex];

    if (nextCenterItem) {
      this.centerize(nextCenterItem);
    } else {
      this.checkLeftItem(-1);
    }
  }

  public moveLeft(): void {
    const index = Math.floor(this.displayItems.length / 2);
    const nextIndex = index + 1;
    const nextCenterItem: DOMRecycleViewItem = this.displayItems[nextIndex];

    if (nextCenterItem) {
      this.centerize(nextCenterItem);
    } else {
      this.checkRightItem(-1);
    }
  }
}
