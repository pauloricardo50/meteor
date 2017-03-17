import React, { PropTypes } from 'react';
import classNames from 'classnames';

import { toMoney } from '/imports/js/conversionFunctions';
import constants from '/imports/js/constants';

const isReady = (income, fortune, property) => property && income && fortune;

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

const getArray = props => {
  const p = props;
  let borrow = (p.fortuneUsed &&
    Math.max(
      (p.propAndWork - (p.fortuneUsed - 0.05 * p.property)) / p.propAndWork,
      0,
    )) ||
    0;
  const ratio = p.income - p.expenses &&
    props.monthly / ((p.income - p.expenses) / 12);

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
      label: 'Fortune Bancaire',
      value: `CHF ${toMoney(Math.round(p.bankFortune))}`,
      hide: !p.bankFortune || !p.realEstate,
    },
    {
      label: 'Fortune Immobilière',
      value: `CHF ${toMoney(Math.round(p.realEstate))}`,
      hide: !p.realEstate,
      spacing: !p.insuranceFortune,
    },
    {
      label: 'Fortune de Prévoyance',
      value: `CHF ${toMoney(Math.round(p.insuranceFortune))}`,
      hide: !p.insuranceFortune,
      spacing: true,
    },
    {
      label: 'Votre Fortune',
      value: (
        <span
          className={classNames({
            sum: p.realEstate || (p.realEstate && p.bankFortune),
          })}
        >
          CHF {toMoney(Math.round(p.fortune + p.insuranceFortune))}
        </span>
      ),
    },
    {
      title: true,
      label: 'Revenus',
      hide: !p.bonus && !p.otherIncome && !p.expenses,
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
      label: 'Autres Revenus',
      value: `CHF ${toMoney(Math.round(p.otherIncome))}`,
      hide: !p.otherIncome,
    },
    {
      label: 'Vos Charges',
      value: `- CHF ${toMoney(Math.round(p.expenses))}`,
      hide: !p.expenses,
    },
    {
      label: 'Revenus considérés',
      value: (
        <span className="sum">
          CHF {toMoney(Math.round(p.income - p.expenses))}
        </span>
      ),
      hide: !p.bonus && !p.otherIncome && !p.expenses,
      spacingTop: true,
    },
    {
      title: true,
      label: 'Projet',
    },
    {
      label: p.type === 'test' ? "Prix d'Achat maximal" : "Prix d'Achat",
      value: `CHF ${toMoney(Math.round(p.property))}`,
    },
    {
      label: 'Frais de Notaire',
      value: `CHF ${toMoney(Math.round(p.property * constants.notaryFees))}`,
      spacing: !p.propertyWork,
    },
    {
      label: 'Travaux de plus-value',
      value: `CHF ${toMoney(Math.round(p.propertyWork))}`,
      hide: !p.propertyWork,
      spacing: true,
    },
    {
      label: 'Valeur du bien',
      value: `CHF ${toMoney(Math.round(p.propAndWork))}`,
      hide: !p.propertyWork,
      spacing: true,
    },
    {
      label: <span className="bold">Coût total du projet</span>,
      value: (
        <span className="bold">
          CHF
          {' '}
          {toMoney(
            Math.round(
              p.property * (1 + constants.notaryFees) + p.propertyWork,
            ),
          )}
        </span>
      ),
      spacing: p.fortuneUsed,
    },
    {
      label: 'Fonds Propres',
      value: `CHF ${toMoney(Math.round(p.fortuneUsed))}`,
      hide: !p.fortuneUsed,
    },
    {
      label: 'Emprunt',
      value: `CHF ${p.fortuneUsed ? toMoney(Math.round(p.project - p.fortuneUsed)) : 0}`,
      props: {
        className: borrow <= constants.maxLoan(p.usageType)
          ? 'success'
          : 'error',
      },
      hide: !p.fortuneUsed,
      spacing: !p.fortuneUsed,
    },
    {
      label: 'Coût mensuel estimé',
      value: (
        <span>
          CHF
          {' '}
          {p.fortuneUsed ? toMoney(Math.round(p.monthlyReal)) : 0}
          {' '}
          <small>/mois</small>
        </span>
      ),
      hide: !p.fortuneUsed,
    },
    {
      title: true,
      label: 'Calculs FINMA',
      hide: !(borrow || ratio),
    },
    {
      label: p.propertyWork ? 'Emprunt/Valeur du bien' : "Emprunt/Prix d'achat",
      value: `${p.fortuneUsed && Math.round(borrow * 1000) / 10}%`,
      props: {
        className: borrow <= constants.maxLoan(p.usageType)
          ? 'success'
          : 'error',
      },
      hide: !p.fortuneUsed,
    },
    {
      label: 'Charges/Revenus Disponibles',
      value: `${Math.round(ratio * 1000) / 10}%`,
      props: {
        className: Math.round(ratio * 1000) / 1000 <= 1 / 3
          ? 'success'
          : Math.round(ratio * 1000) / 1000 <= 0.38 ? 'warning' : 'error',
      },
      hide: !p.fortuneUsed,
    },
    {
      title: true,
      label: 'e-Potek',
    },
    {
      label: 'Nb. de prêteurs potentiels',
      value: getLenderCount(borrow, ratio),
      spacing: true,
    },
  ];
};

const getResult = props => (
  <div className="result animated fadeIn">
    {getArray(props).map(
      item => !item.hide &&
      (item.title
        ? <label className="text-center" {...item.props} key={item.label}>
            {item.label}
          </label>
        : <div
            className="fixed-size"
            style={{
              marginBottom: item.spacing && 16,
              marginTop: item.spacingTop && 16,
            }}
            key={item.label}
          >
            <h4 className="secondary">{item.label}</h4>
            <h3 {...item.props}>{item.value}</h3>
          </div>),
    )}
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
