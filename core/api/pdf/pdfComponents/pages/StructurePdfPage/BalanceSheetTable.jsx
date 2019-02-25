// @flow
import React from 'react';

import { Money } from '../../../../../components/Translation';
import Calculator from '../../../../../utils/Calculator';
import { ROW_TYPES, classes, shouldRenderRow } from '../../PdfTable/PdfTable';
import { toMoney } from '../../../../../utils/conversionFunctions';

type BalanceSheetTableProps = {};

const getCostLines = ({ loan, structureId }) => {
  const propertyValue = Calculator.selectPropertyValue({ loan, structureId });
  const notaryFees = Calculator.getFees({ loan, structureId }).total;
  const propertyWork = Calculator.selectPropertyKey({
    loan,
    structureId,
    key: 'propertyWork',
  });

  return [
    { label: "Prix d'achat", value: propertyValue },
    { label: 'Frais de notaire', value: notaryFees },
    {
      label: 'Travaux de plus-value',
      value: propertyWork,
      condition: propertyWork > 0,
    },
  ].filter(({ condition }) => shouldRenderRow(condition));
};

const getFinancingLines = ({ loan, structureId }) => {
  const wantedLoan = Calculator.selectLoanValue({ loan, structureId });

  return [{ label: 'Prêt hypothécaire', value: wantedLoan }].filter(({ condition }) => shouldRenderRow(condition));
};

const makeTableContent = (costLines, financingLines) => {
  const lines = Math.max(costLines.length, financingLines.length);

  return [...Array(lines)].map((_, index) => {
    const costLine = costLines[index] || {};
    const financingLine = financingLines[index] || {};

    return (
      <tr key={index} className={classes[ROW_TYPES.REGULAR]}>
        <td>{costLine.label}</td>
        <td>{toMoney(costLine.value)}</td>
        <td>{financingLine.label}</td>
        <td>{toMoney(financingLine.value)}</td>
      </tr>
    );
  });
};

const BalanceSheetTable = ({ loan, structureId }: BalanceSheetTableProps) => (
  <table className="pdf-table balance-sheet-table">
    <tr className={classes[ROW_TYPES.TITLE]}>
      <td colSpan={2}>Coût de l'opération</td>
      <td colSpan={2}>Financement</td>
    </tr>

    {makeTableContent(
      getCostLines({ loan, structureId }),
      getFinancingLines({ loan, structureId }),
    )}

    <tr className={classes[ROW_TYPES.SUM]}>
      <td>Prix de revient</td>
      <td>
        <Money
          currency={false}
          value={Calculator.getProjectValue({ loan, structureId })}
        />
      </td>
      <td>Financement total</td>
      <td>
        <Money
          currency={false}
          value={Calculator.getTotalFinancing({ loan, structureId })}
        />
      </td>
    </tr>
  </table>
);

export default BalanceSheetTable;
