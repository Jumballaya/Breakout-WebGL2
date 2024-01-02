#version 300 es

layout(location=0) in vec4 a_position;

out vec2 v_uv;

uniform mat4 u_model_matrix;
uniform mat4 u_proj_matrix;

uniform float u_time;
uniform bool u_is_shaking;

void main() {
    gl_Position = u_proj_matrix * u_model_matrix * vec4(a_position.xy, 0.0, 1.0);

    if (u_is_shaking) {
        gl_Position.x += cos(u_time * 100.0) * 0.005;
        gl_Position.y += sin(u_time * 100.0) * 0.005;
    }

    v_uv = a_position.xy;
}
