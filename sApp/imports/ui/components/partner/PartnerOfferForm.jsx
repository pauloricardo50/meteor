import PropTypes from 'prop-types';
import React from 'react';

import OfferForm from '/imports/ui/components/admin/OfferForm';

const handleSubmit = history => {
  history.push('/partner');
};

const PartnerOfferForm = props => {
  return (
    <div>
      <h1>Faire une offre</h1>
      <OfferForm
        {...props}
        method="insertOffer"
        callback={() => props.history.push('/partner')}
        handleCancel={() => props.history.push('/partner')}
      />
    </div>
  );
};

PartnerOfferForm.propTypes = {};

PartnerOfferForm.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default PartnerOfferForm;
