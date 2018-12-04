import React from 'react';

import Calculator from 'core/utils/Calculator';
import T, { Percent } from 'core/components/Translation';
import { toMoney } from 'core/utils/conversionFunctions';
import {
  OWN_FUNDS_USAGE_TYPES,
  OWN_FUNDS_TYPES,
  PROPERTY_TYPE,
  FLAT_TYPE,
} from 'core/api/constants';
import { ROW_TYPES } from '../../PdfTable/PdfTable';

export const NBSP = '\u00A0';

export const shouldDisplayOwnFund = ({ ownFunds, type, usageType }) =>
  ownFunds.some((ownFund) => {
    if (usageType) {
      return ownFund.type === type && ownFund.usageType === usageType;
    }
    return ownFund.type === type;
  });

export const usedOwnFundsTableData = loan =>
  Object.values(OWN_FUNDS_USAGE_TYPES).reduce(
    (usedOwnFunds, usageType) => [
      ...usedOwnFunds,
      ...Object.values(OWN_FUNDS_TYPES)
        .filter(type =>
          ![
            OWN_FUNDS_TYPES.BANK_FORTUNE,
            OWN_FUNDS_TYPES.THIRD_PARTY_FORTUNE,
          ].includes(type))
        .map(type => ({
          label: (
            <T id={`PDF.ownFund.${type}${usageType ? `.${usageType}` : ''}`} />
          ),
          data: toMoney(Calculator.getUsedFundsOfType({ loan, type, usageType })),
          condition:
            Calculator.getUsedFundsOfType({ loan, type, usageType }) > 0,
          style: {
            textAlign: 'right',
          },
        })),
    ],
    [],
  );

const oneBorrowerHasOwnFunds = ({ borrowers }, type) =>
  borrowers.filter((borrower) => {
    const valueForType = borrower[type];
    if (Array.isArray(valueForType)) {
      return valueForType.length > 0;
    }
    return !!valueForType;
  }).length > 0;

export const remainingFundsTableData = loan =>
  Object.values(OWN_FUNDS_TYPES)
    .filter(type => ![OWN_FUNDS_TYPES.BANK_FORTUNE].includes(type))
    .map(type => ({
      label: <T id={`PDF.ownFund.${type}`} />,
      data: toMoney(Calculator.getRemainingFundsOfType({ loan, type })),
      condition: oneBorrowerHasOwnFunds(loan, type),
      style: { textAlign: 'right' },
    }));

export const EMPTY_LINE = {
  label: NBSP,
  type: ROW_TYPES.EMPTY,
};

export const structureArrayData = loan => [
  {
    label: <T id="PDF.projectInfos.structure.propertyValue" />,
    data: toMoney(Calculator.getPropertyValue({ loan })),
  },
  {
    label: <T id="PDF.projectInfos.structure.notaryFees" />,
    data: toMoney(Calculator.getFees({ loan })),
  },
  {
    label: <T id="PDF.projectInfos.structure.propertyWork" />,
    data: toMoney(Calculator.getPropertyWork({ loan })),
    condition: !!loan.propertyWork,
  },
  {
    label: <T id="PDF.projectInfos.structure.totalCost" />,
    data: toMoney(Calculator.getProjectValue({ loan })),
    type: ROW_TYPES.SUM,
  },
  {
    label: <T id="PDF.projectInfos.structure.wantedLoan" />,
    data: toMoney(Calculator.selectLoanValue({ loan })),
  },
  {
    label: <T id="PDF.projectInfos.structure.usedOwnFunds" />,
    data: toMoney(Calculator.getTotalUsed({ loan })),
  },
  {
    label: <T id="PDF.projectInfos.structure.pledgedOwnFunds" />,
    data: toMoney(Calculator.getTotalPledged({ loan })),
    condition: Calculator.getTotalPledged({ loan }) > 0,
  },
  {
    label: <T id="PDF.projectInfos.structure.theoreticalCharges" />,
    type: ROW_TYPES.SUBSECTION,
  },
  {
    label: <T id="PDF.projectInfos.structure.interests" />,
    data: toMoney(12 * Calculator.getTheoreticalInterests({ loan })),
  },
  {
    label: <T id="PDF.projectInfos.structure.amortization" />,
    data: toMoney(12 * Calculator.getAmortization({ loan })),
  },
  {
    label: <T id="PDF.projectInfos.structure.maintenance" />,
    data: toMoney(12 * Calculator.getTheoreticalMaintenance({ loan })),
  },
  {
    label: <T id="PDF.projectInfos.structure.totalTheoreticalCharges" />,
    data: toMoney(12 * Calculator.getTheoreticalMonthly({ loan })),
    type: ROW_TYPES.SUM,
  },
  {
    label: <T id="PDF.projectInfos.structure.totalIncome" />,
    data: toMoney(Calculator.getTotalIncome({ loan })),
  },
  {
    label: <T id="PDF.projectInfos.structure.solvency" />,
    data: <Percent value={Calculator.getIncomeRatio({ loan })} rounded />,
  },
];

export const propertyArrayKeys = [
  'address',
  'residenceType',
  'propertyType',
  'houseType',
  'flatType',
  'roomCount',
  'insideArea',
  'landArea',
  'volume',
  'terraceArea',
  'numberOfFloors',
  'floorNumber',
  'constructionYear',
  'renovationYear',
  'parking',
  'minergie',
  'maintenance',
];

