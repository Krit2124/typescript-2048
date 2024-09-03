import { Block } from "./Block";
import { Cell } from "./Cell";
import { Direction } from "../enums/DirectionEnum";

export class Table {
    cells: Cell[][] = [];
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    public initCells(width: number, height: number) {
        for (let i = 0; i < height; i++) {
            const row: Cell[] = [];
            for (let j = 0; j < width; j++) {
                row.push(new Cell(j, i));
            }
            this.cells.push(row);
        }
    }

    public getCopyBoard(width: number, height: number): Table {
        const newTable = new Table(width, height);
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
            this.saveState();
        }
    }

    // Метод для преобразования состояния игры в json
    public serialize(): string {
        return JSON.stringify(this.cells.map(row => 
            row.map(cell => cell.block ? cell.block.value : null)
        ));
    }
    
    // Метод для преобразования json в состояние игры
    public deserialize(data: string): Table {
        const table = new Table(this.width, this.height);
        const parsedData = JSON.parse(data);
        table.cells = parsedData.map((row: (number | null)[], rowIndex: number) =>
            row.map((value: number | null, colIndex: number) => {
                const cell = new Cell(colIndex, rowIndex);
                if (value !== null) {
                    cell.block = new Block(value);
                }
                return cell;
            })
        );
        return table;
    }

    // Метод для сохранения состояния игры
    private saveState(): void {
        const serializedTable = this.serialize();
        const prevState = localStorage.getItem(`gameState${this.width}x${this.height}`);
        prevState && localStorage.setItem(`prevGameState${this.width}x${this.height}`, prevState);
        localStorage.setItem(`gameState${this.width}x${this.height}`, serializedTable);
    }

    // Метод для загрузки актуального состояния игры
    public loadState(tableWidth: number, tableHeight: number): void {
        const savedState = localStorage.getItem(`gameState${this.width}x${this.height}`);
        document.documentElement.style.setProperty('--columns', this.width.toString());
        document.documentElement.style.setProperty('--rows', this.height.toString());
        if (savedState) {
            const table = this.deserialize(savedState);
            this.cells = table.cells;
        } else {
            // Если состояние не сохранено, инициируем таблицу заново
            this.initCells(tableWidth, tableHeight);
            this.addRandomBlock();
        }
    }

    // Метод для отмены хода
    public loadPrevState(table: Table): void {
        const prevState = localStorage.getItem(`prevGameState${this.width}x${this.height}`);
        if (prevState) {
            const table = this.deserialize(prevState);
            this.cells = table.cells;
            localStorage.setItem(`gameState${this.width}x${this.height}`, prevState);
            localStorage.removeItem(`prevGameState${this.width}x${this.height}`);
        } else {
            this.cells = table.cells;
        }
    }
}