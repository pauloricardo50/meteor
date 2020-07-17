import React from 'react';

import T, { Money } from '../../../../../components/Translation';
import Calculator from '../../../../../utils/Calculator';
import { toMoney } from '../../../../../utils/conversionFunctions';
import {
  FLAT_TYPE,
  PROPERTY_TYPE,
} from '../../../../properties/propertyConstants';
import PdfTable, { ROW_TYPES } from '../../PdfTable/PdfTable';

const getPropertyRows = loan => {
  const {
    address1,
    balconyArea,
    city,
    constructionYear,
    flatType,
    floorNumber,
    houseType,
    insideArea,
    landArea,
    minergie,
    numberOfFloors,
    parkingInside = 0,
    parkingOutside = 0,
    propertyType,
    renovationYear,
    roomCount,
    terraceArea,
    totalValue,
    volume,
    volumeNorm,
    yearlyExpenses,
    zipCode,
  } = Calculator.selectProperty({ loan });
  const { residenceType, promotions = [] } = loan;
  const [promotion] = promotions;

  return [
    {
      label: <T id="Forms.property" />,
      colspan: 2,
      type: ROW_TYPES.TITLE,
    },
    {
      label: <T id="Forms.undetailedValue" />,
      data: <Money value={totalValue} />,
    },
    {
      label: <T id="Forms.category.PROMOTION" />,
      data: (
        <T
          id="PDF.projectInfos.property.promotionNameData"
          values={{ name: promotion?.name }}
        />
      ),
      condition: !!promotion,
    },
    {
      label: <T id="Forms.address" />,
      data: (
        <span>
          {address1},<br />
          {zipCode} {city}
        </span>
      ),
    },
    {
      label: <T id="Forms.residenceType" />,
      data: <T id={`Forms.residenceType.${residenceType}`} />,
    },
    {
      label: <T id="Forms.propertyType" />,
      data: <T id={`Forms.propertyType.${propertyType}`} />,
    },
    {
      label: <T id="Forms.houseType" />,
      data: <T id={`Forms.houseType.${houseType}`} />,
      condition: !!houseType && propertyTyrpe === PROPERTY_TYPE.HOUSE,
    },
    {
      label: <T id="Forms.flatType" />,
      data: <T id={`Forms.flatType.${flatType}`} />,
      condition: !!flatType && propertyType === PROPERTY_TYPE.FLAT,
    },
    {
      label: <T id="PDF.projectInfos.property.roomCount" />,
      data: roomCount,
      tooltip: {
        text: <T id="PDF.projectInfos.property.roomCount.tooltip" />,
        symbol: '*',
      },
      condition: !!roomCount,
    },
    {
      label: <T id="Forms.variable.insideArea" />,
      data: `${insideArea} m2`,
      condition: !!insideArea && propertyType === PROPERTY_TYPE.FLAT,
    },
    {
      label: <T id="PDF.projectInfos.property.landArea" />,
      data: `${landArea} m2`,
      condition: !!landArea && propertyType === PROPERTY_TYPE.HOUSE,
    },
    {
      label: <T id="PDF.projectInfos.property.volume" />,
      data: (
        <span>
          {volume} m3 (
          <T id={`Forms.volumeNorm.${volumeNorm}`} />)
        </span>
      ),
      condition:
        !!volume && !!volumeNorm && propertyType === PROPERTY_TYPE.HOUSE,
    },
    {
      label: <T id="PDF.projectInfos.property.terraceArea" />,
      data: `${terraceArea} m2`,
      condition:
        !!terraceArea &&
        propertyType === PROPERTY_TYPE.FLAT &&
        flatType === FLAT_TYPE.TERRACE_APARTMENT,
    },
    {
      label: <T id="Forms.balconyArea" />,
      data: `${balconyArea} m2`,
      condition: !!balconyArea,
    },
    {
      label: <T id="PDF.projectInfos.property.numberOfFloors" />,
      data: numberOfFloors,
      condition: !!numberOfFloors && propertyType === PROPERTY_TYPE.FLAT,
    },
    {
      label: <T id="PDF.projectInfos.property.floorNumber" />,
      data: floorNumber,
      condition:
        propertyType === PROPERTY_TYPE.FLAT &&
        (flatType === FLAT_TYPE.SINGLE_FLOOR_APARTMENT ||
          flatType === FLAT_TYPE.DUPLEX_APARTMENT),
    },
    {
      label: <T id="Forms.constructionYear" />,
      data: constructionYear,
      condition: !!constructionYear,
    },
    {
      label: <T id="Forms.renovationYear" />,
      data: renovationYear,
      condition: !!renovationYear,
    },
    {
      label: <T id="PDF.projectInfos.property.parking" />,
      data: `${parkingInside} int., ${parkingOutside} ext.`,
      condition: !!parkingInside || !!parkingOutside,
    },
    {
      label: <T id="PDF.projectInfos.property.minergie" />,
      data: <T id={`Forms.minergie.${minergie}`} />,
      condition: !!minergie,
    },
    {
      label: <T id="PDF.projectInfos.property.maintenance" />,
      data: toMoney(yearlyExpenses),
      condition: !!yearlyExpenses,
    },
  ];
};

const PdfPropertyDetails = ({ loan, style }) => (
  <PdfTable
    style={style}
    rows={getPropertyRows(loan)}
    columnOptions={[{}, { style: { textAlign: 'right' } }]}
  />
);

export default PdfPropertyDetails;
