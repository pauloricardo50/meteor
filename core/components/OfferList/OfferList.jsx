import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Calculator from 'core/utils/Calculator';
import ConditionsButton from 'core/components/ConditionsButton';
import { T, IntlNumber } from 'core/components/Translation';
import Offer from './Offer';
import OfferListSorting from './OfferListSorting';

const getOfferValues = ({ monthly, conditions }) => [
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
  { key: 'maxAmount', format: 'money' },
  { key: 'amortization', format: 'money' },
  { key: 'interestLibor', format: 'percentage' },
  { key: 'interest1', format: 'percentage' },
  { key: 'interest2', format: 'percentage' },
  { key: 'interest5', format: 'percentage' },
  { key: 'interest10', format: 'percentage' },
  { key: 'interest15', format: 'percentage' },
  { key: 'interest20', format: 'percentage' },
  { key: 'interest25', format: 'percentage' },
  {
    component: <ConditionsButton conditions={conditions} />,
  },
];

const sortOffers = (offers, sort, isAscending) =>
  offers.sort((a, b) => (isAscending ? a[sort] - b[sort] : b[sort] - a[sort]));

class OfferList extends Component {
  constructor(props) {
    super(props);

    this.state = { sort: 'monthly', isAscending: true };
  }

  handleChange = (_, value) => this.setState({ sort: value });

  handleChangeOrder = () =>
    this.setState(prev => ({ isAscending: !prev.isAscending }));

  render() {
    const { loan, offers } = this.props;
    const { sort, isAscending } = this.state;

    const filteredOffers = sortOffers(
      offers.map(offer => Calculator.addMetadataToOffer({ offer, loan })),
      sort,
      isAscending,
    );

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
            key={offer._id}
          />
        ))}
      </div>
    );
  }
}

OfferList.propTypes = {
  allowDelete: PropTypes.bool,
  disabled: PropTypes.bool,
  loan: PropTypes.object.isRequired,
  offers: PropTypes.array,
  property: PropTypes.object.isRequired,
};

OfferList.defaultProps = {
  offers: [],
  disabled: false,
  allowDelete: false,
};

export default OfferList;
