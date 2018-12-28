// @flow
import React from 'react';

import Skimmer from 'core/components/Skimmer';
import T, { Percent } from 'core/components/Translation';
import { toMoney } from 'core/utils/conversionFunctions';
import { INTEREST_RATES } from 'core/api/constants';

type LenderOfferProps = {};

const getData = offer =>
  [
    { id: 'maxAmount', format: toMoney },
    ...Object.values(INTEREST_RATES).map(rate => ({
      id: rate,
      format: val => <Percent value={val} />,
    })),
  ]
    .filter(({ id }) => !!offer[id])
    .map(({ id, format = x => x }) => (
      <span key={id}>
        <label htmlFor="">
          <T id={`offer.${id}`} />
        </label>
        <h4 style={{ margin: 0 }}>{format(offer[id])}</h4>
      </span>
    ));

const LenderOffer = ({ offer }: LenderOfferProps) => (
  <Skimmer className="lender-offer" data={getData(offer)} />
);

export default LenderOffer;
