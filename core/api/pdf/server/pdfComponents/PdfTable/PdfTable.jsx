import React from 'react';
import cx from 'classnames';
import PdfTableTooltips from './PdfTableTooltips';
import PdfTableRow from './PdfTableRow';

export const ROW_TYPES = {
  TITLE: 'TITLE',
  TITLE_NO_PADDING: 'TITLE_NO_PADDING',
  REGULAR: 'REGULAR',
  EMPTY: 'EMPTY',
  SUM: 'SUM',
  SUBSECTION: 'SUBSECTION',
  TOOLTIP: 'TOOLTIP',
};

export const classes = {
  [ROW_TYPES.TITLE]: 'title-row',
  [ROW_TYPES.TITLE_NO_PADDING]: 'title-row no-padding',
  [ROW_TYPES.REGULAR]: 'regular-row',
  [ROW_TYPES.EMPTY]: 'empty-row',
  [ROW_TYPES.SUM]: 'sum-row',
  [ROW_TYPES.SUBSECTION]: 'subsection-row',
  [ROW_TYPES.TOOLTIP]: 'tooltip',
};

export const shouldRenderRow = condition =>
  condition === undefined || condition;

const PdfTable = ({ rows, className, columnOptions = [], style = {} }) => (
  <table className={cx('pdf-table', className)} style={style}>
    {rows.map((rowData, index) => {
      if (!shouldRenderRow(rowData.condition)) {
        return null;
      }

      return (
        <PdfTableRow
          key={index}
          rowData={rowData}
          index={index}
          columnOptions={columnOptions}
        />
      );
    })}
    <PdfTableTooltips
      tooltips={rows.filter(
        ({ tooltip, condition }) => !!tooltip && shouldRenderRow(condition),
      )}
      startIndex={rows.length + 1}
    />
  </table>
);
export default PdfTable;
