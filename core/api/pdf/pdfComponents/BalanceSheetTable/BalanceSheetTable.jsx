// @flow
import React from 'react';
import { classes, ROW_TYPES } from '../PdfTable/PdfTable';
import { toMoney } from '../../../../utils/conversionFunctions';

type BalanceSheetTableProps = {};

const makeTableContent = (rightRows, leftRows) => {
  const lines = Math.max(rightRows.length, leftRows.length);

  return [...Array(lines)].map((_, index) => {
    const { label: rightLabel, value: rightValue, money: rightMoney = true } = rightRows[index] || {};
    const { label: leftLabel, value: leftValue, money: leftMoney = true } = leftRows[index] || {};

    return (
      <tr key={index} className={classes[ROW_TYPES.REGULAR]}>
        <td>{rightLabel}</td>
        <td>{rightMoney ? toMoney(rightValue) : rightValue}</td>
        <td>{leftLabel}</td>
        <td>{leftMoney ? toMoney(leftValue) : leftValue}</td>
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
}: BalanceSheetTableProps) => (
  <table className="pdf-table balance-sheet-table">
    <tr className={classes[ROW_TYPES.TITLE]}>
      <td colSpan={2}>{titles[0]}</td>
      <td colSpan={2}>{titles[1]}</td>
    </tr>

    {makeTableContent(rightRows, leftRows)}

    <tr className={classes[ROW_TYPES.SUM]}>
      <td>{bottomTitles[0]}</td>
      <td>{bottomValues[0]}</td>
      <td>{bottomTitles[1]}</td>
      <td>{bottomValues[1]}</td>
    </tr>
  </table>
);

export default BalanceSheetTable;
