// @flow
import React from 'react';
import cx from 'classnames';

import T, { Percent } from '../../../../Translation';
import { toMoney } from '../../../../../utils/conversionFunctions';
import FinancingCalculator from '../../FinancingCalculator';

type OfferPickerListItemProps = {};

const OfferPickerListItem = ({
  offer,
  selected,
  structure: { loanTranches },
  handleClick,
}: OfferPickerListItemProps) => {
  const {
    _id,
    organisation: { name, logo },
    amortization,
    maxAmount,
  } = offer;
  const averagedRate = FinancingCalculator.getAveragedInterestRate({
    tranches: loanTranches,
    rates: offer,
  });
  return (
    <div className={cx({ selected })} onClick={handleClick}>
      <img src={logo} alt={name} />

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
