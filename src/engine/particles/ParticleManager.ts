import { mat4, vec2 } from "gl-matrix";
import { VertexBuffer } from "../gl/VertexBuffer";
import { GeometryLibrary } from "../library/GeometryLibrary";
import { Particle } from "./Particle";
import { Shader } from "../gl/Shader";
import { ShaderLibrary } from "../library/ShaderLibrary";
import { TextureLibrary } from "../library/TextureLibrary";
import { Texture } from "../gl/Texture";

export class ParticleManager {
    private ctx: WebGL2RenderingContext;
    private particles: Float32Array
    private vertex: VertexBuffer;
    private shader: Shader;
    public texture: Texture;
    private capacity = 100;

    private pointer = 0;

    public position: vec2;
    private spawnRange: vec2;

    public inRainbowMode = false;

    constructor(ctx: WebGL2RenderingContext, name: string, position: vec2, spawnRange: vec2, geoLib: GeometryLibrary, shaderLib: ShaderLibrary, texLib: TextureLibrary, capacity = 100) {
        this.position = position;
        this.spawnRange = spawnRange;
        this.capacity = capacity;
        this.ctx = ctx;
        this.particles = new Float32Array(this.capacity * 8 * 6);
        geoLib.create(`particle_manager_${name}`, {
            stride: 32,
            data: this.particles,
            drawType: WebGL2RenderingContext.DYNAMIC_DRAW,
            sections: [
                // Position
                {
                    type: WebGL2RenderingContext.FLOAT,
                    size: 2,
                    normalized: false,
                },
                // UV
                {
                    type: WebGL2RenderingContext.FLOAT,
                    size: 2,
                    normalized: false,
                },
                // Color
                {
                    type: WebGL2RenderingContext.FLOAT,
                    size: 3,
                    normalized: false,
                },
                // Life
                {
                    type: WebGL2RenderingContext.FLOAT,
                    size: 1,
                    normalized: false,
                },
            ],
        });
        this.vertex = geoLib.get(`particle_manager_${name}`)!;
        this.shader = shaderLib.get('particle')!;
        this.texture = texLib.get('particle')!;
    }

    public render(projMatrix: mat4) {
        this.shader.uniform('u_texture', { type: 'texture', value: this.texture.id });
        this.shader.uniform('u_proj_matrix', { type: 'mat4', value: projMatrix });
        this.texture.bind();
        this.vertex.bind();
        this.shader.bind();
        this.ctx.drawArrays(this.ctx.TRIANGLES, 0, this.pointer * 6);
        this.shader.unbind();
        this.vertex.unbind();
        this.texture.unbind();

        for (let i = 0; i < this.pointer; i++) {
            const base = (i * 8 * 6);
            for (let i = 0; i < 6; i++) {
                const idx = base + (i * 8) + 7;
                this.particles.set([this.particles[idx]+1], idx);
            }
        }
        this.vertex.update();
    }

    public spawn() {
        const id = this.pointer++;
        if (this.pointer >= this.capacity) {
            this.pointer = 0;
        }
        const particle =  new Particle(id, this);
        particle.position = this.position;
        particle.position = [
            this.position[0] + (this.spawnRange[0] / 2 - Math.random() * this.spawnRange[0]),
            this.position[1] + (this.spawnRange[1] / 2 - Math.random() * this.spawnRange[1]),
        ];

        if (this.inRainbowMode) {
            particle.color = [Math.random(), Math.random(), Math.random()];
        }
        return particle;
    }

    public set(id: number, data: number[]) {
        this.particles.set(data, id);
        this.vertex.update();
    }

    public reset(position: vec2) {
        this.position = position;
        this.particles.fill(0);
        this.pointer = 0;
        this.inRainbowMode = false;
    }
}
