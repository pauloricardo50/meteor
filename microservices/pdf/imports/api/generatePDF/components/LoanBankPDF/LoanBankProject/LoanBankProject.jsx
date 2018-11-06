// @flow
import React from 'react';
import { toMoney } from 'core/utils/conversionFunctions';
import { OWN_FUNDS_TYPES } from 'core/api/constants';
import { T } from 'core/components/Translation/Translation';
import Calculator from 'core/utils/Calculator';
import PDFTable from '../utils/PDFTable';
import {
  structureArrayData,
  usedOwnFundsTableData,
  shouldDisplayOwnFund,
  remainingFundsTableData,
  propertyArrayData,
  EMPTY_LINE,
} from './LoanBankProjectArrayData';

type LoanBankProjectProps = {
  loan: Object,
};

const getPropertyRecapArray = loan => [
  {
    label: (
      <p style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
        <T id="PDF.projectInfos.valuation.title" />
      </p>
    ),
  },
  {
    label: <T id="PDF.projectInfos.valuation.value" />,
    data: `${toMoney(loan.structure.property.valuation.value)} - ${toMoney(loan.structure.property.valuation.max)}`,
  },
  {
    label: <T id="PDF.projectInfos.valuation.microlocation" />,
    data: `${loan.structure.property.valuation.microlocation.grade}/5`,
  },
  // EMPTY_LINE,
  {
    label: (
      <p style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
        <T id="PDF.projectInfos.property.title" />
      </p>
    ),
  },
  ...propertyArrayData(loan),
];

const getStructureRecapArray = loan => [
  {
    label: (
      <p style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
        <T id="PDF.projectInfos.structure.title" />
      </p>
    ),
  },
  ...structureArrayData(loan),
  // EMPTY_LINE,
  {
    label: (
      <p style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
        <T id="PDF.projectInfos.structure.usedOwnFunds.title" />
      </p>
    ),
  },
  {
    label: <T id="PDF.projectInfos.structure.usedOwnFunds.bankFortune" />,
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
    label: <T id="PDF.projectInfos.structure.usedOwnFunds.thirdPartyFortune" />,
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
  // EMPTY_LINE,
  {
    label: (
      <p
        style={{
          fontWeight: 'bold',
          textTransform: 'uppercase',
          maxWidth: '150px',
        }}
      >
        <T id="PDF.projectInfos.structure.postDisbursementSituation.title" />
      </p>
    ),
  },
  {
    label: (
      <T id="PDF.projectInfos.structure.postDisbursementSituation.bankFortune" />
    ),
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

const structureRecap = loan => (
  <PDFTable className="structure-table" rows={getStructureRecapArray(loan)} />
);

const propertyRecap = loan => (
  <PDFTable className="property-table" rows={getPropertyRecapArray(loan)} />
);

const LoanBankProject = ({ loan }: LoanBankProjectProps) => (
  <div className="project-table">
    {structureRecap(loan)}
    {propertyRecap(loan)}
  </div>
);

export default LoanBankProject;
