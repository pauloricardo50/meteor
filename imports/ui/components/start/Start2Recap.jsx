import React, { PropTypes } from 'react';

import { toMoney } from '/imports/js/conversionFunctions';
import constants from '/imports/js/constants';

const isReady = (income, fortune, property) => (
  property &&
  income &&
  fortune
);

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


const getArray = (props) => {
  const p = props;
  const borrow = Math.max((p.property - p.fortuneUsed) / p.property, 0) || 0;
  const ratio = (p.income - p.expenses) && props.monthly / ((p.income - p.expenses) / 12);


  return [
    {
      title: true,
      label: 'Vos Finances',
      props: {
        style: {
          marginTop: 0,
        },
      },
    },
    {
      label: 'Votre Fortune',
      value: `CHF ${toMoney(Math.round(p.fortune))}`,
    },
    {
      label: 'Votre Prévoyance',
      value: `CHF ${toMoney(Math.round(p.insuranceFortune))}`,
    },
    {
      label: 'Vos Revenus',
      value: <span>CHF {toMoney(Math.round(p.income / 12))} <small>/mois</small></span>,
    },
    {
      label: 'Vos Charges',
      value: <span>CHF {toMoney(Math.round(p.expenses / 12))} <small>/mois</small></span>,
    },
    {
      label: 'Revenus Disponibles',
      value: <span>CHF {toMoney(Math.round((p.income - p.expenses) / 12))} <small>/mois</small></span>,
    },
    {
      title: true,
      label: 'La Propriété',
    },
    {
      label: 'Prix d\'achat',
      value: (
        <span>
          CHF {toMoney(Math.round(p.property))}
        </span>
      ),
    }, {
      label: 'Frais de notaire',
      value: (
        <span>
          CHF {toMoney(Math.round(p.property * constants.notaryFees))}
        </span>
      ),
    }, {
      label: 'Travaux supplémentaires',
      value: (
        <span>
          CHF {toMoney(Math.round(p.propertyWork))}
        </span>
      ),
    }, {
      label: 'Coût total du projet',
      value: (
        <span>
          CHF {toMoney(Math.round((p.property * (1 + constants.notaryFees)) + p.propertyWork))}
        </span>
      ),
      spacing: true,
    }, {
      label: 'Emprunt',
      value: <span>CHF {p.fortuneUsed ? toMoney(Math.round(borrow * p.property)) : 0}</span>,
      props: {
        className: borrow <= 0.8
          ? 'success'
          : (borrow <= 0.9 ? 'warning' : 'error'),
      },
    }, {
      label: 'Ratio Emprunt/Prix d\'achat',
      value: `${p.fortuneUsed && Math.round(borrow * 1000) / 10}%`,
      spacing: true,
      props: {
        className: borrow <= 0.8
          ? 'success'
          : (borrow <= 0.9 ? 'warning' : 'error'),
      },
    }, {
      label: 'Vos revenus mensuels',
      value: p.income > 0
        ? <span>CHF {toMoney(p.income / 12)} <small>/mois</small></span>
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
      value: Math.round(borrow * 1000) / 1000 <= 0.8 && p.fortuneUsed < p.property
            ? <span>CHF {toMoney(props.monthly)} <small>/mois</small></span>
            : '-',
      props: {
        className: Math.round(ratio * 1000) / 1000 <= 1 / 3
          ? 'success'
          : (Math.round(ratio * 1000) / 1000 <= 0.38 ? 'warning' : 'error'),
      },
    }, {
      label: 'Coût réel estimé',
      value: Math.round(borrow * 1000) / 1000 <= 0.8 && p.fortuneUsed < p.property
            ? <span>CHF {toMoney(props.monthlyReal)} <small>/mois</small></span>
            : '-',
      spacing: true,
    }, {
      label: 'Nb. de prêteurs potentiels',
      value: getLenderCount(borrow, ratio),
    },
  ];
};


const getResult = props => (
  <div className="result animated fadeIn">
    {getArray(props).map(item => (item.title
      ? <label className="text-center" {...item.props} key={item.label}>{item.label}</label>
      : (
        <div className="fixed-size" style={{ marginBottom: item.spacing && 16 }} key={item.label}>
          <h4 className="secondary">{item.label}</h4>
          <h3 {...item.props}>{item.value}</h3>
        </div>
      )
    ))}
  </div>
);


const Start2Recap = props => (
  <article className="validator">
    {getResult(props)}
  </article>
);

Start2Recap.defaultProps = {
  income: 0,
  fortune: 0,
  property: 0,
  expenses: 0,
  insuranceFortune: 0,
  propertyWork: 0,
  fortuneUsed: 0,
};

Start2Recap.propTypes = {
  income: PropTypes.number,
  fortune: PropTypes.number,
  property: PropTypes.number,
  expenses: PropTypes.number,
  insuranceFortune: PropTypes.number,
  propertyWork: PropTypes.number,
  fortuneUsed: PropTypes.number,
};

export default Start2Recap;
