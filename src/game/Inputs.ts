export class Inputs {
    
    private keys: Record<string, boolean> = {};
    
    constructor(element: HTMLElement) {
        element.addEventListener('keydown', e => {
             this.keys[e.key] = true;
        });
        element.addEventListener('keyup', e => {
             this.keys[e.key] = false;
        });
    }

    public isPressed(k: string) {
        return this.keys[k] ?? false;
    }
}
