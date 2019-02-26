// @flow
import React from 'react';

import T, { Money, Percent } from '../../../../../components/Translation';
import Calculator from '../../../../../utils/Calculator';
import { ROW_TYPES, classes, shouldRenderRow } from '../../PdfTable/PdfTable';
import { toMoney } from '../../../../../utils/conversionFunctions';
import { OWN_FUNDS_USAGE_TYPES } from '../../../../loans/loanConstants';

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

const ownFundLabel = (type, usageType) =>
  (usageType ? (
    <T id={`PDF.ownFund.${type}.${usageType}`} />
  ) : (
    <T id={`PDF.ownFund.${type}`} />
  ));

const getFinancingLines = ({ loan, structureId }) => {
  const wantedLoan = Calculator.selectLoanValue({ loan, structureId });
  const borrowRatio = Calculator.getBorrowRatio({ loan, structureId });
  const ownFunds = Calculator.selectStructureKey({
    loan,
    structureId,
    key: 'ownFunds',
  });

  return [
    {
      label: 'Prêt hypothécaire',
      value: (
        <span>
          (<Percent value={borrowRatio} />
          )&nbsp;
          <Money value={wantedLoan} currency={false} />
        </span>
      ),
      money: false,
    },
    ...ownFunds
      .filter(({ usageType }) => usageType !== OWN_FUNDS_USAGE_TYPES.PLEDGE)
      .map(({ value, type, usageType }) => ({
        label: ownFundLabel(type, usageType),
        value,
      })),
    ...ownFunds
      .filter(({ usageType }) => usageType === OWN_FUNDS_USAGE_TYPES.PLEDGE)
      .map(({ value, type, usageType }) => ({
        label: ownFundLabel(type, usageType),
        value: <span className="secondary">{toMoney(value)}</span>,
        money: false,
      })),
  ].filter(({ condition }) => shouldRenderRow(condition));
};

const makeTableContent = (costLines, financingLines) => {
  const lines = Math.max(costLines.length, financingLines.length);

  return [...Array(lines)].map((_, index) => {
    const { label: costLabel, value: costValue, money: costMoney = true } = costLines[index] || {};
    const {
      label: financingLabel,
      value: financingValue,
      money: financingMoney = true,
    } = financingLines[index] || {};

    return (
      <tr key={index} className={classes[ROW_TYPES.REGULAR]}>
        <td>{costLabel}</td>
        <td>{costMoney ? toMoney(costValue) : costValue}</td>
        <td>{financingLabel}</td>
        <td>{financingMoney ? toMoney(financingValue) : financingValue}</td>
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
