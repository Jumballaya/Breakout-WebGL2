#version 300 es

layout(location=0) in vec4 a_position;
layout(location=1) in vec2 a_uv;
layout(location=2) in vec3 a_color;
layout(location=3) in float a_life;

out vec2 v_uv;
out vec3 v_color;
out float v_life;

uniform mat4 u_proj_matrix;

void main() {
    gl_Position = u_proj_matrix * vec4(a_position.xy, -1.0, 1.0);
    v_uv = a_uv;
    v_color = a_color;
    v_life = a_life;
}

