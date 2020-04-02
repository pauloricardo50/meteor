import React from 'react';

import { getDuration, getFrequency } from 'core/api/insurances/helpers';
import { INSURANCE_PREMIUM_FREQUENCY } from 'core/api/insurances/insuranceConstants';
import { Money, Percent } from 'core/components/Translation';

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
};

export default InsuranceEstimatedRevenueInfos;
