//      
import React from 'react';
import cx from 'classnames';
import { toClass } from 'recompose';

import { toMoney } from '../../../../../utils/conversionFunctions';
import T from '../../../../Translation';
import CounterpartsOfferIcon from '../../../../CounterpartsOfferIcon';
import OfferPickerListItemValue from './OfferPickerListItemValue';
import OfferPickerListItemInterests from './OfferPickerListItemInterests';

                                   

const OfferPickerListItem = (props                          ) => {
  const { offer, selected, structure, handleClick, displayDetail } = props;
  const {
    organisation: { name, logo },
    maxAmount,
    amortization,
    fees = 0,
    epotekFees = 0,
    withCounterparts,
  } = offer;
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
        label={<T id="offer.maxAmount" />}
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
