// @flow
import React from 'react';

import { toMoney } from 'core/utils/conversionFunctions';
import { OWN_FUNDS_TYPES } from 'core/api/constants';
import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';
import PdfTable from '../../PdfTable';
import PdfPage from '../../PdfPage';
import {
  structureArrayData,
  usedOwnFundsTableData,
  shouldDisplayOwnFund,
  remainingFundsTableData,
  propertyArrayData,
} from './LoanBankProjectArrayData';
import { ROW_TYPES } from '../../PdfTable/PdfTable';

type LoanBankProjectProps = {
  loan: Object,
};

const titleLine = label => ({
  label,
  colspan: 2,
  type: ROW_TYPES.TITLE,
});

const getPropertyValuationArray = loan => [
  titleLine(<T id="PDF.projectInfos.valuation.title" />),
  {
    label: <T id="PDF.projectInfos.valuation.value" />,
    data: `${toMoney(loan.structure.property.valuation.value)} - ${toMoney(loan.structure.property.valuation.max)}`,
  },
  {
    label: <T id="PDF.projectInfos.valuation.microlocation" />,
    data: `${loan.structure.property.valuation.microlocation.grade}/5`,
  },
];

const getPropertyRecapArray = (loan) => {
  const valuationExists = !!(
    loan.structure.property.valuation
    && loan.structure.property.valuation.microlocation
  );

  return [
    ...(valuationExists ? getPropertyValuationArray(loan) : []),
    titleLine(<T id="PDF.projectInfos.property.title" />),
    ...propertyArrayData(loan),
  ];
};

const getStructureRecapArray = loan => [
  titleLine(<T id="PDF.projectInfos.structure.title" />),
  ...structureArrayData(loan),
  titleLine(<T id="PDF.projectInfos.structure.usedOwnFunds.title" />),
  {
    label: <T id="PDF.ownFund.bankFortune" />,
    data: toMoney(Calculator.getUsedFundsOfType({
      loan,
      type: OWN_FUNDS_TYPES.BANK_FORTUNE,
    })),
    condition:
      Calculator.getUsedFundsOfType({
        loan,
        type: OWN_FUNDS_TYPES.BANK_FORTUNE,
      }) !== 0,
  },
  ...usedOwnFundsTableData(loan),
  {
    label: <T id="PDF.ownFund.thirdPartyFortune" />,
    data: toMoney(Calculator.getUsedFundsOfType({
      loan,
      type: OWN_FUNDS_TYPES.THIRD_PARTY_FORTUNE,
    })),
    condition: shouldDisplayOwnFund({
      ownFunds: loan.structure.ownFunds,
      type: OWN_FUNDS_TYPES.THIRD_PARTY_FORTUNE,
    }),
  },
  {
    label: <T id="PDF.projectInfos.structure.usedOwnFunds.total" />,
    data: toMoney(Calculator.getTotalUsed({ loan })),
    type: ROW_TYPES.SUM,
  },
  titleLine(<T id="PDF.projectInfos.structure.postDisbursementSituation.title" />),
  {
    label: <T id="PDF.ownFund.bankFortune" />,
    data: toMoney(Calculator.getRemainingFundsOfType({
      loan,
      type: OWN_FUNDS_TYPES.BANK_FORTUNE,
    })),
  },
  ...remainingFundsTableData(loan),
  {
    label: (
      <T id="PDF.projectInfos.structure.postDisbursementSituation.total" />
    ),
    data: toMoney(Calculator.getTotalRemainingFunds({ loan })),
    type: ROW_TYPES.SUM,
  },
];

const LoanBankProject = ({ loan, pageNb, pageCount }: LoanBankProjectProps) => (
  <PdfPage
    className="project-page"
    title={<T id="PDF.title.project" />}
    withFooter
    pageNb={pageNb}
    pageCount={pageCount}
  >
    <div className="project-table">
      <PdfTable
        className="structure-table"
        rows={getStructureRecapArray(loan)}
      />
      <PdfTable className="property-table" rows={getPropertyRecapArray(loan)} />
    </div>
  </PdfPage>
);

export default LoanBankProject;
