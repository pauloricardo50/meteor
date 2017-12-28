import React from 'react';
import PropTypes from 'prop-types';

import SummaryComponent from '/imports/ui/components/general/SummaryComponent';
import { T, IntlNumber } from 'core/components/Translation';
import { getRange } from 'core/utils/offerFunctions';
import { getMonthlyWithOffer } from 'core/utils/requestFunctions';

const values = (offers, loanRequest) => {
  const { max: maxAmount, min: minAmount } = getRange(offers, 'maxAmount');
  const monthlyArray = [];
  offers.forEach((offer) => {
    monthlyArray.push(getMonthlyWithOffer(loanRequest, offer, true));
    monthlyArray.push(getMonthlyWithOffer(loanRequest, offer, false));
  });

  // remove undefined, NaN values
  const minMonthly = Math.min(...monthlyArray.filter(v => !!v));
  const count = offers.length;

  return [
    {
      id: 'amount',
      value: <IntlNumber value={maxAmount} format="money" />,
    },
    {
      id: 'monthly',
      value: (
        <span>
          <IntlNumber value={minMonthly} format="money" />{' '}
          <T id="general.perMonth" />
        </span>
      ),
    },
    {
      id: 'count',
      value: count,
    },
  ];
};

const LenderSummary = ({ offers, loanRequest }) => (
  <SummaryComponent>
    <h4 style={{ paddingBottom: 8 }}>
      <T id="LenderSummary.title" />
    </h4>
    <div
      className="flex"
      style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}
    >
      {values(offers, loanRequest).map(({ id, value }) => (
        <div className="flex-col" key={id}>
          <label htmlFor={id}>
            <T id={`LenderSummary.${id}`} />
          </label>
          <h3 className="bold" id={id}>
            {value}
          </h3>
        </div>
      ))}
    </div>
  </SummaryComponent>
);

LenderSummary.propTypes = {
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default LenderSummary;
