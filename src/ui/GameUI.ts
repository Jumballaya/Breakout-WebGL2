import { EventEmitter } from "../game/EventEmitter";
import { Dialog } from "./Dialog";

const rules = `
    <div class="game-rules">
        <h1>Breakout!</h1>
        <p class="game-rules--explaination">
            <a href="https://en.wikipedia.org/wiki/Breakout_(video_game)">Breakout</a> is a game originally designed by Steve Wozniak where the player controls a paddle to hit a ball to break the level's bricks.
        </p>
        <p>
            The game has 3 major components: the paddle, ball and bricks.
        </p>
        <p>
            The paddle moves from side to side using the <strong>&lt;a&gt;</strong> and <strong>&lt;d&gt;</strong> keys and it used to bounce the ball, similar to Pong, but the movement is horizontal instead of vertical. The ball bounces around the level and when it collides with a breakable brick, the brick will be destroyed. There are 2 types of bricks: breakable and unbreakable. The unbreakable bricks deflect the ball without being destroyed and the breakable bricks are destroyed on contact with the ball.
        </p>
        <p>
            The game is made up of levels filled with bricks and when the level has ran out of breakable bricks a message with display letting you know you have completed that level, and powerups occasionally spawn after destroying a brick.
        </p>
        <div class="game-rules--powerups">
            <div class="powerup--section">
                <div class="powerup--section--image">
                    <img src="example/textures/powerup-ball-speed.png" />
                    <label>Ball Speed Increase</label>
                </div>
                <div class="powerup--section--name">
                     This will increase the base velocity of the ball, as well as give a slight boost to the paddle speed to help deal with the new ball speed.
                </div>
            </div>
            <div class="powerup--section">
                <div class="powerup--section--image">
                    <img src="example/textures/powerup-paddle.png" />
                    <label>Paddle Size</label>
                </div>
                <div class="powerup--section--name">
                    This will increase the paddle size a little bit.
                </div>
            </div>
            <div class="powerup--section">
                <div class="powerup--section--image">
                    <img src="example/textures/powerup-pass-through.png" />
                    <label>Ghost Mode</label>
                </div>
                <div class="powerup--section--name">
                    The ball will no longer be deflected by regular bricks, allowing you to destroy a bunch of bricks before its timer runs out. While in Ghost Mode, the ball's sparkle trail is rainbow colored instead of white.
                </div>
            </div>
            <div class="powerup--section">
                <div class="powerup--section--image">
                    <img src="example/textures/powerup-sticky.png" />
                    <label>Sticky Paddle</label>
                </div>
                <div class="powerup--section--name">
                    The ball sticks to the center of the paddle everytime it lands.
                </div>
            </div>
            <div class="powerup--section">
                <div class="powerup--section--image">
                    <img src="example/textures/powerup-pixelated.png" />
                    <label>Pixel world</label>
                </div>
                <div class="powerup--section--name">
                    This one is a negative that will pixelate the game, making it harder to see. It will also be colored red unlike the rest of the powerups.
                </div>
            </div>
        </div>
        <button id="rules-btn">Close and Start</button>
    </div>
`;

export class GameUI extends EventEmitter<null> {
    private root: HTMLDivElement;
    private ballCount: HTMLHeadingElement;
    private title: HTMLHeadingElement;
    private message: HTMLHeadingElement;
    private points: HTMLHeadingElement;

    public dialog: Dialog;
    public gameRules: HTMLDivElement;
    
    public gameContainer: HTMLDivElement;

    constructor() {
        super();
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

        this.gameRules = document.createElement('div');
        this.gameRules.classList.add('game-rules--container');
        this.gameRules.innerHTML = rules;
        this.gameRules.querySelector('#rules-btn')?.addEventListener('click', () => {
            this.emit('close-rules', null);
            this.gameRules.style.visibility = 'hidden';
        });
        this.root.appendChild(this.gameRules);
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
