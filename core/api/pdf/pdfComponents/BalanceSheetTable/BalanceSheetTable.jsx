import React from 'react';

import { toMoney } from '../../../../utils/conversionFunctions';
import { CELL_TYPES, ROW_TYPES, classes } from '../PdfTable/PdfTable';

const makeTableContent = (leftRows, rightRows = []) => {
  const lines = Math.max(rightRows.length, leftRows.length);

  return [...Array(lines)].map((_, index) => {
    const { label: leftLabel, value: leftValue, money: leftMoney = true } =
      leftRows[index] || {};
    const { label: rightLabel, value: rightValue, money: rightMoney = true } =
      rightRows[index] || {};

    return (
      <tr key={index} className={classes[ROW_TYPES.REGULAR]}>
        <td className={classes[CELL_TYPES.LEFT_LABEL]}>{leftLabel}</td>
        <td className={classes[CELL_TYPES.LEFT_VALUE]}>
          {leftMoney ? toMoney(leftValue) : leftValue}
        </td>
        {!!rightRows.length && (
          <>
            <td className={classes[CELL_TYPES.RIGHT_LABEL]}>{rightLabel}</td>
            <td className={classes[CELL_TYPES.RIGHT_VALUE]}>
              {rightMoney ? toMoney(rightValue) : rightValue}
            </td>
          </>
        )}
      </tr>
    );
  });
};

const BalanceSheetTable = ({
  titles,
  rightRows,
  leftRows,
  bottomTitles,
  bottomValues,
}) => (
  <table className="pdf-table balance-sheet-table">
    <tr className={classes[ROW_TYPES.TITLE]}>
      <td className={classes[CELL_TYPES.LEFT_LABEL]} colSpan={2}>
        {titles[0]}
      </td>
      {titles.length === 2 && (
        <td className={classes[CELL_TYPES.RIGHT_LABEL]} colSpan={2}>
          {titles[1]}
        </td>
      )}
    </tr>

    {makeTableContent(leftRows, rightRows)}

    <tr className={classes[ROW_TYPES.SUM]}>
      <td className={classes[CELL_TYPES.LEFT_LABEL]}>{bottomTitles[0]}</td>
      <td className={classes[CELL_TYPES.LEFT_VALUE]}>{bottomValues[0]}</td>
      {titles.length === 2 && (
        <>
          <td className={classes[CELL_TYPES.RIGHT_LABEL]}>{bottomTitles[1]}</td>
          <td className={classes[CELL_TYPES.RIGHT_VALUE]}>{bottomValues[1]}</td>
        </>
      )}
    </tr>
  </table>
);

export default BalanceSheetTable;
