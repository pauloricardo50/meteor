import PropTypes from 'prop-types';
import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import CheckIcon from 'material-ui/svg-icons/navigation/check';

import { getMonthlyWithOffer } from '/imports/js/helpers/requestFunctions';
import { toMoney } from '/imports/js/helpers/conversionFunctions';
import cleanMethod from '/imports/api/cleanMethods';

import OfferToggle from '/imports/ui/components/general/OfferToggle.jsx';
import ConditionsButton from '/imports/ui/components/general/ConditionsButton.jsx';

const styles = {
  tableDiv: {
    overflowX: 'scroll',
    width: '100%',
  },
};

const getOffers = props => {
  const newOffers = props.offers.map(offer => {
    let rates = [];
    let amortization = 0;
    if (props.formState.standard) {
      rates = offer.standardOffer;
      amortization = offer.standardOffer.amortization;
    } else {
      rates = offer.counterpartOffer;
      amortization = offer.counterpartOffer.amortization;
    }
    const monthly = getMonthlyWithOffer(
      props.loanRequest,
      props.formState.fortuneUsed,
      props.formState.insuranceFortuneUsed,
      props.formState.loanTranches,
      rates,
      amortization,
    );

    return {
      _id: offer._id,
      maxAmount: props.formState.standard
        ? offer.standardOffer.maxAmount
        : offer.counterpartOffer.maxAmount,
      monthly,
      conditions: offer.conditions,
      counterparts: props.formState.standard ? [] : offer.counterparts,
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

  object['logic.insuranceUsePreset'] = props.formState.insuranceUsePreset;
  object['logic.amortizationStrategyPreset'] = props.formState.amortizationStrategyPreset;
  object['logic.loanStrategyPreset'] = props.formState.loanStrategyPreset;
  object['general.loanTranches'] = props.formState.loanTranches;
  object['logic.lender.offerId'] = props.formState.chosenLender;

  cleanMethod('updateRequest', object, props.loanRequest._id);
};

export default class LenderTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showFullTable: false,
    };
  }

  handleToggleTable = () => {
    this.setState(prevState => ({
      showFullTable: !prevState.showFullTable,
    }));
  };

  render() {
    const offers = getOffers(this.props);
    const shownOffers = this.state.showFullTable ? offers : offers.slice(0, 5);
    const saved = this.props.loanRequest.logic.lender.offerId === this.props.formState.chosenLender;

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

        <div style={styles.tableDiv}>
          <table className="minimal-table">
            <colgroup>
              <col span="1" style={{ width: 70 }} />
              <col span="1" style={{ minWidth: 100 }} />
              <col span="1" style={{ minWidth: 100 }} />
              <col span="1" style={{ minWidth: 150 }} />
            </colgroup>
            <thead>
              <tr>
                <th className="l" />
                <th className="r">Montant prêté</th>
                <th className="r">Coût mensuel</th>
                <th className="c">Conditions</th>
              </tr>
            </thead>
            <tbody>
              {shownOffers &&
                shownOffers.length > 0 &&
                shownOffers.map(
                  (offer, index) =>
                    offer &&
                    <tr
                      key={offer._id}
                      onTouchTap={() => handleChoose(offer._id, this.props)}
                      className={
                        offer._id === this.props.formState.chosenLender ? 'chosen' : 'choose'
                      }
                    >
                      <td className="l">
                        {index + 1}
                        {' '}
                        {offer._id === this.props.formState.chosenLender &&
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
                      <td className="c">
                        {offer.conditions.length > 0 || offer.counterparts.length > 0
                          ? <ConditionsButton
                            conditions={offer.conditions}
                            counterparts={offer.counterparts}
                          />
                          : '-'}
                      </td>
                    </tr>,
                )}
            </tbody>
          </table>
        </div>

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
