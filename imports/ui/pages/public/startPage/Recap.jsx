import React, { Component, PropTypes } from 'react';

import { toMoney } from '/imports/js/helpers/conversionFunctions';
import constants from '/imports/js/config/constants';

const getIncome = s =>
  [
    s.propertyRent * 12,
    s.income1,
    s.income2,
    s.bonus11,
    s.bonus12,
    s.bonus21,
    s.bonus22,
    s.bonus31,
    s.bonus32,
    s.bonus41,
    s.bonus42,
    ...(s.otherIncomeArray ? s.otherIncomeArray.map(i => i.value * 12) : []),
  ].reduce((tot, val) => (val > 0 && tot + val) || tot, 0);

const getFortune = s =>
  [s.fortune1, s.fortune2, s.insurance11, s.insurance12].reduce(
    (tot, val) => (val > 0 && tot + val) || tot,
    0,
  );

const getMaxBorrow = s => {
  if (!s.knowsProperty) {
    return Math.round(
      Math.min(
        getFortune(s) / 0.2,
        getIncome(s) / (3 * (constants.maintenance + 0.8 * constants.loanCost)),
      ) / 1000,
    ) * 1000;
  }
  return null;
};

const getMonthlyCost = s => {
  return null;
};

export default class Recap extends Component {
  getValues() {
    const s = this.props.formState;
    const arr = [
      getIncome(s),
      getFortune(s),
      getMaxBorrow(s),
      getMonthlyCost(s),
    ];

    return arr;
  }

  render() {
    const labels = [
      'Revenu total',
      'Fonds propres totaux',
      "Capacité d'achat",
      'Coût mensuel estimé',
    ];

    // Make sure one of the values is above 0
    if (this.getValues().reduce((tot, v) => tot || v > 0)) {
      return (
        <div className="mask1 recap animated fadeIn">
          {this.getValues().map(
            (value, i) => value > 0 &&
            <div>
              <h5>{labels[i]}</h5>
              <h4 className="secondary">CHF {toMoney(value)}</h4>
            </div>,
          )}
        </div>
      );
    }

    return null;
  }
}

Recap.defaultProps = {
  formState: {},
};

Recap.propTypes = {
  formState: PropTypes.objectOf(PropTypes.any),
};
