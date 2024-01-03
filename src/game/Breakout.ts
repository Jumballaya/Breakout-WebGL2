import { mat4, vec2 } from "gl-matrix";
import { SpriteRenderer } from "../engine/sprites/SpriteRenderer";
import { GameLevel } from "./GameLevel";
import { GameData } from "./types/game-data.type";
import { Paddle } from "./objects/Paddle";
import { Inputs } from "./Inputs";
import { Ball } from "./objects/Ball";
import { ParticleManager } from "../engine/particles/ParticleManager";
import { Surface } from "../engine/gl/Surface";
import { ResourceManager } from './ResourceManager';
import { EventEmitter } from './EventEmitter';
import { PhysicsManager } from "./PhysicsManager";
import { PowerupManager } from "./PowerupManager";


type BreakoutEvent = {
    event: string;
    currentLevel: string;
    balls: number;
    points: number;
}

export class Breakout extends EventEmitter<BreakoutEvent> {
    private data: GameData;
    private screenSize: vec2;
    private screen: Surface;
    private gl: WebGL2RenderingContext;

    // Managers
    private inputs: Inputs;
    private resources: ResourceManager;
    private particleManager: ParticleManager;
    private spriteRenderer: SpriteRenderer;
    private physicsManager: PhysicsManager;
    private powerupManager: PowerupManager;

    // Game Entities
    private paddle: Paddle;
    private ball: Ball;
    // Levels
    private levels: Record<string, GameLevel> = {};

    // State
    private time = 0;
    private balls = 3;
    private currentLevel = '';
    private projMatrix: mat4;
    private stickyPowerup = {
        active: false,
        time: 0,
    };
    private passThroughPowerup = {
        active: false,
        time: 0,
    };
    private pixelPowerup = {
        active: false,
        time: 0,
        level: 4,
    }
    private points = 0;
    public running = false;

    constructor(data: GameData, container: HTMLElement) {
        super();
        this.data = data;
        this.screenSize = data.screenSize;

        const canvas = document.createElement('canvas');
        canvas.width = data.screenSize[0];
        canvas.height = data.screenSize[1];
        this.inputs = new Inputs(document.body);
        container.appendChild(canvas);

        const gl = canvas.getContext('webgl2');
        if (!gl) throw new Error('could not create webgl2 context');
        this.gl = gl;
        this.gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        this.resources = new ResourceManager({ context: { gl } });
        this.spriteRenderer = new SpriteRenderer(
            gl,
            this.resources.textures,
            this.resources.geometries,
            this.resources.shaders
        );
        this.screen = new Surface(
            gl,
            'quad',
            [this.screenSize[0], this.screenSize[1]],
            'screen',
            this.resources.shaders,
            this.resources.geometries
        );
        this.screen.disable();

        this.projMatrix = mat4.create() as mat4;
        mat4.ortho(this.projMatrix, 0, data.screenSize[0], data.screenSize[1], 0, -1, 1);
        this.resources.shaders.get('sprite')?.uniform('u_proj_matrix', {type: 'mat4', value: this.projMatrix });

        this.paddle = new Paddle();
        this.ball = new Ball();
        this.physicsManager = new PhysicsManager(this.ball, this.paddle);
        this.particleManager = new ParticleManager(
            gl,
            'ball-sparkles',
            [0,0],
            [30, 30],
            this.resources.geometries,
            this.resources.shaders,
            this.resources.textures,
            500
        );
        this.powerupManager = new PowerupManager();
    }

    static async FromFile(path: string, container: HTMLElement): Promise<Breakout> {
        const res = await fetch(path);
        const json = await res.json() as GameData;
        const game = new Breakout(json, container);
        return game;
    }

    async load() {
        for (const [name, path] of Object.entries(this.data.textures)) {
            await this.resources.textures.create(name, path);
        }
        for (const [name, path] of Object.entries(this.data.sounds)) {
            await this.resources.audio.loadSound(name, path);
        }
        for (const level of this.data.levels) {
            const lvl = await GameLevel.FromFile(level);
            if (this.currentLevel === '') this.currentLevel = lvl.title;
            this.levels[lvl.title] = lvl;
        }
        this.particleManager.texture = this.resources.textures.get('particle')!;
        this.emitEvent('load-game');
    }

