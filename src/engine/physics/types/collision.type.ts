import { vec2 } from "gl-matrix";

export type CollisionDirection = 'up' | 'right' | 'down' | 'left';
export type Collision = {
   direction: CollisionDirection; 
   difference: vec2;
   position: vec2;
}

