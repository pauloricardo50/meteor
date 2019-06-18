// @flow
import React from 'react';

type LoanChecklistEmailTableProps = {};

const displayColumn = (column, index = 0) => {
  if (column.el) {
    return (
      <td valign="top" key={index} {...column.style}>
        {column.el}
      </td>
    );
  }

  return (
    <td valign="top" key={index}>
      {column}
    </td>
  );
};

const LoanChecklistEmailTable = ({
  columns = [],
}: LoanChecklistEmailTableProps) => (
  <table
    align="center"
    cellPadding="0"
    cellSpacing="0"
    className="loan-checklist-email-table"
  >
    <tbody>
      <tr>
        {columns.length === 1 ? (
          displayColumn(columns[0])
        ) : (
          <table
            align="center"
            cellPadding="0"
            cellSpacing="0"
            className="loan-checklist-email-table"
          >
            <tbody>
              <tr>{columns.map(displayColumn)}</tr>
            </tbody>
          </table>
        )}
      </tr>
    </tbody>
  </table>
);

export default LoanChecklistEmailTable;
