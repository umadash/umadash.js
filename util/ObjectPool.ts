export class ObjectPool<T> {

    private onRequire: () => T;
    private onDestroy: (item: T) => void;
    private initCount: number;
    private growthCount: number;
    private index: number;
    private items: T[] = [];

    constructor(onRequire: () => T, onDestroy: (item: T) => void, initCount: number, growthCount: number) {

        this.onRequire = onRequire;
        this.onDestroy = onDestroy;
        this.initCount = initCount;
        this.growthCount = growthCount;
        this.index = 0;

        this.init();
    }

    public getItem(): T {
        if (this.index > 0) return this.items[--this.index];
        for (let i = 0; i < this.growthCount; i += 1) {
            this.items.push(this.onRequire());
        }
        this.index = this.growthCount;
        return this.getItem();
    }

    public returnItem(item:T): void {
        this.items[this.index++] = item;
    }

    public destroy(): void {
        for (let i = 0; i < this.items.length; i += 1) {
            const item = this.items[i];
            this.onDestroy(item);
        }
        this.items = [];
    }

    private init(): void {
        for (let i = 0; i < this.initCount; i += 1) {
            const item: T = this.onRequire();
            this.items.push(item);
        }
        this.index = this.initCount;
    }
}