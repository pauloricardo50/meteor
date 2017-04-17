import PropTypes from 'prop-types';
import React, { Component } from 'react';
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

export default class LenderTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showFullTable: false,
    };

    this.handleToggleTable = this.handleToggleTable.bind(this);
  }

  handleToggleTable() {
    this.setState(prevState => ({
      showFullTable: !prevState.showFullTable,
    }));
  }

  render() {
    const offers = this.state.showFullTable
      ? getOffers(this.props)
      : getOffers(this.props).slice(0, 5);
    const saved = this.props.loanRequest.logic.lender ===
      this.props.formState.chosenLender;

    return (
      <article>
        <h2 className="text-c">Les meilleurs prêteurs</h2>
        <div className="description">
          <p>
            Voici les offres que vous avez reçues, vous pouvez modifier les valeurs en haut pour changer les résultats.
          </p>
        </div>

        {this.props.formState.chosenLender &&
          <div className="text-center" style={{ margin: '40px 0' }}>
            <RaisedButton
              label={saved ? 'Sauvegardé' : 'Sauvegarder'}
              keyboardFocused={!saved}
              primary={!saved}
              onTouchTap={() => handleSave(this.props)}
              style={{ height: 'unset' }}
              overlayStyle={{ padding: 20 }}
              icon={saved && <CheckIcon />}
            />
          </div>}

        <OfferToggle
          value={!this.props.formState.standard}
          handleToggle={(e, c) => this.props.setFormState('standard', !c)}
        />

        <table className="minimal-table">
          <colgroup>
            <col span="1" style={{ width: '8%' }} />
            <col span="1" style={{ width: '15%' }} />
            <col span="1" style={{ width: '25%' }} />
            <col span="1" style={{ width: '25%' }} />
            {!this.props.formState.standard &&
              <col span="1" style={{ width: '20%' }} />}
          </colgroup>
          <thead>
            <tr>
              <th className="l" />
              <th className="r">Montant prêté</th>
              <th className="r">Coût mensuel</th>
              <th className="l">Conditions</th>
              {!this.props.formState.standard &&
                <th className="c">Contrepartie</th>}
            </tr>
          </thead>
          <tbody>
            {offers &&
              offers.map(
                (offer, index) =>
                  offer &&
                  <tr
                    key={index}
                    onTouchTap={() => handleChoose(offer.id, this.props)}
                    className={
                      offer.id === this.props.formState.chosenLender && 'chosen'
                    }
                  >
                    <td className="l">
                      {index + 1}
                      {' '}
                      {offer.id === this.props.formState.chosenLender &&
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
                    {!this.props.formState.standard &&
                      <td className="c">
                        <RaisedButton label="Afficher" disabled />
                      </td>}
                  </tr>,
              )}
          </tbody>
        </table>

        {offers.length > 5 &&
          <div className="text-center" style={{ marginBottom: 20 }}>
            <RaisedButton
              label={this.state.showFullTable ? 'Masquer' : 'Afficher tout'}
              onTouchTap={this.handleToggleTable}
            />
          </div>}
      </article>
    );
  }
}

LenderTable.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
  formState: PropTypes.objectOf(PropTypes.any).isRequired,
  setFormState: PropTypes.func.isRequired,
};
