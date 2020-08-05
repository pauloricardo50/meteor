import React from 'react';

import DialogSimple from '../DialogSimple';
import Linkify from '../Linkify';

const TimelineDescription = ({
  activity: { description },
  className = 'timeline-description',
}) => {
  if (!description) {
    return null;
  }

  // When you pass a component, such as front conversation links
  const canSlice = typeof description?.slice === 'function';
  const part1 = canSlice ? description.slice(0, 120) : description;
  const part2 = canSlice ? description.slice(120) : null;

  return (
    <div className={className}>
      <Linkify>
        {part1}
        {part2 ? '...' : null}
      </Linkify>
      {part2 && (
        <DialogSimple
          buttonProps={{
            primary: true,
            raised: false,
            label: 'Afficher tout',
            size: 'small',
            style: { display: 'block' },
          }}
          title="Description complète"
        >
          <Linkify>{description}</Linkify>
        </DialogSimple>
      )}
    </div>
  );
};

export default TimelineDescription;
