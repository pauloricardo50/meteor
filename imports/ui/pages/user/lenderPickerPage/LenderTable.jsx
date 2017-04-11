import React, { PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import { getMonthlyWithOffer } from '/imports/js/helpers/requestFunctions';
import { toMoney } from '/imports/js/helpers/conversionFunctions';

import OfferToggle from '/imports/ui/components/general/OfferToggle.jsx';

const getOffers = props => {
  const newOffers = props.offers.map(offer => {
    let rates = [];
    let amortizing = 0;
    if (props.formState.standard) {
      rates = offer.standardOffer;
      amortizing = offer.standardOffer.amortizing;
    } else {
      rates = offer.conditionsOffer;
      amortizing = offer.conditionsOffer.amortizing;
    }
    const monthly = getMonthlyWithOffer(
      props.loanRequest,
      props.formState.fortuneUsed,
      props.formState.insuranceFortuneUsed,
      props.formState.loanTranches,
      rates,
      amortizing,
    );

    return {
      maxAmount: props.formState.standard
        ? offer.standardOffer.maxAmount
        : offer.conditionsOffer.maxAmount,
      monthly,
      conditions: offer.conditions,
      counterpart: offer.counterpart,
    };
  });

  // Sort them by monthly cost
  newOffers.sort((a, b) => a.monthly < b.monthly);

  return newOffers;
};

const LenderTable = props => {
  const offers = getOffers(props);
  console.log(offers);
  return (
    <article>
      <h2 className="text-center">Les meilleurs prêteurs</h2>
      <div className="description">
        <p>
          Voici les offres que vous avez reçues, vous pouvez modifier les valeurs en haut pour changer les résultats.
        </p>
      </div>

      <OfferToggle
        value={!props.formState.standard}
        handleToggle={(e, c) => props.setFormState('standard', !c)}
      />

      <table className="minimal-table">
        {/* <colgroup>
          <col span="1" style={{ width: '5%' }} />
          <col span="1" style={{ width: '20%' }} />
          <col span="1" style={{ width: '12%' }} />
          <col span="1" style={{ width: '12%' }} />
          <col span="1" style={{ width: '12%' }} />
          <col span="1" style={{ width: '12%' }} />
          <col span="1" style={{ width: '12%' }} />
          <col span="1" style={{ width: '15%' }} />
        </colgroup> */}
        <thead>
          <tr>
            <th className="left-align" />
            <th className="right-align">Montant</th>
            <th className="right-align">Coût mensuel</th>
            <th className="right-align">Conditions</th>
            {!props.formState.standard &&
              <th className="right-align">Contrepartie</th>}
          </tr>
        </thead>
        <tbody>
          {offers &&
            offers.map(
              (offer, index) =>
                offer &&
                <tr key={index}>
                  <td className="left-align">{index + 1}</td>
                  <td className="right-align">
                    CHF {toMoney(Math.round(offer.maxAmount))}
                  </td>
                  <td className="right-align">
                    <h3 className="fixed-size">
                      CHF {toMoney(offer.monthly)} <small>/mois</small>
                    </h3>
                  </td>
                  <td className="right-align">
                    {offer.conditions || 'Sans Conditions'}
                  </td>
                  {!props.formState.standard &&
                    <td className="right-align">
                      {offer.counterpart
                        ? <RaisedButton label="Voir contreparties" />
                        : ''}
                    </td>}
                </tr>,
            )}
        </tbody>
      </table>
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