    public start() {
        this.emitEvent('game-start');
        this.running = true;
        let time = Date.now();
        const loop = () => {
            const cur = Date.now();
            const dt = (cur - time) / 1000;
            time = cur;
            this.tick(dt);
            requestAnimationFrame(loop);
        }
        loop();
    }

    public pause() {
        this.running = false;
    }

    public unpause() {
        this.running = true;
    }

    // dt is in seconds (usually around 0.016 for 60FPS)
    public tick(dt: number) {
        if (this.running) {
            this.handleGamePlayInputs(dt);
            this.paddle.update(this.screenSize);
            this.ball.update(dt, this.screenSize, this.paddle);
            this.powerupManager.update(dt);
            this.handleCollisions();
            this.handlePowerups(dt);
            this.checkWinCondition();
        }
        this.render();
        this.time += dt * 1000;
    }

    public reset() {
        this.time = 0;
        this.balls = 3;
        this.points = 0;
        this.resetBall();
        this.paddle.reset();
        this.particleManager.reset(this.paddle.collider.position);
        this.powerupManager.clear();
        this.currentLevel = Object.keys(this.levels)[0];
        this.stickyPowerup.active = false;
        this.stickyPowerup.time = 0;
        this.passThroughPowerup.active = false;
        this.passThroughPowerup.time = 0;
        this.pixelPowerup.active = false;
        this.pixelPowerup.time = 0;
        this.pixelPowerup.level = 4;
        this.screen.pixelAmout = 1;

        for (const lvl of Object.values(this.levels)) {
            lvl.reset();
        }

        this.running = true;
        this.emitEvent('game-reset');
    }

    private render() {
        // Render to the main screen surface
        this.screen.enable();
        // Background
        this.spriteRenderer.render('background', this.screenSize, [0,0]);

        // Level
        this.levels[this.currentLevel].render(this.spriteRenderer);

        // Paddle
        this.spriteRenderer.render(
            this.paddle.texture,
            this.paddle.collider.size,
            this.paddle.collider.position,
            this.paddle.rotation,
            this.paddle.color,
        );

        // Power ups
        this.powerupManager.render(this.spriteRenderer);

        // Ball particles
        this.particleManager.position = [
            this.ball.collider.position[0] + 8,
            this.screenSize[1] - this.ball.collider.position[1] - 16,
        ];
        this.particleManager.render(this.screen.ortho);
        if (this.running) this.particleManager.spawn();

        // Ball
        this.spriteRenderer.render(
            this.ball.texture,
            this.ball.collider.size,
            this.ball.collider.position,
            this.ball.rotation,
            this.ball.color,
        );

        this.screen.disable();

        // Render the screen
        this.screen.draw(this.time);
    }

    private handleGamePlayInputs(dt: number) {
        if (this.inputs.isPressed('a')) {
            this.paddle.collider.position[0] -= this.paddle.velocity * dt;
        }
        if (this.inputs.isPressed('d')) {
            this.paddle.collider.position[0] += this.paddle.velocity * dt;
        }
        if (this.inputs.isPressed(' ') && this.ball.isStuck) {
            this.ball.isStuck = false; 
            this.ball.velocity[0] = (Math.random() > 0.5 ? -1 : 1) * this.ball.baseVelocity[0];
            this.ball.velocity[1] = -this.ball.baseVelocity[1];
        }
    }

    private handleCollisions() {
        const level = this.levels[this.currentLevel];
        const levelCollissions = this.physicsManager.handleLevelCollisions(level);
        if (levelCollissions.length > 0) {
            for (const collision of levelCollissions) {
                if (collision.unbreakable) {
                    if (this.pixelPowerup.active) {
                        this.resources.audio.play('impact_metal_pixelated');
                    } else {
                        this.resources.audio.play('impact_metal');
                    }
                    this.screen.isShaking = true;
                    setTimeout(() => {
                        this.screen.isShaking = false;
                    }, 30);
                } else {
                    this.powerupManager.randomSpawn(collision.position);
                    this.points += 10;
                    if (this.pixelPowerup.active) {
                        this.resources.audio.play('impact_brick_pixelated');
                    } else {
                        this.resources.audio.play('impact_brick');
                    }
                }
            }
            this.emitEvent('update-points');
        }

        const paddleCollision = this.physicsManager.handlePaddleCollisions();
        if (paddleCollision && this.stickyPowerup.active) {
            this.ball.isStuck = true;
        }
    }

