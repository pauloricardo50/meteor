// @flow
import React from 'react';

import T from 'core/components/Translation';

import FinancingSection from '../FinancingSection';
import FinancingOffersHeader from './FinancingOffersHeader';
import OfferPicker from './OfferPicker';
import FinancingOffersSorter from './FinancingOffersSorter';
import FinancingOffersContainer from './FinancingOffersContainer';

type FinancingOffersProps = {};

const FinancingOffers = (props: FinancingOffersProps) => (
  <FinancingSection
    summaryConfig={[
      {
        id: 'offer',
        label: (
          <span className="section-title">
            <T id="FinancingOffers.title" />
          </span>
        ),
        Component: FinancingOffersHeader,
      },
    ]}
    detailConfig={[
      {
        id: 'offerId',
        label: <FinancingOffersSorter />,
        Component: OfferPicker,
      },
    ]}
    noWrapper
    className="financing-offers"
  />
);

export default FinancingOffersContainer(FinancingOffers);
