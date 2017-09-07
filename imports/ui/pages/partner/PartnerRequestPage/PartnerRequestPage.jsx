import PropTypes from 'prop-types';
import React from 'react';

import Button from '/imports/ui/components/general/Button.jsx';

import RequestDetails from '/imports/ui/components/partner/RequestDetails.jsx';
import PartnerOfferForm from '/imports/ui/components/partner/PartnerOfferForm.jsx';

const styles = {
  section: {
    maxWidth: 1200,
    margin: 'auto',
  },
  back: {
    margin: 20,
  },
};

const PartnerRequestPage = (props) => {
  if (props.loanRequest) {
    return (
      <section>
        <div className="form-group">
          <Button
            raised
            icon={<span className="fa fa-angle-left" />}
            label="Retour"
            href="/partner"
            className="animated slideInLeft"
          />
        </div>
        <div className="mask1" style={styles.section}>
          <RequestDetails {...props} />
          <PartnerOfferForm loanRequest={props.loanRequest} />
        </div>
      </section>
    );
  }

  return (
    <section className="text-center">
      <h1>
        Il semblerait qu'il y ait eu une erreur.
        <br />
        Soit cette demande de prêt n'existe pas, soit vous n'êtes pas autorisé à
        la voir.
      </h1>
      <Button raised label="Retour" href="/partner" style={styles.back} />
    </section>
  );
};

PartnerRequestPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default PartnerRequestPage;
