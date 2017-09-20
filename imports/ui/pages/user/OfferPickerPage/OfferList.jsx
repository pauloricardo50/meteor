import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { extractOffers } from '/imports/js/helpers/offerFunctions';
import cleanMethod from '/imports/api/cleanMethods';
import ConditionsButton from '/imports/ui/components/general/ConditionsButton';
import { T, IntlNumber } from '/imports/ui/components/general/Translation';
import Select from '/imports/ui/components/general/Select';
import Offer from './Offer';
import StarRating from './StarRating';

const getOfferValues = ({ monthly, rating, conditions, counterparts }) => [
  {
    id: 'monthly',
    value: (
      <span>
        <IntlNumber value={monthly} format="money" />{' '}
        <span className="secondary">
          {' '}
          <T id="general.perMonth" />
        </span>
      </span>
    ),
  },
  {
    id: 'rating',
    value: <StarRating value={rating} />,
  },
  { key: 'maxAmount', format: 'money' },
  { key: 'amortization', format: 'percentage' },
  { key: 'interestLibor', format: 'percentage' },
  { key: 'interest1', format: 'percentage' },
  { key: 'interest2', format: 'percentage' },
  { key: 'interest5', format: 'percentage' },
  { key: 'interest10', format: 'percentage' },
  {
    component: (
      <ConditionsButton conditions={conditions} counterparts={counterparts} />
    ),
  },
];

const sortOffers = (offers, sort) =>
  offers.sort((a, b) => {
    if (a[sort] > b[sort]) return 1;
    if (a[sort] < b[sort]) return -1;
    return 0;
  });

const handleSave = (id, type, loanRequest) => {
  cleanMethod(
    'updateRequest',
    {
      'logic.lender.offerId': id,
      'logic.lender.type': id ? type : undefined,
    },
    loanRequest._id,
  );
};

export default class OfferList extends Component {
  constructor(props) {
    super(props);

    this.state = { sort: 'monthly' };
  }

  handleChange = (_, value) => this.setState({ sort: value });

  render() {
    const { loanRequest, offers, disabled } = this.props;
    const { sort } = this.state;
    const filteredOffers = sortOffers(extractOffers(offers, loanRequest), sort);
    const lender = loanRequest.logic.lender;

    return (
      <div className="flex-col" style={{ width: '100%' }}>
        <Select
          id="sort"
          label={<T id="general.sortBy" />}
          currentValue={sort}
          onChange={this.handleChange}
          options={getOfferValues({})
            .filter(o => !o.component)
            .map(o => ({
              id: o.key || o.id,
              label: <T id={`offer.${o.key || o.id}`} />,
            }))}
          style={{ marginBottom: 16 }}
        />

        {filteredOffers.map(offer => (
          <Offer
            offerValues={getOfferValues(offer)}
            offer={offer}
            key={offer.uid}
            handleSave={(id, type) => handleSave(id, type, loanRequest)}
            chosen={lender.offerId === offer.id && lender.type === offer.type}
            disabled={disabled}
          />
        ))}
      </div>
    );
  }
}

OfferList.propTypes = {};
