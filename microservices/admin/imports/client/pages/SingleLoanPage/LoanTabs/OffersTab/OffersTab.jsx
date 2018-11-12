import React from 'react';

import T from 'core/components/Translation';

import OfferList from 'core/components/OfferList';
import OfferAdder from 'core/components/OfferAdder';
import Toggle from 'core/components/Material/Toggle';
import { loanUpdate } from 'core/api';

const makeToggleOffers = loanId => (event, checked) =>
  loanUpdate.run({ loanId, object: { enableOffers: checked } });

const OffersTab = (props) => {
  const {
    loan: { _id: loanId, offers, enableOffers },
  } = props;
  return (
    <div className="offers-tab">
      <h2>
        <T id="collections.offers" />
      </h2>
      <div className="flex">
        <Toggle
          labelTop={<T id="Forms.enableOffers" />}
          labelLeft={<T id="general.no" />}
          labelRight={<T id="general.yes" />}
          toggled={enableOffers}
          onToggle={makeToggleOffers(loanId)}
        />
        <p className="description" style={{ marginLeft: 16 }}>
          Affiche les offres dans les plans financiers, switch des taux publics
          aux taux des offres reçues, et active le choix des tranches taux et du
          type d'amortissement.
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
