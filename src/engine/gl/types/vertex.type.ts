
export type GlNumber = typeof WebGL2RenderingContext.FLOAT;

export type VertexBufferConfig = {
    stride: number;
    data: Float32Array;
    drawType: typeof WebGL2RenderingContext.STATIC_DRAW | typeof WebGL2RenderingContext.DYNAMIC_DRAW;
    sections: Array<{
        type: GlNumber;
        size: number;
        normalized: boolean;
    }>;
};
