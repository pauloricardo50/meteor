//
import React from 'react';

const BoardColumn = ({
  columnHeader: ColumnHeader,
  columnHeaderProps,
  columnItem: ColumnItem,
  columnItemProps,
  columnData: { data = [], id },
}) => (
  <div className="board-column card1 card-top">
    <ColumnHeader id={id} count={data.length} {...columnHeaderProps} />

    {data.map(({ boardItemOptions = {}, ...item }) => {
      let component = (
        <ColumnItem {...columnItemProps} data={item} key={item._id} />
      );

      if (boardItemOptions.titleTop) {
        component = [boardItemOptions.titleTop, component];
      }

      if (boardItemOptions.titleBottom) {
        component = [component, boardItemOptions.titleBottom];
      }

      return component;
    })}
  </div>
);

export default BoardColumn;
