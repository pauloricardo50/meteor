// @flow
import React from 'react';

type BoardColumnProps = {};

const BoardColumn = ({
  columnHeader: ColumnHeader,
  columnHeaderProps,
  columnItem: ColumnItem,
  columnData: { data = [], id },
}: BoardColumnProps) => (
  <div className="board-column card1 card-top">
    <ColumnHeader id={id} {...columnHeaderProps} />

    {data.map(item => (
      <ColumnItem data={item} key={item._id || item.id} />
    ))}
  </div>
);

export default BoardColumn;
