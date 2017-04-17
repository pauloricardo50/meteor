import React, { PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

const VerificationPage = props => {
  return (
    <section className="mask1">
      <h1>Faites la vérification</h1>
      <div className="description">
        <p>
          Votre dossier va être analysé en détail par les professionels d'e-Potek, et vous conseiller pour préparer la meilleur demande possible.
        </p>
      </div>

      <div className="text-center" style={{ margin: '40px 0' }}>
        <RaisedButton label="Envoyer mon dossier" primary />
      </div>
    </section>
  );
};

VerificationPage.propTypes = {};

export default VerificationPage;
