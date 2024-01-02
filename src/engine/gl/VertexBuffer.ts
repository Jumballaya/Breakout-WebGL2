import type { GlNumber, VertexBufferConfig } from "./types/vertex.type";

function sizeof(type: GlNumber): number {
    switch (type) {
        case WebGL2RenderingContext.FLOAT: {
            return 4;
        }
        default: {
            return 0;
        }
    }
}

export class VertexBuffer {

    private data: Float32Array;
    private ctx: WebGL2RenderingContext;
    private vao: WebGLVertexArrayObject;
    private buffer: WebGLBuffer;
    private vertexCount = 0;

    constructor(ctx: WebGL2RenderingContext, config: VertexBufferConfig) {
        const vao = ctx.createVertexArray();
        const buffer = ctx.createBuffer();
        if (!vao || !buffer) throw new Error('could not create vertex array object or buffer');
        ctx.bindVertexArray(vao);
        ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, config.data, config.drawType);

        let offset = 0;
        let strideCount = 0;
        for (let i = 0; i < config.sections.length; i++) {
            const section = config.sections[i];
            ctx.enableVertexAttribArray(i);
            ctx.vertexAttribPointer(i, section.size, section.type, section.normalized, config.stride, offset);
            offset += section.size * sizeof(section.type);
            strideCount += section.size;
        }

        this.vertexCount = config.data.length / strideCount;

        this.ctx = ctx;
        this.vao = vao;
        this.buffer = buffer;
        this.data = config.data;
    }

    public get count(): number {
        return this.vertexCount;
    }

    public bind() {
        this.ctx.bindVertexArray(this.vao);
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.buffer);
    }

    public unbind() {
        this.ctx.bindVertexArray(null);
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, null);
    }

    public update() {
        this.bind();
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, this.data, this.ctx.DYNAMIC_DRAW);
    }
}
