import PropTypes from 'prop-types';
import React from 'react';
import { insertFakeOffer } from '/imports/api/offers/methods';

import RaisedButton from 'material-ui/RaisedButton';

import { getRandomOffer } from '/imports/js/helpers/random-generators';

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
      <RaisedButton
        label="Ajouter 20 offres imaginaires"
        onTouchTap={() => addLotsOfFakeOffers(props.loanRequest)}
        style={{ margin: 8 }}
      />
      <RaisedButton
        label="Ajouter offre imaginaire"
        onTouchTap={() => addFakeOffer(props.loanRequest)}
        style={{ margin: 8 }}
      />
    </div>
  );
};

FakeOfferAdder.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FakeOfferAdder;
