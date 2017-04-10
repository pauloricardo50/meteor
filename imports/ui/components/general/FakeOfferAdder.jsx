import React, { PropTypes } from 'react';
import { insertFakeOffer } from '/imports/api/offers/methods';

import RaisedButton from 'material-ui/RaisedButton';

import { getRandomOffer } from '/imports/js/helpers/random-generators';

const addFakeOffer = request => {
  const object = getRandomOffer(request);
  insertFakeOffer.call({ object });
};

const FakeOfferAdder = props => {
  return (
    <div className="text-center" style={{ marginBottom: 40 }}>
      <RaisedButton
        label="Ajouter offre imaginaire"
        primary
        onTouchTap={() => addFakeOffer(props.loanRequest)}
      />
    </div>
  );
};

FakeOfferAdder.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FakeOfferAdder;
