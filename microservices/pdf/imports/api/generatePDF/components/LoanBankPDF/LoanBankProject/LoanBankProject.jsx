// @flow
import React from 'react';
import { toMoney } from 'core/utils/conversionFunctions';
import {
  HOUSE_TYPE,
  FLAT_TYPE,
  PROPERTY_TYPE,
  OWN_FUNDS_USAGE_TYPES,
  OWN_FUNDS_TYPES,
} from 'core/api/constants';
import { T } from 'core/components/Translation/Translation';
import PDFTable from '../utils/PDFTable';

type LoanBankProjectProps = {
  loan: Object,
};

const getPropertyRecapArray = ({
  address1,
  zipCode,
  city,
  constructionYear,
  renovationYear,
  roomCount,
  parkingInside,
  parkingOutside,
  minergie,
  monthlyExpenses,
  flatType,
  insideArea,
  floorNumber,
  numberOfFloors,
  terraceArea,
  houseType,
  landArea,
  volume,
  volumeNorm,
  valuation,
  residenceType,
  propertyType,
}) => [
  {
    label: (
      <p style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
        <T id="PDF.projectInfos.valuation.title" />
      </p>
    ),
  },
  {
    label: <T id="PDF.projectInfos.valuation.value" />,
    data: `${toMoney(valuation.value)} - ${toMoney(valuation.max)}`,
  },
  {
    label: <T id="PDF.projectInfos.valuation.microlocation" />,
    data: `${valuation.microlocation.grade}/5`,
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
  {
    label: <T id="PDF.projectInfos.property.address" />,
    data: (
      <span>
        {address1},<br />
        {zipCode} {city}
      </span>
    ),
  },
  {
    label: <T id="PDF.projectInfos.property.residenceType" />,
    data: <T id={`PDF.residenceType.${residenceType}`} />,
  },
  {
    label: <T id="PDF.projectInfos.property.propertyType" />,
    data: <T id={`PDF.projectInfos.property.propertyType.${propertyType}`} />,
  },
  {
    label: <T id="PDF.projectInfos.property.houseType" />,
    data: <T id={`PDF.projectInfos.property.houseType.${houseType}`} />,
    condition: propertyType === PROPERTY_TYPE.HOUSE,
    style: { maxWidth: '100px' },
  },
  {
    label: <T id="PDF.projectInfos.property.flatType" />,
    data: <T id={`PDF.projectInfos.property.flatType.${flatType}`} />,
    condition: propertyType === PROPERTY_TYPE.FLAT,
    style: { maxWidth: '100px' },
  },
  {
    label: <T id="PDF.projectInfos.property.roomCount" />,
    data: roomCount,
  },
  {
    label: <T id="PDF.projectInfos.property.insideArea" />,
    data: `${insideArea} m2`,
    condition: propertyType === PROPERTY_TYPE.FLAT,
  },
  {
    label: <T id="PDF.projectInfos.property.landArea" />,
    data: `${landArea} m2`,
    condition: propertyType === PROPERTY_TYPE.HOUSE,
  },
  {
    label: <T id="PDF.projectInfos.property.volume" />,
    data: (
      <span>
        {volume} m3 (
        <T id={`PDF.projectInfos.property.volumeNorm.${volumeNorm}`} />)
      </span>
    ),
    condition: propertyType === PROPERTY_TYPE.HOUSE,
  },
  {
    label: <T id="PDF.projectInfos.property.terraceArea" />,
    data: `${terraceArea} m2`,
    condition:
      propertyType === PROPERTY_TYPE.FLAT
      && flatType === FLAT_TYPE.TERRACE_APARTMENT,
  },
  {
    label: <T id="PDF.projectInfos.property.numberOfFloors" />,
    data: `${numberOfFloors}`,
    condition: propertyType === PROPERTY_TYPE.FLAT,
  },
  {
    label: <T id="PDF.projectInfos.property.floorNumber" />,
    data: `${floorNumber}`,
    condition:
      propertyType === PROPERTY_TYPE.FLAT
      && (flatType === FLAT_TYPE.SINGLE_FLOOR_APARTMENT
        || flatType === FLAT_TYPE.DUPLEX_APARTMENT),
  },
  {
    label: <T id="PDF.projectInfos.property.constructionYear" />,
    data: constructionYear,
  },
  {
    label: <T id="PDF.projectInfos.property.renovationYear" />,
    data: renovationYear,
    condition: !!renovationYear,
  },
  {
    label: <T id="PDF.projectInfos.property.parking" />,
    data: `${parkingInside} int, ${parkingOutside} ext`,
  },
  {
    label: <T id="PDF.projectInfos.property.minergie" />,
    data: <T id={`PDF.projectInfos.property.minergie.${minergie}`} />,
  },
  {
    label: <T id="PDF.projectInfos.property.maintenance" />,
    data: toMoney(monthlyExpenses),
    condition: !!monthlyExpenses,
  },
];

const shouldDisplayOwnFund = ({ ownFunds, type, usageType }) =>
  ownFunds.filter((ownFund) => {
    if (usageType) {
      return ownFund.type === type && ownFund.usageType === usageType;
    }
    return ownFund.type === type;
  }).length > 0;

const shouldDisplayPostDisbursementSituation = ({ type, borrowers }) =>
  borrowers.filter(borrower => borrower[type].length > 0).length > 0;

const getStructureRecapArray = ({
  propertyWork,
  ownFunds,
  wantedLoan,
  borrowers,
}) => [
  {
    label: (
      <p style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
        <T id="PDF.projectInfos.structure.title" />
      </p>
    ),
  },
  {
    label: <T id="PDF.projectInfos.structure.propertyValue" />,
    data: 1000000,
    style: { textAlign: 'right' },
  },
  {
    label: <T id="PDF.projectInfos.structure.notaryFees" />,
    data: 50000,
    style: { textAlign: 'right' },
  },
  {
    label: <T id="PDF.projectInfos.structure.propertyWork" />,
    data: 10000,
    condition: !!propertyWork,
    style: { textAlign: 'right' },
  },
  {
    label: (
      <p style={{ fontWeight: 'bold' }}>
        <T id="PDF.projectInfos.structure.totalCost" />
      </p>
    ),
    data: 1060000,
    style: { fontWeight: 'bold', textAlign: 'right' },
  },
  {
    label: '\u00A0',
  },
  {
    label: <T id="PDF.projectInfos.structure.wantedLoanRate" />,
    data: '80%',
    style: { textAlign: 'right' },
  },
  {
    label: <T id="PDF.projectInfos.structure.wantedLoan" />,
    data: toMoney(wantedLoan),
    style: { textAlign: 'right' },
  },
  {
    label: <T id="PDF.projectInfos.structure.usedOwnFunds" />,
    data: 200000,
    style: { textAlign: 'right' },
  },
  {
    label: <T id="PDF.projectInfos.structure.pledgedOwnFunds" />,
    data: 150000,
    condition:
      ownFunds.filter(ownFund => ownFund.usageType === OWN_FUNDS_USAGE_TYPES.PLEDGE).length > 0,
    style: { textAlign: 'right' },
  },
  {
    label: <T id="PDF.projectInfos.structure.interests" />,
    data: 44000,
    style: { textAlign: 'right' },
  },
  {
    label: <T id="PDF.projectInfos.structure.amortization" />,
    data: 11000,
    style: { textAlign: 'right' },
  },
  {
    label: <T id="PDF.projectInfos.structure.maintenance" />,
    data: 12000,
    style: { textAlign: 'right' },
  },
  {
    label: <T id="PDF.projectInfos.structure.solvency" />,
    data: '33%',
    style: { textAlign: 'right' },
  },
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
    data: 150000,
    condition: shouldDisplayOwnFund({
      ownFunds,
      type: OWN_FUNDS_TYPES.BANK_FORTUNE,
    }),
    style: { textAlign: 'right' },
  },
  {
    label: (
      <T id="PDF.projectInfos.structure.usedOwnFunds.insurance2.withdraw" />
    ),
    data: 150000,
    condition: shouldDisplayOwnFund({
      ownFunds,
      type: OWN_FUNDS_TYPES.INSURANCE_2,
      usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
    }),
    style: { textAlign: 'right' },
  },
  {
    label: (
      <T id="PDF.projectInfos.structure.usedOwnFunds.insurance3A.withdraw" />
    ),
    data: 150000,
    condition: shouldDisplayOwnFund({
      ownFunds,
      type: OWN_FUNDS_TYPES.INSURANCE_3A,
      usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
    }),
    style: { textAlign: 'right' },
  },
  {
    label: (
      <T id="PDF.projectInfos.structure.usedOwnFunds.insurance3B.withdraw" />
    ),
    data: 150000,
    condition: shouldDisplayOwnFund({
      ownFunds,
      type: OWN_FUNDS_TYPES.INSURANCE_3B,
      usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
    }),
    style: { textAlign: 'right' },
  },
  {
    label: <T id="PDF.projectInfos.structure.usedOwnFunds.bank3A.withdraw" />,
    data: 150000,
    condition: shouldDisplayOwnFund({
      ownFunds,
      type: OWN_FUNDS_TYPES.BANK_3A,
      usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
    }),
    style: { textAlign: 'right' },
  },
  {
    label: <T id="PDF.projectInfos.structure.usedOwnFunds.thirdPartyFortune" />,
    data: 150000,
    condition: shouldDisplayOwnFund({
      ownFunds,
      type: OWN_FUNDS_TYPES.THIRD_PARTY_FORTUNE,
    }),
    style: { textAlign: 'right' },
  },
  {
    label: <T id="PDF.projectInfos.structure.usedOwnFunds.insurance2.pledge" />,
    data: 150000,
    condition: shouldDisplayOwnFund({
      ownFunds,
      type: OWN_FUNDS_TYPES.INSURANCE_2,
      usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
    }),
    style: { textAlign: 'right' },
  },
  {
    label: (
      <T id="PDF.projectInfos.structure.usedOwnFunds.insurance3A.pledge" />
    ),
    data: 150000,
    condition: shouldDisplayOwnFund({
      ownFunds,
      type: OWN_FUNDS_TYPES.INSURANCE_3A,
      usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
    }),
    style: { textAlign: 'right' },
  },
  {
    label: (
      <T id="PDF.projectInfos.structure.usedOwnFunds.insurance3B.pledge" />
    ),
    data: 150000,
    condition: shouldDisplayOwnFund({
      ownFunds,
      type: OWN_FUNDS_TYPES.INSURANCE_3B,
      usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
    }),
    style: { textAlign: 'right' },
  },
  {
    label: <T id="PDF.projectInfos.structure.usedOwnFunds.bank3A.pledge" />,
    data: 150000,
    condition: shouldDisplayOwnFund({
      ownFunds,
      type: OWN_FUNDS_TYPES.BANK_3A,
      usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
    }),
    style: { textAlign: 'right' },
  },
  {
    label: (
      <p style={{ fontWeight: 'bold' }}>
        <T id="PDF.projectInfos.structure.usedOwnFunds.total" />
      </p>
    ),
    data: 250000,
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
    data: 487834,
    style: { textAlign: 'right' },
  },
  {
    label: (
      <T id="PDF.projectInfos.structure.postDisbursementSituation.insurance2" />
    ),
    data: 487834,
    condition: shouldDisplayPostDisbursementSituation({
      type: OWN_FUNDS_TYPES.INSURANCE_2,
      borrowers,
    }),
    style: { textAlign: 'right' },
  },
  {
    label: (
      <T id="PDF.projectInfos.structure.postDisbursementSituation.insurance3A" />
    ),
    data: 487834,
    condition: shouldDisplayPostDisbursementSituation({
      type: OWN_FUNDS_TYPES.INSURANCE_3A,
      borrowers,
    }),
    style: { textAlign: 'right' },
  },
  {
    label: (
      <T id="PDF.projectInfos.structure.postDisbursementSituation.insurance3B" />
    ),
    data: 487834,
    condition: shouldDisplayPostDisbursementSituation({
      type: OWN_FUNDS_TYPES.INSURANCE_3B,
      borrowers,
    }),
    style: { textAlign: 'right' },
  },
  {
    label: (
      <T id="PDF.projectInfos.structure.postDisbursementSituation.bank3A" />
    ),
    data: 487834,
    condition: shouldDisplayPostDisbursementSituation({
      type: OWN_FUNDS_TYPES.BANK_3A,
      borrowers,
    }),
    style: { textAlign: 'right' },
  },
  {
    label: (
      <p style={{ fontWeight: 'bold' }}>
        <T id="PDF.projectInfos.structure.postDisbursementSituation.total" />
      </p>
    ),
    data: 487834,
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
      {structureRecap({ borrowers: loan.borrowers, ...loan.structure })}
      {propertyRecap({
        residenceType: loan.general.residenceType,
        ...loan.structure.property,
      })}
    </div>
  </div>
);

export default LoanBankProject;
