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

  const part1 = description.slice(0, 120);
  const part2 = description.slice(120);

  return (
    <div className={className}>
      <Linkify>
        {part1} {part2 ? '...' : null}
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
