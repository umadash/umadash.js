import { EventDispatcher } from '../event/EventDispatcher';
import Event from '../event/Event';

export class KeyboardWatcher extends EventDispatcher {
    
    private static instance: KeyboardWatcher;

    public static KeyDown: string = 'keydown';

    private keyDownHandler: () => void;
    private enable: boolean;

    private constructor() {
        super();

        this.init();
    }

    private init(): void {
        this.enable = true;
    }

    public start(): void {
        this.keyDownHandler = this.onKeyDown.bind(this);

        window.addEventListener(KeyboardWatcher.KeyDown, this.keyDownHandler);
    }

    public stop(listener: () => void = null): void {
        window.removeEventListener(KeyboardWatcher.KeyDown, this.keyDownHandler);
    }

    public setEnable(enable: boolean) {
        this.enable = enable;
    }

    private onKeyDown(e): void {
        if (!this.enable) return;
        this.dispatchEvent(new KeyboardEvent(KeyboardWatcher.KeyDown, { keyCode: e.keyCode }));
    }

    public static getInstance(): KeyboardWatcher {
        if (!this.instance) {
            this.instance = new KeyboardWatcher();
        }
        return this.instance;
    }
}


export interface IKeyboardEventData {
    keyCode: number
}

export class KeyboardEvent extends Event {

    constructor(eventName: string, data: IKeyboardEventData) {
        super(eventName, data);
    }

    public getKeyCode(): number {
        return (<IKeyboardEventData>this.getData()).keyCode;
    }
}