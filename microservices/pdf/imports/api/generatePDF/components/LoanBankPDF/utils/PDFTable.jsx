// @flow
import React from 'react';
import cx from 'classnames';

type PDFTableProps = {
  array: Array,
  className: String,
};

const shouldRenderRow = condition => condition === undefined || condition;

const PDFTable = ({ array, className }: PDFTableProps) => (
  <table className={cx('pdf-table', className)} cellSpacing="5">
    {array.map(({ label, data, condition, style }) =>
      shouldRenderRow(condition) && (
        <tr key={label}>
          {label && <td>{label}</td>}
          {Array.isArray(data) ? (
            data.map((x, index) => (
              <td style={style} key={index}>
                {x}
              </td>
            ))
          ) : (
            <td style={style}>{data}</td>
          )}
        </tr>
      ))}
  </table>
);

export default PDFTable;
