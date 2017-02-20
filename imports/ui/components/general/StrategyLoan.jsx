import React, { Component, PropTypes } from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import RaisedButton from 'material-ui/RaisedButton';
import Scroll from 'react-scroll';

import StrategyChoices from './StrategyChoices.jsx';
import FinanceStrategyPicker from '/imports/ui/components/general/FinanceStrategyPicker.jsx';
import LenderPicker from '/imports/ui/components/general/LenderPicker.jsx';


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

export default class StrategyPage extends Component {
  constructor(props) {
    super(props);

    this.strategyChosen = this.strategyChosen.bind(this);
    this.handleChoose = this.handleChoose.bind(this);
  }


  strategyChosen() {
    const tranches = this.props.loanRequest.general.loanTranches;
    const propertyValue = this.props.loanRequest.property.value;
    const trancheSum = tranches.reduce((total, tranche) => total + tranche.value, 0);

    return propertyValue === trancheSum;
  }

  handleChoose(choiceId) {
    if (choiceId !== '') {
      // scroll to the strategyChosen
      Scroll.scroller.scrollTo('myStrategy', {
        duration: 1500,
        delay: 100,
        smooth: true,
      });

      if (choiceId !== 'manual') {
        const id = this.props.loanRequest._id;
        const object = { 'general.loanTranches': this.getStructure(choiceId) };

        cleanMethod('update', id, object);
      }
    }
  }

  getChoices() {
    return [
      {
        id: 'fixed',
        title: 'Le Fixé',
        reasons: [
          'Dormez serein',
          'Profitez des taux historiquement bas',
          <span>&nbsp;</span>,
        ],
        isBest: true,
      }, {
        id: 'fixedLibor',
        title: 'Le Fixé Risqué',
        reasons: [
          'Jouez le Libor',
          'Risque faible',
          'Vérifiez votre capacité d\'épargne au préalable',
        ],
      }, {
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
    const borrow = r.property.value - r.general.fortuneUsed - r.general.insuranceFortuneUsed;
    if (choiceId === 'fixed') {
      return [
        {
          type: 'interest10',
          value: borrow,
        },
      ];
    } else if (choiceId === 'fixedLibor') {
      return [
        {
          type: 'interest10',
          value: borrow * 0.8,
        }, {
          type: 'interestLibor',
          value: borrow * 0.2,
        },
      ];
    }

    return false;
  }

  render() {
    return (
      <section>
        <h2>Ma Stratégie de Taux</h2>

        <div className="description">
          <p>
            Il n&apos;y a pas une seule stratégie parfaite pour structurer votre prêt, cependant,
            nous pouvons vous aiguiller dans la bonne direction grâce à notre expertise.
            <br />
            <br />
            Sinon, utilisez notre outil interactif ci-dessous.
          </p>

        </div>

        <span className="text-center" style={styles.callButton}>
          <RaisedButton primary label="Appeler un expert" />
        </span>

        <StrategyChoices
          currentValue={this.props.loanRequest.logic.loanStrategyPreset}
          valueId="logic.loanStrategyPreset"
          requestId={this.props.loanRequest._id}
          choices={this.getChoices()}
          load
          handleChoose={this.handleChoose}
        />

        {this.props.loanRequest.logic.loanStrategyPreset &&
          <Scroll.Element name="myStrategy">
            <FinanceStrategyPicker
              loanRequest={this.props.loanRequest}
              style={styles.picker}
              manual={this.props.loanRequest.logic.loanStrategyPreset === 'manual'}
            />
          </Scroll.Element>
        }


        {/* {this.strategyChosen() && <hr style={styles.hr} />}
        {this.strategyChosen() && <LenderPicker loanRequest={this.props.loanRequest} />} */}

      </section>
    );
  }
}

StrategyPage.propTypes = {
  loanRequest: React.PropTypes.objectOf(React.PropTypes.any),
};
