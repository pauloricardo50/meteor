// @flow
import React from 'react';

type LendersActivationProps = {};

const LendersActivation = ({
  loan: { enableOffers },
}: LendersActivationProps) => (
  <div className="flex">
    <span>
      Offres{' '}
      {enableOffers ? (
        <span className="success">Activées</span>
      ) : (
        <span className="error">Désactivées</span>
      )}
    </span>
    <p className="description" style={{ marginLeft: 16, marginTop: 0 }}>
      <b>
        Les offres sont activées dès que l'étape du dossier est "Identification
        du prêteur"
      </b>
      <br />
      Affiche les offres dans les plans financiers, switch des taux publics aux
      taux des offres reçues sur le dashboard, et active le choix des tranches
      de taux et du type d'amortissement.
    </p>
  </div>
);

export default LendersActivation;
