import React from 'react';
import { compose } from 'recompose';

import Calculator from '../../../../utils/Calculator';
import T from '../../../Translation';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import SingleStructureContainer from '../containers/SingleStructureContainer';

const FinancingOffersHeader = props => {
  const {
    structure: { offerId },
    offers,
    loan,
  } = props;
  if (offerId) {
    const offer = offers.find(({ _id }) => _id === offerId);
    const lender = Calculator.selectLenderForOfferId({
      loan,
      offerId: offer._id,
    });
    return (
      <>
        <div className="financing-offers-header-image offer">
          <img src={lender.organisation.logo} alt={lender.organisation.name} />
        </div>
      </>
    );
  }
  return (
    <p className="secondary offer">
      <T defaultMessage="Choisissez.." />
    </p>
  );
};
export default compose(
  FinancingDataContainer,
  SingleStructureContainer,
)(FinancingOffersHeader);
