#version 300 es

precision mediump float;

out vec4 outColor;

in vec2 v_uv;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_pixel_amount;


void main() {
    vec2 dims = u_resolution / u_pixel_amount;
    vec2 tex_uv = floor(v_uv * dims) / dims;
    vec3 pixelated = texture(u_texture, tex_uv).rgb;
    outColor = vec4(pixelated, 1.0);
}
