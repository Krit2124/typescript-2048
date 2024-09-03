import React, { useEffect, useState } from 'react';
import './App.css';
import TableComponent from './components/TableComponent';
import { Table } from './models/Table';

function App() {
  const [tableWidth, setTableWidth] = useState(4);
  const [tableHeight, setTableHeight] = useState(4);
  const [table, setTable] = useState(new Table(tableWidth, tableHeight));

  function restart() {
    const newTable = new Table(tableWidth, tableHeight);
    newTable.loadState(tableWidth, tableHeight);
    setTable(newTable);
  }

  useEffect(() => {
    restart();
  }, [tableWidth, tableHeight]);

  function handleWidthChange(e: any) {
    setTableWidth(Math.min(Number(e.target.value), 25));
  }

  function handleHeightChange(e: any) {
    setTableHeight(Math.min(Number(e.target.value), 25));
  }

  return (
    <>
      <div className="table-container">
        <div className='tableSize-container'>
          <div className='tableSize-input-container'>
            <label htmlFor="tw">Количество столбцов:</label>
            <input className='tableSize-input' id='tw' type="number" value={tableWidth} max={25} onChange={(e) => handleWidthChange(e)}/>
          </div>
          <div className='tableSize-input-container'>
            <label htmlFor="th">Количество строк:</label>
            <input className='tableSize-input' id='th' type="number" value={tableHeight} max={25} onChange={(e) => handleHeightChange((e))}/>
          </div>
        </div>

        <TableComponent
          width={tableWidth}
          height={tableHeight}
          table={table}
          setTable={setTable}
        />
      </div>
    </>
  );
}

export default App;