export const propertyArrayKeysData = {
  address: ({
    structure: {
      property: { address1, zipCode, city },
    },
  }) => (
    <span>
      {address1},<br />
      {zipCode} {city}
    </span>
  ),
  residenceType: ({ general: { residenceType } }) => (
    <T id={`PDF.residenceType.${residenceType}`} />
  ),
  propertyType: ({
    structure: {
      property: { propertyType },
    },
  }) => <T id={`PDF.projectInfos.property.propertyType.${propertyType}`} />,
  houseType: ({
    structure: {
      property: { houseType },
    },
  }) => <T id={`PDF.projectInfos.property.houseType.${houseType}`} />,
  flatType: ({
    structure: {
      property: { flatType },
    },
  }) => <T id={`PDF.projectInfos.property.flatType.${flatType}`} />,
  roomCount: ({
    structure: {
      property: { roomCount },
    },
  }) => roomCount,
  insideArea: ({
    structure: {
      property: { insideArea },
    },
  }) => `${insideArea} m2`,
  landArea: ({
    structure: {
      property: { landArea },
    },
  }) => `${landArea} m2`,
  volume: ({
    structure: {
      property: { volume, volumeNorm },
    },
  }) => (
    <span>
      {volume} m3 (
      <T id={`PDF.projectInfos.property.volumeNorm.${volumeNorm}`} />)
    </span>
  ),
  terraceArea: ({
    structure: {
      property: { terraceArea },
    },
  }) => `${terraceArea} m2`,
  numberOfFloors: ({
    structure: {
      property: { numberOfFloors },
    },
  }) => numberOfFloors,
  floorNumber: ({
    structure: {
      property: { floorNumber },
    },
  }) => floorNumber,
  constructionYear: ({
    structure: {
      property: { constructionYear },
    },
  }) => constructionYear,
  renovationYear: ({
    structure: {
      property: { renovationYear },
    },
  }) => renovationYear,
  parking: ({
    structure: {
      property: { parkingInside = 0, parkingOutside = 0 },
    },
  }) => `${parkingInside} int., ${parkingOutside} ext.`,
  minergie: ({
    structure: {
      property: { minergie },
    },
  }) => <T id={`PDF.projectInfos.property.minergie.${minergie}`} />,
  maintenance: ({
    structure: {
      property: { monthlyExpenses },
    },
  }) => toMoney(monthlyExpenses),
};

export const propertyArrayKeysCondition = {
  houseType: ({ propertyType }) => propertyType === PROPERTY_TYPE.HOUSE,
  flatType: ({ propertyType }) => propertyType === PROPERTY_TYPE.FLAT,
  insideArea: ({ propertyType }) => propertyType === PROPERTY_TYPE.FLAT,
  landArea: ({ propertyType }) => propertyType === PROPERTY_TYPE.HOUSE,
  volume: ({ propertyType }) => propertyType === PROPERTY_TYPE.HOUSE,
  terraceArea: ({ propertyType, flatType }) =>
    propertyType === PROPERTY_TYPE.FLAT
    && flatType === FLAT_TYPE.TERRACE_APARTMENT,
  numberOfFloors: ({ propertyType }) => propertyType === PROPERTY_TYPE.FLAT,
  floorNumber: ({ propertyType, flatType }) =>
    propertyType === PROPERTY_TYPE.FLAT
    && (flatType === FLAT_TYPE.SINGLE_FLOOR_APARTMENT
      || flatType === FLAT_TYPE.DUPLEX_APARTMENT),
  renovationYear: ({ renovationYear }) => !!renovationYear,
  maintenance: ({ monthlyExpenses }) => !!monthlyExpenses,
};

// export const propertyArrayData = loan =>
//   propertyArrayKeys.map(key =>
//     (key === 'emptyLine'
//       ? EMPTY_LINE
//       : {
//         label: <T id={`PDF.projectInfos.property.${key}`} />,
//         data: propertyArrayKeysData[key](loan),
//         condition: propertyArrayKeysCondition[key]
//           ? propertyArrayKeysCondition[key](loan.structure.property)
//           : true,
//       }));

export const propertyArrayData = (loan) => {
  const {
    structure: {
      property: {
        address1,
        zipCode,
        city,
        propertyType,
        houseType,
        flatType,
        roomCount,
        insideArea,
        landArea,
        volume,
        volumeNorm,
        terraceArea,
        numberOfFloors,
        floorNumber,
        constructionYear,
        renovationYear,
        parkingInside = 0,
        parkingOutside = 0,
        minergie,
        monthlyExpenses,
      },
    },
    general: { residenceType },
  } = loan;
  return [
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
    },
    {
      label: <T id="PDF.projectInfos.property.flatType" />,
      data: <T id={`PDF.projectInfos.property.flatType.${flatType}`} />,
      condition: propertyType === PROPERTY_TYPE.FLAT,
    },
    {
      label: <T id="PDF.projectInfos.property.roomCount" />,
      data: roomCount,
      tooltip: {
        text: <T id="PDF.projectInfos.property.roomCount.tooltip" />,
        symbol: '*',
      },
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
      data: numberOfFloors,
      condition: propertyType === PROPERTY_TYPE.FLAT,
    },
    {
      label: <T id="PDF.projectInfos.property.floorNumber" />,
      data: floorNumber,
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
      data: `${parkingInside} int., ${parkingOutside} ext.`,
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
};
