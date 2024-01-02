import { GameObject } from "./GameObject";

export type PowerupType = 'ball-speed' | 'paddle' | 'pass-through' | 'pixelated' | 'sticky';

export class Powerup extends GameObject {
    public velocity = 350;
    public type: PowerupType;

    constructor(type: PowerupType) {
        super(`powerup-${type}`);
        this.type = type;
        this.collider.size = [48, 48];

        if (type !== 'pixelated') {
            this.color = [0.02, 0.76, 0.21];
        } else {
            this.color = [0.96, 0.2, 0.31];
        }

        if (type === 'pass-through') {
            this.rotation = Math.PI;
        }
    }
}
