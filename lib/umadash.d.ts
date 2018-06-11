declare namespace umadash.events {
    type EventListener = (target: EventDispatcher, data: object) => void;
    class EventDispatcher {
        constructor();
        addEventListener(eventName: string, listener: EventListener): void;
        removeEventListener(eventName: string, listener: EventListener): void;
        dispatchEvent(eventName: string, data?: any): void;
        private listeners;
    }
}
declare namespace umadash {
    function getVersion(): string;
}
