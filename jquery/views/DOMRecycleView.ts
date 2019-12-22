const $ = jQuery;

import View from "../../views/View";
import JqueryUtil from "../utils/JqueryUtil";
import ObjectPool from "../../utils/ObjectPool";
import DOMRecycleViewItem from "./DOMRecycleViewItem";

// interface
export default abstract class DOMRecycleView<T extends DOMRecycleViewItem> extends View<JQuery> {
  constructor($elm: JQuery, margin: number, onRequireItem: () => T) {
    super($elm);

    this.$elm = $elm;
    this.margin = margin;
    this.onRequireItem = onRequireItem;

    this.width = this.height = 0;

    this.setup();
    this.resize();
  }

  public resize(): void {
    this.width = this.$elm.outerWidth();
    this.height = this.$elm.outerHeight();
    this.fill();
  }

  public setup(): void {
    this.displayItems = [];
    this.models = [];

    // 子要素の幅をattributeに保存する
    let maxHeight: number = -9999;
    const $children: JQuery = this.$elm.children();
    $children.each((index: number, element: HTMLElement) => {
      const $elm: JQuery = $(element);
      const width: number = $elm.outerWidth();
      const height: number = $elm.outerHeight();

      maxHeight = height > maxHeight ? height : maxHeight;
      $elm.attr("data-width", width);
      $elm.attr("data-height", height);

      const txtDom: string = JqueryUtil.getSelfHTML($elm);
      this.models.push(txtDom);
    });

    // オブジェクトプールを作る
    this.modelsLength = this.models.length;
    if (this.pool) {
      this.pool.reduce();
    } else {
      this.pool = new ObjectPool<T>(
        this.onRequireItem,
        (item: DOMRecycleViewItem) => {
          item.destroy();
        },
        this.modelsLength * 2,
        this.modelsLength
      );
    }

    this.hasSetuped = true;
  }

  protected getNextLeftIndex(): number {
    let nextIndex: number = this.leftIndex - 1;
    if (nextIndex < 0) nextIndex = this.modelsLength - 1;
    return nextIndex;
  }

  protected getNextRightIndex(): number {
    let nextIndex: number = this.rightIndex + 1;
    if (nextIndex >= this.modelsLength) nextIndex = 0;
    return nextIndex;
  }

  public checkRightItem(tx: number): void {
    const item: T = this.displayItems[this.displayItems.length - 1];
    if (!item) return;

    const directionRight: boolean = tx >= 0;

    if (directionRight) {
      const left: number = item.x + tx;

      if (left >= this.width) {
        const oldItem = this.displayItems.pop();
        oldItem.destroy();
        this.pool.returnItem(oldItem);

        // インデックスの更新
        const nextIndex: number = this.rightIndex - 1;
        this.rightIndex = nextIndex < 0 ? this.modelsLength - 1 : nextIndex;

        this.checkRightItem(tx);
      }
    } else {
      const right: number = item.x + item.width + tx;
      if (right <= this.width - this.margin) {
        // 次のモデルのインデックス
        this.rightIndex = this.getNextRightIndex();
        const model = this.models[this.rightIndex];

        // プールから取得してhtmlを渡してアイテムを更新
        const $elm = $(model).appendTo(this.getView());
        const newItem: T = this.pool.getItem();
        newItem.setup($elm);
        newItem.setX(item.x + item.width + this.margin);

        // DOM・配列の一番後ろに追加する
        this.displayItems.push(newItem);

        this.checkRightItem(tx);
      }
    }
  }

  public checkLeftItem(tx: number): void {
    const item: T = this.displayItems[0];
    if (!item) return;

    const directionRight: boolean = tx >= 0;

    if (directionRight) {
      const left: number = item.x + tx;

      if (left >= 0 + this.margin) {
        // 次のモデルのインデックス
        this.leftIndex = this.getNextLeftIndex();
        const model = this.models[this.leftIndex];
        const $element = $(model).prependTo(this.getView());

        // プールから取得してhtmlを渡してアイテムを更新
        const newItem: T = this.pool.getItem();
        newItem.setup($element);
        newItem.setX(item.x - (newItem.width + this.margin));
        this.displayItems.unshift(newItem);

        // 再チェック
        this.checkLeftItem(tx);
      }
    } else {
      // 右端の座標
      const right: number = item.x + item.width + tx;
      if (right <= 0) {
        const oldItem = this.displayItems.shift();
        oldItem.destroy();
        this.pool.returnItem(oldItem);

        const nextIndex: number = this.leftIndex + 1;
        this.leftIndex = nextIndex >= this.modelsLength ? 0 : nextIndex;

        this.checkLeftItem(tx);
      }
    }
  }

  protected moveAllItems(speed: number): void {
    const length = this.displayItems.length;

    for (let i = 0; i < length; i += 1) {
      const item: T = this.displayItems[i];
      const x: number = item.x + speed;
      item.setX(x);
    }
  }

  protected savePositionAllItems(): void {
    const length = this.displayItems.length;
    for (let i = 0; i < length; i += 1) {
      const item: T = this.displayItems[i];
      item.savePosition();
    }
  }

  protected fill(): void {
    this.$elm.css({ height: "auto" });

    // destroy current items
    for (let i = 0; i < this.displayItems.length; i += 1) {
      const item: T = this.displayItems[i];
      item.destroy();
    }
    this.displayItems = [];

    // プールされているアイテムの削除
    this.pool.reduce();

    // 子要素を空にする
    this.$elm.empty();

    // 幅全てを埋めるまで子要素をDOMに追加する
    const margin: number = this.margin;
    let allWidth: number = 0;
    let count: number = 0;
    let maxHeight = -9999;

    while (allWidth <= this.width) {
      const model: string = this.models[count++ % this.modelsLength];
      const $element: JQuery = $(model).appendTo(this.getView());

      const item: T = this.pool.getItem();
      item.setup($element);
      item.setX(allWidth);
      this.displayItems.push(item);

      allWidth += item.width + margin;
      maxHeight = item.height > maxHeight ? item.height : maxHeight;
    }

    // 最も左右端にあるアイテムのモデルインデックスを保持
    this.leftIndex = 0;
    this.rightIndex = count - 1;

    // 高さを揃える
    this.$elm.css({ height: maxHeight });
  }

  public getLeftestItem(): DOMRecycleViewItem | undefined {
    return this.displayItems[0];
  }

  public getRightestItem(): DOMRecycleViewItem | undefined {
    return this.displayItems[this.displayItems.length - 1];
  }

  protected $elm: JQuery;
  protected margin: number;
  protected onRequireItem: () => T;

  protected pool: ObjectPool<T>;
  protected width: number;
  protected height: number;
  protected models: string[];
  protected modelsLength: number;
  protected displayItems: T[];

  // the leftest position item index
  protected leftIndex: number;

  // the rightest position item index
  protected rightIndex: number;

  protected hasSetuped: boolean;
}
