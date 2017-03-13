import React, { PropTypes } from 'react';

import { toMoney } from '/imports/js/conversionFunctions';
import constants from '/imports/js/constants';

const isReady = (income, fortune, property) => (
  property &&
  income &&
  fortune
);


const getMonthly = (income, fortune, property) => (Math.max(
  ((property * constants.maintenance) +
  ((property - fortune) * constants.loanCost())) / 12,
  0,
));

const getMonthlyReal = (income, fortune, property) => (Math.max(
  ((property * constants.maintenanceReal) +
  ((property - fortune) * constants.loanCostReal())) / 12,
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


const getArray = (income, fortune, property) => {
  const borrow = Math.max((property - fortune) / property, 0);
  const ratio = getMonthly(income, fortune, property) / (income / 12);


  return [
    {
      label: 'Prix d\'achat',
      value: (
        <span>
          CHF {toMoney(Math.round(property / 1000) * 1000)}
        </span>
      ),
    }, {
      label: 'Frais de notaire',
      value: (
        <span>
          CHF {toMoney(Math.round((property * constants.notaryFees) / 1000) * 1000)}
        </span>
      ),
    }, {
      label: 'Coût total du projet',
      value: (
        <span>
          CHF {toMoney(Math.round((property * (1 + constants.notaryFees)) / 1000) * 1000)}
        </span>
      ),
      spacing: true,
    }, {
      label: 'Emprunt',
      value: <span>CHF {toMoney(Math.round((borrow * property) / 1000) * 1000)}</span>,
      props: {
        className: Math.round(borrow * 1000) / 1000 <= 0.8
          ? 'success'
          : (Math.round(borrow * 1000) / 1000 <= 0.9 ? 'warning' : 'error'),
      },
    }, {
      label: 'Ratio Emprunt/Prix d\'achat',
      value: `${Math.round(borrow * 1000) / 10}%`,
      spacing: true,
      props: {
        className: Math.round(borrow * 1000) / 1000 <= 0.8
          ? 'success'
          : (Math.round(borrow * 1000) / 1000 <= 0.9 ? 'warning' : 'error'),
      },
    }, {
      label: 'Vos revenus mensuels',
      value: income > 0
        ? <span>CHF {toMoney(income / 12)} <small>/mois</small></span>
        : '-',
    }, {
      label: 'Ratio d\'endettement FINMA',
      value: `${Math.round(ratio * 1000) / 10}%`,
      props: {
        className: Math.round(ratio * 1000) / 1000 <= 1 / 3
          ? 'success'
          : (Math.round(ratio * 1000) / 1000 <= 0.38 ? 'warning' : 'error'),
      },
    }, {
      label: 'Coût officiel FINMA',
      value: Math.round(borrow * 1000) / 1000 <= 0.8 && fortune < property
            ? <span>CHF {toMoney(getMonthly(income, fortune, property))} <small>/mois</small></span>
            : '-',
      props: {
        className: Math.round(ratio * 1000) / 1000 <= 1 / 3
          ? 'success'
          : (Math.round(ratio * 1000) / 1000 <= 0.38 ? 'warning' : 'error'),
      },
    }, {
      label: 'Coût réel estimé',
      value: Math.round(borrow * 1000) / 1000 <= 0.8 && fortune < property
            ? <span>CHF {toMoney(getMonthlyReal(income, fortune, property))} <small>/mois</small></span>
            : '-',
      spacing: true,
    }, {
      label: 'Nb. de prêteurs potentiels',
      value: getLenderCount(borrow, ratio)
    },
  ];
};


const getResult = (income, fortune, property) => (
  <div className="result animated fadeIn">
    {getArray(income, fortune, property).map(item =>
      <div className="fixed-size" style={{ marginBottom: item.spacing && 16 }} key={item.label}>
        <h4 className="secondary">{item.label}</h4>
        <h3 {...item.props}>{item.value}</h3>
      </div>,
    )}
  </div>
);


const StartRecap = ({ income, fortune, property, noPlaceholder }) => (
  <article className="validator">
    {isReady(income, fortune, property)
      ? getResult(income, fortune, property)
      : !noPlaceholder && <h4 className="secondary text-center">Amusez-vous avec les valeurs</h4>
    }
  </article>
);

StartRecap.propTypes = {
  income: PropTypes.number,
  fortune: PropTypes.number,
  property: PropTypes.number,
  noPlaceholder: PropTypes.bool,
};

export default StartRecap;
