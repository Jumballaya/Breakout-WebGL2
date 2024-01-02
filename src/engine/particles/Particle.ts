import { vec2, vec3 } from "gl-matrix";
import { ParticleManager } from "./ParticleManager";
import { quadVertices } from "../../game/objects/vertices/quad";

const offsets = (s: number) => ([
    [0, s],
    [s, s],
    [s, 0],
    [0, s],
    [s, 0],
    [0, 0],
]);

export class Particle {
    private id: number;
    private manager: ParticleManager;

    private size = 10;

    private data = {
        position: [0, 0] as vec2,
        velocity: [0, 0] as vec2,
        color: [1,1,1] as vec3,
        life: 0,
    };

    constructor(id: number, manager: ParticleManager) {
        this.id = id;
        this.manager = manager;
        this.reset();
    }

    public update() {
        this.data.position[0] += this.data.velocity[0];
        this.data.position[1] += this.data.velocity[1];
        this.fullSet();    
    }

    public get velocity(): vec2 {
        return this.data.velocity;
    }

    public set velocity(v: vec2) {
        this.data.velocity = v;
    }

    public get position(): vec2 {
        return this.data.position;
    }

    public set position(p: vec2) {
        this.data.position[0] = p[0];
        this.data.position[1] = p[1];
        const idx = this.id * 8 * 6;

        const offset = offsets(this.size); 
        for (let i = 0; i < 6; i += 1) {
            const base = idx + (i*8);
            this.manager.set(base, [
                this.data.position[0] + offset[i][0], this.data.position[1] + offset[i][1],
            ]);
        }
    }

    public get color(): vec3 {
        return this.data.color;
    }

    public set color(c: vec3) {
        this.data.color[0] = c[0];
        this.data.color[1] = c[1];
        this.data.color[2] = c[2];
        const idx = this.id * 8 * 6;
        
        for (let i = 0; i < 6; i += 1) {
            const base = idx + (i*8);
            this.manager.set(base+4, this.data.color as number[]);
        }
    }

    public get life(): number {
        return this.data.life;
    }

    public set life(l: number) {
        this.data.life = l;
        const idx = this.id * 8 * 6;
        
        for (let i = 0; i < 6; i += 1) {
            const base = idx + (i*8);
            this.manager.set(base+7, [this.data.life]);
        }
    }

    private fullSet() {
        const idx = this.id * 8 * 6;
        const off = offsets(this.size);
        for (let i = 0; i < 6; i += 1) {
            const base = idx + (i*8);
            this.manager.set(base, [
                this.data.position[0] + off[i][0], this.data.position[1] + off[i][1],
                quadVertices[i*2], quadVertices[(i*2)+1],
                this.data.color[0], this.data.color[1], this.data.color[2],
                this.data.life,
            ]);
        }
    }

    private reset() {
        this.data.position = this.manager.position;
        this.data.velocity = [0, 0];
        this.data.color = [1, 1, 1];
        this.data.life = 0;
        const idx = this.id * 8 * 6;
        const off = offsets(this.size);
        for (let i = 0; i < 6; i += 1) {
            const base = idx + (i*8);
            this.manager.set(base, [
                this.data.position[0] + off[i][0], this.data.position[1] + off[i][1],
                quadVertices[i*2], quadVertices[(i*2)+1],
                this.data.color[0], this.data.color[1], this.data.color[2],
                this.data.life,
            ]);
        }
    }
}
