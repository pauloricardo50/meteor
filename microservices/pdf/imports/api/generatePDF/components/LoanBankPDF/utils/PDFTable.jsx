// @flow
import React from 'react';
import cx from 'classnames';

type PDFTableProps = {
  rows: Array,
  className: String,
};

const shouldRenderRow = condition => condition === undefined || condition;

const multiColumn = (data, style) =>
  data.map((x, index) => (
    <td style={style} key={index}>
      {x}
    </td>
  ));

const singleColumn = (data, style) => <td style={style}>{data}</td>;

const row = ({ label, data, condition, style, colspan = 1 }) => (
  <tr key={label} colSpan={colspan}>
    {label && <td>{label}</td>}
    {Array.isArray(data) ? multiColumn(data, style) : singleColumn(data, style)}
  </tr>
);

const PDFTable = ({ rows, className }: PDFTableProps) => (
  <table className={cx('pdf-table', className)}>
    {rows.map(rowData => shouldRenderRow(rowData.condition) && row(rowData))}
  </table>
);

export default PDFTable;
