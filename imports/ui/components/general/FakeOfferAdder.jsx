import PropTypes from 'prop-types';
import React from 'react';
import { insertFakeOffer } from '/imports/api/offers/methods';

import Button from '/imports/ui/components/general/Button.jsx';

import { getRandomOffer } from '/imports/api/offers/fakes';

const addFakeOffer = request => {
  const object = getRandomOffer(request);
  insertFakeOffer.call({ object });
};

const addLotsOfFakeOffers = request => {
  for (var i = 0; i < 20; i++) {
    addFakeOffer(request);
  }
};

const FakeOfferAdder = props => {
  return (
    <div className="text-center" style={{ marginBottom: 40 }}>
      <Button raised
        label="Ajouter 20 offres imaginaires"
        onClick={() => addLotsOfFakeOffers(props.loanRequest)}
        style={{ margin: 8 }}
      />
      <Button raised
        label="Ajouter offre imaginaire"
        onClick={() => addFakeOffer(props.loanRequest)}
        style={{ margin: 8 }}
      />
    </div>
  );
};

FakeOfferAdder.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FakeOfferAdder;
