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

export const structureArrayKeys = [
  'propertyValue',
  'notaryFees',
  'propertyWork',
  'totalCost',
  'emptyLine',
  'wantedLoanRate',
  'wantedLoan',
  'usedOwnFunds',
  'pledgedOwnFunds',
  'interests',
  'amortization',
  'maintenance',
  'solvency',
];

export const structureArrayKeysData = {
  propertyValue: loan => toMoney(Calculator.getPropertyValue({ loan })),
  notaryFees: loan => toMoney(Calculator.getFees({ loan })),
  propertyWork: loan => toMoney(Calculator.getPropertyWork({ loan })),
  totalCost: loan => toMoney(Calculator.getProjectValue({ loan })),
  wantedLoanRate: loan => (
    <Percent value={Calculator.getBorrowRatio({ loan })} rounded />
  ),
  wantedLoan: loan => toMoney(Calculator.selectLoanValue({ loan })),
  usedOwnFunds: loan => toMoney(Calculator.getTotalUsed({ loan })),
  pledgedOwnFunds: loan => toMoney(Calculator.getTotalPledged({ loan })),
  interests: loan => toMoney(12 * Calculator.getTheoreticalInterests({ loan })),
  amortization: loan => toMoney(12 * Calculator.getAmortization({ loan })),
  maintenance: loan =>
    toMoney(12 * Calculator.getTheoreticalMaintenance({ loan })),
  solvency: loan => (
    <Percent value={Calculator.getIncomeRatio({ loan })} rounded />
  ),
};

export const EMPTY_LINE = {
  label: NBSP,
  type: ROW_TYPES.EMPTY,
};

export const structureArrayKeysCondition = {
  propertyWork: ({ propertyWork }) => !!propertyWork,
  pledgedOwnFunds: loan => Calculator.getTotalPledged({ loan }) > 0,
};

export const structureArrayData = loan =>
  structureArrayKeys.map(key =>
    (key === 'emptyLine'
      ? EMPTY_LINE
      : {
        label: <T id={`PDF.projectInfos.structure.${key}`} />,
        data: structureArrayKeysData[key](loan),
        condition: structureArrayKeysCondition[key]
          ? structureArrayKeysCondition[key](loan)
          : true,
        type: key === 'totalCost' ? ROW_TYPES.SUM : ROW_TYPES.REGULAR,
      }));

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

export const propertyArrayData = loan =>
  propertyArrayKeys.map(key =>
    (key === 'emptyLine'
      ? EMPTY_LINE
      : {
        label: <T id={`PDF.projectInfos.property.${key}`} />,
        data: propertyArrayKeysData[key](loan),
        condition: propertyArrayKeysCondition[key]
          ? propertyArrayKeysCondition[key](loan.structure.property)
          : true,
      }));
