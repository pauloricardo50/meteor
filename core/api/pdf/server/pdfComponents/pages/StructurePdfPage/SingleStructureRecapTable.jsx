import React from 'react';

import PercentWithStatus from '../../../../../../components/PercentWithStatus';
import T from '../../../../../../components/Translation';
import { toMoney } from '../../../../../../utils/conversionFunctions';
import { OWN_FUNDS_TYPES } from '../../../../../borrowers/borrowerConstants';
import { ERROR, SUCCESS } from '../../../../../constants';
import {
  OWN_FUNDS_USAGE_TYPES,
  PURCHASE_TYPE,
} from '../../../../../loans/loanConstants';
import { ROW_TYPES, classes } from '../../PdfTable/PdfTable';

const getColumnsConfig = ({ calculator, structureId, loan }) => {
  const isRefinancing = loan.purchaseType === PURCHASE_TYPE.REFINANCING;

  return [
    {
      style: { width: '30%' },
      title: 'Prêt hypothécaire demandé',
      value: () => toMoney(calculator.selectLoanValue({ loan, structureId })),
    },
    {
      style: { width: '20%', textAlign: 'right' },
      title: <T id="Forms.value" />,
      value: () =>
        toMoney(calculator.selectPropertyValue({ loan, structureId })),
    },
    isRefinancing
      ? {
          style: { width: '20%', textAlign: 'right' },
          title:
            calculator.getRefinancingRequiredOwnFunds({ loan, structureId }) > 0
              ? 'Amortissement extraordinaire'
              : 'Liquidités dégagées',
          value: () =>
            toMoney(
              Math.abs(
                calculator.getRefinancingRequiredOwnFunds({
                  loan,
                  structureId,
                }),
              ),
            ),
        }
      : {
          style: { width: '20%', textAlign: 'right' },
          title: 'Fonds propres',
          value: () =>
            toMoney(
              calculator.getCashUsed({ loan, structureId }) +
                calculator.getUsedFundsOfType({
                  loan,
                  type: OWN_FUNDS_TYPES.INSURANCE_2,
                  usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
                  structureId,
                }) -
                calculator.getFees({ loan, structureId }).total,
            ),
        },
    {
      style: { width: '15%', textAlign: 'right' },
      title: "Taux d'avance",
      value: () => {
        const borrowRatio = calculator.getBorrowRatio({ loan, structureId });
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <PercentWithStatus
              value={borrowRatio}
              status={borrowRatio > calculator.maxBorrowRatio ? ERROR : SUCCESS}
            />
          </div>
        );
      },
    },
    {
      style: { width: '15%', textAlign: 'right' },
      title: "Taux d'effort",
      value: () => {
        const incomeRatio = calculator.getIncomeRatio({ loan, structureId });
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <PercentWithStatus
              value={incomeRatio}
              status={incomeRatio > calculator.maxIncomeRatio ? ERROR : SUCCESS}
            />
          </div>
        );
      },
    },
  ];
};

const getRows = ({ loan, structureId, calculator }) => {
  const columnsConfig = getColumnsConfig({ loan, calculator, structureId });
  return [
    <tr key="0" className={classes[ROW_TYPES.TITLE]}>
      {columnsConfig.map(({ title, style }, index) => (
        <td style={style} key={`title${index}`}>
          {title}
        </td>
      ))}
    </tr>,
    <tr key={structureId}>
      {columnsConfig.map(({ style, value }, i) => (
        <td style={style} key={`${structureId}${i}`}>
          {value()}
        </td>
      ))}
    </tr>,
  ];
};

const SingleStructureRecapTable = ({ loan, structureId, calculator }) => (
  <table className="pdf-table structure-recap-table single-structure-recap-table">
    {getRows({ loan, structureId, calculator })}
  </table>
);

export default SingleStructureRecapTable;
