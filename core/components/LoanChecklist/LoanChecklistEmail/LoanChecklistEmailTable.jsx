// @flow
import React from 'react';

type LoanChecklistEmailTableProps = {};

const displayColumn = (column, index = 0) => {
  if (column.el) {
    return (
      <td key={index} {...column.style}>
        {column.el}
      </td>
    );
  }

  return <td key={index}>{column}</td>;
};

const LoanChecklistEmailTable = ({
  columns = [],
}: LoanChecklistEmailTableProps) => (
  <table align="center" cellPadding="0" cellSpacing="0">
    <tbody>
      <tr>{columns.map(displayColumn)}</tr>
    </tbody>
  </table>
);

export default LoanChecklistEmailTable;
