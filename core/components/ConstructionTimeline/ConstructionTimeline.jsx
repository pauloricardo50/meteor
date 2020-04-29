import React from 'react';
import { useTable } from 'react-table';

import { Money } from '../Translation';

export const ConstructionTimelineItem = ({
  description,
  date,
  value,
  isLast,
}) => (
  <div className="construction-timeline-item">
    <div className="content">
      <h4 className="content-description font-size-5">
        <small>{description}</small>
      </h4>
      <h5 className="content-date secondary">
        <small>{date}</small>
      </h5>
      {value && <Money value={value} />}
    </div>
    {!isLast && <div className="line" />}
  </div>
);

const ConstructionTimeline = ({ columns }) => {
  const { headerGroups } = useTable({
    columns,
    data: [],
  });

  const colCount = columns.reduce(
    (tot, { columns: cols }) => tot + cols.length,
    0,
  );

  return (
    <table
      className="construction-timeline"
      style={{ minWidth: colCount * 150 }}
      cellSpacing="0"
      cellPadding="0"
    >
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
    </table>
  );
};
export default ConstructionTimeline;
