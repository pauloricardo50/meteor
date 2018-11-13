// @flow
import React from 'react';
import cx from 'classnames';

import T, { Percent } from '../../../../Translation';
import { toMoney } from '../../../../../utils/conversionFunctions';
import FinancingCalculator from '../../FinancingCalculator';
import {
  getAmortizationForStructureWithOffer,
  getInterestsForStructureWithOffer,
  getMonthlyForStructureWithOffer,
} from './offerPickerHelpers';

type OfferPickerListItemProps = {};

const OfferPickerListItem = (props: OfferPickerListItemProps) => {
  const {
    offer,
    selected,
    structure: { loanTranches },
    handleClick,
  } = props;
  const {
    organisation: { name, logo },
    maxAmount,
  } = offer;
  const hasInvalidInterestRates = FinancingCalculator.checkInterestsAndTranches({
    interestRates: offer,
    tranches: loanTranches,
  });
  const amortization = getAmortizationForStructureWithOffer(props) * 12;
  const interests = getInterestsForStructureWithOffer(props) * 12;
  const averagedRate = FinancingCalculator.getAveragedInterestRate({
    tranches: loanTranches,
    rates: offer,
  });
  return (
    <div className={cx({ selected })} onClick={handleClick}>
      <img src={logo} alt={name} />

      <p className="secondary">
        <T id="FinancingOffers.interests" />
      </p>
      {hasInvalidInterestRates ? (
        <p className="error">
          <T
            id="FinancingOffers.invalidRate"
            values={{
              rate: <T id={`offer.${hasInvalidInterestRates}.short`} />,
            }}
          />
        </p>
      ) : (
        <h5>{toMoney(interests)} /an</h5>
      )}

      <p className="secondary">
        <T id="FinancingOffers.amortization" />
      </p>
      <h5>{toMoney(amortization)} /an</h5>

      <p className="secondary">
        <T id="offer.maxAmount" />
      </p>
      <h5>{toMoney(maxAmount)}</h5>

      <p className="secondary">
        <T id="offer.interests" />
      </p>
      <h5>
        <Percent value={averagedRate} />
      </h5>
    </div>
  );
};

export default OfferPickerListItem;
