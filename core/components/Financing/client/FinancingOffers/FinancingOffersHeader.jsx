// @flow
import React from 'react';

import T from '../../../Translation';
import SingleStructureContainer from '../containers/SingleStructureContainer';

type FinancingOffersHeaderProps = {};

const FinancingOffersHeader = (props: FinancingOffersHeaderProps) => {
  const {
    structure: { offer },
  } = props;
  console.log('FinancingOffersHeader props', props);
  if (offer && offer.organisation) {
    return (
      <div className="financing-offers-header-image offer">
        <img src={offer.organisation.logo} alt={offer.organisation.name} />
      </div>
    );
  }
  return (
    <p className="secondary offer">
      <T id="FinancingOffersHeader.empty" />
    </p>
  );
};
export default SingleStructureContainer(FinancingOffersHeader);
