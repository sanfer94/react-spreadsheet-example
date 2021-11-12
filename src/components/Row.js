import React from 'react';
import { Cell } from './Cell';

export const Row = (props) => {
  const { columns, onCellChange, rowData, getTableValue } = props;
  const cells = [];
  const row = props.row;
  for (let y = 0; y < columns; y++) {
    cells.push(
      <Cell
        key={`${row}-${y}`}
        column={y}
        row={row}
        onChange={onCellChange}
        value={rowData[row] || ''}
        getTableValue={getTableValue}
      />
    );
  }

  return <div>{cells}</div>;
};
