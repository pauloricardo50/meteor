import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import StrategyChoices from './StrategyChoices.jsx';

const styles = {
  topText: {
    display: 'inline-block',
    padding: '40px 20px',
  },
  description: {
    lineHeight: '1.5em',
  },
  callButton: {
    display: 'block',
    width: '100%',
    marginTop: 40,
    marginBottom: 40,
  },
};

export default class StrategyAmortization extends Component {
  getChoices() {
    return [
      {
        id: 'direct',
        title: 'Amortissement Direct',
        reasons: [
          'Paiements diminuent avec les années',
          'Charge fiscale augmente',
          <span>&nbsp;</span>,
        ],
      }, {
        id: 'indirect',
        title: 'Amortissement Indirect',
        reasons: [
          'Paiements ne changent pas avec les années',
          'Charge fiscale minimale',
          'Établissement d\'un 3e pilier',
        ],
        isBest: true,
      },
    ];
  }


  render() {
    return (
      <section>
        <h1>Ma Stratégie d&apos;Amortissement</h1>

        <div
          className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3"
          style={styles.topText}
        >
          <h4 style={styles.description}>
            Choisir comment amortir son bien immobilier peut avoir des conséquences très
            importantes pour votre futur. N&apos;hésitez pas à nous appeler pour prendre cette
            décision en toute confiance.
          </h4>
          <span className="text-center" style={styles.callButton}>
            <RaisedButton primary label="Appeler un expert" />
          </span>
        </div>

        <StrategyChoices
          currentValue={this.props.loanRequest.logic.amortizingStrategyPreset}
          valueId="logic.amortizingStrategyPreset"
          choices={this.getChoices()}
          requestId={this.props.loanRequest._id}
        />

      </section>
    );
  }
}

StrategyAmortization.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any),
};
