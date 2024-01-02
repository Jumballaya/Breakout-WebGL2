import { Collision } from "../engine/physics/types/collision.type";
import { GameLevel } from "./GameLevel";
import { Ball } from "./objects/Ball";
import { Paddle } from "./objects/Paddle";
import { vec2 } from "gl-matrix";

export class PhysicsManager {

    private ball: Ball;
    private paddle: Paddle;

    constructor(ball: Ball, paddle: Paddle) {
        this.ball = ball;
        this.paddle = paddle;
    }

    public handleLevelCollisions(level: GameLevel) {
        const levelCollissions = level.handleCollisions(this.ball);
        if (levelCollissions.length > 0) {
            for (const collision of levelCollissions) {
                if (!this.ball.unbreakable || collision.unbreakable) {
                    this.handleBallBrickCollision(collision);
                }
            }
        }
        return levelCollissions;
    }

    public handlePaddleCollisions() {
        const paddleCollision = this.ball.checkCollision(this.paddle);
        if (paddleCollision !== null && !this.ball.isStuck) {
            const centerBoard = this.paddle.collider.position[0] + this.paddle.collider.size[0] / 2;
            const distance = (this.ball.collider.position[0] + this.ball.collider.radius) - centerBoard;
            const percentage = distance / (this.paddle.collider.size[0] / 2);
            const strength = 2;

            const oldVel = this.ball.velocity;
            this.ball.velocity[0] = this.ball.baseVelocity[0] * percentage * strength;
            this.ball.velocity[1] = -1 * Math.abs(this.ball.baseVelocity[1]);
            const normalize = vec2.create();
            vec2.normalize(normalize, this.ball.velocity);
            const mag = vec2.length(oldVel);
            this.ball.velocity[0] = mag * normalize[0];
            this.ball.velocity[1] = mag * normalize[1];
        }
        return paddleCollision;
    }

    private handleBallBrickCollision(collision: Collision) {
        if (collision.direction === 'left' || collision.direction === 'right') {
            this.ball.velocity[0] = -this.ball.velocity[0];
            this.ball.velocity[0] += (Math.random() > 0.4999 ? -1 : 1) * Math.random() * 15;
            const penetration = this.ball.collider.radius - Math.abs(collision.difference[0]);
            if (collision.direction === 'left') {
                this.ball.collider.position[0] -= penetration;
            } else {
                this.ball.collider.position[0] += penetration;
            }
        } else {
            this.ball.velocity[1] = -this.ball.velocity[1];
            this.ball.velocity[1] += (Math.random() > 0.4999 ? -1 : 1) * Math.random() * 15;
            const penetration = this.ball.collider.radius - Math.abs(collision.difference[1]);
            if (collision.direction === 'up') {
                this.ball.collider.position[1] += penetration;
            } else {
                this.ball.collider.position[1] -= penetration;
            }
        }
    }
}
