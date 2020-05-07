import React from 'react';

import PercentWithStatus from '../../../../../../components/PercentWithStatus';
import T from '../../../../../../components/Translation';
import { Calculator } from '../../../../../../utils/Calculator';
import { toMoney } from '../../../../../../utils/conversionFunctions';
import { ERROR, SUCCESS } from '../../../../../constants';
import { ROW_TYPES, classes } from '../../PdfTable/PdfTable';

const columnsConfig = [
  {
    style: { width: '20%' },
    title: 'Plan financier',
    value: (calculator, { name }, loan, index) => `${name || index + 1}`,
  },
  {
    style: { width: '20%', textAlign: 'right' },
    title: <T id="Forms.value" />,
    value: (calculator, { id: structureId }, loan) =>
      toMoney(calculator.selectPropertyValue({ loan, structureId })),
  },
  {
    style: { width: '30%', textAlign: 'right' },
    title: 'Prêt hypothécaire demandé',
    value: (calculator, { id: structureId }, loan) =>
      toMoney(calculator.selectLoanValue({ loan, structureId })),
  },
  {
    style: { width: '15%', textAlign: 'right' },
    title: "Taux d'avance",
    value: (calculator, { id: structureId }, loan) => {
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
    value: (calculator, { id: structureId }, loan) => {
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

const getRows = ({ loan, structureIds, organisation }) => {
  const { lenderRules } = organisation || {};

  return [
    <tr key="0" className={classes[ROW_TYPES.TITLE]}>
      {columnsConfig.map(({ title, style }, index) => (
        <td style={style} key={`title${index}`}>
          {title}
        </td>
      ))}
    </tr>,
    ...structureIds
      .map(structureId => loan.structures.find(({ id }) => id === structureId))
      .map((structure, index) => {
        const { id: structureId } = structure;
        const calculator = new Calculator({
          loan,
          structureId,
          lenderRules,
        });
        return (
          <tr key={structureId}>
            {columnsConfig.map(({ style, value }, i) => (
              <td style={style} key={`${structureId}${i}`}>
                {value(calculator, structure, loan, index)}
              </td>
            ))}
          </tr>
        );
      }),
  ];
};

const StructureRecapTable = ({ loan, structureIds, organisation }) => (
  <table className="pdf-table structure-recap-table">
    {getRows({ loan, structureIds, organisation })}
  </table>
);

export default StructureRecapTable;
