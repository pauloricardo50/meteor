// @flow
import React from 'react';
import { compose } from 'recompose';

import T from '../../../Translation';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import OfferListDialog from './OfferListDialog';

type FinancingOffersHeaderProps = {};

const FinancingOffersHeader = (props: FinancingOffersHeaderProps) => {
  const {
    structure: { offerId },
    offers,
  } = props;
  if (offerId) {
    const offer = offers.find(({ _id }) => _id === offerId);
    return (
      <>
        <OfferListDialog offers={offers} />
        <div className="financing-offers-header-image offer">
          <img src={offer.organisation.logo} alt={offer.organisation.name} />
        </div>
      </>
    );
  }
  return (
    <p className="secondary offer">
      <OfferListDialog offers={offers} />
      <T id="FinancingOffersHeader.empty" />
    </p>
  );
};
export default compose(
  FinancingDataContainer,
  SingleStructureContainer,
)(FinancingOffersHeader);
