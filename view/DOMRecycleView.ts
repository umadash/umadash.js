const $ = jQuery;

import View from "./View";
import JqueryUtil from "../util/JqueryUtil";
import ObjectPool from "../util/ObjectPool";
import DOMRecycleViewItem from "./DOMRecycleViewItem";

// interface
export default abstract class DOMRecycleView<T extends DOMRecycleViewItem> extends View<JQuery> {
  protected $elm: JQuery;
  protected margin: number = 0;
  protected onRequireItem: () => T;

  protected pool: ObjectPool<T>;
  protected width: number = 0;
  protected height: number = 0;
  protected models: string[] = [];
  protected modelsLength: number;
  protected items: T[] = [];

  // the leftest position item index
  protected leftIndex: number;

  // the rightest position item index
  protected rightIndex: number;

  constructor($elm: JQuery, margin: number, onRequireItem: () => T) {
    super($elm);

    this.$elm = $elm;
    this.margin = margin;
    this.onRequireItem = onRequireItem;

    this._init();
  }

  public resize(): void {
    this.width = this.$elm.outerWidth();
    this.height = this.$elm.outerHeight();
    this.fill();
  }

  private _init(): void {
    // 子要素の幅をattributeに保存する
    const $children: JQuery = this.$elm.children();
    $children.each((index: number, element: HTMLElement) => {
      const $elm: JQuery = $(element);
      const width: number = $elm.outerWidth();
      const height: number = $elm.outerHeight();
      $elm.attr("data-width", width + "");
      $elm.attr("data-height", height + "");

      const txtDom: string = JqueryUtil.getSelfHTML($elm);
      this.models.push(txtDom);
    });

    // オブジェクトプールを作る
    this.modelsLength = this.models.length;
    this.pool = new ObjectPool<T>(
      this.onRequireItem,
      (item: DOMRecycleViewItem) => {
        item.destoroy();
      },
      this.modelsLength * 2,
      this.modelsLength
    );
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
    const item: T = this.items[this.items.length - 1];
    if (!item) return;

    const directionRight: boolean = tx >= 0;

    if (directionRight) {
      const left: number = item.x + tx;

      if (left >= this.width) {
        const oldItem = this.items.pop();
        oldItem.destoroy();
        this.pool.returnItem(oldItem);

        // インデックスの更新
        const nextIndex: number = this.rightIndex - 1;
        this.rightIndex = nextIndex < 0 ? this.modelsLength - 1 : nextIndex;

        item.leftItem.rightItem = null;

        this.checkRightItem(tx);
      }
    } else {
      const right: number = item.x + item.width + tx;
      if (right <= this.width - this.margin) {
        // 次のモデルのインデックス
        this.rightIndex = this.getNextRightIndex();
        const htmlString = this.models[this.rightIndex];

        // プールから取得してhtmlを渡してアイテムを更新
        const newItem: T = this.pool.getItem();
        newItem.attachHTML(htmlString);
        newItem.willAppear();

        // 位置調整
        newItem.setX(item.x + item.width + this.margin);

        // DOM・配列の一番後ろに追加する
        this.$elm.append(newItem.$elm);
        this.items.push(newItem);

        item.rightItem = newItem;
        newItem.leftItem = item;

        this.checkRightItem(tx);
      }
    }
  }

  public checkLeftItem(tx: number): void {
    const item: T = this.items[0];
    if (!item) return;

    const directionRight: boolean = tx >= 0;

    if (directionRight) {
      const left: number = item.x + tx;

      if (left >= 0 + this.margin) {
        // 次のモデルのインデックス
        this.leftIndex = this.getNextLeftIndex();
        const htmlString = this.models[this.leftIndex];

        // プールから取得してhtmlを渡してアイテムを更新
        const newItem: T = this.pool.getItem();
        newItem.attachHTML(htmlString);
        newItem.willAppear();

        // position
        const tx: number = item.x - (newItem.width + this.margin);
        newItem.setX(tx);

        // DOM・配列の一番前に追加する
        this.$elm.prepend(newItem.$elm);
        this.items.unshift(newItem);

        newItem.rightItem = item;
        item.leftItem = newItem;

        // 再チェック
        this.checkLeftItem(left);
      }
    } else {
      // 右端の座標
      const right: number = item.x + item.width + tx;
      if (right <= 0) {
        const oldItem = this.items.shift();
        oldItem.destoroy();
        this.pool.returnItem(oldItem);

        const nextIndex: number = this.leftIndex + 1;
        this.leftIndex = nextIndex >= this.modelsLength ? 0 : nextIndex;

        item.rightItem.leftItem = null;

        this.checkLeftItem(tx);
      }
    }
  }

  protected updateAllItems(speed: number): void {
    const length = this.items.length;

    for (let i = 0; i < length; i += 1) {
      const item: T = this.items[i];
      const x: number = item.x + speed;
      item.setX(x);
    }
  }

  protected savePositionAllItems(): void {
    const length = this.items.length;
    for (let i = 0; i < length; i += 1) {
      const item: T = this.items[i];
      item.savePosition();
    }
  }

  protected fill(): void {
    //
    this.$elm.css({ height: "auto" });

    // destroy current items
    for (let i = 0; i < this.items.length; i += 1) {
      const item: T = this.items[i];
      item.destoroy();
    }
    this.items = [];

    // プールされているアイテムの削除
    this.pool.reduce();

    // 子要素を空にする
    this.$elm.empty();

    // 幅全てを埋めるまで子要素をDOMに追加する
    const margin: number = this.margin;
    let allWidth: number = 0;
    let count: number = 0;
    let prevItem: T;
    let maxHeight = -9999;

    while (allWidth <= this.width) {
      const model: string = this.models[count++ % this.modelsLength];

      const item: T = this.pool.getItem();
      item.attachHTML(model);
      item.willAppear();
      item.setX(allWidth);
      this.$elm.append(item.$elm);
      this.items.push(item);

      allWidth += item.width + margin;
      maxHeight = item.height > maxHeight ? item.height : maxHeight;

      if (prevItem) {
        item.leftItem = prevItem;
        prevItem.rightItem = item;
      }
      prevItem = item;
    }

    // 最も左右端にあるアイテムのモデルインデックスを保持
    this.leftIndex = 0;
    this.rightIndex = count - 1;

    // 高さを揃える
    this.$elm.css({ height: maxHeight });
  }

  public getLeftestItem(): DOMRecycleViewItem | undefined {
    return this.items[0];
  }

  public getRightestItem(): DOMRecycleViewItem | undefined {
    return this.items[this.items.length - 1];
  }
}
