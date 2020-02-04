//      
import React from 'react';

import { OWN_FUNDS_USAGE_TYPES, OWN_FUNDS_TYPES } from 'core/api/constants';
import T, { Money, Percent } from '../../../../../../components/Translation';
import { shouldRenderRow } from '../../PdfTable/PdfTable';
import BalanceSheetTable from '../../BalanceSheetTable';

                                      

const getCostLines = ({ loan, structureId, calculator }) => {
  const fees = calculator.getFees({ loan, structureId });
  const {
    total: totalFees,
    buyersContractFees: { total: totalBuyersContractFees = 0 } = {},
    mortgageNoteFees: { total: totalMortgageNoteFees = 0 } = {},
    deductions: {
      buyersContractDeductions = 0,
      mortgageNoteDeductions = 0,
    } = {},
  } = fees;
  const cashUsed = calculator.getCashUsed({ loan, structureId }) - totalFees;
  const insurance2Used = calculator.getUsedFundsOfType({
    loan,
    type: OWN_FUNDS_TYPES.INSURANCE_2,
    usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
    structureId,
  });
  const finalBuyersContractFees = totalBuyersContractFees
    ? totalBuyersContractFees - buyersContractDeductions
    : 0;
  const finalMortgageNoteFees = totalMortgageNoteFees
    ? totalMortgageNoteFees - mortgageNoteDeductions
    : 0;
  const propAndWork = calculator.getPropAndWork({ loan, structureId });

  return [
    {
      label: <b>Fonds propres</b>,
      value: (
        <b>
          <Money value={cashUsed + insurance2Used} currency={false} />
        </b>
      ),
      money: false,
    },
    {
      label: 'Épargne',
      value: <Money value={cashUsed} currency={false} />,
      money: false,
    },
    {
      label: 'Retrait prévoyance professionnelle',
      value: <Money value={insurance2Used} currency={false} />,
      money: false,
      condition: !!insurance2Used,
    },
    {
      label: (
        <>
          <b>Frais de transaction&nbsp;</b>
          <span className="secondary">
            (<Percent value={totalFees / propAndWork} />)
          </span>
        </>
      ),
      value: (
        <b>
          <Money value={totalFees} currency={false} />
        </b>
      ),
      money: false,
    },
    {
      label: (
        <>
          Frais d'acte&nbsp;
          <span className="secondary">
            (<Percent value={finalBuyersContractFees / propAndWork} />)
          </span>
        </>
      ),
      value: <Money value={finalBuyersContractFees} currency={false} />,
      money: false,
      condition: !!finalBuyersContractFees,
    },
    {
      label: (
        <>
          Frais de cédule&nbsp;
          <span className="secondary">
            (<Percent value={finalMortgageNoteFees / propAndWork} />)
          </span>
        </>
      ),
      value: <Money value={finalMortgageNoteFees} currency={false} />,
      money: false,
      condition: !!finalMortgageNoteFees,
    },
  ].filter(({ condition }) => shouldRenderRow(condition));
};

const ownFundLabel = ({ type, usageType, borrower, borrowerIndex }) => {
  const borrowerSuffix = borrower ? (
    <>
      &nbsp;
      <span className="secondary">
        (
        {borrower.firstName || (
          <T
            id="general.borrowerWithIndex"
            values={{ index: borrowerIndex + 1 }}
          />
        )}
        )
      </span>
    </>
  ) : null;
  return usageType ? (
    <span>
      <T id={`PDF.ownFund.${type}.${usageType}`} />
      {borrowerSuffix}
    </span>
  ) : (
    <span>
      <T id={`PDF.ownFund.${type}`} />
      {borrowerSuffix}
    </span>
  );
};

const getOwnFundsLines = ({ loan, structureId, calculator }) => {
  const { borrowers } = loan;
  const multipleBorrowers = borrowers.length > 1;
  const ownFunds = calculator.selectStructureKey({
    loan,
    structureId,
    key: 'ownFunds',
  });
  return ownFunds
    .filter(({ usageType }) => usageType !== OWN_FUNDS_USAGE_TYPES.PLEDGE)
    .map(({ value, type, usageType, borrowerId }) => ({
      label: ownFundLabel({
        type,
        usageType,
        borrower:
          multipleBorrowers && borrowers.find(({ _id }) => _id === borrowerId),
        borrowerIndex: borrowers.findIndex(({ _id }) => _id === borrowerId) + 1,
      }),
      value,
    }))
    .filter(({ condition }) => shouldRenderRow(condition));
};

const CostsBalanceSheet = ({
  loan,
  structureId,
  calculator,
}                             ) => (
  <BalanceSheetTable
    titles={["Coût de l'opération", 'Répartition des fonds propres']}
    leftRows={getCostLines({ loan, structureId, calculator })}
    rightRows={getOwnFundsLines({ loan, structureId, calculator })}
    bottomTitles={['Total', 'Total']}
    bottomValues={[
      <Money
        currency={false}
        value={
          calculator.getCashUsed({ loan, structureId }) +
          calculator.getUsedFundsOfType({
            loan,
            type: OWN_FUNDS_TYPES.INSURANCE_2,
            usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
            structureId,
          })
        }
        key="0"
      />,
      <Money
        currency={false}
        value={
          calculator.getTotalUsed({ loan, structureId }) -
          calculator.getTotalPledged({ loan, structureId })
        }
        key="1"
      />,
    ]}
  />
);

export default CostsBalanceSheet;
