import { Collision } from "../engine/physics/types/collision.type";
import { SpriteRenderer } from "../engine/sprites/SpriteRenderer";
import { Ball } from "./objects/Ball";
import { Brick } from "./objects/Brick";
import { LevelData } from "./types/level-data.type";

export class GameLevel {
    
    public title: string;
    public nextLevel: string;
    private bricks: Array<Brick> = [];

    private data: LevelData;

    constructor(data: LevelData) {
        this.title = data.title;
        this.nextLevel = data.nextLevel;
        this.data = data;
        this.reset();
    }

    static async FromFile(path: string) {
        const res = await fetch(path);
        const json = await res.json();
        return new GameLevel(json);
    }

    public render(renderer: SpriteRenderer) {
        for (const brick of this.bricks) {
            if (!brick.destroyed) {
                renderer.render(
                    brick.texture,
                    brick.collider.size,
                    brick.collider.position,
                    brick.rotation,
                    brick.color,
                );
            }
        }
    }

    public reset() {
        this.bricks = [];
        for (const brick of this.data.bricks) {
            const br = new Brick(brick.sprite);
            br.collider.position[0] = brick.position[0];
            br.collider.position[1] = brick.position[1];
            br.collider.size[0] = this.data.brickSize[0];
            br.collider.size[1] = this.data.brickSize[1];
            br.color[0] = brick.color[0];
            br.color[1] = brick.color[1];
            br.color[2] = brick.color[2];
            br.unbreakable = brick.unbreakable ?? false;
            this.addBrick(br);
        }
    }

    public handleCollisions(ball: Ball): Array<Collision & { unbreakable: boolean; }> {
        const collisions: Array<Collision & { unbreakable: boolean; }> = [];
        for (const brick of this.bricks) {
            if (brick.destroyed) continue;

            const collision = ball.checkCollision(brick);
            if (collision == null) continue;
            collisions.push({ ...collision, unbreakable: brick.unbreakable });

            if (!brick.unbreakable) brick.destroyed = true;
        }
        return collisions;
    }

    public isEmpty() {
        return this.bricks.filter(b => !b.unbreakable && !b.destroyed).length === 0;
    }

    private addBrick(brick: Brick) {
       this.bricks.push(brick); 
    }

}
