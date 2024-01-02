#version 300 es

layout(location=0) in vec4 a_position;

out vec2 v_uv;

uniform mat4 u_model_matrix;
uniform mat4 u_proj_matrix;

void main() {
    gl_Position = u_proj_matrix * u_model_matrix * vec4(a_position.xy, 0.0, 1.0);
    v_uv = a_position.xy;
}
