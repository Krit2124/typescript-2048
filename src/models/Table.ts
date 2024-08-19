import { Block } from "./Block";
import { Cell } from "./Cell";

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

        console.log(this.cells);
        
    }

    public getCopyBoard(): Table {
        const newTable = new Table();
        newTable.cells = this.cells;
        return newTable;
    }

    private getRandomNumber(): number {
        return Math.random() < 0.25 ? 4 : 2;
    }

    public addRandomBlock(): void {
        let newBlock = new Block(this.getRandomNumber());
        let emptyCells = this.getEmptyCells();
        if (emptyCells.length > 0) {
            let randomIndex = Math.floor(Math.random() * emptyCells.length);
            emptyCells[randomIndex].block = newBlock;
        }
    }

    public getEmptyCells(): Cell[] {
        const emptyCells: Cell[] = [];
        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells[i].length; j++) {
                if (this.cells[i][j].block === null) {
                    emptyCells.push(this.cells[i][j]);
                }
            }
        }
        return emptyCells;
    }

    // Перемещение одного блока влево
    private moveCellToLeft(row: number, col: number, currentCell: Cell): boolean {
        // Ближайшая подходящая ячейка
        let cellToMove: Cell | null = null;

        // Перебираем ячейки слева от текущей
        for (let newCol = col - 1; newCol >= 0; newCol--) {            
            // Запоминаем ячейку, на которую указывает цикл
            let conflictCell = this.cells[row][newCol];            

            if (conflictCell.block === null) {
                // Если ячейка пустая, то запоминаем её
                cellToMove = conflictCell;
            } else {
                // Если ячейка не пустая, то проверяем её значение
                if (conflictCell.block?.value === currentCell.block?.value) {
                    // Если значения совпадают, то происходит слияние ячеек
                    conflictCell.block.setDoubleValue();
                    currentCell.deleteBlock();
                    return true;
                } else {
                    // Если значения не совпадают, то пытаемся переместить нужный блок в дальнюю пустую ячейку
                    if (cellToMove !== null) {
                        cellToMove.block = currentCell.block;
                        currentCell.deleteBlock();
                        return true;
                    }
                    return false;
                }
            }
        }

        // Если блока для слияния нет, перемещаем нужный блок в дальнюю пустую ячейку
        if (cellToMove !== null) {
            cellToMove.block = currentCell.block;
            currentCell.deleteBlock();
            return true;
        }
        // Если нет подходящего блока для перемещения, то возвращаем false
        return false;
    }

    // Перемещение всех блоков влево
    public moveEveryCellToLeft() {       
        let wasMovement = false;
        // Перебираем все строки
        for (let row = 0; row < this.cells.length; row++) {
            // Перебираем все столбцы после первого
            for (let col = 1; col < this.cells[row].length; col++) {
                // Просматриваемая циклами выше ячейка
                let currentCell: Cell = this.cells[row][col];     

                // Если в текущей ячейке нет блока, то пропускаем её
                if (currentCell.block !== null) {              
                    // Если блок есть, то вызываем функцию для перемещения
                    wasMovement = this.moveCellToLeft(row, col, currentCell) || wasMovement;
                }
            }
        }

        // Если было совершено перемещение, то добавляем новый блок
        if (wasMovement) {
            this.addRandomBlock();
        }
    }

    // Перемещение одного блока вправо
    private moveCellToRight(row: number, col: number, currentCell: Cell): boolean {
        // Ближайшая подходящая ячейка
        let cellToMove: Cell | null = null;

        // Перебираем ячейки справа от текущей
        for (let newCol = col + 1; newCol < this.cells[0].length; newCol++) {            
            // Запоминаем ячейку, на которую указывает цикл
            let conflictCell = this.cells[row][newCol];            

            if (conflictCell.block === null) {
                // Если ячейка пустая, то запоминаем её
                cellToMove = conflictCell;
            } else {
                // Если ячейка не пустая, то проверяем её значение
                if (conflictCell.block?.value === currentCell.block?.value) {
                    // Если значения совпадают, то происходит слияние ячеек
                    conflictCell.block.setDoubleValue();
                    currentCell.deleteBlock();
                    return true;
                } else {
                    // Если значения не совпадают, то пытаемся переместить нужный блок в дальнюю пустую ячейку
                    if (cellToMove !== null) {
                        cellToMove.block = currentCell.block;
                        currentCell.deleteBlock();
                        return true;
                    }
                    return false;
                }
            }
        }

        // Если блока для слияния нет, перемещаем нужный блок в дальнюю пустую ячейку
        if (cellToMove !== null) {
            cellToMove.block = currentCell.block;
            currentCell.deleteBlock();
            return true;
        }
        // Если нет подходящего блока для перемещения, то возвращаем false
        return false;
    }

    // Перемещение всех блоков вправо
    public moveEveryCellToRight() {       
        let wasMovement = false;     
        // Перебираем все строки
        for (let row = 0; row < this.cells.length; row++) {
            // Перебираем все столбцы от предпоследнего
            for (let col = this.cells[row].length - 1; col >= 0; col--) {
                // Просматриваемая циклами выше ячейка
                let currentCell: Cell = this.cells[row][col];     

                // Если в текущей ячейке нет блока, то пропускаем её
                if (currentCell.block !== null) {              
                    // Если блок есть, то вызываем функцию для перемещения
                    wasMovement = this.moveCellToRight(row, col, currentCell) || wasMovement;
                }
            }
        }

        // Если было совершено перемещение, то добавляем новый блок
        if (wasMovement) {
            this.addRandomBlock();
        }
    }

    // Перемещение одного блока вниз
    private moveCellDown(row: number, col: number, currentCell: Cell): boolean {
        // Ближайшая подходящая ячейка
        let cellToMove: Cell | null = null;

        // Перебираем ячейки снизу от текущей
        for (let newRow = row + 1; newRow < this.cells.length; newRow++) {            
            // Запоминаем ячейку, на которую указывает цикл
            let conflictCell = this.cells[newRow][col];            

            if (conflictCell.block === null) {
                // Если ячейка пустая, то запоминаем её
                cellToMove = conflictCell;
            } else {
                // Если ячейка не пустая, то проверяем её значение
                if (conflictCell.block?.value === currentCell.block?.value) {
                    // Если значения совпадают, то происходит слияние ячеек
                    conflictCell.block.setDoubleValue();
                    currentCell.deleteBlock();
                    return true;
                } else {
                    // Если значения не совпадают, то пытаемся переместить нужный блок в дальнюю пустую ячейку
                    if (cellToMove !== null) {
                        cellToMove.block = currentCell.block;
                        currentCell.deleteBlock();
                        return true;
                    }
                    return false;
                }
            }
        }

        // Если блока для слияния нет, перемещаем нужный блок в дальнюю пустую ячейку
        if (cellToMove !== null) {
            cellToMove.block = currentCell.block;
            currentCell.deleteBlock();
            return true;
        }
        // Если нет подходящего блока для перемещения, то возвращаем false
        return false;
    }

    // Перемещение всех блоков вниз
    public moveEveryCellDown() {       
        let wasMovement = false;   
        // Перебираем все строки до предпоследней
        for (let row = this.cells.length - 1; row >= 0; row--) {  
            // Перебираем все столбцы
            for (let col = this.cells[row].length - 1; col >= 0; col--) {
                // Просматриваемая циклами выше ячейка
                let currentCell: Cell = this.cells[row][col];     

                // Если в текущей ячейке нет блока, то пропускаем её
                if (currentCell.block !== null) {              
                    // Если блок есть, то вызываем функцию для перемещения
                    wasMovement = this.moveCellDown(row, col, currentCell) || wasMovement;
                }
            }
        }

        // Если было совершено перемещение, то добавляем новый блок
        if (wasMovement) {
            this.addRandomBlock();
        }
    }

    // Перемещение одного блока вверх
    private moveCellUp(row: number, col: number, currentCell: Cell): boolean {
        // Ближайшая подходящая ячейка
        let cellToMove: Cell | null = null;

        // Перебираем ячейки сверху от текущей
        for (let newRow = row - 1; newRow >= 0; newRow--) {            
            // Запоминаем ячейку, на которую указывает цикл
            let conflictCell = this.cells[newRow][col];            

            if (conflictCell.block === null) {
                // Если ячейка пустая, то запоминаем её
                cellToMove = conflictCell;
            } else {
                // Если ячейка не пустая, то проверяем её значение
                if (conflictCell.block?.value === currentCell.block?.value) {
                    // Если значения совпадают, то происходит слияние ячеек
                    conflictCell.block.setDoubleValue();
                    currentCell.deleteBlock();
                    return true;
                } else {
                    // Если значения не совпадают, то пытаемся переместить нужный блок в дальнюю пустую ячейку
                    if (cellToMove !== null) {
                        cellToMove.block = currentCell.block;
                        currentCell.deleteBlock();
                        return true;
                    }
                    return false;
                }
            }
        }

        // Если блока для слияния нет, перемещаем нужный блок в дальнюю пустую ячейку
        if (cellToMove !== null) {
            cellToMove.block = currentCell.block;
            currentCell.deleteBlock();
            return true;
        }
        // Если нет подходящего блока для перемещения, то возвращаем false
        return false;
    }

    // Перемещение всех блоков вверх
    public moveEveryCellUp() {       
        let wasMovement = false; 
        // Перебираем все строки после первой
        for (let row = 0; row < this.cells.length; row++) {    
            // Перебираем все столбцы
            for (let col = this.cells[row].length - 1; col >= 0; col--) {
                // Просматриваемая циклами выше ячейка
                let currentCell: Cell = this.cells[row][col];     

                // Если в текущей ячейке нет блока, то пропускаем её
                if (currentCell.block !== null) {              
                    // Если блок есть, то вызываем функцию для перемещения
                    wasMovement = this.moveCellUp(row, col, currentCell) || wasMovement;
                }
            }
        }

        // Если было совершено перемещение, то добавляем новый блок
        if (wasMovement) {
            this.addRandomBlock();
        }
    }
}