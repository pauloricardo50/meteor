// @flow
import React from 'react';
import { toMoney } from 'core/utils/conversionFunctions';
import { HOUSE_TYPE, FLAT_TYPE } from 'core/api/constants';
import { PROPERTY_TYPE } from '../../../../core/api/constants';
import { T } from '../../../../core/components/Translation/Translation';

type LoanBankProjectProps = {
  property: Object,
};

const getHouseRecapArray = ({ houseType, landArea, volume, volumeNorm }) => [
  {
    label: <T id="Forms.houseType" />,
    data: <T id={`Forms.houseType.${houseType}`} />,
  },
  {
    label: <T id="Forms.landArea" />,
    data: landArea,
  },
  {
    label: <T id="Forms.volume" />,
    data: (
      <span>
        {volume} (<T id={`Forms.volumeNorm.${volumeNorm}`} />)
      </span>
    ),
  },
];

const getFlatRecapArray = ({
  flatType,
  insideArea,
  floorNumber,
  numberOfFloors,
  terraceArea,
}) => [
  {
    label: <T id="Forms.flatType" />,
    data: <T id={`Forms.flatType.${flatType}`} />,
  },
  {
    label: <T id="Forms.insideArea" />,
    data: insideArea,
  },
  {
    label: <T id="Forms.numberOfFloors" />,
    data: `${numberOfFloors}`,
  },
  {
    label: <T id="Forms.floorNumber" />,
    data: `${floorNumber}`,
    condition:
      flatType === FLAT_TYPE.SINGLE_FLOOR_APARTMENT
      || flatType === FLAT_TYPE.DUPLEX_APARTMENT,
  },
  {
    label: <T id="Forms.terraceArea" />,
    data: terraceArea,
    condition: flatType === FLAT_TYPE.TERRACE_APARTMENT,
  },
];

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
}) => [
  {
    label: <T id="Forms.roomCount" />,
    data: roomCount,
  },
  {
    label: <T id="Forms.propertyAddress" />,
    data: `${address1}, ${zipCode} ${city}`,
    style: { maxWidth: '100px' },
  },
  {
    label: <T id="Forms.constructionYear" />,
    data: constructionYear,
  },
  {
    label: <T id="Forms.renovationYear" />,
    data: renovationYear,
    condition: !!renovationYear,
  },
  {
    label: 'Places de parc',
    data: `${parkingInside} int, ${parkingOutside} ext`,
  },
  {
    label: <T id="Forms.minergie" />,
    data: <T id={`Forms.minergie.${minergie}`} />,
  },
  {
    label: <T id="general.maintenance" />,
    data: `CHF ${toMoney(monthlyExpenses)}`,
    condition: !!monthlyExpenses,
  },
];

const projectTable = ({ array, className }) => (
  <table className={className} cellSpacing="5">
    {array.map(({ label, data, condition, style }) =>
      (condition === undefined || condition) && (
        <tr key={label}>
          <td>{label}</td>
          <td style={style}>{data}</td>
        </tr>
      ))}
  </table>
);

const projectRecap = property => (
  <div className="loan-bank-pdf-project-details">
    <h3>Détails du projet</h3>
    {projectTable({
      className: 'loan-bank-pdf-project-table',
      array: [
        {
          label: <T id="Recap.propertyValue" />,
          data: `CHF ${toMoney(property.value)}`,
        },
        {
          label: <T id="Valuation.title" />,
          data: `CHF ${toMoney(property.valuation.value)} - ${toMoney(property.valuation.max)}`,
        },
        {
          label: 'Microsituation',
          data: `${property.valuation.microlocation.grade} / 5`,
        },
      ],
    })}
  </div>
);

const propertyRecap = property => (
  <div className="loan-bank-pdf-property">
    <h3>Détails de la propriété</h3>
    {projectTable({
      className: 'loan-bank-pdf-property-table',
      array: [
        ...(property.propertyType === PROPERTY_TYPE.HOUSE
          ? getHouseRecapArray(property)
          : getFlatRecapArray(property)),
        ...getPropertyRecapArray(property),
      ],
    })}
  </div>
);

const LoanBankProject = ({ property }: LoanBankProjectProps) => (
  <div className="loan-bank-pdf-project">
    <h3 className="loan-bank-pdf-section-title">Projet</h3>
    <div className="loan-bank-pdf-project-recap">
      {projectRecap(property)}
      {propertyRecap(property)}
    </div>
  </div>
);

export default LoanBankProject;
