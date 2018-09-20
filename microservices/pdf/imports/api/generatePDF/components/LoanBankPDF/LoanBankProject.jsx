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
    {array.map(({ label, data, condition, units }) =>
      (condition === undefined || condition) && (
        <tr key={label}>
          <td>{label}</td>
          <td>{data}</td>
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

const LoanBankProject = ({ property }: LoanBankProjectProps) => (
  <div className="loan-bank-pdf-project">
    <h3 className="loan-bank-pdf-section-title">Projet</h3>
    <div className="loan-bank-pdf-project-recap">
      {property.propertyType === PROPERTY_TYPE.HOUSE
        ? houseRecap(property)
        : flatRecap(property)}
    </div>
  </div>
);

export default LoanBankProject;
