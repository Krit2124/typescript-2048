import { Block } from "./Block";
import { Cell } from "./Cell";
import { Direction } from "./DirectionEnum";

export class Table {
    cells: Cell[][] = [];

    public initCells(width: number, height: number) {
        for (let i = 0; i < height; i++) {
            const row: Cell[] = [];
            for (let j = 0; j < width; j++) {
                row.push(new Cell(j, i));
            }
            this.cells.push(row);
        }
    }

    public getCopyBoard(): Table {
        const newTable = new Table();
        newTable.cells = this.cells;
        return newTable;
    }

    private getRandomNumber(): number {
        return Math.random() < 0.25 ? 4 : 2;
    }

    public getEmptyCells(): Cell[] {
        return this.cells.flat().filter(cell => cell.block === null);
    }

    public addRandomBlock(): void {
        let emptyCells = this.getEmptyCells();
        if (emptyCells.length > 0) {
            let randomIndex = Math.floor(Math.random() * emptyCells.length);
            emptyCells[randomIndex].block = new Block(this.getRandomNumber());
        }
    }
    

    // Метод для получения правил перебора ячеек для перемещения
    private getStepsForDirection(direction: Direction): [number, number] {
        switch (direction) {
            case Direction.Left: return [0, -1];
            case Direction.Right: return [0, 1];
            case Direction.Up: return [-1, 0];
            case Direction.Down: return [1, 0];
        }
    }

    // Метод для формирования массивов индексов
    private getStartIndexesForDirection(direction: Direction): number[][] {
        switch (direction) {
            case Direction.Left:
                // Слева-направо
                return this.cells.flatMap((row, rowIndex) => row.map((_, colIndex) => [rowIndex, colIndex]));
            case Direction.Right:
                // Справа-налево
                return this.cells.flatMap((row, rowIndex) => row.map((_, colIndex) => [rowIndex, this.cells[0].length - colIndex - 1]));
            case Direction.Up:
                // Сверху-вниз
                return this.cells[0].map((_, colIndex) => this.cells.map((row, rowIndex) => [rowIndex, colIndex])).flat();
            case Direction.Down:
                // Снизу вверх
                return this.cells[0].map((_, colIndex) => this.cells.map((row, rowIndex) => [this.cells.length - rowIndex - 1, colIndex])).flat();
        }
    }

    // Метод для проверки существования ячейки
    private isValidPosition(row: number, col: number): boolean {
        return row >= 0 && row < this.cells.length && col >= 0 && col < this.cells[0].length;
    }

    // Метод для перемещения одной ячейки
    private moveCell(row: number, col: number, direction: Direction, currentCell: Cell): boolean {
        // Ближайшая подходящая ячейка
        let cellToMove: Cell | null = null;
        // Получаем правила перебора ячеек для данного направления
        const [rowStep, colStep] = this.getStepsForDirection(direction);

        // Перебираем ячейки по полученным правилам
        for (let newRow = row + rowStep, newCol = col + colStep;
            this.isValidPosition(newRow, newCol);
            newRow += rowStep, newCol += colStep) {

            // Запоминаем ячейку, на которую указывает цикл
            const conflictCell = this.cells[newRow][newCol];

            if (conflictCell.block === null) {
                // Если ячейка пустая, то запоминаем её
                cellToMove = conflictCell;
            } else if (conflictCell.block?.value === currentCell.block?.value) {
                // Если значения совпадают, то происходит слияние ячеек
                conflictCell.block.setDoubleValue();
                currentCell.deleteBlock();
                return true;
            } else {
                // Если значения не совпадают, то пытаемся переместить нужный блок в дальнюю пустую ячейку
                if (cellToMove) {
                    cellToMove.block = currentCell.block;
                    currentCell.deleteBlock();
                    return true;
                }
                return false;
            }
        }

        // Если блока для слияния нет, перемещаем нужный блок в дальнюю пустую ячейку
        if (cellToMove) {
            cellToMove.block = currentCell.block;
            currentCell.deleteBlock();
            return true;
        }
        // Если нет подходящего блока для перемещения, то возвращаем false
        return false;
    }

    // Метод для перемещения всех ячеек
    public moveCells(direction: Direction) {
        const startIndexes = this.getStartIndexesForDirection(direction);       
        let wasMovement = false;

        for (const [row, col] of startIndexes) {
            const currentCell = this.cells[row][col];
            if (currentCell.block) {
                wasMovement = this.moveCell(row, col, direction, currentCell) || wasMovement;
            }
        }

        if (wasMovement) {
            this.addRandomBlock();
        }
    }
}