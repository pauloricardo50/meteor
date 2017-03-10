import React, { PropTypes } from 'react';

import { toMoney } from '/imports/js/conversionFunctions';
import constants from '/imports/js/constants';

const isReady = sliderState => (
  sliderState.property.value &&
  sliderState.income.value &&
  sliderState.fortune.value
);


const getMonthly = s => (Math.max(
  ((s.property.value * constants.amortizing) +
  ((s.property.value - s.fortune.value) * constants.loanCost)) / 12,
  0,
));

const getMonthlyReal = s => (Math.max(
  ((s.property.value * constants.amortizing) +
  ((s.property.value - s.fortune.value) * constants.loanCostReal)) / 12,
  0,
));

const getLenderCount = (borrow, ratio) => {
  if (ratio > 0.38) {
    return 0;
  } else if (ratio > 1 / 3) {
    return 4;
  } else if (borrow <= 0.65) {
    return 30;
  } else if (borrow > 0.65 && borrow <= 0.9) {
    return 20;
  }

  return 0;
};


const getArray = (s, minIncome, borrow, ratio) => [
  {
    label: 'Prix d\'achat',
    value: (
      <h3>
        CHF {toMoney(Math.round(s.property.value / 1000) * 1000)}
      </h3>
    ),
  }, {
    label: 'Frais de notaire',
    value: (
      <h3>
        CHF {toMoney(Math.round((s.property.value * constants.notaryFees) / 1000) * 1000)}
      </h3>
    ),
  }, {
    label: 'Coût total du projet',
    value: (
      <h3>
        CHF {toMoney(Math.round((s.property.value * (1 + constants.notaryFees)) / 1000) * 1000)}
      </h3>
    ),
  }, {
    label: 'Emprunt possible',
    value: (
      <h3
        className={Math.round(borrow * 1000) / 1000 <= 0.8
          ? 'success'
          : (Math.round(borrow * 1000) / 1000 <= 0.9 ? 'warning' : 'error')
        }
      >
        CHF {toMoney(Math.round((borrow * s.property.value) / 1000) * 1000)}
      </h3>
    ),
  }, {
    label: '',
    value: (
      <h3
        className={Math.round(borrow * 1000) / 1000 <= 0.8
          ? 'success'
          : (Math.round(borrow * 1000) / 1000 <= 0.9 ? 'warning' : 'error')
        }
      >
        {Math.round(borrow * 1000) / 10}%
      </h3>
    ),
  }, {
    label: 'Vos revenus mensuels',
    value: (
      <h3>
        {s.income.value > 0
          ? <span>CHF {toMoney(s.income.value / 12)} <small>/mois</small></span>
          : '-'
        }
      </h3>
    ),
  }, {
    label: 'Ratio d\'endettement théorique',
    value: (
      <h3
        className={Math.round(ratio * 1000) / 1000 <= 1 / 3
          ? 'success'
          : (Math.round(ratio * 1000) / 1000 <= 0.38 ? 'warning' : 'error')
        }
      >
        {Math.round(ratio * 1000) / 10}%
      </h3>
    ),
  }, {
    label: 'Coût officiel FINMA',
    value: (
      <h3
        className={Math.round(ratio * 1000) / 1000 <= 1 / 3
          ? 'success'
          : (Math.round(ratio * 1000) / 1000 <= 0.38 ? 'warning' : 'error')
        }
      >
        {Math.round(borrow * 1000) / 1000 <= 0.8 && s.fortune.value < s.property.value
          ? <span>CHF {toMoney(getMonthly(s))} <small>/mois</small></span>
          : '-'
        }
      </h3>
    ),
  }, {
    label: 'Coût réel estimé',
    value: (
      <h3>
        {Math.round(borrow * 1000) / 1000 <= 0.8 && s.fortune.value < s.property.value
          ? <span>CHF {toMoney(getMonthlyReal(s))} <small>/mois</small></span>
          : '-'
        }
      </h3>
    ),
  }, {
    label: 'Nb. de prêteurs potentiels',
    value: (
      <h3>
        {getLenderCount(borrow, ratio)}
      </h3>
    ),
  },
];


const getResult = (s) => {
  const minIncome = Math.round(s.property.value * constants.propertyToIncome());
  const borrow = Math.max((s.property.value - s.fortune.value) / s.property.value, 0);
  const ratio = minIncome / s.income.value / 3;

  return (
    <div className="result animated fadeIn">
      {getArray(s, minIncome, borrow, ratio).map(item =>
        <div className="fixed-size">
          <h4 className="secondary">{item.label}</h4>
          {item.value}
        </div>,
      )}
    </div>
  );
};


const StartRecap = ({ sliderState }) => (
  <div className="validator">
    {isReady(sliderState)
      ? getResult(sliderState)
      : <h4 className="secondary text-center">Amusez-vous avec les valeurs</h4>
    }
  </div>
);

StartRecap.propTypes = {
  sliderState: PropTypes.objectOf(PropTypes.any),
};

export default StartRecap;
