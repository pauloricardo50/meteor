// @flow
import React from 'react';

import { Calculator } from '../../../../../../utils/Calculator';
import { toMoney } from '../../../../../../utils/conversionFunctions';
import PercentWithStatus from '../../../../../../components/PercentWithStatus';
import { ERROR, SUCCESS } from '../../../../../constants';
import { classes, ROW_TYPES } from '../../PdfTable/PdfTable';

type StructureRecapTableProps = {};

const columnStyles = [
  { width: '30%' },
  { width: '20%', textAlign: 'right' },
  { width: '20%', textAlign: 'right' },
  { width: '15%', textAlign: 'right' },
  { width: '15%', textAlign: 'right' },
];

const getRows = ({ loan, structureIds, organisation }) => {
  const { lenderRules } = organisation || {};

  return [
    <tr key="0" className={classes[ROW_TYPES.TITLE]}>
      <td style={columnStyles[0]}>Plan financier</td>
      <td style={columnStyles[1]}>Valeur du bien</td>
      <td style={columnStyles[2]}>Prêt hypothécaire</td>
      <td style={columnStyles[3]}>Taux d'avance</td>
      <td style={columnStyles[4]}>Taux d'effort</td>
    </tr>,
    ...structureIds
      .map(structureId => loan.structures.find(({ id }) => id === structureId))
      .map(({ id: structureId, name }, index) => {
        const calculator = new Calculator({
          loan,
          structureId,
          lenderRules,
        });
        const loanValue = calculator.selectLoanValue({ loan, structureId });
        const borrowRatio = calculator.getBorrowRatio({ loan, structureId });
        const incomeRatio = calculator.getIncomeRatio({ loan, structureId });
        const propertyValue = calculator.selectPropertyValue({
          loan,
          structureId,
        });

        return (
          <tr key={structureId}>
            <td style={columnStyles[0]}>
              {name || index + 1} (page {index + 2})
            </td>
            <td style={columnStyles[1]}>{toMoney(propertyValue)}</td>
            <td style={columnStyles[2]}>{toMoney(loanValue)}</td>
            <td style={columnStyles[3]}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <PercentWithStatus
                  value={borrowRatio}
                  status={
                    borrowRatio > calculator.maxBorrowRatio ? ERROR : SUCCESS
                  }
                />
              </div>
            </td>
            <td style={columnStyles[4]}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <PercentWithStatus
                  value={incomeRatio}
                  status={
                    incomeRatio > calculator.maxIncomeRatio ? ERROR : SUCCESS
                  }
                />
              </div>
            </td>
          </tr>
        );
      }),
  ];
};

const StructureRecapTable = ({
  loan,
  structureIds,
  organisation,
}: StructureRecapTableProps) => (
  <table className="pdf-table structure-recap-table">
    {getRows({ loan, structureIds, organisation })}
  </table>
);

export default StructureRecapTable;
