import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Calculator from '../../utils/Calculator';
import makeSort from '../../utils/sorting';
import ConditionsButton from '../ConditionsButton';
import T from '../Translation';
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

const OfferList = ({ loan }) => {
  const [sort, setSort] = useState('maxAmount');
  const [isAscending, setIsAscending] = useState(false);
  const toggleAscending = () => setIsAscending(s => !s);
  const offers = Calculator.selectOffers({ loan });

  if (offers.length === 0) {
    return <h3 className="secondary text-center">Pas encore d'offres</h3>;
  }

  const sortedOffers = sortOffers(offers, sort, isAscending);

  return (
    <div className="flex-col" style={{ width: '100%' }}>
      <OfferListSorting
        sort={sort}
        options={[
          ...getOfferValues({}).filter(({ component }) => !component),
          { key: 'createdAt' },
        ].map(({ key, id }) => ({
          id: key || id,
          label: <T id={`Forms.${key || id}`} />,
        }))}
        handleChange={setSort}
        handleChangeOrder={toggleAscending}
        isAscending={isAscending}
      />

      {sortedOffers.map(offer => (
        <Offer
          offerValues={getOfferValues(offer)}
          offer={offer}
          loan={loan}
          key={offer._id}
        />
      ))}
    </div>
  );
};

OfferList.propTypes = {
  loan: PropTypes.object.isRequired,
};

export default OfferList;
