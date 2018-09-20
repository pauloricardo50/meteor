// @flow
import React from 'react';
import { toMoney } from 'core/utils/conversionFunctions';
import { HOUSE_TYPE } from 'core/api/constants';
import { PROPERTY_TYPE } from '../../../../core/api/constants';
import { T } from '../../../../core/components/Translation/Translation';

type LoanBankProjectProps = {
  property: Object,
};

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

const houseRecap = ({
  value,
  houseType,
  address1,
  zipCode,
  city,
  constructionYear,
  renovationYear,
  landArea,
  volume,
  volumeNorm,
  roomCount,
  parkingInside,
  parkingOutside,
  minergie,
  monthlyExpenses,
  valuation,
}) => (
  <div className="loan-bank-pdf-property">
    <h3>Détails de la propriété</h3>
    {projectTable({
      className: 'loan-bank-pdf-property-table',
      array: [
        {
          label: <T id="Forms.houseType" />,
          data: <T id={`Forms.houseType.${houseType}`} />,
        },
        {
          label: <T id="Forms.propertyAddress" />,
          data: `${address1}, ${zipCode} ${city}`,
          style: { maxWidth: '80px' },
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
        },
      ],
    })}
  </div>
);
const flatRecap = property => 'THIS IS A FLAT !';

const projectRecap = property => (
  <div className="loan-bank-pdf-project-details">
    <h3>Détails du projet</h3>
    {projectTable({
      className: 'loan-bank-pdf-project-table',
      array: [
        {
          label: <T id="Recap.propertyValue" />,
          data: property.value,
        },
        {
          label: <T id="Valuation.title" />,
          data: `CHF ${property.valuation.value} - ${property.valuation.max}`,
        },
      ],
    })}
  </div>
);

const LoanBankProject = ({ property }: LoanBankProjectProps) => (
  <div className="loan-bank-pdf-project">
    <h3 className="loan-bank-pdf-section-title">Projet</h3>
    <div className="loan-bank-pdf-project-recap">
      {projectRecap(property)}
      {property.propertyType === PROPERTY_TYPE.HOUSE
        ? houseRecap(property)
        : flatRecap(property)}
    </div>
  </div>
);

export default LoanBankProject;
