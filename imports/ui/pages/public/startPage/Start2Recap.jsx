import React, { PropTypes } from 'react';
import classNames from 'classnames';

import { toMoney } from '/imports/js/helpers/conversionFunctions';
import constants from '/imports/js/config/constants';

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
      label: 'Projet',
      props: {
        style: {
          marginTop: 0,
        },
      },
    },
    {
      label: p.type === 'test' ? "Prix d'Achat maximal" : "Prix d'Achat",
      value: `CHF ${toMoney(Math.round(p.property))}`,
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
    },
    {
      label: 'Frais de Notaire',
      value: `CHF ${toMoney(Math.round(p.property * constants.notaryFees))}`,
    },
    {
      label: <span className="bold">Coût total du projet</span>,
      value: (
        <span className="bold sum">
          CHF
          {' '}
          {toMoney(
            Math.round(
              p.property * (1 + constants.notaryFees) + p.propertyWork,
            ),
          )}
        </span>
      ),
      spacingTop: true,
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
      label: (
        <span style={{ fontSize: '0.8em' }}>
          *Utilise un taux d'intérêt moyen de 1.5%
        </span>
      ),
      value: '',
      hide: !p.fortuneUsed,
    },
    {
      title: true,
      label: 'Calculs FINMA',
      hide: !p.fortuneUsed,
    },
    {
      label: p.propertyWork ? 'Emprunt/Valeur du bien' : "Emprunt/Prix d'achat",
      value: (
        <span>
          {p.fortuneUsed && Math.round(borrow * 1000) / 10}%&nbsp;
          <span
            className={
              borrow <= constants.maxLoan(p.usageType)
                ? 'fa fa-check'
                : 'fa fa-times'
            }
          />
        </span>
      ),
      hide: !p.fortuneUsed,
    },
    {
      label: 'Charges/Revenus Disponibles',
      value: (
        <span>
          {p.fortuneUsed && Math.round(ratio * 1000) / 10}%&nbsp;
          <span
            className={
              ratio <= 1 / 3
                ? 'fa fa-check'
                : ratio <= 0.38 ? 'fa fa-exclamation' : 'fa fa-times'
            }
          />
        </span>
      ),
      hide: !p.fortuneUsed,
    },
    {
      title: true,
      label: 'Fortune',
      hide: !(p.bankFortune || p.realEstate || p.insuranceFortune),
    },
    {
      label: 'Fortune Bancaire',
      value: `CHF ${toMoney(Math.round(p.bankFortune))}`,
      hide: !p.bankFortune,
    },
    {
      label: 'Fortune Immobilière',
      value: `CHF ${toMoney(Math.round(p.realEstate))}`,
      hide: !p.realEstate,
    },
    {
      label: 'Fortune de Prévoyance',
      value: `CHF ${toMoney(Math.round(p.insuranceFortune))}`,
      hide: !p.insuranceFortune,
    },
    {
      label: 'Votre Fortune',
      value: (
        <span className="sum">
          CHF {toMoney(Math.round(p.fortune + p.insuranceFortune))}
        </span>
      ),
      spacingTop: true,
      hide: !p.fortune && !p.insuranceFortune,
    },
    {
      title: true,
      label: 'Revenus',
      hide: !(p.salary || p.bonus || p.otherIncome || p.expenses),
    },
    {
      label: 'Salaire annuel',
      value: `CHF ${toMoney(Math.round(p.salary))}`,
      hide: !p.salary,
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
      hide: !(p.salary || p.bonus || p.otherIncome || p.expenses),
      spacingTop: true,
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
      (item, i) => !item.hide &&
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
            key={i}
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
