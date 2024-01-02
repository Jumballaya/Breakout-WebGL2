import { vec2 } from "gl-matrix";
import { Collision } from "../engine/physics/types/collision.type";
import { Paddle } from "./objects/Paddle";
import { Powerup, PowerupType } from "./objects/Powerup";
import { SpriteRenderer } from "../engine/sprites/SpriteRenderer";

export class PowerupManager {
    private activePowerups: Array<Powerup> = [];

    public render(renderer: SpriteRenderer) {
        for (const powerup of this.activePowerups) {
            renderer.render(
                powerup.texture,
                powerup.collider.size,
                powerup.collider.position,
                powerup.rotation,
                powerup.color,
            );
        }
    }

    public clear() {
        this.activePowerups = [];
    }
    
    public update(dt: number) {
        for (const powerup of this.activePowerups) {
            const pos = powerup.collider.position;
            powerup.collider.position = [pos[0], pos[1] + powerup.velocity * dt];
        }
    }

    public checkPaddleCollisions(paddle: Paddle): Array<Collision & { type: PowerupType }> {
        const collisions: Array<Collision & { type: PowerupType }> = [];
        let i = 0;
        for (let pu of this.activePowerups) {
            const col = pu.checkCollision(paddle);
            if (col) {
                collisions.push({ ...col, type: pu.type });
                pu.collider.position = [pu.collider.position[0], 10000];
            }
            i++;
        }
        return collisions;
    }

    public cullOutOfBounds(screenSize: vec2) {
        let i = 0;
        for (let pu of this.activePowerups) {
            if (pu.collider.position[1] > screenSize[1]) {
                delete this.activePowerups[i];
            }
            i++;
        }
        this.activePowerups = this.activePowerups.filter(x => x);
    }

    public randomSpawn(position: vec2) {
        const type = this.getRandomType();
        if (type === null) return;
        const powerup = new Powerup(type);
        powerup.collider.position = [...position] as vec2;
        this.activePowerups.push(powerup);
    }

    private getRandomType(): PowerupType | null {
        let roll = Math.random();
        if (roll < 0.25) return null;
        roll = Math.random();
        if (roll < 0.1) {
            return 'pixelated';
        }
        if (roll > 0.9) {
            return 'pass-through';
        }
        if (roll > 0.8) {
            return 'sticky';
        }
        if (roll > 0.4) {
            roll = Math.random();
            if (roll > 0.5) {
                return 'paddle';
            }
            return 'ball-speed';
        }
        return null;
    }
}
