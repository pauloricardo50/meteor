import React from 'react';
import T, { Money, Percent } from 'core/components/Translation';
import { INSURANCE_PREMIUM_FREQUENCY } from 'core/api/constants';

const getFrequency = premiumFrequency => {
  switch (premiumFrequency) {
    case INSURANCE_PREMIUM_FREQUENCY.MONTHLY:
      return ' / mois';
    case INSURANCE_PREMIUM_FREQUENCY.QUARTERLY:
      return ' / trimestre';
    case INSURANCE_PREMIUM_FREQUENCY.BIANNUAL:
      return ' / semestre';
    case INSURANCE_PREMIUM_FREQUENCY.YEARLY:
      return ' / année';
    case INSURANCE_PREMIUM_FREQUENCY.SINGLE:
      return ' unique';
    default:
      return '';
  }
};

const getDuration = ({ premiumFrequency, duration }) => {
  switch (premiumFrequency) {
    case INSURANCE_PREMIUM_FREQUENCY.MONTHLY:
      return `${duration} mois`;
    case INSURANCE_PREMIUM_FREQUENCY.QUARTERLY:
      return `${duration} trimestres`;
    case INSURANCE_PREMIUM_FREQUENCY.BIANNUAL:
      return `${duration} semestres`;
    case INSURANCE_PREMIUM_FREQUENCY.YEARLY:
      return `${duration} ans`;
    default:
      return '';
  }
};

const InsuranceEstimatedRevenueInfos = props => {
  const {
    premium,
    premiumFrequency,
    duration,
    revaluationFactor,
    productionRate,
  } = props;

  return (
    <table className="insurance-estimated-revenue-infos" cellSpacing={16}>
      <thead>
        <tr>
          <th>
            <b>Prime</b>
          </th>
          {premiumFrequency !== INSURANCE_PREMIUM_FREQUENCY.SINGLE && (
            <th>
              <b>Durée</b>
            </th>
          )}
          <th>
            <b>Facteur de revalorisation</b>
          </th>
          <th>
            <b>Taux de commissionnement</b>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <span>
              <Money value={premium} />
              {getFrequency(premiumFrequency)}
            </span>
          </td>
          {premiumFrequency !== INSURANCE_PREMIUM_FREQUENCY.SINGLE && (
            <td>
              <span>{getDuration({ premiumFrequency, duration })}</span>
            </td>
          )}
          <td>
            <span>{revaluationFactor}</span>
          </td>
          <td>
            <Percent value={productionRate} />
          </td>
        </tr>
      </tbody>
    </table>
  );

  //   return (
  //     <div className="grid-col">
  //       <div className="flex-col">
  //         <b>Prime</b>
  //         <span>
  //           <Money value={premium} />
  //           {getFrequency(premiumFrequency)}
  //         </span>
  //       </div>
  //       {premiumFrequency !== INSURANCE_PREMIUM_FREQUENCY.SINGLE && (
  //         <div className="flex-col">
  //           <b>Durée</b>
  //           <span>{getDuration({ premiumFrequency, duration })}</span>
  //         </div>
  //       )}
  //       <div className="flex-col">
  //         <b>Facteur de revalorisation</b>
  //         <span>{revaluationFactor}</span>
  //       </div>
  //       <div className="flex-col">
  //         <b>Taux de commissionnement</b>
  //         <Percent value={productionRate} />
  //       </div>
  //     </div>
  //   );
};

export default InsuranceEstimatedRevenueInfos;