    private handlePowerups(dt: number) {
        if (this.stickyPowerup.active) {
            this.stickyPowerup.time += dt;
            if (this.stickyPowerup.time > 10) {
                this.stickyPowerup.time = 0;
                this.stickyPowerup.active = false;
            }
        }
        if (this.passThroughPowerup.active) {
            this.passThroughPowerup.time += dt;
            if (this.passThroughPowerup.time > 6) {
                this.passThroughPowerup.time = 0;
                this.passThroughPowerup.active = false;
                this.ball.unbreakable = false;
                this.particleManager.inRainbowMode = false;
            }
        }
        if (this.pixelPowerup.active) {
            this.pixelPowerup.time += dt;
            if (this.pixelPowerup.time > 10) {
                this.pixelPowerup.time = 0;
                this.pixelPowerup.active = false;
                this.screen.pixelAmout = 1;
            }
        }
        const collisions = this.powerupManager.checkPaddleCollisions(this.paddle);
        for (let col of collisions) {
            this.points += 5;
            if (col.type === 'paddle') {
                const paddleSize = this.paddle.collider.size;
                paddleSize[0] += 12;
                this.paddle.collider.size = paddleSize;
            }
            if (col.type === 'ball-speed') {
                const ballVel = this.ball.baseVelocity;
                this.ball.baseVelocity = [ballVel[0] + 50, ballVel[1] + 50];
                this.paddle.velocity += 100;
            }
            if (col.type === 'sticky' && !this.stickyPowerup.active) {
                this.stickyPowerup.active = true;
                this.stickyPowerup.time = 0;
            }
            if (col.type === 'pass-through' && !this.passThroughPowerup.active) {
                this.ball.unbreakable = true;
                this.passThroughPowerup.active = true;
                this.passThroughPowerup.time = 0;
                this.particleManager.inRainbowMode = true;
            }
            if (col.type === 'pixelated') {
                if (this.pixelPowerup.active) {
                    this.pixelPowerup.level += 2;
                    if (this.pixelPowerup.level > 6) {
                        this.pixelPowerup.level = 6;
                    }
                    this.screen.pixelAmout = this.pixelPowerup.level;
                } else {
                    this.pixelPowerup.active = true;
                    this.pixelPowerup.time = 0;
                    this.screen.pixelAmout = this.pixelPowerup.level;
                }
            }
        }
        if (collisions.length > 0) {
            this.emitEvent('update-points');
            this.resources.audio.play('impact_powerup');
        }
        this.powerupManager.cullOutOfBounds(this.screenSize);
    }

    private checkWinCondition() {
        if (this.ball.collider.position[1] >= this.screenSize[1]) {
            this.balls -= 1;
            this.ball.baseVelocity = [400, 400];
            this.emitEvent('ball-count');
            if (this.balls <= 0) {
                this.emitEvent('game-lost');
                this.resources.audio.play('lost_game');
                this.pause();
                return;
            }; 
            this.ball.isStuck = true;
            this.resetBall();
        }
        if (this.balls === 0) {
            this.pause();
            return;
        }
        const level = this.levels[this.currentLevel];
        if (level.isEmpty()) {
            if (level.nextLevel) {
                this.powerupManager.clear();
                this.emitEvent('level-won');
                this.resources.audio.play('level_win');
                this.pause();
            } else {
                this.emitEvent('game-won');
                this.pause();
            }
        }
    }

    private resetBall() {
        this.ball.isStuck = true;
        this.ball.collider.position[0] = this.paddle.collider.position[0] + (this.paddle.width / 2) - (this.ball.width / 2);
        this.ball.collider.position[1] = this.paddle.collider.position[1] - (this.paddle.height);
        this.ball.baseVelocity = [400, 400];
        this.ball.unbreakable = false;
    }

    private emitEvent(evt: string) {
        this.emit(evt, {
            event: evt,
            balls: this.balls,
            currentLevel: this.currentLevel,
            points: this.points,
        })
    }

    public nextLevel() {
        const level = this.levels[this.currentLevel];
        this.currentLevel = level.nextLevel;
        this.emitEvent('level-change');
        this.resetBall();
        this.powerupManager.clear();
    }
}

