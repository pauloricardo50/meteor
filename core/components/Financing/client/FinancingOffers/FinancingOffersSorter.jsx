// @flow
import React from 'react';

import T from 'core/components/Translation';
import Select from 'core/components/Select';
import FinancingOffersSorterContainer from './FinancingOffersSorterContainer';

type FinancingOffersSorterProps = {};

const FinancingOffersSorter = ({
  options,
  sortBy,
  setSort,
  ...props
}: FinancingOffersSorterProps) => (
  <div>
    <p>
      <T id="Financing.offerId" />
    </p>
    <Select value={sortBy} options={options} onChange={setSort} />
  </div>
);

export default FinancingOffersSorterContainer(FinancingOffersSorter);
