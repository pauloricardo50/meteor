import React from 'react';

import { toMoney } from '../../../../../utils/conversionFunctions';
import { ROW_TYPES, classes } from '../PdfTable/PdfTable';

const makeTableContent = (leftRows, rightRows = []) => {
  const lines = Math.max(rightRows.length, leftRows.length);

  return [...Array(lines)].map((_, index) => {
    const { label: leftLabel, value: leftValue, money: leftMoney = true } =
      leftRows[index] || {};
    const { label: rightLabel, value: rightValue, money: rightMoney = true } =
      rightRows[index] || {};

    return (
      <tr key={index} className={classes[ROW_TYPES.REGULAR]}>
        <td>{leftLabel}</td>
        <td>{leftMoney ? toMoney(leftValue) : leftValue}</td>
        {!!rightRows.length && (
          <>
            <td>{rightLabel}</td>
            <td>{rightMoney ? toMoney(rightValue) : rightValue}</td>
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
      <td colSpan={2}>{titles[0]}</td>
      {titles.length === 2 && <td colSpan={2}>{titles[1]}</td>}
    </tr>

    {makeTableContent(leftRows, rightRows)}

    <tr className={classes[ROW_TYPES.SUM]}>
      <td>{bottomTitles[0]}</td>
      <td>{bottomValues[0]}</td>
      {titles.length === 2 && (
        <>
          <td>{bottomTitles[1]}</td>
          <td>{bottomValues[1]}</td>
        </>
      )}
    </tr>
  </table>
);

export default BalanceSheetTable;
