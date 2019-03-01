// @flow
import React from 'react';

import T, { Money, Percent } from '../../../../../components/Translation';
import { shouldRenderRow } from '../../PdfTable/PdfTable';
import { toMoney } from '../../../../../utils/conversionFunctions';
import { OWN_FUNDS_USAGE_TYPES } from '../../../../loans/loanConstants';
import BalanceSheetTable from '../../BalanceSheetTable';

type BalanceSheetTableProps = {};

const getCostLines = ({ loan, structureId, calculator }) => {
  const propertyValue = calculator.selectPropertyValue({ loan, structureId });
  const notaryFees = calculator.getFees({ loan, structureId }).total;
  const propertyWork = calculator.selectPropertyKey({
    loan,
    structureId,
    key: 'propertyWork',
  });

  return [
    {
      label: (
        <T id="Forms.value" values={{ purchaseType: loan.purchaseType }} />
      ),
      value: propertyValue,
    },
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

const getFinancingLines = ({ loan, structureId, calculator }) => {
  const wantedLoan = calculator.selectLoanValue({ loan, structureId });
  const borrowRatio = calculator.getBorrowRatio({ loan, structureId });
  const ownFunds = calculator.selectStructureKey({
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
        label: (
          <span className="secondary">{ownFundLabel(type, usageType)}</span>
        ),
        value: <span className="secondary">({toMoney(value)})</span>,
        money: false,
      })),
  ].filter(({ condition }) => shouldRenderRow(condition));
};

const BalanceSheet = ({
  loan,
  structureId,
  calculator,
}: BalanceSheetTableProps) => (
  <BalanceSheetTable
    titles={["Coût de l'opération", 'Financement']}
    leftRows={getCostLines({ loan, structureId, calculator })}
    rightRows={getFinancingLines({ loan, structureId, calculator })}
    bottomTitles={['Prix de revient', 'Financement total']}
    bottomValues={[
      <Money
        currency={false}
        value={calculator.getProjectValue({ loan, structureId })}
        key="0"
      />,
      <Money
        currency={false}
        value={calculator.getTotalFinancing({ loan, structureId })}
        key="1"
      />,
    ]}
  />
);

export default BalanceSheet;
