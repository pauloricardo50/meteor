import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ConditionsButton from 'core/components/ConditionsButton';
import T from 'core/components/Translation';
import makeSort from 'core/utils/sorting';
import Offer from './Offer';
import OfferListSorting from './OfferListSorting';

const getOfferValues = ({ conditions }) => [
  { key: 'fees', format: 'money' },
  { key: 'epotekFees', format: 'money' },
  { key: 'maxAmount', format: 'money' },
  { key: 'amortizationGoal', format: 'percentage' },
  { key: 'amortizationYears', format: '' },
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

const sortOffers = (offers, sort, isAscending) => {
  const sorter = makeSort(isAscending);
  return offers.sort((a, b) => sorter(a[sort], b[sort]));
};
class OfferList extends Component {
  constructor(props) {
    super(props);

    this.state = { sort: 'maxAmount', isAscending: false };
  }

  handleChange = value => this.setState({ sort: value });

  handleChangeOrder = () =>
    this.setState(prev => ({ isAscending: !prev.isAscending }));

  render() {
    const { offers, property } = this.props;
    const { sort, isAscending } = this.state;

    const filteredOffers = sortOffers(offers, sort, isAscending);

    if (filteredOffers.length === 0) {
      return <h3 className="secondary text-center">Pas encore d'offres</h3>;
    }

    return (
      <div className="flex-col" style={{ width: '100%' }}>
        <OfferListSorting
          sort={sort}
          options={[
            ...getOfferValues({}).filter(({ component }) => !component),
            { key: 'createdAt' },
          ].map(({ key, id }) => ({
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
            offer={{ ...offer, property }}
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
