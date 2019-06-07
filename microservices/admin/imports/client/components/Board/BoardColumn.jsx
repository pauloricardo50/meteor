// @flow
import React from 'react';
import { FixedSizeList as List } from 'react-window';

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

    <List height={1000} itemCount={data.length} itemSize={120} width={300}>
      {({ index, style }) => (
        <div
          style={{
            ...style,
            padding: index === 0 ? 8 : '4px 8px',
            boxSizing: 'border-box',
          }}
        >
          <ColumnItem {...columnItemProps} data={data[index]} />
        </div>
      )}
    </List>
  </div>
);

export default BoardColumn;
