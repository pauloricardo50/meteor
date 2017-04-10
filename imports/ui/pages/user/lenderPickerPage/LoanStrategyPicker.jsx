import React, { Component, PropTypes } from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import RaisedButton from 'material-ui/RaisedButton';
import Scroll from 'react-scroll';

import {
  loanStrategySuccess,
  getLoanValue,
} from '/imports/js/helpers/requestFunctions';
import StrategyChoices
  from '/imports/ui/components/general/StrategyChoices.jsx';
import FinanceStrategyPicker from './FinanceStrategyPicker.jsx';

const styles = {
  callButton: {
    display: 'block',
    width: '100%',
    marginTop: 40,
    marginBottom: 80,
  },
  backButton: {
    marginBottom: 32,
  },
  article: {
    marginBottom: 40,
  },
  choice: {
    display: 'inline-block',
    padding: 20,
    minWidth: 200,
  },
  icon: {
    paddingBottom: 20,
    color: '#D8D8D8',
  },
  picker: {
    marginTop: 40,
    display: 'inline-block',
  },
  hr: {
    display: 'inline-block',
    width: '100%',
    marginTop: 40,
    marginBottom: 40,
  },
  okButton: {
    marginTop: 32,
    float: 'right',
  },
};

export default class LoanStrategyPicker extends Component {
  constructor(props) {
    super(props);

    this.strategyChosen = this.strategyChosen.bind(this);
    this.handleChoose;
  }

  handleChoose(id) {
    this.props.setFormState('loanStrategyPreset', id);
    if (id !== 'manual') {
      this.props.setFormState('loanTranches', this.getStructure(id));
    }
  }

  strategyChosen() {
    const tranches = this.props.formState.loanTranches;
    const propertyValue = this.props.loanRequest.property.value;
    const trancheSum = tranches.reduce(
      (total, tranche) => total + tranche.value,
      0,
    );

    return propertyValue === trancheSum;
  }

  getChoices() {
    return [
      {
        id: 'fixed',
        title: '100% Fixé',
        reasons: [
          'Dormez serein',
          'Profitez des taux historiquement bas',
          <span>&nbsp;</span>,
        ],
        isBest: true,
      },
      {
        id: 'fixedLibor',
        title: '20% Libor',
        reasons: [
          'Jouez le Libor',
          'Risque faible',
          "Vérifiez votre capacité d'épargne au préalable",
        ],
      },
      {
        id: 'manual',
        title: 'Mode Manuel',
        reasons: [
          'Fixez chaque tranche vous-même',
          'Choisissez la durée',
          'À vos risques et périls',
        ],
      },
    ];
  }

  getStructure(choiceId) {
    const r = this.props.loanRequest;
    const loan = getLoanValue(r);
    if (choiceId === 'fixed') {
      return [
        {
          type: 'interest10',
          value: loan,
        },
      ];
    } else if (choiceId === 'fixedLibor') {
      return [
        {
          type: 'interest10',
          value: Math.round(loan * 0.8),
        },
        {
          type: 'interestLibor',
          value: Math.round(loan * 0.2),
        },
      ];
    }

    return false;
  }

  render() {
    return (
      <section>
        <h2>3. Choisissez votre stratégie de taux</h2>

        <div className="description">
          <p>
            Il n'y a pas une seule stratégie parfaite pour structurer votre prêt, cependant,
            nous pouvons vous aiguiller dans la bonne direction grâce à notre expertise.
            <br />
            <br />
            Sinon, utilisez notre outil interactif ci-dessous.
          </p>
        </div>

        <StrategyChoices
          currentValue={this.props.formState.loanStrategyPreset}
          choices={this.getChoices()}
          handleChoose={id => this.handleChoose(id)}
        />

        {this.props.formState.loanStrategyPreset &&
          <Scroll.Element name="myStrategy">
            <FinanceStrategyPicker
              loanTranches={this.props.formState.loanTranches}
              setFormState={this.props.setFormState}
              loanRequest={this.props.loanRequest}
              style={styles.picker}
              manual={this.props.formState.loanStrategyPreset === 'manual'}
            />
          </Scroll.Element>}

        {/* {this.strategyChosen() && <hr style={styles.hr} />}
        {this.strategyChosen() && <LenderPicker loanRequest={this.props.loanRequest} />} */}

      </section>
    );
  }
}

LoanStrategyPicker.propTypes = {
  formState: React.PropTypes.objectOf(React.PropTypes.any).isRequired,
  setFormState: React.PropTypes.func.isRequired,
};
