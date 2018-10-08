// @flow
import React from 'react';
import { toMoney } from 'core/utils/conversionFunctions';
import { FLAT_TYPE, PROPERTY_TYPE, OWN_FUNDS_TYPES } from 'core/api/constants';
import { T } from 'core/components/Translation/Translation';
import Calculator from 'core/utils/Calculator';
import PDFTable from '../utils/PDFTable';
import {
  structureArrayData,
  usedOwnFundsTableData,
  shouldDisplayOwnFund,
  remainingFundsTableData,
} from './LoanBankProjectArrayData';
import { propertyArrayData } from './LoanBankProjectArrayData';

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
  {
    label: '\u00A0',
  },
  {
    label: (
      <p style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
        <T id="PDF.projectInfos.property.title" />
      </p>
    ),
  },
  ...propertyArrayData(loan),
  // {
  //   label: <T id="PDF.projectInfos.property.address" />,
  //   data: (
  //     <span>
  //       {address1},<br />
  //       {zipCode} {city}
  //     </span>
  //   ),
  // },
  // {
  //   label: <T id="PDF.projectInfos.property.residenceType" />,
  //   data: <T id={`PDF.residenceType.${residenceType}`} />,
  // },
  // {
  //   label: <T id="PDF.projectInfos.property.propertyType" />,
  //   data: <T id={`PDF.projectInfos.property.propertyType.${propertyType}`} />,
  // },
  // {
  //   label: <T id="PDF.projectInfos.property.houseType" />,
  //   data: <T id={`PDF.projectInfos.property.houseType.${houseType}`} />,
  //   condition: propertyType === PROPERTY_TYPE.HOUSE,
  //   style: { maxWidth: '100px' },
  // },
  // {
  //   label: <T id="PDF.projectInfos.property.flatType" />,
  //   data: <T id={`PDF.projectInfos.property.flatType.${flatType}`} />,
  //   condition: propertyType === PROPERTY_TYPE.FLAT,
  //   style: { maxWidth: '100px' },
  // },
  // {
  //   label: <T id="PDF.projectInfos.property.roomCount" />,
  //   data: roomCount,
  // },
  // {
  //   label: <T id="PDF.projectInfos.property.insideArea" />,
  //   data: `${insideArea} m2`,
  //   condition: propertyType === PROPERTY_TYPE.FLAT,
  // },
  // {
  //   label: <T id="PDF.projectInfos.property.landArea" />,
  //   data: `${landArea} m2`,
  //   condition: propertyType === PROPERTY_TYPE.HOUSE,
  // },
  // {
  //   label: <T id="PDF.projectInfos.property.volume" />,
  //   data: (
  //     <span>
  //       {volume} m3 (
  //       <T id={`PDF.projectInfos.property.volumeNorm.${volumeNorm}`} />)
  //     </span>
  //   ),
  //   condition: propertyType === PROPERTY_TYPE.HOUSE,
  // },
  // {
  //   label: <T id="PDF.projectInfos.property.terraceArea" />,
  //   data: `${terraceArea} m2`,
  //   condition:
  //     propertyType === PROPERTY_TYPE.FLAT
  //     && flatType === FLAT_TYPE.TERRACE_APARTMENT,
  // },
  // {
  //   label: <T id="PDF.projectInfos.property.numberOfFloors" />,
  //   data: `${numberOfFloors}`,
  //   condition: propertyType === PROPERTY_TYPE.FLAT,
  // },
  // {
  //   label: <T id="PDF.projectInfos.property.floorNumber" />,
  //   data: `${floorNumber}`,
  //   condition:
  //     propertyType === PROPERTY_TYPE.FLAT
  //     && (flatType === FLAT_TYPE.SINGLE_FLOOR_APARTMENT
  //       || flatType === FLAT_TYPE.DUPLEX_APARTMENT),
  // },
  // {
  //   label: <T id="PDF.projectInfos.property.constructionYear" />,
  //   data: constructionYear,
  // },
  // {
  //   label: <T id="PDF.projectInfos.property.renovationYear" />,
  //   data: renovationYear,
  //   condition: !!renovationYear,
  // },
  // {
  //   label: <T id="PDF.projectInfos.property.parking" />,
  //   data: `${parkingInside} int, ${parkingOutside} ext`,
  // },
  // {
  //   label: <T id="PDF.projectInfos.property.minergie" />,
  //   data: <T id={`PDF.projectInfos.property.minergie.${minergie}`} />,
  // },
  // {
  //   label: <T id="PDF.projectInfos.property.maintenance" />,
  //   data: toMoney(monthlyExpenses),
  //   condition: !!monthlyExpenses,
  // },
];

const getStructureRecapArray = ({
  propertyWork,
  ownFunds,
  borrowers,
  loan,
}) => [
  {
    label: (
      <p style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
        <T id="PDF.projectInfos.structure.title" />
      </p>
    ),
  },
  ...structureArrayData(loan),
  {
    label: '\u00A0',
  },
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
      ownFunds,
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
  {
    label: '\u00A0',
  },
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

const structureRecap = structure => (
  <div className="loan-bank-pdf-project-details">
    <PDFTable
      className="loan-bank-pdf-project-table"
      array={getStructureRecapArray(structure)}
    />
  </div>
);

const propertyRecap = property => (
  <div className="loan-bank-pdf-property">
    <PDFTable
      className="loan-bank-pdf-property-table"
      array={getPropertyRecapArray(property)}
    />
  </div>
);

const LoanBankProject = ({ loan }: LoanBankProjectProps) => (
  <div className="loan-bank-pdf-project">
    <div className="loan-bank-pdf-project-recap">
      {structureRecap({ loan, borrowers: loan.borrowers, ...loan.structure })}
      {propertyRecap(loan)}
    </div>
  </div>
);

export default LoanBankProject;
