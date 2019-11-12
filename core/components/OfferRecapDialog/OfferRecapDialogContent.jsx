// @flow
import React from 'react';

import pick from 'lodash/pick';
import moment from 'moment';

import T, { Money, Percent } from '../Translation';
import { INTEREST_RATES } from '../../api/constants';

type OfferRecapDialogContentProps = {
  offer: Object,
};

const OfferRecapDialogContent = ({
  offer = {},
}: OfferRecapDialogContentProps) => {
  const {
    createdAt,
    maxAmount,
    conditions = [],
    organisation = {},
    amortizationGoal,
    amortizationYears,
    fees,
    epotekFees,
    feedback,
    ...rest
  } = offer;
  const rates = pick(rest, Object.values(INTEREST_RATES));

  const { logo = '', name = '' } = organisation;
  return (
    <div className="offer-recap-dialog">
      <img src={logo} alt={name} />

      <h3>
        <T id="offer.createdAt" />
      </h3>
      <p>{moment(createdAt).format('DD.MM.YYYY')}</p>

      {conditions.length > 0 && (
        <>
          <h3>
            <T id="FinancingOffers.conditions" />
          </h3>
          <p>
            <ul>
              {conditions.map(c => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </p>
        </>
      )}

      {!!fees && (
        <>
          <h3>
            <T id="offer.fees" />
          </h3>
          <Money value={fees} />
        </>
      )}

      {!!epotekFees && (
        <>
          <h3>
            <T id="offer.epotekFees" />
          </h3>
          <Money value={epotekFees} />
        </>
      )}

      <h3>
        <T id="offer.maxAmount" />
      </h3>
      <Money value={maxAmount} />

      <h3>
        <T id="offer.amortizationGoal" />
      </h3>
      <span className="flex flex-row">
        <Percent value={amortizationGoal} />
        {amortizationYears && <p>&nbsp;sur {amortizationYears} ans</p>}
      </span>

      <h3>
        <T id="offer.interests" />
      </h3>
      <div className="rates">
        {Object.keys(rates).map(rate => (
          <span key={rate}>
            <p>
              <T id={`offer.${rate}.short`} />
            </p>
            <h4>
              <Percent value={rates[rate]} />
            </h4>
          </span>
        ))}
      </div>

      <h3>
        <T id="offer.feedback" />
      </h3>
      <p style={{ whiteSpace: 'pre-line' }}>
        {feedback || 'Pas encore de feedback'}
      </p>
    </div>
  );
};

export default OfferRecapDialogContent;
