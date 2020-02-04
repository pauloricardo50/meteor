//      
import React from 'react';

import { OWN_FUNDS_USAGE_TYPES } from 'core/api/loans/loanConstants';
import T from '../../../../../../components/Translation';
import { toMoney } from '../../../../../../utils/conversionFunctions';
import PdfTable from '../../PdfTable';
import { ROW_TYPES } from '../../PdfTable/PdfTable';

                           

const getBorrowerNameSuffix = ({ borrowers = [], borrowerId }) => {
  if (borrowers.length === 1) {
    return null;
  }

  const borrowerIndex =
    borrowers.findIndex(({ _id }) => _id === borrowerId) + 1;
  const borrower = borrowers.find(({ _id }) => _id === borrowerId);

  return (
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
  );
};

const getPledgeRows = ({ loan, structureId, calculator }) => {
  const ownFunds = calculator.selectStructureKey({
    loan,
    structureId,
    key: 'ownFunds',
  });

  const { borrowers = [] } = loan;

  const pledgedOwnFunds = ownFunds.filter(
    ({ usageType }) => usageType === OWN_FUNDS_USAGE_TYPES.PLEDGE,
  );

  return [
    {
      label: 'Nantissements',
      colspan: 2,
      type: ROW_TYPES.TITLE,
    },
    ...pledgedOwnFunds.map(({ value, type, usageType, borrowerId }) => ({
      label: (
        <span>
          <T id={`PDF.ownFund.${type}.${usageType}`} />
          {getBorrowerNameSuffix({ borrowers, borrowerId })}
        </span>
      ),
      data: toMoney(value),
      //   style: { textAlign: 'right' },
    })),
    {
      label: 'Total',
      data: toMoney(calculator.getTotalPledged({ loan, structureId })),
      type: ROW_TYPES.SUM,
    },
  ];
};

const PledgeTable = ({ loan, structureId, calculator }                  ) => {
  const totalPledged = calculator.getTotalPledged({ loan, structureId });
  return totalPledged ? (
    <PdfTable
      className="pledge-table"
      rows={getPledgeRows({ loan, structureId, calculator })}
      columnOptions={[{}, { style: { textAlign: 'right' } }]}
    />
  ) : null;
};

export default PledgeTable;
