import { vec3 } from "gl-matrix";
import { Collider } from "../../engine/physics/Collider";

export class GameObject {
   public texture: string;
   public rotation = 0;
   public color: vec3 = [1, 1, 1];
   public collider: Collider;

   constructor(texture: string) {
        this.texture = texture;
        this.collider = new Collider([0, 0], [1, 1], 'rectangle');
   }

    public get width(): number {
        return this.collider.size[0];
    }

    public get height(): number {
        return this.collider.size[1];
    }

    public checkCollision(go: GameObject) {
        return this.collider.checkCollision(go.collider);
    }
}
