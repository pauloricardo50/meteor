import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Button from '/imports/ui/components/general/Button.jsx';

import { toMoney } from '/imports/js/helpers/conversionFunctions';
import { getLoanValue } from '/imports/js/helpers/requestFunctions';

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

const getRemainingTypes = (props, ignoredValue) => {
  const initialChoices = [
    'interestLibor',
    'interest1',
    'interest2',
    'interest5',
    'interest10',
    'interest15',
  ];

  // Filter out existing values, for each remove the string if there is a match
  props.loanTranches.forEach((t) => {
    // If the value is different from the one we're currently running this from
    if (t.type !== ignoredValue) {
      const index = initialChoices.indexOf(t.type);
      if (index > -1) {
        initialChoices.splice(index, 1);
      }
    }
  });

  return initialChoices;
};

const getMoneyLeft = (props) => {
  let loan = getLoanValue(props.loanRequest);

  // Substract the values of each tranche
  props.loanTranches.forEach((tranche) => {
    loan -= tranche.value;
  });

  return loan;
};

const addTranche = (props) => {
  const newTranche = {
    type: getRemainingTypes(props)[0],
    value: getMoneyLeft(props) > 100000 ? 100000 : getMoneyLeft(props),
  };

  props.setFormState('loanTranches', [...props.loanTranches, newTranche]);
};

const removeTranche = (props, event, i) => {
  const tranches = [...props.loanTranches].splice(i, 1);
  props.setFormState('loanTranches', tranches);
};

const incrementTranche = (props, event, i) => {
  const tranches = [...props.loanTranches];
  const moneyLeft = getMoneyLeft(props);

  if (moneyLeft > 10000) {
    tranches[i].value += 10000;
  } else {
    tranches[i].value += moneyLeft;
  }

  props.setFormState('loanTranches', tranches);
};

const decrementTranche = (props, event, i) => {
  const tranches = [...props.loanTranches];

  if (tranches[i].value > 110000) {
    // Remove 10'000, or the remaining value until the next 10'000
    tranches[i].value -=
      tranches[i].value % 10000 === 0 ? 10000 : tranches[i].value % 10000;
  } else if (tranches[i].type === 'interestLibor') {
    // If this is the libor tranche, reduce it until it's 10'000, below that, set it to 0
    if (tranches[i].value > 10000) {
      tranches[i].value -=
        tranches[i].value % 10000 === 0 ? 10000 : tranches[i].value % 10000;
    } else {
      tranches[i].value = 0;
    }
  } else {
    // Set it to 100'000 straight
    tranches[i].value = 100000;
  }

  props.setFormState('loanTranches', tranches);
};

const changeTrancheType = (props, i, newType) => {
  const tranches = [...props.loanTranches];
  tranches[i].type = newType;
  props.setFormState('loanTranches', tranches);
};

const FinanceStrategyPicker = (props) => {
  const loan = getLoanValue(props.loanRequest);
  const moneyLeft = getMoneyLeft(props);
  const tranchesArray = [];

  props.loanTranches.forEach((tranche, index) => {
    tranchesArray.push(
      <LoanTranche
        key={index}
        index={index}
        tranche={tranche}
        totalValue={loan}
        moneyLeft={moneyLeft}
        getRemainingTypes={ignored => getRemainingTypes(props, ignored)}
        removeTranche={e => removeTranche(props, e, index)}
        incrementTranche={e => incrementTranche(props, e, index)}
        decrementTranche={e => decrementTranche(props, e, index)}
        changeTrancheType={value => changeTrancheType(props, index, value)}
        manual={props.manual}
      />,
    );
  });

  return (
    <article>
      {props.manual &&
        <div>
          <h4>
            Argent restant à distribuer&nbsp;
            {moneyLeft <= 0 &&
              <span className="fa fa-check success" style={styles.check} />}
          </h4>
          <div className="trancheBar">
            <div
              className="bar main"
              style={{
                width: `${100 * (moneyLeft / loan)}%`,
              }}
            />
            <div className="money">
              <h4 className="center-adjust">
                <span className="text-span">
                  CHF {toMoney(moneyLeft)}
                </span>
              </h4>
            </div>
          </div>

          <hr style={styles.hr} />

          <div className="text-center">
            <h3>
              Je veux diviser mon prêt en {props.loanTranches.length}{' '}
              tranche(s).
            </h3>
            <Button
              raised
              label="Ajouter une Tranche"
              onTouchTap={() => addTranche(props)}
              primary
              style={styles.button}
              disabled={moneyLeft < 100000}
            />
          </div>
        </div>}

      {!props.manual &&
        <div className="text-center">
          <h3>Votre Structure de financement</h3>
        </div>}

      {tranchesArray}
    </article>
  );
};

FinanceStrategyPicker.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  loanTranches: PropTypes.arrayOf(PropTypes.any),
  setFormState: PropTypes.func.isRequired,
  manual: PropTypes.bool,
};

FinanceStrategyPicker.defaultProps = {
  manual: false,
  loanTranches: [],
};

export default FinanceStrategyPicker;
