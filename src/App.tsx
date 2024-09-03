import React, { useEffect, useState } from 'react';
import './App.css';
import TableComponent from './components/TableComponent';
import { Table } from './models/Table';

import restartImage from './assets/restart.png';
import backImage from './assets/back.png';

function App() {
  const [tableWidth, setTableWidth] = useState(4);
  const [tableHeight, setTableHeight] = useState(4);
  const [table, setTable] = useState(new Table(tableWidth, tableHeight));

  function load() {
    const newTable = new Table(tableWidth, tableHeight);
    newTable.loadState(tableWidth, tableHeight);
    setTable(newTable);
  }

  function restart() {
    const newTable = new Table(tableWidth, tableHeight);
    newTable.initCells(tableWidth, tableHeight);
    newTable.addRandomBlock();
    setTable(newTable);
  }

  function back() {
    const newTable = new Table(tableWidth, tableHeight);
    newTable.loadPrevState(table);
    setTable(newTable);
  }

  useEffect(() => {
    load();
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
        <div className='settings-container'>
          <div>
            <div className='tableSize-input-container'>
              <label htmlFor="tw">Количество столбцов:</label>
              <input className='tableSize-input' id='tw' type="number" value={tableWidth} max={25} onChange={(e) => handleWidthChange(e)}/>
            </div>
            <div className='tableSize-input-container'>
              <label htmlFor="th">Количество строк:</label>
              <input className='tableSize-input' id='th' type="number" value={tableHeight} max={25} onChange={(e) => handleHeightChange((e))}/>
            </div>
          </div>
            
          <div className='buttons-container'>
            <button className='button-default' onClick={restart}><img src={restartImage} alt="Сброс"/></button>
            <button className='button-default' onClick={back}><img src={backImage} alt="Отмена"/></button>
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
