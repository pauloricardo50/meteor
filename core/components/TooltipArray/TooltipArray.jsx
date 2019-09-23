// @flow
import React from 'react';

import StickyPopover from '../StickyPopover';

type TooltipArrayProps = {
  items: Array<String>,
  displayLimit: Number,
  title: String,
};

const TooltipArray = ({
  items = [],
  displayLimit = 1,
  title,
}: TooltipArrayProps) => {
  const firstItems = items.slice(0, displayLimit);
  const remainingItems = items.slice(displayLimit);

  if (items.length === 0) {
    return <span>-</span>;
  }

  if (items.length <= displayLimit) {
    return typeof firstItems[0] === 'string' ? (
      <span>
        {[firstItems.slice(0, -1).join(', '), firstItems.slice(-1)[0]].join(firstItems.length < 2 ? '' : ' et ')}
      </span>
    ) : (
      firstItems
    );
  }

  return (
    <StickyPopover
      title={title}
      component={items.map(item => (
        <div key={item}>{item}</div>
      ))}
    >
      {typeof firstItems[0] === 'string' ? (
        <span>
          {`${firstItems.join(', ')} et ${remainingItems.length} autre${
            remainingItems.length > 1 ? 's' : ''
          }`}
        </span>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {firstItems}
          {` et ${remainingItems.length} autre${
            remainingItems.length > 1 ? 's' : ''
          }`}
        </div>
      )}
    </StickyPopover>
  );
};

export default TooltipArray;
