#version 300 es

precision mediump float;

out vec4 outColor;

in vec2 v_uv;

uniform sampler2D u_texture;
uniform vec3 u_color;

void main() {
    vec4 color = vec4(u_color, 1.0) * texture(u_texture, v_uv);
    outColor = color;
}
