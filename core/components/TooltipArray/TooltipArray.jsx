// @flow
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

type TooltipArrayProps = {
  items: Array<String>,
  displayLimit: Number,
};

const TooltipArray = ({ items = [], displayLimit = 1 }: TooltipArrayProps) => {
  const firstItems = items.slice(0, displayLimit);
  const remainingItems = items.slice(displayLimit);

  if (items.length === 0) {
    return <span>-</span>;
  }

  if (items.length <= displayLimit) {
    return (
      <span>
        {[firstItems.slice(0, -1).join(', '), firstItems.slice(-1)[0]].join(firstItems.length < 2 ? '' : ' et ')}
      </span>
    );
  }

  return (
    <Tooltip
      title={items.map(item => (
        <li key={item}>{item}</li>
      ))}
    >
      <span>
        {`${firstItems.join(', ')} et ${remainingItems.length} autre${
          remainingItems.length > 1 ? 's' : ''
        }`}
      </span>
    </Tooltip>
  );
};

export default TooltipArray;
