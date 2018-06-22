import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { extractOffers } from 'core/utils/offerFunctions';
import ConditionsButton from 'core/components/ConditionsButton';
import { T, IntlNumber } from 'core/components/Translation';
import { loanUpdate } from 'core/api';
import Offer from './Offer';
import StarRating from './StarRating';
import OfferListSorting from './OfferListSorting';

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
    value: <StarRating value={rating || 5} />,
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

const sortOffers = (offers, sort, isAscending) =>
  offers.sort((a, b) => (isAscending ? a[sort] - b[sort] : b[sort] - a[sort]));

const handleSave = (id, type, loan) => {
  loanUpdate.run({
    object: {
      'logic.lender.offerId': id,
      'logic.lender.type': id ? type : undefined,
    },
    loanId: loan._id,
  });
};

class OfferList extends Component {
  constructor(props) {
    super(props);

    this.state = { sort: 'monthly', isAscending: true };
  }

  handleChange = (_, value) => this.setState({ sort: value });

  handleChangeOrder = () =>
    this.setState(prev => ({ isAscending: !prev.isAscending }));

  render() {
    const { loan, offers, disabled, property, allowDelete } = this.props;
    const { sort, isAscending } = this.state;

    const filteredOffers = sortOffers(
      extractOffers({ offers, loan, property }),
      sort,
      isAscending,
    );
    const { lender } = loan.logic;

    return (
      <div className="flex-col" style={{ width: '100%' }}>
        <OfferListSorting
          sort={sort}
          options={getOfferValues({})
            .filter(({ component }) => !component)
            .map(({ key, id }) => ({
              id: key || id,
              label: <T id={`offer.${key || id}`} />,
            }))}
          handleChange={this.handleChange}
          handleChangeOrder={this.handleChangeOrder}
          isAscending={isAscending}
        />

        {filteredOffers.map(offer => (
          <Offer
            offerValues={getOfferValues(offer)}
            offer={offer}
            key={offer.uid}
            handleSave={(id, type) => handleSave(id, type, loan)}
            chosen={lender.offerId === offer.id && lender.type === offer.type}
            disabled={disabled}
            allowDelete={allowDelete}
          />
        ))}
      </div>
    );
  }
}

OfferList.propTypes = {
  loan: PropTypes.object.isRequired,
  offers: PropTypes.array,
  property: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  allowDelete: PropTypes.bool,
};

OfferList.defaultProps = {
  offers: [],
  disabled: false,
  allowDelete: false,
};

export default OfferList;
