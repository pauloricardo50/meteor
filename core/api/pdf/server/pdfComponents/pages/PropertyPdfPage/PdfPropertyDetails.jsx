import React from 'react';

import T from '../../../../../../components/Translation';
import Calculator from '../../../../../../utils/Calculator';
import { toMoney } from '../../../../../../utils/conversionFunctions';
import {
  FLAT_TYPE,
  PROPERTY_TYPE,
} from '../../../../../properties/propertyConstants';
import PdfTable, { ROW_TYPES } from '../../PdfTable/PdfTable';

const getPropertyRows = loan => {
  const {
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
    yearlyExpenses,
    promotion,
  } = Calculator.selectProperty({ loan });
  const { residenceType } = loan;

  return [
    {
      label: 'Bien immobilier',
      colspan: 2,
      type: ROW_TYPES.TITLE,
    },
    {
      label: <T id="PDF.projectInfos.property.promotionName" />,
      data: (
        <T
          id="PDF.projectInfos.property.promotionNameData"
          values={{ name: promotion && promotion.name }}
        />
      ),
      condition: !!promotion,
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
      condition: !!houseType && propertyType === PROPERTY_TYPE.HOUSE,
    },
    {
      label: <T id="PDF.projectInfos.property.flatType" />,
      data: <T id={`PDF.projectInfos.property.flatType.${flatType}`} />,
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
      label: <T id="PDF.projectInfos.property.insideArea" />,
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
          <T id={`PDF.projectInfos.property.volumeNorm.${volumeNorm}`} />)
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
      label: <T id="PDF.projectInfos.property.constructionYear" />,
      data: constructionYear,
      condition: !!constructionYear,
    },
    {
      label: <T id="PDF.projectInfos.property.renovationYear" />,
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
      data: <T id={`PDF.projectInfos.property.minergie.${minergie}`} />,
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
