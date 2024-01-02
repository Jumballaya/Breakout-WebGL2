
type EventHandler<T> = (d: T) => void;
export class EventEmitter<T> {
    private listeners: Record<string, Array<EventHandler<T>>> = {};

    public addEventListener(event: string, listener: EventHandler<T>) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
    }

    public emit(event: string, d: T) {
        const listeners = this.listeners[event];
        if (listeners) {
            for (let l of listeners) {
                l(d);
            }
        }
    }
}
