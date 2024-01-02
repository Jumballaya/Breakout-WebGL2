import { Shader } from "../gl/Shader";

export class ShaderLibrary {

    private ctx: WebGL2RenderingContext;
    private shaders: Map<string, Shader>;

    constructor(ctx: WebGL2RenderingContext) {
        this.ctx = ctx;
        this.shaders = new Map();
    }

    public create(name: string, vertex: string, fragment: string) {
        const shader = new Shader(this.ctx, name, vertex, fragment);
        this.shaders.set(name, shader);
    }

    public get(name: string): Shader | undefined {
        return this.shaders.get(name);
    }
    
    public bind(name: string) {
        this.get(name)?.bind();
    }
}
