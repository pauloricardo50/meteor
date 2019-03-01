// @flow
import React from 'react';

import T from '../../../../../components/Translation';
import { classes, ROW_TYPES } from '../../PdfTable/PdfTable';
import { toMoney } from '../../../../../utils/conversionFunctions';

type OtherRealEstateTableProps = {};

const OtherRealEstateTable = ({
  loan: { borrowers },
}: OtherRealEstateTableProps) => {
  const realEstateArray = borrowers.reduce(
    (arr, { realEstate }) => [...arr, ...realEstate],
    [],
  );
  return (
    <table className="pdf-table other-real-estate">
      <tr className={classes[ROW_TYPES.TITLE]}>
        <td colSpan={2}>Patrimoine immobilier</td>
      </tr>
      {realEstateArray.map(({ value, loan, name, description, income }, index) => (
        <tr key={index} className={classes[ROW_TYPES.REGULAR]}>
          <td>
            <div>{name}</div>
            <div className="secondary">
              <T id={`Forms.residenceType.${description}`} />
            </div>
          </td>
          <td>
            <div>
              <span className="secondary">Valeur:</span>&nbsp;{toMoney(value)}
            </div>

            <div>
              <span className="secondary">Dette:</span>&nbsp;{toMoney(loan)}
            </div>

            <div>
              <span className="secondary">Revenus annuels:</span>&nbsp;
              {toMoney(income)}
            </div>
          </td>
        </tr>
      ))}
    </table>
  );
};

export default OtherRealEstateTable;
