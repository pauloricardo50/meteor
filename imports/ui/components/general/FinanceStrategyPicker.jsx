import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import cleanMethod from '/imports/api/cleanMethods';

import RaisedButton from 'material-ui/RaisedButton';

import { toMoney } from '/imports/js/conversionFunctions';

import LoanTranche from './LoanTranche.jsx';


const styles = {
  button: {
    marginRight: 8,
  },
  array: {
    marginBottom: 20,
  },
  saveButton: {
    marginTop: 32,
    float: 'right',
  },
  hr: {
    width: '60%',
    margin: '40px auto',
  },
};

export default class FinanceStrategyPicker extends Component {
  constructor(props) {
    super(props);

    this.borrowAmount = this.props.loanRequest.property.value -
      this.props.loanRequest.general.fortuneUsed -
      this.props.loanRequest.general.insuranceFortuneUsed;

    this.state = {
      totalLeft: this.borrowAmount,
      tranches: this.props.loanRequest.general.loanTranches ?
        JSON.parse(JSON.stringify(this.props.loanRequest.general.loanTranches)) : [],
    };

    this.addTranche = this.addTranche.bind(this);
    this.getRemainingTypes = this.getRemainingTypes.bind(this);
    this.getMoneyLeft = this.getMoneyLeft.bind(this);
    this.removeTranche = this.removeTranche.bind(this);
    this.incrementTranche = this.incrementTranche.bind(this);
    this.decrementTranche = this.decrementTranche.bind(this);
    this.save = this.save.bind(this);
  }

  componentWillReceiveProps(n) {
    // If the user chooses a predefined strategy, update the entire component
    if (JSON.stringify(n.loanRequest.general.loanTranches) !== JSON.stringify(this.state.tranches)) {
      this.setState({
        tranches: n.loanRequest.general.loanTranches,
      });
    }
  }

  addTranche() {
    const newTranche = {
      type: this.getRemainingTypes()[0],
      value: this.getMoneyLeft() > 100000 ? 100000 : this.getMoneyLeft(),
    };

    this.setState({
      tranches: this.state.tranches.concat([newTranche]),
    });
  }

  getRemainingTypes(ignoredValue) {
    const initialChoices = [
      'interestLibor',
      'interestFloating',
      'interest1',
      'interest2',
      'interest5',
      'interest7',
      'interest10',
      'interest15',
    ];

    // Filter out existing values, for each remove the string if there is a match
    this.state.tranches.forEach((t) => {
      // If the value is different from the one we're currently running this from
      if (t.type !== ignoredValue) {
        const index = initialChoices.indexOf(t.type);
        if (index > -1) {
          initialChoices.splice(index, 1);
        }
      }
    });

    return initialChoices;
  }


  getMoneyLeft() {
    let borrowAmount = this.borrowAmount;

    // Substract the values of each tranche
    this.state.tranches.forEach((tranche) => {
      borrowAmount -= tranche.value;
    });

    return borrowAmount;
  }


  removeTranche(event, i) {
    const tranches = this.state.tranches;
    tranches.splice(i, 1);

    this.setState({ tranches });
  }

  incrementTranche(event, i) {
    const tranches = this.state.tranches;

    if (this.getMoneyLeft() > 10000) {
      tranches[i].value += 10000;
    } else {
      tranches[i].value += this.getMoneyLeft();
    }

    this.setState({ tranches });
  }

  decrementTranche(event, i) {
    const tranches = this.state.tranches;

    if (tranches[i].value > 110000) {
      // Remove 10'000, or the remaining value until the next 10'000
      tranches[i].value -= (tranches[i].value % 10000 === 0 ? 10000 : tranches[i].value % 10000);
    } else if (tranches[i].type === 'interestLibor') {
      // If this is the libor tranche, reduce it until it's 10'000, below that, set it to 0
      if (tranches[i].value > 10000) {
        tranches[i].value -= (tranches[i].value % 10000 === 0 ? 10000 : tranches[i].value % 10000);
      } else {
        tranches[i].value = 0;
      }
    } else {
      // Set it to 100'000 straight
      tranches[i].value = 100000;
    }

    this.setState({ tranches });
  }

  changeTrancheType(i, newType) {
    const tranches = this.state.tranches;
    tranches[i].type = newType;
    this.setState({ tranches });
  }

  save() {
    const id = this.props.loanRequest._id;
    const object = {};
    object['general.loanTranches'] = this.state.tranches;

    cleanMethod('update', id, object);
  }


  render() {
    const tranchesArray = [];

    this.state.tranches.forEach((tranche, index) => {
      tranchesArray.push(
        <LoanTranche
          key={index}
          index={index}
          tranche={tranche}
          totalValue={this.borrowAmount}
          moneyLeft={this.getMoneyLeft()}
          getRemainingTypes={this.getRemainingTypes}
          removeTranche={e => this.removeTranche(e, index)}
          incrementTranche={e => this.incrementTranche(e, index)}
          decrementTranche={e => this.decrementTranche(e, index)}
          changeTrancheType={value => this.changeTrancheType(index, value)}
          manual={this.props.manual}
        />,
      );
    });

    return (
      <article>

        {this.props.manual &&
          <div>
            <h4>
              Argent restant à distribuer&nbsp;
              {this.getMoneyLeft() <= 0 &&
                <span className="fa fa-check success" style={styles.check} />
              }
            </h4>
            <div className="trancheBar">
              <div
                className="bar main"
                style={{
                  width: `${100 * (this.getMoneyLeft() / this.borrowAmount)}%`,
                }}
              />
              <div className="money">
                <h4 className="center-adjust">
                  <span className="text-span">
                    CHF {toMoney(this.getMoneyLeft())}
                  </span>
                </h4>
              </div>
            </div>

            <hr style={styles.hr} />

            <div className="text-center">
              <h3>Je veux diviser mon prêt en {this.state.tranches.length} tranche(s).</h3>
              <RaisedButton
                label="Ajouter une Tranche"
                onClick={this.addTranche}
                primary
                style={styles.button}
                disabled={this.getMoneyLeft() < 100000}
              />
            </div>
          </div>
        }

        {!this.props.manual &&
          <div className="text-center"><h2>Votre Structure de financement</h2></div>
        }

        {tranchesArray}

        {this.props.manual &&
          <RaisedButton
            label="Sauvegarder"
            onClick={this.save}
            primary
            style={styles.saveButton}
            disabled={
              JSON.stringify(this.state.tranches) ===
              JSON.stringify(this.props.loanRequest.general.loanTranches)
            }
          />
        }

      </article>
    );
  }
}

FinanceStrategyPicker.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  manual: PropTypes.bool,
};

FinanceStrategyPicker.defaultProps = {
  manual: false,
};
