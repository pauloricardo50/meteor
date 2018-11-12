// @flow
import React from 'react';
import pick from 'lodash/pick';

import { lifecycle } from 'recompose';
import Dialog from '../../../../Material/Dialog';
import T, { Percent, Money } from '../../../../Translation';
import Button from '../../../../Button';
import { INTEREST_RATES } from '../../../../../api/constants';

type OfferPickerDialogProps = {};

const dialogContent = (offer, structure) => {
  const { amortization, maxAmount, conditions, organisation } = offer;
  const rates = pick(offer, Object.values(INTEREST_RATES));
  return (
    <div className="offer-picker-dialog">
      <img src={organisation.logo} alt={organisation.name} />

      {conditions.length > 0 && (
        <>
          <h3>
            <T id="offer.conditions" />
          </h3>
          <p>{conditions.join(' ')}</p>
        </>
      )}

      <h3>
        <T id="offer.amortization" />
      </h3>
      <Money value={amortization} />

      <h3>
        <T id="offer.maxAmount" />
      </h3>
      <Money value={maxAmount} />

      <h3>
        <T id="offer.interests" />
      </h3>
      <div className="rates">
        {Object.keys(rates).map(rate => (
          <span key={rate}>
            <p>{<T id={`offer.${rate}.short`} />}</p>
            <h4>
              <Percent value={rates[rate]} />
            </h4>
          </span>
        ))}
      </div>
    </div>
  );
};

const OfferPickerDialog = ({
  open,
  handleClose,
  handleSelect,
  offer,
  structure,
}: OfferPickerDialogProps) => (
  <Dialog
    open={open}
    onClose={handleClose}
    actions={[
      <Button
        label={<T id="general.close" />}
        onClick={handleClose}
        key="close"
      />,
      <Button
        raised
        primary
        label={<T id="general.choose" />}
        onClick={handleSelect}
        key="choose"
      />,
    ]}
  >
    {offer && dialogContent(offer, structure)}
  </Dialog>
);

export default lifecycle({
  componentWillReceiveProps({ offer: nextOffer }) {
    const { offer } = this.props;
    // Cache the last offer, to avoid jerky visuals in the dialog
    // Because the dialog takes 500ms to fade out, the offer first disappears
    // and then the dialog slowly fades out, which looks really bad
    if (!offer && nextOffer) {
      this.setState({ offer: nextOffer });
    }
  },
})(OfferPickerDialog);
