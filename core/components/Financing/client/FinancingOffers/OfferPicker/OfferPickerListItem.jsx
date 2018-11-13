// @flow
import React from 'react';
import cx from 'classnames';

import T, { Percent } from '../../../../Translation';
import { toMoney } from '../../../../../utils/conversionFunctions';
import FinancingCalculator from '../../FinancingCalculator';
import {
  getAmortizationForStructureWithOffer,
  getInterestsForStructureWithOffer,
} from './offerPickerHelpers';
import OfferPickerListItemValue from './OfferPickerListItemValue';
import OfferPickerListItemDetail from './OfferPickerListItemDetail';

type OfferPickerListItemProps = {};

const OfferPickerListItem = (props: OfferPickerListItemProps) => {
  const { offer, selected, structure, handleClick, displayDetail } = props;
  const {
    organisation: { name, logo },
    maxAmount,
  } = offer;
  const { loanTranches } = structure;
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

      <OfferPickerListItemValue
        label={<T id="FinancingOffers.interests" />}
        value={
          hasInvalidInterestRates ? (
            <T
              id="FinancingOffers.invalidRate"
              values={{
                rate: <T id={`offer.${hasInvalidInterestRates}.short`} />,
              }}
            />
          ) : (
            <span>{toMoney(interests)} /an</span>
          )
        }
        valueProps={hasInvalidInterestRates ? { className: 'error' } : {}}
      />

      <OfferPickerListItemValue
        label={<T id="FinancingOffers.amortization" />}
        value={<span>{toMoney(amortization)} /an</span>}
      />

      <OfferPickerListItemValue
        label={<T id="offer.maxAmount" />}
        value={toMoney(maxAmount)}
      />

      {displayDetail ? (
        <OfferPickerListItemDetail offer={offer} structure={structure} />
      ) : loanTranches.length > 1 ? (
        <OfferPickerListItemValue
          label={<T id="offer.averagedInterestRate" />}
          value={<Percent value={averagedRate} />}
        />
      ) : (
        <OfferPickerListItemDetail offer={offer} structure={structure} />
      )}
    </div>
  );
};

export default OfferPickerListItem;
