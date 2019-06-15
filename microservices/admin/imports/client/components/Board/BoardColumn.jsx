// @flow
import React from 'react';

type BoardColumnProps = {};

const BoardColumn = ({
  columnHeader: ColumnHeader,
  columnHeaderProps,
  columnItem: ColumnItem,
  columnItemProps,
  columnData: { data = [], id },
}: BoardColumnProps) => (
  <div className="board-column card1 card-top">
    <ColumnHeader id={id} count={data.length} {...columnHeaderProps} />

    {data.map(item => (
      <ColumnItem {...columnItemProps} data={item} key={item._id} />
    ))}
  </div>
);

export default BoardColumn;
