import React from 'react';
import cx from 'classnames';

import PdfTableRow from './PdfTableRow';
import PdfTableTooltips from './PdfTableTooltips';

export const ROW_TYPES = {
  TITLE: 'TITLE',
  TITLE_NO_PADDING: 'TITLE_NO_PADDING',
  REGULAR: 'REGULAR',
  EMPTY: 'EMPTY',
  SUM: 'SUM',
  SUBSECTION: 'SUBSECTION',
  TOOLTIP: 'TOOLTIP',
};

export const CELL_TYPES = {
  LEFT_LABEL: 'LEFT_LABEL',
  LEFT_VALUE: 'LEFT_VALUE',
  RIGHT_LABEL: 'RIGHT_LABEL',
  RIGHT_VALUE: 'RIGHT_VALUE',
};

export const classes = {
  [ROW_TYPES.TITLE]: 'title-row',
  [ROW_TYPES.TITLE_NO_PADDING]: 'title-row no-padding',
  [ROW_TYPES.REGULAR]: 'regular-row',
  [ROW_TYPES.EMPTY]: 'empty-row',
  [ROW_TYPES.SUM]: 'sum-row',
  [ROW_TYPES.SUBSECTION]: 'subsection-row',
  [ROW_TYPES.TOOLTIP]: 'tooltip',
  [CELL_TYPES.LEFT_LABEL]: 'left-label',
  [CELL_TYPES.LEFT_VALUE]: 'left-value',
  [CELL_TYPES.RIGHT_LABEL]: 'right-label',
  [CELL_TYPES.RIGHT_VALUE]: 'right-value',
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
