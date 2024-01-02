import { vec2 } from "gl-matrix";
import { GameObject } from "./GameObject";

export class Paddle extends GameObject {

    public velocity = 700;
   
    constructor() {
        super('paddle');
        this.collider.size[0] = 160;
        this.collider.size[1] = 32;
        this.collider.position[0] = 64;
        this.collider.position[1] = 768 - 64;
    }

    public update(screenSize: vec2) {
        if (this.collider.position[0] <= 0) {
            this.collider.position[0] = 0;
        }
        if (this.collider.position[0] >= (screenSize[0] - this.width)) {
            this.collider.position[0] = screenSize[0] - this.width;
        }
    }

    public reset() {
        this.velocity = 700;
        this.collider.size[0] = 160;
        this.collider.size[1] = 32;
        this.collider.position[0] = 64;
        this.collider.position[1] = 768 - 64;
    }
}
