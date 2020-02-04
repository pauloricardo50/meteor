//      
import React from 'react';

import BoardColumn from './BoardColumn';

                     

const Board = ({
  data = [],
  columnHeader,
  columnHeaderProps,
  columnItem,
  columnItemProps,
}            ) => (
  <div className="board">
    {data.map(columnData => (
      <BoardColumn
        columnHeader={columnHeader}
        columnHeaderProps={columnHeaderProps}
        columnItem={columnItem}
        columnItemProps={columnItemProps}
        columnData={columnData}
        key={columnData.id}
      />
    ))}
  </div>
);

export default Board;
