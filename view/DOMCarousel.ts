const $ = require('jquery');

import { View } from "./View";
import { Command } from "../command/Command";
import { JqueryUtil } from "../util/JqueryUtil";
import { Easing } from "../tween/Easing";
import { ObjectPool } from "../util/ObjectPool";

// interface
export class DOMCarousel<T extends DOMCarouselItem> extends View<JQuery> {

    private $elm: JQuery;
    private onRequireItem: () => T;

    private width: number = 0;
    private models: string[] = [];
    private items: T[] = [];

    private pool: ObjectPool<T>;
    private speed: number = 0;
    private defaultSpeed: number = 0;
    private margin: number = 0;
    private request: number = -9999;

    private directionRight: boolean;

    // the leftest position item index
    private leftIndex: number;

    // the rightest position item index
    private rightIndex: number;

    private modelsLength: number;

    private touchable: boolean;
    private touchX: number;
    private FRICTION: number = .92;

    private updateFunc: () => void;

    constructor($elm: JQuery, margin: number, touchable: boolean, onRequireItem: () => T) {
        super();

        this.$elm = $elm;
        this.margin = margin;
        this.touchable = touchable;
        this.onRequireItem = onRequireItem;

        this.init();
    }

    private init(): void {

        this.updateFunc = this.update.bind(this);

        this.setParam();
        
        // カルーセルの子要素を取得する
        const $children: JQuery = this.$elm.children();

        // 子要素の幅をattributeに保存する
        $children.each((index: number, element: HTMLElement) => {
            const $elm: JQuery = $(element);
            const width: number = $elm.outerWidth();
            $elm.attr('data-width', width + "");

            const txtDom: string = JqueryUtil.getSelfHTML($elm);
            this.models.push(txtDom);
        });

        this.modelsLength = this.models.length;

        // オブジェクトプールを作る
        this.pool = new ObjectPool<T>(
            this.onRequireItem, 
            (item: DOMCarouselItem) => { item.destoroy(); },
            this.modelsLength,
            this.modelsLength
        );

        if (this.touchable) {

            this.$elm.on('touchstart', (e) => {
                // e.preventDefault();
    
                // 止める
                this.stop();
    
                // 最初に触れた位置を保存
                const touch = e.changedTouches[0];
                this.touchX = touch.pageX;
            });
    
            this.$elm.on('touchmove', (e) => {
                // e.preventDefault();
    
                // 最初に触れた位置を保存
                const touch = e.changedTouches[0];
                const currentTouchX: number = touch.pageX;
    
                const diff: number = currentTouchX - this.touchX;
                this.speed = diff;
                this.updateAllItems(this.speed);
                this.checkLeftItem();
                this.checkRightItem();
    
                // 最新の位置を保存
                this.touchX = touch.pageX;
            });
            
            this.$elm.on('touchend', (e) => {
                // e.preventDefault();
    
                this.directionRight = this.speed > 0;
                if (this.directionRight) {
                    this.defaultSpeed = Math.abs(this.defaultSpeed);
                } else {
                    this.defaultSpeed = -Math.abs(this.defaultSpeed);
                }
                
                this.checkLeftItem();
                this.checkRightItem();
                this.start();
            });

        }

        

        this.resize();
        this.fill();
    }

    protected getShowCommand(): Command {
        return JqueryUtil.fadeIn(this.$elm, 0, Easing.linear, 'block', true, false);
    }

