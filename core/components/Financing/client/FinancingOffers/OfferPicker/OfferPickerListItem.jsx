import React from 'react';
import cx from 'classnames';
import { toClass } from 'recompose';

import Calculator from '../../../../../utils/Calculator';
import { toMoney } from '../../../../../utils/conversionFunctions';
import CounterpartsOfferIcon from '../../../../CounterpartsOfferIcon';
import T from '../../../../Translation';
import OfferPickerListItemInterests from './OfferPickerListItemInterests';
import OfferPickerListItemValue from './OfferPickerListItemValue';

const OfferPickerListItem = props => {
  const {
    offer,
    loan,
    selected,
    structure,
    handleClick,
    displayDetail,
  } = props;
  const {
    _id: offerId,
    maxAmount,
    amortization,
    fees = 0,
    epotekFees = 0,
    withCounterparts,
  } = offer;
  const {
    organisation: { name, logo },
  } = Calculator.selectLenderForOfferId({ loan, offerId });

  return (
    <div
      className={cx('offer-picker-list-item card1 card-hover', { selected })}
      onClick={handleClick}
    >
      {withCounterparts && <CounterpartsOfferIcon />}
      <img src={logo} alt={name} />

      {!!(offer.fees || offer.epotekFees) && (
        <OfferPickerListItemValue
          label={<T id="FinancingOffers.fees" />}
          value={<span>{toMoney(fees + epotekFees)}</span>}
        />
      )}

      <OfferPickerListItemValue
        label={<T id="Forms.maxAmount" />}
        value={toMoney(maxAmount)}
      />

      <OfferPickerListItemValue
        label={<T id="FinancingOffers.amortization" />}
        value={
          <span>
            {toMoney(amortization)} <T id="general.perMonth" />
          </span>
        }
      />

      <OfferPickerListItemInterests
        offer={offer}
        structure={structure}
        displayDetail={displayDetail}
      />
    </div>
  );
};

// toClass necessary for react-flip-move
export default toClass(OfferPickerListItem);
