import PropTypes from 'prop-types';
import React from 'react';
import { insertFakeOffer } from 'core/api/offers/methods';

import Button from 'core/components/Button';

import { getRandomOffer } from 'core/api/offers/fakes';

const addFakeOffer = (loan) => {
  const object = getRandomOffer(loan);
  insertFakeOffer.call({ object });
};

const addLotsOfFakeOffers = (loan) => {
  for (let i = 0; i < 20; i++) {
    addFakeOffer(loan);
  }
};

const FakeOfferAdder = props => (
  <div className="text-center" style={{ marginBottom: 40 }}>
    <Button
      raised
      label="Ajouter 20 offres imaginaires"
      onClick={() => addLotsOfFakeOffers(props.loan)}
      style={{ margin: 8 }}
    />
    <Button
      raised
      label="Ajouter offre imaginaire"
      onClick={() => addFakeOffer(props.loan)}
      style={{ margin: 8 }}
    />
  </div>
);

FakeOfferAdder.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FakeOfferAdder;
