import { vec2 } from "gl-matrix";
import type { Collision, CollisionDirection } from "./types/collision.type";

type ColliderType = 'rectangle' | 'circle';

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

export class Collider {
    public size: vec2;
    public position: vec2;
    public type: ColliderType

    public radius = 0;

    constructor(size: vec2, position: vec2, type: ColliderType) {
        this.size = size;
        this.position = position;
        this.type = type;

        if (this.type === 'circle') this.radius = this.size[0] / 2;
    }

    public checkCollision(co: Collider): Collision | null {
        const types: `${ColliderType}${ColliderType}` = `${this.type}${co.type}`
        switch (types) {
            case 'circlerectangle':
            case 'rectanglecircle': {
                return this.checkCircleRect(co);
            }
           case 'circlecircle': {
                return this.checkCircleCircle(co);
           }
           case 'rectanglerectangle': {
                return this.checkRectRect(co);
           }
        }
    }

    private checkCircleRect(co: Collider): Collision | null {
        const [circle, rect] = this.type === 'circle' ? [this, co] : [co, this];
        const center = vec2.fromValues(circle.position[0] + circle.radius, circle.position[1] + circle.radius);
        const aabbHalfExtents = vec2.fromValues(rect.size[0] / 2, rect.size[1] / 2);
        const aabbCenter = vec2.create();
        vec2.add(aabbCenter, rect.position, aabbHalfExtents);
        const difference = vec2.create();
        vec2.sub(difference, center, aabbCenter);
        const clamped: vec2 = [
            clamp(difference[0], -aabbHalfExtents[0], aabbHalfExtents[0]),
            clamp(difference[1], -aabbHalfExtents[1], aabbHalfExtents[1]),
        ];
        const closest = vec2.create();
        vec2.add(closest, aabbCenter, clamped);
        vec2.sub(difference, closest, center);
        const collided = vec2.length(difference) < circle.radius;
        if (!collided) return null;

        const pos = vec2.create();
        vec2.sub(pos, co.position, difference);
        return {
            direction: this.getVectorDirection(difference as vec2),
            difference: difference as vec2,
            position: pos,
        };
    }

    private checkCircleCircle(_: Collider): Collision | null {
        return null;
    }

    private checkRectRect(co: Collider): Collision | null {
        const colX = (this.position[0] + this.size[0]) >= co.position[0]
            && co.position[0] + co.size[0] >= this.position[0];
        const colY = (this.position[1] + this.size[1]) >= co.position[1]
            && co.position[1] + co.size[1] >= this.position[1];

        const collided = colX && colY;
        if (!collided) return null;

        const aabbHalfExtentsA = vec2.fromValues(this.size[0] / 2, this.size[1] / 2);
        const aabbCenterA = vec2.create();
        vec2.add(aabbCenterA, this.position, aabbHalfExtentsA);

        const aabbHalfExtentsB = vec2.fromValues(co.size[0] / 2, co.size[1] / 2);
        const aabbCenterB = vec2.create();
        vec2.add(aabbCenterB, co.position, aabbHalfExtentsB);

        const difference = vec2.create();
        vec2.sub(difference, aabbCenterA, aabbCenterB);
        const clamped: vec2 = [
            clamp(difference[0], -aabbHalfExtentsB[0], aabbHalfExtentsB[0]),
            clamp(difference[1], -aabbHalfExtentsB[1], aabbHalfExtentsB[1]),
        ];
        const closest = vec2.create();
        vec2.add(closest, aabbCenterB, clamped);
        vec2.sub(difference, closest, aabbCenterA);
        
        const pos = vec2.create();
        vec2.sub(pos, co.position, difference);
        return {
            direction: this.getVectorDirection(difference as vec2),
            difference: difference as vec2,
            position: pos,
        };
    }

    private getVectorDirection(target: vec2): CollisionDirection {
        const compass: vec2[] = [
            [ 0,  1], // up
            [ 1,  0], // right
            [ 0, -1], // down
            [-1,  0], // left
        ];
        let max = 0;
        let bestMatch = -1;
        let normal = vec2.create();
        for (let i = 0; i < 4; i++) {
            vec2.normalize(normal, target);
            const dot = vec2.dot(normal, compass[i]);
            if (dot > max) {
                max = dot;
                bestMatch = i;
            }
        }
        const table: CollisionDirection[] = ['up', 'right', 'down', 'left']
        return table[bestMatch];
    }
}
