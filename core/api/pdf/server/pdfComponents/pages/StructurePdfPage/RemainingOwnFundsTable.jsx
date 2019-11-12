// @flow
import React from 'react';

import T from '../../../../../../components/Translation';
import { toMoney } from '../../../../../../utils/conversionFunctions';
import { OWN_FUNDS_TYPES } from '../../../../../borrowers/borrowerConstants';
import PdfTable from '../../PdfTable';
import { ROW_TYPES } from '../../PdfTable/PdfTable';

type RemainingOwnFundsTableProps = {};

const oneBorrowerHasOwnFunds = ({ borrowers }, type) =>
  borrowers.filter(borrower => {
    const valueForType = borrower[type];
    if (Array.isArray(valueForType)) {
      return valueForType.length > 0;
    }
    return !!valueForType;
  }).length > 0;

const remainingFundsTableData = ({ loan, structureId, calculator }) =>
  Object.values(OWN_FUNDS_TYPES)
    .filter(
      type =>
        ![OWN_FUNDS_TYPES.BANK_FORTUNE, OWN_FUNDS_TYPES.DONATION].includes(
          type,
        ),
    )
    .map(type => ({
      label: <T id={`PDF.ownFund.${type}`} />,
      data: toMoney(
        calculator.getRemainingFundsOfType({ loan, type, structureId }),
      ),
      condition: oneBorrowerHasOwnFunds(loan, type),
      style: { textAlign: 'right' },
    }));

const getRemainingOwnFundsRows = ({ loan, structureId, calculator }) => [
  {
    label: (
      <T id="PDF.projectInfos.structure.postDisbursementSituation.title" />
    ),
    colspan: 2,
    type: ROW_TYPES.TITLE,
  },
  {
    label: <T id="PDF.ownFund.bankFortune" />,
    data: toMoney(
      calculator.getRemainingFundsOfType({
        loan,
        structureId,
        type: OWN_FUNDS_TYPES.BANK_FORTUNE,
      }),
    ),
  },
  ...remainingFundsTableData({ loan, structureId, calculator }),
  {
    label: (
      <T id="PDF.projectInfos.structure.postDisbursementSituation.total" />
    ),
    data: toMoney(calculator.getTotalRemainingFunds({ loan, structureId })),
    type: ROW_TYPES.SUM,
  },
];

const RemainingOwnFundsTable = ({
  loan,
  structureId,
  calculator,
}: RemainingOwnFundsTableProps) => (
  <PdfTable
    className="remaining-own-funds-table"
    rows={getRemainingOwnFundsRows({ loan, structureId, calculator })}
    columnOptions={[{}, { style: { textAlign: 'right' } }]}
  />
);

export default RemainingOwnFundsTable;
