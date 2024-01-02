import spriteVert from '../engine/shaders/sprite/vertex.glsl?raw';
import spriteFrag from '../engine/shaders/sprite/fragment.glsl?raw';
import screenVert from '../engine/shaders/screen/vertex.glsl?raw';
import screenFrag from '../engine/shaders/screen/fragment.glsl?raw';
import particleVert from '../engine/shaders/particles/vertex.glsl?raw';
import particleFrag from '../engine/shaders/particles/fragment.glsl?raw';

import { GeometryLibrary } from "../engine/library/GeometryLibrary";
import { ShaderLibrary } from "../engine/library/ShaderLibrary";
import { TextureLibrary } from "../engine/library/TextureLibrary";
import { quadVertices } from './objects/vertices/quad';

type ResourceManagerConfig = {
    context: {
        gl: WebGL2RenderingContext;
        // audio: AudioContext;
    };
};

export class ResourceManager {

    private context: ResourceManagerConfig['context'];

    private shaderLibrary: ShaderLibrary;
    private textureLibrary: TextureLibrary;
    private geometryLibrary: GeometryLibrary;

    constructor(config: ResourceManagerConfig) {
        this.context = config.context;

        this.shaderLibrary = new ShaderLibrary(this.context.gl);
        this.textureLibrary = new TextureLibrary(this.context.gl);
        this.geometryLibrary = new GeometryLibrary(this.context.gl);

        this.setupGeometry();
        this.setupShaders();
    }

    public get shaders(): ShaderLibrary {
        return this.shaderLibrary;
    }

    public get textures(): TextureLibrary {
        return this.textureLibrary;
    }

    public get geometries(): GeometryLibrary {
        return this.geometryLibrary;
    }

    private setupGeometry() {
        const gl = this.context.gl;
        const geoLib = this.geometryLibrary;
        geoLib.create('quad', {
            stride: 8,
            data: quadVertices,
            drawType: gl.STATIC_DRAW,
            sections: [
                { size: 2, type: gl.FLOAT, normalized: false },
            ],
        });
    }

    private setupShaders() {
        // Sprites
        this.shaderLibrary.create('sprite', spriteVert, spriteFrag);
        const spriteShader = this.shaderLibrary.get('sprite');
        if (!spriteShader) throw new Error('could not find Sprite shader');

        // Screen
        this.shaderLibrary.create('screen', screenVert, screenFrag);
        const screenShader = this.shaderLibrary.get('screen');
        if (!screenShader) throw new Error('could not find Screen shader');

        // Particles
        this.shaderLibrary.create('particle', particleVert, particleFrag);
        const particleShader = this.shaderLibrary.get('particle');
        if (!particleShader) throw new Error('could not find Particle shader');
    }
}
