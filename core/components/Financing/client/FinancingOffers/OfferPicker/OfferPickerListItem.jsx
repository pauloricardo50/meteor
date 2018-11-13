// @flow
import React from 'react';
import cx from 'classnames';

import T from '../../../../Translation';
import { toMoney } from '../../../../../utils/conversionFunctions';
import OfferPickerListItemValue from './OfferPickerListItemValue';
import OfferPickerListItemInterests from './OfferPickerListItemInterests';

type OfferPickerListItemProps = {};

const OfferPickerListItem = (props: OfferPickerListItemProps) => {
  const { offer, selected, structure, handleClick, displayDetail } = props;
  const {
    organisation: { name, logo },
    maxAmount,
    amortization,
    fees = 0,
    epotekFees = 0,
  } = offer;
  return (
    <div className={cx('card1 card-hover', { selected })} onClick={handleClick}>
      <img src={logo} alt={name} />

      {(offer.fees || offer.epotekFees) && (
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
        value={<span>{toMoney(amortization)} /an</span>}
      />

      <OfferPickerListItemInterests
        offer={offer}
        structure={structure}
        displayDetail={displayDetail}
      />
    </div>
  );
};

export default OfferPickerListItem;
