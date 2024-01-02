import { ShaderLibrary } from '../library/ShaderLibrary';
import { GeometryLibrary } from '../library/GeometryLibrary';
import { TextureLibrary } from '../library/TextureLibrary';
import { mat4, vec2, vec3 } from 'gl-matrix';
import { VertexBuffer } from '../gl/VertexBuffer';
import { Shader } from '../gl/Shader';


export class SpriteRenderer {

    private texLib: TextureLibrary;
    private quad: VertexBuffer;
    private shader: Shader;
    private gl: WebGL2RenderingContext;


    constructor(gl: WebGL2RenderingContext, texLib: TextureLibrary, geoLib: GeometryLibrary, shaderLib: ShaderLibrary) {
        this.gl = gl;
        this.texLib = texLib;
        this.quad = geoLib.get('quad')!;
        this.shader = shaderLib.get('sprite')!;

        this.shader.bind();
        this.shader.uniform('u_texture', { type: 'texture', value: 0 });
        this.shader.uniform('u_model_matrix', { type: 'mat4', value: mat4.create() });
        this.shader.uniform('u_proj_matrix', { type: 'mat4', value: mat4.create() });
        this.shader.uniform('u_color', { type: 'vec3', value: [1,1,1] });
    }

    public render(sprite: string, size: vec2, position: vec2, rotation = 0, color: vec3 = [1, 1, 1]) {
        const mat = mat4.create();
        mat4.translate(mat, mat, vec3.fromValues(position[0], position[1], 0));
        mat4.translate(mat, mat, [0.5 * size[0], 0.5 * size[1], 0]);
        mat4.rotateZ(mat, mat, rotation);
        mat4.translate(mat, mat, [-0.5 * size[0], -0.5 * size[1], 0]);
        mat4.scale(mat, mat, vec3.fromValues(size[0], size[1], 1));

        if (sprite === 'paddle2') {
            console.log(this.texLib.get(sprite));
        }

        this.shader.uniform('u_texture', { type: 'texture', value: this.texLib.get(sprite)?.id || 0 });
        this.shader.uniform('u_model_matrix', {type: 'mat4', value: mat });
        this.shader.uniform('u_color', {type: 'vec3', value: color });

        this.quad.bind();
        this.texLib.bind(sprite);
        this.shader.bind();
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.quad.count || 0);
        this.texLib.unbind(sprite);
        this.quad.unbind();
        this.shader.unbind();
    }

}
