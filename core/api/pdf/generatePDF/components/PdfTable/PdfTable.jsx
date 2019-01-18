// @flow
import React from 'react';
import cx from 'classnames';
import PdfTableTooltips from './PdfTableTooltips';

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
  TOOLTIP: 'TOOLTIP',
};

const classes = {
  [ROW_TYPES.TITLE]: 'title-row',
  [ROW_TYPES.TITLE_NO_PADDING]: 'title-row no-padding',
  [ROW_TYPES.REGULAR]: 'regular-row',
  [ROW_TYPES.EMPTY]: 'empty-row',
  [ROW_TYPES.SUM]: 'sum-row',
  [ROW_TYPES.SUBSECTION]: 'subsection-row',
  [ROW_TYPES.TOOLTIP]: 'tooltip',
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
  {
    label,
    tooltip,
    data,
    condition,
    style,
    colspan = 1,
    type = ROW_TYPES.REGULAR,
  },
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
      {label && (
        <td>
          {label}
          {tooltip && <sup> {tooltip.symbol}</sup>}
        </td>
      )}
      {Array.isArray(data)
        ? multiColumn(data, style)
        : singleColumn(data, style)}
    </tr>
  );
};

const PdfTable = ({ rows, className }: PdfTableProps) => (
  <table className={cx('pdf-table', className)}>
    {rows.map((rowData, index) => {
      if (!shouldRenderRow(rowData.condition)) {
        return null;
      }

      return row(rowData, index);
    })}
    <PdfTableTooltips
      tooltips={rows.filter(({ tooltip, condition }) => !!tooltip && shouldRenderRow(condition))}
      rowRenderFunc={row}
      startIndex={rows.length + 1}
    />
  </table>
);
export default PdfTable;
