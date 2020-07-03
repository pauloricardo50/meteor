import React from 'react';

import Calculator from '../../../../../utils/Calculator';
import { toMoney } from '../../../../../utils/conversionFunctions';
import { RecapSimple } from '../../../../Recap';
import T, { Money, Percent } from '../../../../Translation';

const OfferPickerDialogContent = props => {
  const { offer, loan } = props;
  const property = Calculator.selectProperty(props);
  const { organisation } = Calculator.selectLenderForOfferId({
    loan,
    offerId: offer._id,
  });
  const {
    maxAmount,
    conditions,
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
            <T id="Forms.fees" />
          </h3>
          <Money value={fees} />
        </>
      )}

      {!!epotekFees && (
        <>
          <h3>
            <T id="Forms.epotekFees" />
          </h3>
          <Money value={epotekFees} />
        </>
      )}

      <h3>
        <T id="FinancingOffers.monthly" />
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
        <T id="Forms.maxAmount" />
      </h3>
      <Money value={maxAmount} />

      <h3>
        <T id="FinancingOffers.interests" />
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
