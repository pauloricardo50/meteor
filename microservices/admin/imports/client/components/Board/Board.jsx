// @flow
import React from 'react';

import BoardColumn from './BoardColumn';

type BoardProps = {};

const Board = ({ data = [], columnHeader, columnItem }: BoardProps) => (
  <div className="board">
    {data.map(columnData => (
      <BoardColumn
        columnHeader={columnHeader}
        columnItem={columnItem}
        columnData={columnData}
        key={columnData.id}
      />
    ))}
  </div>
);

export default Board;
