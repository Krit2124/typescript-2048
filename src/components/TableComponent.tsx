import React, { FC, useEffect } from 'react';
import { Table } from '../models/Table';
import CellComponent from './CellComponent';
import { Direction } from '../enums/DirectionEnum';

interface TableProps {
    width: number;
    height: number;
    table: Table;
    setTable: (table: Table) => void;
}

const TableComponent: FC<TableProps> = ({ width, height, table, setTable }) => {
    function updateTable() {
        const newBoard = table.getCopyBoard(width, height);
        setTable(newBoard);
    }

    // Обработчик нажатия клавиш
    const handleKeyDown = (event: KeyboardEvent) => {
        switch(event.code) {
        case "KeyW":
        case 'ArrowUp':
            table.moveCells(Direction.Up);
            updateTable();
            break;
        case "KeyS":
        case 'ArrowDown':
            table.moveCells(Direction.Down);
            updateTable();
            break;
        case "KeyA":
        case 'ArrowLeft':
            table.moveCells(Direction.Left);
            updateTable();
            break;
        case "KeyD":
        case 'ArrowRight':
            table.moveCells(Direction.Right);
            updateTable();
            break;
        default:
            break;
        }
    };
    
    useEffect(() => {
        let touchStartX: number | null = null;
        let touchStartY: number | null = null;

        const handleTouchStart = (event: TouchEvent) => {
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        };

        const handleTouchEnd = (event: TouchEvent) => {
            if (touchStartX === null || touchStartY === null) return;

            const touchEndX = event.changedTouches[0].clientX;
            const touchEndY = event.changedTouches[0].clientY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 50) {
                    table.moveCells(Direction.Right);
                } else if (deltaX < -50) {
                    table.moveCells(Direction.Left);
                }
            } else {
                if (deltaY > 50) {
                    table.moveCells(Direction.Down);
                } else if (deltaY < -50) {
                    table.moveCells(Direction.Up);
                }
            }
            updateTable();

            // Сбрасываем координаты после обработки свайпа
            touchStartX = null;
            touchStartY = null;
        };

        // Добавляем обработчики
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            // Удаляем обработчики при размонтировании компонента
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [table]);
    
    return (
        <div className='table'>
            {table.cells.map((row, index) => 
                <React.Fragment key={index}>
                    {row.map(cell => 
                        <CellComponent 
                            cell={cell}
                            key={Math.random().toString()}
                        />
                    )}
                </React.Fragment>
            )}
        </div>
    );
};

export default TableComponent;