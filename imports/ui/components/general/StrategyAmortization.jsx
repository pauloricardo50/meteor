import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import StrategyChoices from './StrategyChoices.jsx';


const styles = {
  callButton: {
    display: 'block',
    width: '100%',
    marginTop: 40,
    marginBottom: 80,
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
        <h2>
          Ma Stratégie d&apos;Amortissement
          &nbsp;
          {this.props.loanRequest.logic.amortizingStrategyPreset &&
            <span className="fa fa-check success" />
          }
        </h2>

        <div className="description">
          <p>
            Choisir comment amortir son bien immobilier peut avoir des conséquences très
            importantes pour votre futur. N&apos;hésitez pas à nous appeler pour prendre cette
            décision en toute confiance.
          </p>
        </div>

        <div className="text-center" style={styles.callButton}>
          <RaisedButton primary label="Appeler un expert" />
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
