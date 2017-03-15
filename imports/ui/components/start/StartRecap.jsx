import React, { PropTypes } from 'react';

import { toMoney } from '/imports/js/conversionFunctions';
import constants from '/imports/js/constants';

const isReady = (income, fortune, property) => property && income && fortune;

const getMonthly = (income, fortune, property) =>
  Math.max(
    (property * constants.maintenance +
      (property - fortune) * constants.loanCost()) /
      12,
    0,
  );

const getMonthlyReal = (income, fortune, property) =>
  Math.max(
    (property * constants.maintenanceReal +
      (property - fortune) * constants.loanCostReal()) /
      12,
    0,
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

const getArray = (income, fortune, property) => {
  const borrow = Math.max((property * 1.05 - fortune) / property, 0);
  const ratio = getMonthly(income, fortune - property * 0.05, property) /
    (income / 12);

  return [
    {
      title: true,
      label: 'Votre Projet',
    },
    {
      label: "Prix d'achat",
      value: `CHF ${toMoney(Math.round(property / 1000) * 1000)}`,
    },
    {
      label: 'Frais de notaire',
      value: `CHF ${toMoney(Math.round(property * constants.notaryFees / 1000) * 1000)}`,
      spacing: true,
    },
    {
      label: <span className="bold">Coût total du projet</span>,
      value: (
        <span className="bold">
          CHF&nbsp;
          {toMoney(
            Math.round(property * (1 + constants.notaryFees) / 1000) * 1000,
          )}
        </span>
      ),
      spacing: true,
    },
    {
      label: 'Fonds propres',
      value: `CHF ${toMoney(fortune)}`,
    },
    {
      label: 'Emprunt',
      value: `CHF ${toMoney(Math.round(borrow * property / 1000) * 1000)}`,
      props: {
        className: Math.round(borrow * 1000) / 1000 <= 0.8
          ? 'success'
          : Math.round(borrow * 1000) / 1000 <= 0.9 ? 'warning' : 'error',
      },
      spacing: true,
    },
    {
      label: 'Coût réel estimé',
      value: Math.round(borrow * 1000) / 1000 <= 0.8 && fortune < property
        ? <span>
            CHF
            {' '}
            {toMoney(
              getMonthlyReal(income, fortune - property * 0.05, property),
            )}
            {' '}
            <small>/mois</small>
          </span>
        : '-',
    },
    {
      title: true,
      label: 'Calculs FINMA',
    },
    {
      label: "Emprunt/Prix d'achat",
      value: `${Math.round(borrow * 1000) / 10}%`,
      props: {
        className: Math.round(borrow * 1000) / 1000 <= 0.8
          ? 'success'
          : Math.round(borrow * 1000) / 1000 <= 0.9 ? 'warning' : 'error',
      },
    },
    {
      label: 'Charges/Revenus',
      value: `${Math.round(ratio * 1000) / 10}%`,
      props: {
        className: Math.round(ratio * 1000) / 1000 <= 1 / 3
          ? 'success'
          : Math.round(ratio * 1000) / 1000 <= 0.38 ? 'warning' : 'error',
      },
    },
    {
      title: true,
      label: 'e-Potek',
      hide: true, // TODO: Remove
    },
    {
      label: 'Nb. de prêteurs potentiels',
      value: getLenderCount(borrow, ratio),
      spacing: true,
      hide: true, // TODO: Remove
    },
  ];
};

const getResult = (income, fortune, property) => (
  <div className="result animated fadeIn">
    {getArray(income, fortune, property).map(
      item => !item.hide &&
      (item.title
        ? <label className="text-center" {...item.props} key={item.label}>
            {item.label}
          </label>
        : <div
            className="fixed-size"
            style={{ marginBottom: item.spacing && 16 }}
            key={item.label}
          >
            <h4 className="secondary">{item.label}</h4>
            <h3 {...item.props}>{item.value}</h3>
          </div>),
    )}
  </div>
);

const StartRecap = ({ income, fortune, property, noPlaceholder }) => (
  <article className="validator">
    {isReady(income, fortune, property)
      ? getResult(income, fortune, property)
      : !noPlaceholder &&
          <h4 className="secondary text-center">
            Amusez-vous avec les valeurs
          </h4>}
  </article>
);

StartRecap.propTypes = {
  income: PropTypes.number,
  fortune: PropTypes.number,
  property: PropTypes.number,
  noPlaceholder: PropTypes.bool,
};

export default StartRecap;
