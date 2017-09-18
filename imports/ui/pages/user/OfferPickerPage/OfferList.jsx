import React from 'react';
import PropTypes from 'prop-types';

import { extractOffers } from '/imports/js/helpers/offerFunctions';
import cleanMethod from '/imports/api/cleanMethods';
import Offer from './Offer';

const handleSave = (id, type, loanRequest) => {
  cleanMethod(
    'updateRequest',
    {
      'logic.lender.offerId': id,
      'logic.lender.type': id ? type : undefined,
    },
    loanRequest._id,
  );
};

const OfferList = ({ loanRequest, offers, disabled }) => {
  const filteredOffers = extractOffers(offers);
  const lender = loanRequest.logic.lender;

  return (
    <div className="flex-col" style={{ width: '100%' }}>
      {filteredOffers.map(offer => (
        <Offer
          loanRequest={loanRequest}
          offer={offer}
          key={offer.uid}
          handleSave={(id, type) => handleSave(id, type, loanRequest)}
          chosen={lender.offerId === offer.id && lender.type === offer.type}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

OfferList.propTypes = {};

export default OfferList;
