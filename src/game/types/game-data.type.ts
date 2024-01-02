import { vec2 } from "gl-matrix";

export type GameData = {
    screenSize: vec2;
    levels: Array<string>;
    textures: Record<string, string>;
};
