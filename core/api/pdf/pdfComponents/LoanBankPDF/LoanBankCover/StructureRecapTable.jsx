// @flow
import React from 'react';

import { classes, ROW_TYPES } from '../../PdfTable/PdfTable';
import { Calculator } from '../../../../../utils/Calculator';
import { toMoney } from '../../../../../utils/conversionFunctions';
import PercentWithStatus from '../../../../../components/PercentWithStatus';
import { ERROR, SUCCESS } from '../../../../constants';

type StructureRecapTableProps = {};

const getRows = ({ loan, structureIds, organisation }) => {
  const { lenderRules } = organisation || {};

  return [
    <tr key="0" className={classes[ROW_TYPES.TITLE]}>
      <td>Scénario</td>
      <td>Prêt hypothécaire</td>
      <td>Taux d'avance</td>
      <td>Taux d'effort</td>
    </tr>,
    ...structureIds
      .map(structureId => loan.structures.find(({ id }) => id === structureId))
      .map(({ id: structureId, name }) => {
        const calculator = new Calculator({
          loan,
          structureId,
          lenderRules,
        });
        const loanValue = calculator.selectLoanValue({ loan, structureId });
        const borrowRatio = calculator.getBorrowRatio({ loan, structureId });
        const incomeRatio = calculator.getIncomeRatio({ loan, structureId });

        return (
          <tr key={structureId}>
            <td>{name}</td>
            <td>{toMoney(loanValue)}</td>
            <td>
              <PercentWithStatus
                value={borrowRatio}
                status={
                  incomeRatio > calculator.maxBorrowRatio ? ERROR : SUCCESS
                }
              />
            </td>
            <td>
              <PercentWithStatus
                value={incomeRatio}
                status={
                  incomeRatio > calculator.maxIncomeRatio ? ERROR : SUCCESS
                }
              />
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
