const $ = require('jquery');
import { Throttle } from './Throttle';

export class WindowWatcher {
    private static eventScroll: string = 'scroll';
    private static eventResize: string = 'resize';

    private static startWatching(eventName: string, handler: () => void, handlers: Object, id: string = '', throttle: number = 0, execute: boolean = true): void {
        const $watcher: JQuery = WindowWatcher.$watcher;

        if (Object.keys(handlers).length < 1) {
            $watcher.on(eventName, () => {
                const now: number = Date.now();
                Object.keys(handlers).forEach((key) => {
                    const t: Throttle = handlers[key];
                    t.execute(now);
                });
            });
        }

        handlers[id] = new Throttle(throttle, handler);
        if (execute) handler();
    }

    private static stopWatching(eventName: string, handlers: Object, id?: string): void {
        if (id) {
            delete handlers[id];
        }
        else {
            this.$watcher.off(eventName);
        }
    }


    /**
     * Scroll
     */
    public static startWatchingScroll(handler: () => void, id: string = '', throttle: number = 0, execute: boolean = true): void {
        this.startWatching(this.eventScroll, handler, this.scrollHandlers, id, throttle, execute);
    }

    public static stopWatchingScroll(id?: string): void {
        this.stopWatching(this.eventScroll, this.scrollHandlers, id);
    }

    /**
     * Resize
     */
    public static startWatchingResize(handler: () => void, id: string = '', throttle: number = 0, execute: boolean = true): void {
        this.startWatching(this.eventResize, () => {
            const windowWidth: number = window.innerWidth;
            if (windowWidth != this.windowWidth) {
                handler();
                this.windowWidth = windowWidth;
            }
        }, this.resizeHandlers, id, throttle, execute);
    }

    public static stopWatchingResize(id?: string): void {
        this.stopWatching(this.eventResize, this.resizeHandlers, id);
    }

    /**
     * Focus
     */
    public static startWatchingFocus(handler: () => void, execute: boolean = true): void {
        WindowWatcher.$watcher.focus(handler);
        if (execute) handler();
    }

    /**
     * Blur
     */
    public static startWatchingBlur(handler: () => void, execute: boolean = true): void {
        WindowWatcher.$watcher.blur(handler);
        if (execute) handler();
    }

    /**
     * Util
     */
    public static getScrollTop(): number {
        return WindowWatcher.$watcher.scrollTop();
    }

    public static getWatcher(): JQuery {
        return this.$watcher;
    }

    public static $watcher: JQuery = $(<any>window);
    private static scrollHandlers: Object = {};
    private static resizeHandlers: Object = {};
    private static windowWidth: number = -9999;

    private constructor() {}
}
