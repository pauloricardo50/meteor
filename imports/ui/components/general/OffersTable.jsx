import React from 'react';
import PropTypes from 'prop-types';

import ConditionsButton from '/imports/ui/components/general/ConditionsButton';
import { IntlNumber } from '/imports/ui/components/general/Translation';

import Table from './Table';

const percentageStyle = { paddingLeft: 8, paddingRight: 8 };
const columns = [
  {
    label: '',
    align: 'center',
    style: { paddingRight: 0, paddingLeft: 0, width: 32 },
  },
  {
    id: 'OffersTable.amount',
    align: 'right',
    format: val => <IntlNumber value={val} format="money" />,
    style: { paddingLeft: 0, overflow: 'unset' },
  },
  {
    id: 'OffersTable.years',
    intlValues: {
      years: 1,
    },
    align: 'right',
    format: val => <IntlNumber value={val} format="percentage" />,
    style: percentageStyle,
  },
  {
    id: 'OffersTable.years',
    intlValues: {
      years: 2,
    },
    align: 'right',
    format: val => <IntlNumber value={val} format="percentage" />,
    style: percentageStyle,
  },
  {
    id: 'OffersTable.years',
    intlValues: {
      years: 5,
    },
    align: 'right',
    format: val => <IntlNumber value={val} format="percentage" />,
    style: percentageStyle,
  },
  {
    id: 'OffersTable.years',
    intlValues: {
      years: 10,
    },
    align: 'right',
    format: val => <IntlNumber value={val} format="percentage" />,
    style: percentageStyle,
  },
  {
    id: 'general.amortization',
    align: 'right',
    format: val => <IntlNumber value={val} format="percentage" />,
    style: percentageStyle,
  },
  {
    id: 'OffersTable.conditions',
    align: 'center',
    style: { paddingLeft: 0, paddingRight: 0 },
  },
];

const OffersTable = ({ offers, showSpecial }) => {
  let mappedOffers = offers.map(
    o =>
      (showSpecial
        ? {
          _id: o._id,
          ...o.counterpartOffer,
          conditions: o.conditions,
          counterparts: o.counterparts,
        }
        : {
          _id: o._id,
          ...o.standardOffer,
          conditions: o.conditions,
          counterparts: [],
        }),
  );
  mappedOffers.sort((a, b) => a.interest10 - b.interest10);
  if (showSpecial) {
    mappedOffers = mappedOffers.filter(o => o.counterparts.length > 0);
  }

  return (
    <article>
      <Table
        columns={columns}
        rows={mappedOffers.map((offer, i) => ({
          id: offer._id,
          columns: [
            i + 1,
            offer.maxAmount,
            offer.interestLibor,
            offer.interest2,
            offer.interest5,
            offer.interest10,
            offer.amortization,
            offer.conditions.length > 0 || offer.counterparts.length > 0 ? (
              <ConditionsButton
                conditions={offer.conditions}
                counterparts={offer.counterparts}
              />
            ) : (
              '-'
            ),
          ],
        }))}
      />
    </article>
  );
};

OffersTable.propTypes = {
  offers: PropTypes.arrayOf(PropTypes.object),
  showSpecial: PropTypes.bool.isRequired,
};

OffersTable.defaultProps = {
  offers: [],
};

export default OffersTable;
