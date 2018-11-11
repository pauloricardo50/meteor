// @flow
import React from 'react';
import cx from 'classnames';

import T from '../../../../Translation';
import { toMoney } from '../../../../../utils/conversionFunctions';

type OfferPickerListItemProps = {};

const OfferPickerListItem = ({
  offer: {
    _id,
    organisation: { name, logo },
    amortization,
    maxAmount,
  },
  selected,
  updateStructure,
}: OfferPickerListItemProps) => (
  <div
    className={cx({ selected })}
    onClick={() => updateStructure(selected ? '' : _id)}
  >
    <img src={logo} alt={name} />

    <p className="secondary">
      <T id="offer.amortization" />
    </p>
    <h5>{toMoney(amortization / 12)} /mois</h5>

    <p className="secondary">
      <T id="offer.maxAmount" />
    </p>
    <h5>{toMoney(maxAmount)}</h5>
  </div>
);

export default OfferPickerListItem;
