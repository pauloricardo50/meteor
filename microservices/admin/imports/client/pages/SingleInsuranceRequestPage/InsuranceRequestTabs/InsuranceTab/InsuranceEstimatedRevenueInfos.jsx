import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import { Money, Percent } from 'core/components/Translation';
import { INSURANCE_PREMIUM_FREQUENCY } from 'core/api/constants';
import {
  getFrequency,
  getDuration,
  getEffectiveDuration,
} from 'core/api/insurances/helpers';

const InsuranceEstimatedRevenueInfos = props => {
  const {
    premium,
    premiumFrequency,
    duration,
    revaluationFactor,
    productionRate,
    maxProductionYears,
  } = props;

  const effectiveDuration = getEffectiveDuration({
    duration,
    premiumFrequency,
    maxProductionYears,
  });
  const formattedDuration = getDuration({
    premiumFrequency,
    duration: effectiveDuration,
  });
  const durationIsShortened = effectiveDuration < duration;

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
              {durationIsShortened ? (
                <Tooltip
                  title={`La durée maximale de production pour le produit étant de ${maxProductionYears} ans, la durée prise en compte est réduite de ${getDuration(
                    { premiumFrequency, duration },
                  )} à ${formattedDuration}`}
                >
                  <span>{formattedDuration}</span>
                </Tooltip>
              ) : (
                <span>{formattedDuration}</span>
              )}
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
