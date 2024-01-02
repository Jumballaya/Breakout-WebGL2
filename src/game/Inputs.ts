export class Inputs {
    
    private parent: HTMLElement;
    private keys: Record<string, boolean> = {};
    
    constructor(element: HTMLElement) {
        this.parent = element;

        document.body.addEventListener('keydown', e => {
             this.keys[e.key] = true;
        });
        document.body.addEventListener('keyup', e => {
             this.keys[e.key] = false;
        });
    }

    public isPressed(k: string) {
        return this.keys[k] ?? false;
    }
}
