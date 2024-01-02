

type DialogAction = () => void;

export class Dialog {
    private parent: HTMLElement;
    private root: HTMLElement;
    private hidden = true;
    private _action: DialogAction;

    private btn: HTMLButtonElement;
    private heading: HTMLElement;

    constructor(parent: HTMLElement, message: string, action: DialogAction) {
        this.root = document.createElement('div');
        this.root.classList.add('dialog-container');
        this.parent = parent;
        this.parent.appendChild(this.root);
        this._action = action;

        const h2 = document.createElement('h2');
        this.heading = h2;
        this.root.appendChild(h2);
        h2.innerHTML = message;
        const btn = document.createElement('button');
        btn.innerText = 'Continue';
        this.root.appendChild(btn);
        this.root.hidden = true;

        btn.addEventListener('click', this._action);
        this.btn = btn;
    }

    public show(message: string, action: () => void, buttonText: string = '') {
        this.hidden = false;
        this.root.hidden = false;
        this.action = action;
        this.setMessage(message);
        if (buttonText !== '') {
            this.setButtonText(buttonText);
        }
    }

    public setMessage(message: string) {
        this.heading.innerText = message;
    }

    public setButtonText(txt: string) {
        this.btn.innerText = txt;
    }

    public toggle() {
        this.hidden = !this.hidden;
        this.root.hidden = this.hidden;
    }

    public set action(a: () => void) {
        this.btn.removeEventListener('click', this._action);
        this._action = a;
        this.btn.addEventListener('click', this._action);
    }
}
