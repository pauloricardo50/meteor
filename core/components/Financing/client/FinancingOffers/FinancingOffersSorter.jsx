import React from 'react';

import Select from '../../../Select';
import T from '../../../Translation';
import FinancingOffersSorterContainer from './FinancingOffersSorterContainer';

const FinancingOffersSorter = ({ options, sortBy, setSort, ...props }) => (
  <div>
    <p>
      <T id="Financing.offerId" />
    </p>
    <Select value={sortBy} options={options} onChange={setSort} />
  </div>
);

export default FinancingOffersSorterContainer(FinancingOffersSorter);
