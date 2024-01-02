import { Dialog } from "./Dialog";

export class GameUI {
    private root: HTMLDivElement;
    private ballCount: HTMLHeadingElement;
    private title: HTMLHeadingElement;
    private message: HTMLHeadingElement;
    private points: HTMLHeadingElement;

    public dialog: Dialog;
    
    public gameContainer: HTMLDivElement;

    constructor() {
        this.root = document.createElement('div');
        this.ballCount = document.createElement('h1');
        this.points = document.createElement('h1');
        this.title = document.createElement('h1');
        this.gameContainer = document.createElement('div');

        this.root.classList.add('game-container');
        const gameInfo = document.createElement('div');
        gameInfo.classList.add('game-info');
        gameInfo.appendChild(this.title);
        gameInfo.appendChild(this.points);
        gameInfo.appendChild(this.ballCount);
        this.root.appendChild(gameInfo);

        this.message = document.createElement('h1');
        this.message.classList.add('game-message');
        this.message.classList.add('fade-out');
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('game-message--container');
        messageContainer.appendChild(this.message);
        this.root.appendChild(messageContainer);

        document.body.appendChild(this.root);
        this.root.appendChild(this.gameContainer);

        this.dialog = new Dialog(this.root, 'Yay! You won!', () => {
            this.dialog.toggle();
        });
    }

    public updateBallCount(count: number) {
        this.ballCount.innerText = `Balls: ${count}`;
    }

    public updateTitle(title: string) {
        this.title.innerText = title;
    }

    public updatePoints(points: number) {
        this.points.innerText = `${points} points`;
    }

    public setMessage(message: string) {
       this.message.classList.remove('fade-out');
       this.message.classList.add('fade-in');
       this.message.innerText = message;
       setTimeout(() => {
           this.message.classList.remove('fade-in');
           this.message.classList.add('fade-out');
       }, 3000);
    }
}
