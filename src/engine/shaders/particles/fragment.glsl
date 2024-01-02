#version 300 es

precision mediump float;

out vec4 outColor;

in vec2 v_uv;
in vec3 v_color;
in float v_life;

uniform sampler2D u_texture;

void main() {
    vec4 tex = texture(u_texture, v_uv);
    vec3 color = tex.rgb * v_color;
    outColor = vec4(color, tex.w * smoothstep(0.0, 1.0, 1.0 / (v_life / 5.0)) / 1.5);
}

