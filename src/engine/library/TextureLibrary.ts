import { loadImage } from "../loader/imageLoader";
import { Texture } from "../gl/Texture";

export class TextureLibrary {
    private textures: Map<string, Texture>;
    private ctx: WebGL2RenderingContext;

    constructor(ctx: WebGL2RenderingContext) {
        this.ctx = ctx;
        this.textures = new Map();
    }

    public async create(name: string, path: string) {
        const image = await loadImage(path);
        const tex = new Texture(this.ctx, image);
        this.textures.set(name, tex);
    }

    public get(name: string): Texture | undefined {
        return this.textures.get(name);
    }

    public bind(name: string) {
        this.get(name)?.bind();
    }

    public unbind(name: string) {
        this.get(name)?.unbind();
    }
}
