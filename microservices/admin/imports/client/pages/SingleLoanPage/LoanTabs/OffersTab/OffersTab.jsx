import React from 'react';

import T from 'core/components/Translation';

import OfferList from 'core/components/OfferList';
import OfferAdder from 'core/components/OfferAdder';

const OffersTab = props => {
  const {
    loan: { _id: loanId, offers, enableOffers },
  } = props;
  return (
    <div className="offers-tab">
      <h2>
        <T id="collections.offers" />
      </h2>
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
            Les offres sont activées dès que l'étape du dossier est
            "Identification du prêteur"
          </b>
          <br />
          Affiche les offres dans les plans financiers, switch des taux publics
          aux taux des offres reçues sur le dashboard, et active le choix des
          tranches de taux et du type d'amortissement.
        </p>
      </div>
      <div className="offer-adder">
        <OfferAdder loanId={loanId} />
      </div>
      {offers && offers.length > 0 ? (
        <OfferList {...props} allowDelete />
      ) : (
        <h3 className="secondary text-center">Pas d'offres pour l'instant</h3>
      )}
    </div>
  );
};

export default OffersTab;
