import { vec2 } from "gl-matrix";
import { GameObject } from "./GameObject";
import { Paddle } from "./Paddle";

export class Ball extends GameObject {
    public isStuck = true;
    public velocity: vec2 = [0, 0];
    public unbreakable = false;
    
    public baseVelocity: vec2 = [400, 400];

    constructor() {
        super('ball_powered');
        this.collider.size[0] = 32;
        this.collider.size[1] = 32;
        this.collider.position[0] = 128 - (this.collider.size[0] / 2);
        this.collider.position[1] = 768 - (64 + this.collider.size[0] + 3);
        this.color = [1.01, 0, 0.156];
    }

    public update(dt: number, screenSize: vec2, paddle: Paddle) {
        if (this.isStuck) {
            this.collider.position[0] = paddle.collider.position[0] + (paddle.width / 2) - (this.width / 2);
            return;
        }
        this.collider.position[0] += this.velocity[0] * dt;
        this.collider.position[1] += this.velocity[1] * dt;

        if (this.collider.position[0] <= 0) {
            this.collider.position[0] = 0;
            this.velocity[0] = -this.velocity[0];
        }
        if (this.collider.position[0] >= (screenSize[0] - this.width)) {
            this.collider.position[0] = screenSize[0] - this.width;
            this.velocity[0] = -this.velocity[0];
        }

        if (this.collider.position[1] <= 0) {
            this.collider.position[1] = 0;
            this.velocity[1] = -this.velocity[1];
        }

        this.rotation += dt * 10;
    }
}
