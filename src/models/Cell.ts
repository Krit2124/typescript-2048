import { Block } from "./Block";

export class Cell {
    readonly x: number;
    readonly y: number;
    block: Block | null;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.block = null;
    }

    isEmpty(): boolean {
        return this.block === null;
    }

    deleteBlock(): void {
        this.block = null;
    }
}