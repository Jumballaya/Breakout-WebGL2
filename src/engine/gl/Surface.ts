import { Shader } from './Shader';
import { VertexBuffer } from './VertexBuffer';
import { Texture } from './Texture';
import { FrameBuffer } from './FrameBuffer';
import { Transform } from '../physics/Transform';
import { mat4, vec2 } from 'gl-matrix';
import { ShaderLibrary } from '../library/ShaderLibrary';
import { GeometryLibrary } from '../library/GeometryLibrary';

export class Surface {
    private screenSize: vec2;
    private frameBuffer: FrameBuffer;
    private texture: Texture;
    private shader: Shader;
    private vertex: VertexBuffer;
    private transform: Transform;

    private _isShaking = false;
    private _pixelAmout = 1;
    public ortho: mat4 = mat4.create();
    public clearColor: [number, number, number, number] = [1,1,1,1];

    private gl: WebGL2RenderingContext;

    constructor(gl: WebGL2RenderingContext, vertex: string, size: vec2, shader: string, shaderLibrary: ShaderLibrary, geoLib: GeometryLibrary) {
        this.gl = gl;
        this.vertex = geoLib.get(vertex)!;
        this.transform = new Transform();
        this.screenSize = size;
        mat4.ortho(this.ortho, 0, size[0], 0, size[1], 0.1, 100);
        this.transform.scale = [size[0], size[1], 1];
        this.transform.translation = [0, 0, -1];
        this.frameBuffer = new FrameBuffer(gl);
        this.frameBuffer.attachment({ type: 'color', size });
        this.texture = this.frameBuffer.getColorTexture()!;
        this.shader = shaderLibrary.get(shader)!;

        // Setup shader
        this.shader.bind();
        this.shader.uniform('u_texture', { type: 'texture', value: this.texture.id });
        this.shader.uniform('u_proj_matrix', { type: 'mat4', value: this.ortho });
        this.shader.uniform('u_model_matrix', { type: 'mat4', value: this.transform.matrix });
        this.shader.uniform('u_resolution', { type: 'vec2', value: size });
        this.shader.uniform('u_pixel_amount', { type: 'float', value: this._pixelAmout });
        this.shader.unbind();
    }

    public rotate(r: number) {
        this.transform.rotation = [0, 0, r];
        this.shader.bind();
        this.shader.uniform('u_model_matrix', { type: 'mat4', value: this.transform.matrix });
        this.shader.unbind();
    }

    public scale(s: vec2) {
        this.transform.scale = [s[0] * this.screenSize[0], s[1] * this.screenSize[1], 1];
        this.shader.bind();
        this.shader.uniform('u_model_matrix', { type: 'mat4', value: this.transform.matrix });
        this.shader.unbind();
    }

    public offset(o: vec2) {
        this.transform.translation = [o[0], o[1], -1];
        this.shader.bind();
        this.shader.uniform('u_model_matrix', { type: 'mat4', value: this.transform.matrix });
        this.shader.unbind();
    }

    public set pixelAmout(amt: number) {
        this._pixelAmout = amt;
        this.shader.bind();
        this.shader.uniform('u_pixel_amount', { type: 'float', value: this.pixelAmout });
        this.shader.unbind();
    }

    public get pixelAmout() {
        return this._pixelAmout;
    }

    public set isShaking(s: boolean) {
        this._isShaking = s;
        this.shader.bind();
        this.shader.uniform('u_is_shaking', { type: 'boolean', value: this.isShaking });
        this.shader.unbind();
    }

    public get isShaking() {
        return this._isShaking;
    }

    public get size(): vec2 {
        return [this.transform.scale[0], this.transform.scale[1]];
    }

    public set size(s: vec2) {
        mat4.ortho(this.ortho, -s[0], s[0], -s[1], s[1], 0.1, 100);
        this.shader.bind();
        this.shader.uniform('u_proj_matrix', { type: 'mat4', value: this.ortho });
        this.shader.uniform('u_resolution', { type: 'vec2', value: [this.transform.scale[0], this.transform.scale[1]] });
        this.shader.unbind();
    }

    public bindTexture() {
        this.texture.bind();
    }

    public enable() {
        this.frameBuffer.bind();
        this.gl.clearColor(...this.clearColor);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    public disable() {
        this.frameBuffer.unbind();
    }

    public draw(t: number) {
        // Set up post-processing uniforms
        this.shader.uniform('u_model_matrix', { type: 'mat4', value: this.transform.matrix });
        this.shader.uniform('u_time', { type: 'float', value: t / 1000 });
        this.shader.uniform('u_resolution', { type: 'vec2', value: this.screenSize });
        this.shader.uniform('u_texture', { type: 'texture', value: 0 });
        this.shader.uniform('u_is_shaking', { type: 'boolean', value: this.isShaking });
        this.shader.uniform('u_pixel_amount', { type: 'float', value: this.pixelAmout });

        // Bind Surface to draw to the default render buffer
        this.texture.bind();
        this.vertex.bind();
        this.shader.bind();

        // Draw the screen quad
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertex.count);

        // Unbind screen
        this.shader.unbind();
        this.vertex.unbind();
        this.texture.unbind();
    }
}

