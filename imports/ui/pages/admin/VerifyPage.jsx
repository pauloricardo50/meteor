import React, { PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

const VerifyPage = props => {
  if (props.loanRequest.logic.verification.requested !== true) {
    <div className="text-center"><h1>Ce client n'a pas demandé de vérification</h1></div>;
  }
  return (
    <div>
      <section className="mask1">
        <h1>Vérifier un dossier</h1>
        <div className="text-center"><RaisedButton label="Télécharger dossier" primary /></div>
      </section>
    </div>
  );
};

VerifyPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default VerifyPage;
