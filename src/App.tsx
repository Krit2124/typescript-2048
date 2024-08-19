import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import TableComponent from './components/TableComponent';
import { Table } from './models/Table';

function App() {
  const [table, setTable] = useState(new Table());
  const [tableWidth, setTableWidth] = useState(4);
  const [tableHeight, setTableHeight] = useState(4);

  function restart() {
    const newTable = new Table();
    newTable.initCells(tableWidth, tableHeight);
    newTable.addRandomBlock();
    setTable(newTable);
  }

  useEffect(() => {
    restart();
  }, []);

  return (
    <>
      <div className="table-container">
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
