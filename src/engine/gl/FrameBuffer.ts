import { vec2 } from 'gl-matrix';
import { Texture } from './Texture';

type AttachmentType = 'color' | 'depth' | 'stencil';
type Attachment = {
    type: AttachmentType;
    size: vec2;
};

interface FrameBufferTextures {
    color: Texture | undefined;
    depth: Texture | undefined;
    stencil: Texture | undefined;
};

export class FrameBuffer {

    private buffer: WebGLFramebuffer;
    private gl: WebGL2RenderingContext;

    private textures: FrameBufferTextures = {
        color: undefined,
        depth: undefined,
        stencil: undefined,
    };

    constructor(gl: WebGL2RenderingContext) {
        const buffer = gl.createFramebuffer();
        if (!buffer) throw new Error('could not create frame buffer');
        this.buffer = buffer;

        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
            throw new Error('frame buffer attachments error');
        }
        this.gl = gl;
    }

    public attachment(attachment: Attachment) {
        if (attachment.type === 'color' && this.textures.color === undefined) {
            this.createColorAttachment(attachment.size);
            return;
        }
        if (attachment.type === 'depth' && this.textures.depth === undefined) {
            this.createDepthAttachment(attachment.size);
            return;
        }
        if (attachment.type === 'stencil' && this.textures.stencil === undefined) {
            return;
        }
    }

    public bind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.buffer);
    }

    public unbind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    public getColorTexture() {
        return this.textures.color;
    }

    public getDepthTexture() {
        return this.textures.depth;
    }

    public getStencilTexture() {
        return this.textures.stencil;
    }

    private createColorAttachment(size: vec2) {
        const gl = this.gl;
        const texture = new Texture(gl, size);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.getTexture(), 0);

        this.textures.color = texture;
    }

    private createDepthAttachment(size: vec2) {
        const gl = this.gl;
        const texture = new Texture(gl, size, { internalFormat: gl.DEPTH_COMPONENT24, format: gl.DEPTH_COMPONENT, type: gl.UNSIGNED_INT });
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, texture.getTexture(), 0);

        this.textures.depth = texture;
    }
}
