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

type LoanBankProjectProps = {
  loan: Object,
};

const titleLine = label => ({
  label: <h5 className="title-line">{label}</h5>,
  colspan: 2,
});

const getPropertyRecapArray = loan => [
  titleLine(<T id="PDF.projectInfos.valuation.title" />),
  {
    label: <T id="PDF.projectInfos.valuation.value" />,
    data: `${toMoney(loan.structure.property.valuation.value)} - ${toMoney(loan.structure.property.valuation.max)}`,
  },
  {
    label: <T id="PDF.projectInfos.valuation.microlocation" />,
    data: `${loan.structure.property.valuation.microlocation.grade}/5`,
  },
  titleLine(<T id="PDF.projectInfos.property.title" />),
  ...propertyArrayData(loan),
];

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
    style: { textAlign: 'right' },
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
    style: { textAlign: 'right' },
  },
  {
    label: (
      <p style={{ fontWeight: 'bold' }}>
        <T id="PDF.projectInfos.structure.usedOwnFunds.total" />
      </p>
    ),
    data: toMoney(Calculator.getTotalUsed({ loan })),
    style: { fontWeight: 'bold', textAlign: 'right' },
  },
  titleLine(<T id="PDF.projectInfos.structure.postDisbursementSituation.title" />),
  {
    label: <T id="PDF.ownFund.bankFortune" />,
    data: toMoney(Calculator.getRemainingFundsOfType({
      loan,
      type: OWN_FUNDS_TYPES.BANK_FORTUNE,
    })),
    style: { textAlign: 'right' },
  },
  ...remainingFundsTableData(loan),
  {
    label: (
      <p style={{ fontWeight: 'bold' }}>
        <T id="PDF.projectInfos.structure.postDisbursementSituation.total" />
      </p>
    ),
    data: toMoney(Calculator.getTotalRemainingFunds({ loan })),
    style: { fontWeight: 'bold', textAlign: 'right' },
  },
];

const LoanBankProject = ({ loan }: LoanBankProjectProps) => (
  <PdfPage className="project-page" title={<T id="PDF.title.project" />}>
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
