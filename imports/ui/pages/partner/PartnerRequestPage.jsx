import PropTypes from 'prop-types';
import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import RequestDetails from '/imports/ui/components/partner/RequestDetails.jsx';
import PartnerOfferForm
  from '/imports/ui/components/partner/PartnerOfferForm.jsx';

const styles = {
  section: {
    maxWidth: 1200,
    margin: 'auto',
  },
  back: {
    margin: 20,
  },
};

const PartnerRequestPage = props => {
  if (props.loanRequest) {
    return (
      <div>
        <div className="form-group">
          <RaisedButton
            icon={<span className="fa fa-angle-left" />}
            label="Retour"
            href="/partner"
            className="animated slideInLeft"
          />
        </div>
        <section className="mask1" style={styles.section}>
          <RequestDetails loanRequest={props.loanRequest} />
          <PartnerOfferForm loanRequest={props.loanRequest} />
        </section>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1>
        Il semblerait qu'il y ait eu une erreur.
        <br />
        Soit cette demande de prêt n'existe pas, soit vous n'êtes pas autorisé à la voir.
      </h1>
      <RaisedButton label="Retour" href="/partner" style={styles.back} />
    </div>
  );
};

PartnerRequestPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default PartnerRequestPage;
