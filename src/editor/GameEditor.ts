import { vec2, vec3 } from "gl-matrix";
import { LevelData } from "../game/types/level-data.type";

const CELL_SIZE = [128, 64];
const SCREEN_SIZE = [1024, 768];

const COLS = SCREEN_SIZE[0] / CELL_SIZE[0];
const ROWS = SCREEN_SIZE[1] / CELL_SIZE[1];

type Cell = {
    col: number;
    row: number;
    position: vec2;
    color: vec3;
    sprite: string;
};

const sprites: string[] = [
    'block',
    'block_solid',
];

export class GameEditor {
    public running = false;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private mouseCoords: vec2 = [0, 0];
    private mouseButton: -1 | 0 | 1 = -1;

    private grid: Array<Cell | null>;
    private selectedSprite = 0;

    constructor(parent: HTMLElement) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!;
        this.canvas.width = SCREEN_SIZE[0];
        this.canvas.height = SCREEN_SIZE[1];
        parent.appendChild(this.canvas);

        this.canvas.addEventListener('mousemove', e => {
            const x = e.offsetX;
            const y = e.offsetY;
            this.mouseCoords[0] = x;
            this.mouseCoords[1] = y;
        });
        this.canvas.addEventListener('mousedown', () => {
            this.mouseButton = 1;
        });
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.mouseButton = 0;
        });
        this.canvas.addEventListener('mouseup', () => {
            this.mouseButton = -1;
        });
        this.canvas.addEventListener('wheel', (e) => {
            const dir = e.deltaY > 0 ? 1 : -1;
            this.selectedSprite += dir;
            if (this.selectedSprite < 0) this.selectedSprite = sprites.length - 1;
            this.selectedSprite = this.selectedSprite % sprites.length;
        });

        this.grid = new Array(COLS * ROWS).fill(null);
    }

    public start() {
        this.running = true;
        let time = Date.now();
        const loop = () => {
            if (!this.running) return;
            const cur = Date.now();
            const dt = (cur - time) / 1000;
            time = cur;
            this.tick(dt);
            requestAnimationFrame(loop);
        }
        loop();
    }

    public pause() {
        this.running = false;
    }

    public tick(dt: number) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#aaaaaa';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.handleInput();
        this.drawGrid();
        this.drawCells();
        this.mouseHover();
    }

    public export(): LevelData {
        return {
            title: '',
            brickSize: CELL_SIZE as vec2,
            nextLevel: '',
            bricks: (this.grid.filter(c => c !== null) as Cell[]).map(c => {
                return { position: c.position, color: c.color, sprite: c.sprite };
            }),
        }; 
    }

    private drawGrid() {
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < COLS; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * CELL_SIZE[0], 0);
            this.ctx.lineTo(i * CELL_SIZE[0], SCREEN_SIZE[1]);
            this.ctx.stroke();
        }
        for (let i = 0; i < ROWS; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * CELL_SIZE[1]);
            this.ctx.lineTo(SCREEN_SIZE[0], i * CELL_SIZE[1]);
            this.ctx.stroke();
        }
    }

    private drawCells() {
        for (const cell of this.grid) {
            if (cell) {
                if (cell?.sprite === 'block_solid') {
                    this.ctx.strokeStyle = 'red';
                    this.ctx.lineWidth = 4;
                    this.ctx.strokeRect(cell.position[0], cell.position[1], CELL_SIZE[0], CELL_SIZE[1]);
                }
                this.ctx.fillStyle = `rgb(${cell.color.map(c => c * 256).join(', ')})`;
                this.ctx.fillRect(cell.position[0], cell.position[1], CELL_SIZE[0], CELL_SIZE[1]);
            }
        }
    }

    private mouseHover() {
        const col = Math.floor(this.mouseCoords[0] / CELL_SIZE[0]);
        const row = Math.floor(this.mouseCoords[1] / CELL_SIZE[1]);
        const cell = this.grid[(row * COLS) + col];
        const color = cell?.color || [1, 1, 1];
        this.ctx.fillStyle = `rgb(${color.map(c => c * 256).join(', ')})`;
        this.ctx.fillRect(col * CELL_SIZE[0], row * CELL_SIZE[1], CELL_SIZE[0], CELL_SIZE[1]);
    }

    private populateCell(col: number, row: number, color: vec3, sprite: string) {
        const id = (row * COLS) + col;
        this.grid[id] = {
            col,
            row,
            position: [col * CELL_SIZE[0], row * CELL_SIZE[1]],
            color,
            sprite,
        };
    }

    private handleInput() {
        if (this.mouseButton === 1) {
            const col = Math.floor(this.mouseCoords[0] / CELL_SIZE[0]);
            const row = Math.floor(this.mouseCoords[1] / CELL_SIZE[1]);
            const cell = this.grid[(row * COLS) + col];
            if (cell === null) {
                this.populateCell(col, row, [Math.random(), Math.random(), Math.random()], sprites[this.selectedSprite]);
            } else {
                cell.sprite = sprites[this.selectedSprite];
            }
        }
        if (this.mouseButton === 0) {
            const col = Math.floor(this.mouseCoords[0] / CELL_SIZE[0]);
            const row = Math.floor(this.mouseCoords[1] / CELL_SIZE[1]);
            const idx = (row * COLS) + col;
            this.grid[idx] = null;
        }
    }
}
