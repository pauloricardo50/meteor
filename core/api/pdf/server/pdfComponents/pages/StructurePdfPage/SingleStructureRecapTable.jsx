// @flow
import React from 'react';

import { toMoney } from '../../../../../../utils/conversionFunctions';
import PercentWithStatus from '../../../../../../components/PercentWithStatus';
import { ERROR, SUCCESS } from '../../../../../constants';
import { classes, ROW_TYPES } from '../../PdfTable/PdfTable';

type SingleStructureRecapTableProps = {};

const columnsConfig = [
  {
    style: { width: '30%' },
    title: 'Prêt hypothécaire demandé',
    value: (calculator, structureId, loan) =>
      toMoney(calculator.selectLoanValue({ loan, structureId })),
  },
  {
    style: { width: '20%', textAlign: 'right' },
    title: "Prix d'achat",
    value: (calculator, structureId, loan) =>
      toMoney(calculator.selectPropertyValue({ loan, structureId })),
  },
  {
    style: { width: '20%', textAlign: 'right' },
    title: 'Fonds propres',
    value: (calculator, structureId, loan) =>
      toMoney(
        calculator.getCashUsed({ loan, structureId }) +
          calculator.getInsurance2Used({ loan, structureId }) -
          calculator.getFees({ loan, structureId }).total,
      ),
  },
  {
    style: { width: '15%', textAlign: 'right' },
    title: "Taux d'avance",
    value: (calculator, structureId, loan) => {
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
    value: (calculator, structureId, loan) => {
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

const getRows = ({ loan, structureId, calculator }) => [
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
        {value(calculator, structureId, loan)}
      </td>
    ))}
  </tr>,
];

const SingleStructureRecapTable = ({
  loan,
  structureId,
  calculator,
}: SingleStructureRecapTableProps) => (
  <table className="pdf-table structure-recap-table">
    {getRows({ loan, structureId, calculator })}
  </table>
);

export default SingleStructureRecapTable;
