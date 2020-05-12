import React from 'react';

import { Money } from '../../../../../../components/Translation';
import BalanceSheetTable from '../../BalanceSheetTable';
import { getOwnFundsLines } from './CostsBalanceSheet';

const getLeftRows = ({ loan, structureId, calculator }) => [
  {
    label: 'Nouveau prêt hypothécaire',
    value: (
      <Money
        value={calculator.selectLoanValue({ loan, structureId })}
        currency={false}
      />
    ),
    money: false,
  },
  {
    label: 'Prêt actuel',
    value: (
      <Money
        value={calculator.getPreviousLoanValue({ loan, structureId })}
        currency={false}
      />
    ),
    money: false,
  },
  {
    label: <b>Coût de l'opération</b>,
    value: (
      <b>
        <Money
          value={calculator.getFees({ loan, structureId }).total}
          currency={false}
        />
      </b>
    ),
    money: false,
  },
  {
    label: 'Pénalités de remboursement',
    value: (
      <Money
        value={calculator.selectReimbursementPenalty({ loan, structureId })}
        currency={false}
      />
    ),
    money: false,
  },
  {
    label: 'Frais de notaire',
    value: (
      <Money
        value={calculator.getNotaryFees({ loan, structureId }).total}
        currency={false}
      />
    ),
    money: false,
  },
];
const getRightRows = ({ loan, structureId, calculator }) => {
  const isMissingOwnFunds =
    calculator.getRefinancingRequiredOwnFunds({ loan, structureId }) > 0;

  if (!isMissingOwnFunds) {
    return [];
  }

  return getOwnFundsLines({ loan, structureId, calculator });
};

const getTitles = ({ loan, structureId, calculator }) => {
  const isMissingOwnFunds =
    calculator.getRefinancingRequiredOwnFunds({ loan, structureId }) > 0;

  return [
    'Refinancement',
    isMissingOwnFunds && 'Répartition des fonds propres',
  ].filter(x => x);
};

const getBottomTitles = ({ loan, structureId, calculator }) => {
  const isMissingOwnFunds =
    calculator.getRefinancingRequiredOwnFunds({ loan, structureId }) > 0;
  return [
    isMissingOwnFunds
      ? 'Amortissement extraordinaire'
      : 'Dégagement de liquidité',
    isMissingOwnFunds && 'Total',
  ].filter(x => x);
};
const getBottomValues = ({ loan, structureId, calculator }) => {
  const missingOwnFunds = calculator.getRefinancingRequiredOwnFunds({
    loan,
    structureId,
  });
  const isMissingOwnFunds = missingOwnFunds > 0;

  return [
    <Money currency={false} value={Math.abs(missingOwnFunds)} key="0" />,
    isMissingOwnFunds && (
      <Money
        currency={false}
        value={
          calculator.getTotalUsed({ loan, structureId }) -
          calculator.getTotalPledged({ loan, structureId })
        }
        key="1"
      />
    ),
  ].filter(x => x);
};

const RefinancingBalanceSheet = ({ loan, structureId, calculator }) => {
  const isMissingOwnFunds =
    calculator.getRefinancingRequiredOwnFunds({ loan, structureId }) > 0;

  return (
    <>
      <BalanceSheetTable
        titles={getTitles({ loan, structureId, calculator })}
        leftRows={getLeftRows({ loan, structureId, calculator })}
        rightRows={getRightRows({ loan, structureId, calculator })}
        bottomTitles={getBottomTitles({ loan, structureId, calculator })}
        bottomValues={getBottomValues({ loan, structureId, calculator })}
      />
      {!isMissingOwnFunds && (
        <div className="own-funds-use-description">
          <span className="title">Description de l'usage des liquidités</span>
          <p>
            {calculator.selectStructureKey({
              loan,
              structureId,
              key: 'ownFundsUseDescription',
            })}
          </p>
        </div>
      )}
    </>
  );
};

export default RefinancingBalanceSheet;
