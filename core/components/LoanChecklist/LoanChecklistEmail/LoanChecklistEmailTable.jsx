//      
import React from 'react';

                                       

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
}                              ) => (
  <table align="center" cellPadding="0" cellSpacing="0">
    <tbody>
      <tr>{columns.map(displayColumn)}</tr>
    </tbody>
  </table>
);

export default LoanChecklistEmailTable;
