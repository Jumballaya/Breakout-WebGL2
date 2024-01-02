import { VertexBuffer } from "../gl/VertexBuffer";
import { VertexBufferConfig } from "../gl/types/vertex.type";

export class GeometryLibrary {

    private ctx: WebGL2RenderingContext;
    private buffers: Map<string, VertexBuffer>;

    constructor(ctx: WebGL2RenderingContext) {
        this.ctx = ctx;
        this.buffers = new Map();
    }

    public create(name: string, config: VertexBufferConfig) {
        const buffer = new VertexBuffer(this.ctx, config);
        this.buffers.set(name, buffer);
    }

    public get(name: string): VertexBuffer | undefined {
        return this.buffers.get(name);
    }
    
    public bind(name: string) {
        this.get(name)?.bind();
    }
}

