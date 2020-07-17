import React from 'react';

import T, { Money } from '../../../../../components/Translation';
import BalanceSheetTable from '../../BalanceSheetTable';
import { getOwnFundsLines } from './CostsBalanceSheet';

const getLeftRows = ({ loan, structureId, calculator }) => [
  {
    label: (
      <T id="Financing.wantedLoan" values={{ purchaseType: 'REFINANCING' }} />
    ),
    value: (
      <Money
        value={calculator.selectLoanValue({ loan, structureId })}
        currency={false}
      />
    ),
    money: false,
  },
  {
    label: <T id="PDF.StructurePage.previousLoan" />,
    value: (
      <Money
        value={calculator.getPreviousLoanValue({ loan, structureId })}
        currency={false}
      />
    ),
    money: false,
  },
  {
    label: (
      <b>
        <T id="PDF.StructurePage.totalCost" />
      </b>
    ),
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
    label: <T id="Forms.reimbursementPenalty" />,
    value: (
      <Money
        value={calculator.selectReimbursementPenalty({ loan, structureId })}
        currency={false}
      />
    ),
    money: false,
  },
  {
    label: <T id="Financing.notaryFees" />,
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
    <T id="Recap.refinancing" key="refinancing" />,
    isMissingOwnFunds && <T id="PDF.StructurePage.ownFunds" key="ownFunds" />,
  ].filter(x => x);
};

const getBottomTitles = ({ loan, structureId, calculator }) => {
  const isMissingOwnFunds =
    calculator.getRefinancingRequiredOwnFunds({ loan, structureId }) > 0;
  return [
    isMissingOwnFunds ? (
      <T id="Recap.ownFundsDecrease" />
    ) : (
      <T id="Recap.ownFundsIncrease" />
    ),
    isMissingOwnFunds && <T id="Recap.total" />,
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
          <span className="title">
            <T id="PDF.StructurePage.ownFundsUseDescription" />
          </span>
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
