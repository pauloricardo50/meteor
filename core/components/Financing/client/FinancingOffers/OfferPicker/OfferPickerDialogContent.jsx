//
import React from 'react';

import T, { Percent, Money } from '../../../../Translation';
import { RecapSimple } from '../../../../Recap';
import { toMoney } from '../../../../../utils/conversionFunctions';
import { getProperty } from '../../FinancingCalculator';

const OfferPickerDialogContent = props => {
  const { offer } = props;
  const property = getProperty(props);
  const {
    maxAmount,
    conditions,
    organisation,
    amortization,
    interests,
    monthly,
    rates,
    fees,
    epotekFees,
  } = offer;

  return (
    <div className="offer-picker-dialog animated fadeIn">
      <img src={organisation.logo} alt={organisation.name} />

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
        <T id="offer.monthly" />
      </h3>
      <div className="validator recap">
        <RecapSimple
          array={[
            {
              label: 'FinancingOffers.amortization',
              value: toMoney(amortization),
            },
            { label: 'FinancingOffers.interests', value: toMoney(interests) },
            {
              label: 'Forms.yearlyExpenses.short',
              value: toMoney(property.yearlyExpenses),
              hide: !(property && property.yearlyExpenses),
            },
            {
              label: 'general.total',
              value: <span className="sum">{toMoney(monthly)}</span>,
              spacingTop: true,
              bold: true,
            },
          ]}
        />
      </div>

      <h3>
        <T id="offer.maxAmount" />
      </h3>
      <Money value={maxAmount} />

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
    </div>
  );
};

export default OfferPickerDialogContent;
