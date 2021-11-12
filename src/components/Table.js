import React, { useState } from 'react';
import { Row } from './Row';

export const Table = (props) => {
  const { rows, columns } = props;
  const [data, setData] = useState({});

  const onCellChange = (x, y, valueToSet) => {
    const modifiedData = Object.assign({}, data);
    if (!modifiedData[x]) {
      modifiedData[x] = {};
    }
    modifiedData[x][y] = valueToSet;
    setData(modifiedData);
  };

  const handleGetValue = (row, column) => {
    let ret;

    if (data[row] && data[row][column]) {
      let value = data[row][column];
      ret = {
        value: value.slice(1),
        isFormula: !Number.isInteger(parseInt(value.slice(1)))
      };
    } else {
      ret = {
        value: '0',
        isFormula: false
      };
    }

    return ret;
  };

  const rowsArray = [];
  for (let x = 0; x < rows + 1; x++) {
    const rowData = data[x] || {};
    rowsArray.push(
      <Row
        onCellChange={onCellChange}
        key={x}
        row={x}
        columns={columns + 1}
        rowData={rowData}
        getTableValue={handleGetValue}
      />
    );
  }

  return <div>{rowsArray}</div>;
};
