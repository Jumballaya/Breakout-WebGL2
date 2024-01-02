import { vec2, vec3 } from "gl-matrix";

export type LevelData = {
    title: string;
    brickSize: vec2;
    nextLevel: string;
    bricks: Array<{
        sprite: string;
        color: vec3;
        position: vec2;
        unbreakable?: boolean;
    }>
}
