import React, { FC, useEffect } from 'react';
import { Table } from '../models/Table';
import CellComponent from './CellComponent';

interface TableProps {
    width: number;
    height: number;
    table: Table;
    setTable: (table: Table) => void;
}

const TableComponent: FC<TableProps> = ({ width, height, table, setTable }) => {
    function updateTable() {
        const newBoard = table.getCopyBoard();
        setTable(newBoard);
    }

    // Обработчик нажатия клавиш
    const handleKeyDown = (event: KeyboardEvent) => {
        switch(event.key) {
        case 'ArrowUp':
            table.moveEveryCellUp();
            updateTable();
            break;
        case 'ArrowDown':
            table.moveEveryCellDown();
            updateTable();
            break;
        case 'ArrowLeft':
            table.moveEveryCellToLeft();
            updateTable();
            break;
        case 'ArrowRight':
            table.moveEveryCellToRight();
            updateTable();
            break;
        default:
            break;
        }
    };

    useEffect(() => {
        // Добавляем обработчик при монтировании компонента
        window.addEventListener('keydown', handleKeyDown);

        // Удаляем обработчик при размонтировании компонента
        return () => {
        window.removeEventListener('keydown', handleKeyDown);
        };
    }, [table])
    
    return (
        <div className='table' style={{width: width*100+10, height: height*100+10}}>
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