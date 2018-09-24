// @flow
import React from 'react';

type PDFTableProps = {
  array: Array,
  className: String,
};

const PDFTable = ({ array, className }: PDFTableProps) => (
  <table className={className} cellSpacing="5">
    {array.map(({ label, data, condition, style }) =>
      (condition === undefined || condition) && (
        <tr key={label}>
          {label && <td>{label}</td>}
          <td style={style}>{data}</td>
        </tr>
      ))}
  </table>
);

export default PDFTable;