    protected getHideCommand(): Command {
        return JqueryUtil.fadeOut(this.$elm, 0, Easing.linear, 'none', true, false);
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

    public resize(): void {
        this.width = this.$elm.outerWidth();
    }

    public setMargin(value: number): void {
        this.margin = value;
    }

    


    private getNextLeftIndex(): number {
        let nextIndex: number = this.leftIndex - 1;
        if (nextIndex < 0) nextIndex = this.modelsLength - 1;
        return nextIndex;
    }

    private getNextRightIndex(): number {
        let nextIndex: number = this.rightIndex + 1;
        if (nextIndex >= this.modelsLength) nextIndex = 0;
        return nextIndex;
    }

    private checkRightItem(): void {
        const item: T = this.items[this.items.length - 1];
        
        if (this.speed >= 0) {
            const left: number = item.tx;

            if (left >= this.width) {

                item.destoroy();
                this.pool.returnItem(item);
                this.items.pop();

                // インデックスの更新
                const nextIndex: number = this.rightIndex - 1;
                this.rightIndex = (nextIndex < 0) ? this.modelsLength - 1 : nextIndex;

                this.checkRightItem();
            }
        }
        else {
            const right: number = item.tx + item.width;
            if (right <= this.width - this.margin) {

                // 次のモデルのインデックス
                this.rightIndex = this.getNextRightIndex();
                const htmlString = this.models[this.rightIndex];

                // プールから取得してhtmlを渡してアイテムを更新
                const newItem: T = this.pool.getItem();
                newItem.updateOnRecycle(htmlString);
                
                // 位置調整
                const tx: number = item.tx + (item.width + this.margin);
                newItem.setTranslateX(tx);

                // DOM・配列の一番後ろに追加する
                this.$elm.append(newItem.$elm);
                this.items.push(newItem);

                this.checkRightItem();
            }
        }
    }

    

    private checkLeftItem(): void {
        const item: T = this.items[0];
        
        if (this.speed >= 0) {
            
            const left: number = item.tx;

            if (left >= 0 + this.margin) {
                // 次のモデルのインデックス
                this.leftIndex = this.getNextLeftIndex();
                const htmlString = this.models[this.leftIndex];
                
                // プールから取得してhtmlを渡してアイテムを更新
                const newItem: T = this.pool.getItem();
                newItem.updateOnRecycle(htmlString);
                
                // position
                const tx: number = item.tx - (item.width + this.margin);
                newItem.setTranslateX(tx);

                // DOM・配列の一番前に追加する
                this.$elm.prepend(newItem.$elm);
                this.items.unshift(newItem);

                // 再チェック
                this.checkLeftItem();
            }
        }
        else {
            const right: number = item.tx + item.width;
            if (right <= 0) {
                item.destoroy();
                this.pool.returnItem(item);
                this.items.shift();

                const nextIndex: number = this.leftIndex + 1;
                this.leftIndex = (nextIndex >= this.modelsLength) ? 0 : nextIndex;

                this.checkLeftItem();
            }
        }
    }

    private updateAllItems(speed: number): void {
        const length = this.items.length;
        for (let i = 0; i < length; i += 1) {
            const item: T = this.items[i];
            const x: number = item.tx + speed;
            item.setTranslateX(x);
        }
    }

    
    
    private update(): void {
        this.request = requestAnimationFrame(this.updateFunc);

        this.checkLeftItem();
        this.checkRightItem();
        
        if (this.directionRight) {
            this.speed = Math.max(this.defaultSpeed, this.speed * this.FRICTION);
        }
        else {
            this.speed = Math.min(this.defaultSpeed, this.speed * this.FRICTION);
        }
        this.updateAllItems(this.speed);
        
    }

    private setParam(): void {
        // margin
        const margin: string =this.$elm.attr('data-margin');
        if (margin) {
            this.setMargin(parseFloat(margin));
        }

        // speed
        const speed: string =this.$elm.attr('data-speed');
        if (speed) {
            this.defaultSpeed = parseFloat(speed);
        }
        else {
            this.defaultSpeed = 1;
        }
        this.speed = this.defaultSpeed;
        this.directionRight = this.speed > 0;
    }

    

    private fill(): void {
        // 子要素を空にする
        this.$elm.empty();
        this.items = [];

        // 幅全てを埋めるまで子要素をDOMについかする
        let allWidth: number = 0;
        let count: number = 0;
        const margin: number = this.margin;

        while(allWidth <= this.width) {
            const model: string = this.models[count];

            const item: T = this.pool.getItem();
            item.updateOnRecycle(model);

            this.items.push(item);
            item.setTranslateX(allWidth);
            
            this.$elm.append(item.$elm);
            allWidth += item.width + margin;
            count += 1;
            count = count % this.modelsLength;
        }

        // 最も左右端にあるアイテムのモデルインデックスを保持
        this.leftIndex = 0;
        this.rightIndex = count;
    }
}

export abstract class DOMCarouselItem {

    public $elm: JQuery;
    public width: number;
    public tx: number;
    public leftItem: DOMCarouselItem;
    public rightItem: DOMCarouselItem;

    constructor() {
        this.width = 0;
        this.tx = 0;
    }

    public abstract destoroy(): void;
    public abstract willAppear(): void;

    public updateOnRecycle(htmlString: string): void {
        this.$elm = $(htmlString);
        this.width = parseFloat(this.$elm.attr('data-width'));

        this.willAppear();
    }

    public setTranslateX(value: number): void {
        this.tx = value;
        this.$elm.css('transform', `translate3d(${this.tx}px, 0, 0)`);
    }
}