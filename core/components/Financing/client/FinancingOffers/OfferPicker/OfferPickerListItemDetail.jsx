// @flow
import React from 'react';

import T, { Percent } from '../../../../Translation';
import OfferPickerListItemValue from './OfferPickerListItemValue';

type OfferPickerListItemDetailProps = {};

const OfferPickerListItemDetail = ({
  offer,
  structure: { loanTranches },
}: OfferPickerListItemDetailProps) => (
  <>
    <p className="secondary">
      <T id="offer.interests" />
    </p>
    <div className="flex wrap">
      {loanTranches.map(({ type }) => (
        <div className="flex-col single-rate" key={type}>
          <OfferPickerListItemValue
            label={<T id={`offer.${type}.short`} />}
            labelProps={{ className: '' }}
            value={<Percent value={offer[type]} />}
          />
        </div>
      ))}
    </div>
  </>
);

export default OfferPickerListItemDetail;
