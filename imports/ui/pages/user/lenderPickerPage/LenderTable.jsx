import React, { PropTypes } from 'react';

import { getMonthlyWithOffer } from '/imports/js/helpers/requestFunctions';

import OfferToggle from '/imports/ui/components/general/OfferToggle.jsx';

const getOffers = props => {
  props.offers.map(offer => {
    const rates = offer.standardOffer;
    const amortizing = offer.standardOffer.amortizing;
    const monthly = getMonthlyWithOffer(
      props.loanRequest,
      props.formState.fortuneUsed,
      props.formState.insuranceFortuneUsed,
      props.formState.loanTranches,
      rates,
      amortizing,
    );

    return {
      ...offer,
      monthly,
    };
  });
};
const LenderTable = props => {
  const offers = getOffers(props);
  return (
    <article>
      <h2 className="text-center">Les meilleurs prêteurs</h2>
      <div className="description">
        <p>
          Voici les offres que vous avez reçues, classées par le coût mensuel que ça représentera
        </p>
      </div>

      <OfferToggle
        value={!props.formState.standard}
        handleToggle={(e, c) => props.setFormState('standard', !c)}
      />
    </article>
  );
};

LenderTable.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
  formState: PropTypes.objectOf(PropTypes.any).isRequired,
  setFormState: PropTypes.func.isRequired,
};

export default LenderTable;
