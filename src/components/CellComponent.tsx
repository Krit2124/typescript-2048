import React, { FC } from 'react';
import { Cell } from '../models/Cell';

interface CellProps {
    cell: Cell;
}

const CellComponent: FC<CellProps> = ({ cell }) => {
    return (
        <div className='cell'>
            {cell.block !== null && 
            <div 
                className='block' 
                style={{background: cell.block.color}}
            >
                {cell.block.value}
            </div>}
        </div>
    );
};

export default CellComponent;