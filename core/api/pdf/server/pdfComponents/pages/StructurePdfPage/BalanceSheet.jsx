// @flow
import React from 'react';

import T, { Money } from '../../../../../../components/Translation';
import { toMoney } from '../../../../../../utils/conversionFunctions';
import { OWN_FUNDS_USAGE_TYPES } from '../../../../../loans/loanConstants';
import { shouldRenderRow } from '../../PdfTable/PdfTable';
import BalanceSheetTable from '../../BalanceSheetTable';

type BalanceSheetTableProps = {};

const getCostLines = ({ loan, structureId, calculator }) => {
  const propertyValue = calculator.selectPropertyValue({ loan, structureId });
  const notaryFees = calculator.getFees({ loan, structureId }).total;
  const propertyWork = calculator.selectStructureKey({
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
const getFinancingLines = ({ loan, structureId, calculator }) => {
  const { borrowers } = loan;
  const multipleBorrowers = borrowers.length > 1;
  const wantedLoan = calculator.selectLoanValue({ loan, structureId });
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
          <Money value={wantedLoan} currency={false} />
        </span>
      ),
      money: false,
    },
    ...ownFunds
      .filter(({ usageType }) => usageType !== OWN_FUNDS_USAGE_TYPES.PLEDGE)
      .map(({ value, type, usageType, borrowerId }) => ({
        label: ownFundLabel({
          type,
          usageType,
          borrower:
            multipleBorrowers &&
            borrowers.find(({ _id }) => _id === borrowerId),
          borrowerIndex:
            borrowers.findIndex(({ _id }) => _id === borrowerId) + 1,
        }),
        value,
      })),
    ...ownFunds
      .filter(({ usageType }) => usageType === OWN_FUNDS_USAGE_TYPES.PLEDGE)
      .map(({ value, type, usageType, borrowerId }) => ({
        label: (
          <span className="secondary">
            {ownFundLabel({
              type,
              usageType,
              borrower:
                multipleBorrowers &&
                borrowers.find(({ _id }) => _id === borrowerId),
              borrowerIndex:
                borrowers.findIndex(({ _id }) => _id === borrowerId) + 1,
            })}
          </span>
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

// // @flow
// import React from 'react';

// import { OWN_FUNDS_TYPES } from 'core/api/borrowers/borrowerConstants';
// import Percent from 'core/components/Translation/numberComponents/Percent';
// import T, { Money } from '../../../../../../components/Translation';
// import { shouldRenderRow } from '../../PdfTable/PdfTable';
// import BalanceSheetTable from '../../BalanceSheetTable';

// type BalanceSheetTableProps = {};

// const getCostLines = ({ loan, structureId, calculator }) => {
//   const propertyValue = calculator.selectPropertyValue({ loan, structureId });
//   const notaryFees = calculator.getFees({ loan, structureId }).total;
//   const propertyWork = calculator.selectStructureKey({
//     loan,
//     structureId,
//     key: 'propertyWork',
//   });

//   return [
//     {
//       label: (
//         <T id="Forms.value" values={{ purchaseType: loan.purchaseType }} />
//       ),
//       value: propertyValue,
//     },
//     { label: "Frais d'achat", value: notaryFees },
//     {
//       label: 'Travaux de plus-value',
//       value: propertyWork,
//       condition: propertyWork > 0,
//     },
//   ].filter(({ condition }) => shouldRenderRow(condition));
// };

// const ownFundLabel = ({ type, usageType, borrower, borrowerIndex }) => {
//   const borrowerSuffix = borrower ? (
//     <>
//       &nbsp;
//       <span className="secondary">
//         (
//         {borrower.firstName || (
//           <T
//             id="general.borrowerWithIndex"
//             values={{ index: borrowerIndex + 1 }}
//           />
//         )}
//         )
//       </span>
//     </>
//   ) : null;

//   return usageType ? (
//     <span>
//       <T id={`PDF.ownFund.${type}.${usageType}`} />
//       {borrowerSuffix}
//     </span>
//   ) : (
//     <span>
//       <T id={`PDF.ownFund.${type}`} />
//       {borrowerSuffix}
//     </span>
//   );
// };
// const getFinancingLines = ({ loan, structureId, calculator }) => {
//   const { borrowers } = loan;
//   const multipleBorrowers = borrowers.length > 1;
//   const ownFunds = calculator.selectStructureKey({
//     loan,
//     structureId,
//     key: 'ownFunds',
//   });
//   const cashRatio = calculator.getCashRatio({ loan, structureId });
//   const insuranceRatio = calculator.getInsurance2Ratio({ loan, structureId });
//   const cashOwnFunds = ownFunds.filter(
//     ({ type }) => type !== OWN_FUNDS_TYPES.INSURANCE_2,
//   );
//   const insuranceOwnFunds = ownFunds.filter(
//     ({ type }) => type === OWN_FUNDS_TYPES.INSURANCE_2,
//   );

//   return [
//     {
//       label: <b>Cash (y.c. frais d'achat)</b>,
//       value: (
//         <span className="secondary">
//           <Percent value={cashRatio} />
//         </span>
//       ),
//       money: false,
//       condition: !!cashOwnFunds.length,
//     },
//     ...cashOwnFunds.map(({ value, type, usageType, borrowerId }) => ({
//       label: ownFundLabel({
//         type,
//         usageType,
//         borrower:
//           multipleBorrowers && borrowers.find(({ _id }) => _id === borrowerId),
//         borrowerIndex: borrowers.findIndex(({ _id }) => _id === borrowerId) + 1,
//       }),
//       value,
//     })),
//     {
//       label: <b>Caisse de pension</b>,
//       value: (
//         <span className="secondary">
//           <Percent value={insuranceRatio} />
//         </span>
//       ),

//       money: false,
//       condition: !!insuranceOwnFunds.length,
//     },
//     ...insuranceOwnFunds.map(({ value, type, usageType, borrowerId }) => ({
//       label: ownFundLabel({
//         type,
//         usageType,
//         borrower:
//           multipleBorrowers && borrowers.find(({ _id }) => _id === borrowerId),
//         borrowerIndex: borrowers.findIndex(({ _id }) => _id === borrowerId) + 1,
//       }),
//       value,
//     })),
//   ].filter(({ condition }) => shouldRenderRow(condition));
// };

// const BalanceSheet = ({
//   loan,
//   structureId,
//   calculator,
// }: BalanceSheetTableProps) => (
//   <BalanceSheetTable
//     titles={["Coût de l'opération", 'Répartition des fonds propres']}
//     leftRows={getCostLines({ loan, structureId, calculator })}
//     rightRows={getFinancingLines({ loan, structureId, calculator })}
//     bottomTitles={['Prix de revient', 'Fonds propres']}
//     bottomValues={[
//       <Money
//         currency={false}
//         value={calculator.getProjectValue({ loan, structureId })}
//         key="0"
//       />,
//       <Money
//         currency={false}
//         value={calculator.getTotalUsed({ loan, structureId })}
//         key="1"
//       />,
//     ]}
//   />
// );

// export default BalanceSheet;
