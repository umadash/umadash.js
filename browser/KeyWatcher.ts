export class KeyWatcher {

    private static KeyDown: string = 'keydown';
    private static KeyUp: string = 'keyup';
    private static watcher: any = $(document);


    private static createId(eventName: string, id: string): string {
        if (id) {
            return eventName + '.' + id;
        }
        return eventName;
    }

    public static startWatchingKeyDown(id: string, handler: (keyCode: number) => void): void {
        this.watcher.on(this.createId(KeyWatcher.KeyDown, id), (e) => {
            handler(e.keyCode);
        });
    }

    public static stopWatchingKeyDown(id: string): void {
        this.watcher.off(this.createId(KeyWatcher.KeyDown, id));
    }


    private constructor() {}
}