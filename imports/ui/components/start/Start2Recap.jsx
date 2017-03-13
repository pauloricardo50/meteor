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
  let borrow = Math.max((p.propAndWork - p.fortuneUsed) / p.propAndWork, 0) || 0;
  borrow = borrow === 1 ? 0 : borrow;
  const ratio = (p.income - p.expenses) && props.monthly / ((p.income - p.expenses) / 12);


  return [
    {
      title: true,
      label: 'Patrimoine',
      props: {
        style: {
          marginTop: 0,
        },
      },
    },
    {
      label: 'Votre Fortune',
      value: `CHF ${toMoney(Math.round(p.fortune))}`,
      spacing: !p.insuranceFortune,
    },
    {
      label: 'Votre Prévoyance',
      value: `CHF ${toMoney(Math.round(p.insuranceFortune))}`,
      hide: !p.insuranceFortune,
      spacing: true,
    },
    {
      label: 'Salaire annuel',
      value: `CHF ${toMoney(Math.round(p.salary))}`,
    },
    {
      label: 'Bonus annuel considéré',
      value: `CHF ${toMoney(Math.round(p.bonus))}`,
      hide: !p.bonus,
    },
    {
      label: 'Autres revenus annuels',
      value: `CHF ${toMoney(Math.round(p.otherIncome))}`,
      hide: !p.otherIncome,
    },
    {
      label: 'Total des revenus',
      value: `CHF ${toMoney(Math.round(p.income))}`,
      hide: (!p.bonus && !p.otherIncome),
      spacing: p.expenses,
    },
    {
      label: 'Vos Charges annuelles',
      value: `CHF ${toMoney(Math.round(p.expenses))}`,
      hide: !p.expenses,
    },
    {
      label: 'Revenus disponibles',
      value: `CHF ${toMoney(Math.round(p.income - p.expenses))}`,
      hide: !p.expenses,
    },
    {
      title: true,
      label: 'Le Projet',
    },
    {
      label: 'Prix d\'achat',
      value: `CHF ${toMoney(Math.round(p.property))}`,
    }, {
      label: 'Frais de notaire',
      value: `CHF ${toMoney(Math.round(p.property * constants.notaryFees))}`,
      spacing: !p.propertyWork,
    }, {
      label: 'Travaux de plus-value',
      value: `CHF ${toMoney(Math.round(p.propertyWork))}`,
      hide: !p.propertyWork,
      spacing: true,
    }, {
      label: 'Coût total du projet',
      value: `CHF ${toMoney(Math.round((p.property * (1 + constants.notaryFees)) + p.propertyWork))}`,
      spacing: true,
    }, {
      label: 'Fonds Propres',
      value: `CHF ${toMoney(Math.round(p.fortuneUsed))}`,
      hide: !p.fortuneUsed,
    }, {
      label: 'Emprunt',
      value: `CHF ${p.fortuneUsed ? toMoney(Math.round(borrow * p.property)) : 0}`,
      props: {
        className: borrow <= 0.8
          ? 'success'
          : (borrow <= 0.9 ? 'warning' : 'error'),
      },
      hide: !p.fortuneUsed,
    }, {
      title: true,
      label: 'Calculs FINMA',
      hide: !(borrow || ratio),
    }, {
      label: 'Ratio Emprunt/Prix d\'achat',
      value: `${p.fortuneUsed && Math.round(borrow * 1000) / 10}%`,
      props: {
        className: borrow <= 0.8
          ? 'success'
          : (borrow <= 0.9 ? 'warning' : 'error'),
      },
      hide: !(borrow || ratio),
    }, {
      label: 'Charges/Revenus Disponibles',
      value: `${Math.round(ratio * 1000) / 10}%`,
      props: {
        className: Math.round(ratio * 1000) / 1000 <= 1 / 3
          ? 'success'
          : (Math.round(ratio * 1000) / 1000 <= 0.38 ? 'warning' : 'error'),
      },
      hide: !(borrow || ratio),
      spacing: true,
    },
    // {
    //   label: 'Coût théorique FINMA',
    //   value: Math.round(borrow * 1000) / 1000 <= 0.8 && p.fortuneUsed < p.property
    //         ? <span>CHF {toMoney(props.monthly)} <small>/mois</small></span>
    //         : '-',
    //   props: {
    //     className: Math.round(ratio * 1000) / 1000 <= 1 / 3
    //       ? 'success'
    //       : (Math.round(ratio * 1000) / 1000 <= 0.38 ? 'warning' : 'error'),
    //   },
    // }, {
    //   label: 'Coût réel estimé',
    //   value: Math.round(borrow * 1000) / 1000 <= 0.8 && p.fortuneUsed < p.property
    //         ? <span>CHF {toMoney(props.monthlyReal)} <small>/mois</small></span>
    //         : '-',
    //   spacing: true,
    // }, {
    //   label: 'Nb. de prêteurs potentiels',
    //   value: getLenderCount(borrow, ratio),
    // },
  ];
};


const getResult = props => (
  <div className="result animated fadeIn">
    {getArray(props).map(item => !item.hide && (item.title
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
