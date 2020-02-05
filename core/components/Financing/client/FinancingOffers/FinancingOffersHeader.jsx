//
import React from 'react';
import { compose } from 'recompose';

import T from '../../../Translation';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import FinancingDataContainer from '../containers/FinancingDataContainer';

const FinancingOffersHeader = props => {
  const {
    structure: { offerId },
    offers,
  } = props;
  if (offerId) {
    const offer = offers.find(({ _id }) => _id === offerId);
    return (
      <>
        <div className="financing-offers-header-image offer">
          <img src={offer.organisation.logo} alt={offer.organisation.name} />
        </div>
      </>
    );
  }
  return (
    <p className="secondary offer">
      <T id="FinancingOffersHeader.empty" />
    </p>
  );
};
export default compose(
  FinancingDataContainer,
  SingleStructureContainer,
)(FinancingOffersHeader);
