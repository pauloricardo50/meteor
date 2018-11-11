// @flow
import React from 'react';

import T from 'core/components/Translation';
import FinancingSection from '../FinancingSection';
import FinancingOffersHeader from './FinancingOffersHeader';
import OfferPicker from './OfferPicker';

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
        id: 'offerPicker',
        Component: OfferPicker,
      },
    ]}
  />
);

export default FinancingOffers;
