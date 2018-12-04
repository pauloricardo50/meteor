// @flow
import React from 'react';
import cx from 'classnames';

type PdfTableProps = {
  rows: Array,
  className: String,
};

export const ROW_TYPES = {
  TITLE: 'TITLE',
  TITLE_NO_PADDING: 'TITLE_NO_PADDING',
  REGULAR: 'REGULAR',
  EMPTY: 'EMPTY',
  SUM: 'SUM',
  SUBSECTION: 'SUBSECTION',
};

const classes = {
  [ROW_TYPES.TITLE]: 'title-row',
  [ROW_TYPES.TITLE_NO_PADDING]: 'title-row no-padding',
  [ROW_TYPES.REGULAR]: 'regular-row',
  [ROW_TYPES.EMPTY]: 'empty-row',
  [ROW_TYPES.SUM]: 'sum-row',
  [ROW_TYPES.SUBSECTION]: 'subsection-row',
};

const shouldRenderRow = condition => condition === undefined || condition;

const multiColumn = (data, style) =>
  data.map((x, index) => (
    <td style={style} key={index}>
      {x}
    </td>
  ));

const singleColumn = (data, style) => <td style={style}>{data}</td>;

const row = (
  { label, data, condition, style, colspan = 1, type = ROW_TYPES.REGULAR },
  index,
) => {
  if (colspan > 1) {
    return (
      <tr key={index} className={classes[type]}>
        {label && <td colSpan={colspan}>{label}</td>}
      </tr>
    );
  }

  return (
    <tr key={index} className={classes[type]}>
      {label && <td>{label}</td>}
      {Array.isArray(data)
        ? multiColumn(data, style)
        : singleColumn(data, style)}
    </tr>
  );
};

const PdfTable = ({ rows, className }: PdfTableProps) => (
  // console.log('rows', rows);

  <table className={cx('pdf-table', className)}>
    {rows.map((rowData, index) =>
      shouldRenderRow(rowData.condition) && row(rowData, index))}
  </table>
);
export default PdfTable;
