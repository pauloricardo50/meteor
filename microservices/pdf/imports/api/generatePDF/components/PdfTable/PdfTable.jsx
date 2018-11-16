// @flow
import React from 'react';
import cx from 'classnames';

type PdfTableProps = {
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

const row = ({ label, data, condition, style, colspan = 1 }, index) => {
  if (colspan > 1) {
    return <tr key={index}>{label && <td colSpan={colspan}>{label}</td>}</tr>;
  }

  return (
    <tr key={index}>
      {label && <td>{label}</td>}
      {Array.isArray(data)
        ? multiColumn(data, style)
        : singleColumn(data, style)}
    </tr>
  );
};

const PdfTable = ({ rows, className }: PdfTableProps) => (
  <table className={cx('pdf-table', className)}>
    {rows.map((rowData, index) =>
      shouldRenderRow(rowData.condition) && row(rowData, index))}
  </table>
);

export default PdfTable;
