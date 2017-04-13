import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import RaisedButton from 'material-ui/RaisedButton';
import CheckIcon from 'material-ui/svg-icons/navigation/check';

import { getMonthlyWithOffer } from '/imports/js/helpers/requestFunctions';
import { toMoney } from '/imports/js/helpers/conversionFunctions';
import cleanMethod from '/imports/api/cleanMethods';

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
      id: offer._id,
      maxAmount: props.formState.standard
        ? offer.standardOffer.maxAmount
        : offer.conditionsOffer.maxAmount,
      monthly,
      conditions: offer.conditions,
      counterpart: offer.counterpart,
    };
  });

  // Sort them by monthly cost
  newOffers.sort((a, b) => a.monthly - b.monthly);

  return newOffers;
};

const handleChoose = (id, props) => {
  if (props.formState.chosenLender === id) {
    props.setFormState('chosenLender', '');
  } else {
    props.setFormState('chosenLender', id);
  }
};

const handleSave = props => {
  const object = {};

  object['general.fortuneUsed'] = props.formState.fortuneUsed;
  object['general.insuranceFortuneUsed'] = props.formState.insuranceFortuneUsed;
  object['logic.amortizingStrategyPreset'] = props.formState.amortizing;
  object['logic.loanStrategyPreset'] = props.formState.loanStrategyPreset;
  object['general.loanTranches'] = props.formState.loanTranches;
  object['logic.lender'] = props.formState.chosenLender;

  cleanMethod('updateRequest', object, props.loanRequest._id, () =>
    Meteor.setTimeout(() => props.history.push('/app'), 300));
};

const LenderTable = props => {
  const offers = getOffers(props);
  const saved = props.loanRequest.logic.lender === props.formState.chosenLender;

  return (
    <article>
      <h2 className="text-c">Les meilleurs prêteurs</h2>
      <div className="description">
        <p>
          Voici les offres que vous avez reçues, vous pouvez modifier les valeurs en haut pour changer les résultats.
        </p>
      </div>

      {props.formState.chosenLender &&
        <div className="text-center" style={{ margin: '40px 0' }}>
          <RaisedButton
            label={saved ? 'Sauvegardé' : 'Sauvegarder'}
            keyboardFocused={!saved}
            primary={!saved}
            onTouchTap={() => handleSave(props)}
            style={{ height: 'unset' }}
            overlayStyle={{ padding: 20 }}
            icon={saved && <CheckIcon />}
          />
        </div>}

      <OfferToggle
        value={!props.formState.standard}
        handleToggle={(e, c) => props.setFormState('standard', !c)}
      />

      <table className="minimal-table">
        <colgroup>
          <col span="1" style={{ width: '8%' }} />
          <col span="1" style={{ width: '15%' }} />
          <col span="1" style={{ width: '25%' }} />
          <col span="1" style={{ width: '25%' }} />
          {!props.formState.standard &&
            <col span="1" style={{ width: '20%' }} />}
        </colgroup>
        <thead>
          <tr>
            <th className="l" />
            <th className="r">Montant prêté</th>
            <th className="r">Coût mensuel</th>
            <th className="l">Conditions</th>
            {!props.formState.standard && <th className="c">Contrepartie</th>}
          </tr>
        </thead>
        <tbody>
          {offers &&
            offers.map(
              (offer, index) =>
                offer &&
                <tr
                  key={index}
                  onTouchTap={() => handleChoose(offer.id, props)}
                  className={
                    offer.id === props.formState.chosenLender && 'chosen'
                  }
                >
                  <td className="l">
                    {index + 1}
                    {' '}
                    {offer.id === props.formState.chosenLender &&
                      <span className="fa fa-check" />}
                  </td>
                  <td className="r">
                    CHF {toMoney(Math.round(offer.maxAmount))}
                  </td>
                  <td className="r">
                    <h3 className="fixed-size" style={{ margin: 0 }}>
                      CHF {toMoney(offer.monthly)} <small>/mois</small>
                    </h3>
                  </td>
                  <td className="l">
                    {offer.conditions || ''}
                  </td>
                  {!props.formState.standard &&
                    <td className="c">
                      <RaisedButton label="Afficher" disabled />
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
