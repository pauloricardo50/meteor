import PropTypes from 'prop-types';
import React from 'react';

import { toMoney } from '/imports/js/helpers/conversionFunctions';
import constants from '/imports/js/config/constants';
import { getLenderCount } from '/imports/js/helpers/startFunctions';

import Recap from '/imports/ui/components/general/Recap.jsx';

const isReady = ({ income, fortune, property }) => property && income && fortune;

const getMonthlyReal = (income, fortune, property, borrow) =>
  Math.max(
    (property * constants.maintenanceReal + (property - fortune) * constants.loanCostReal(borrow)) /
      12,
    0,
  );

const getArray = ({ income, fortune, property, borrowRatio, incomeRatio }) => {
  return [
    {
      title: true,
      label: `Projet (en ${constants.getCurrency()})`,
    },
    {
      label: "Prix d'achat",
      value: toMoney(Math.round(property / 1000) * 1000),
    },
    {
      label: 'Frais de notaire',
      value: toMoney(Math.round(property * constants.notaryFees / 1000) * 1000),
      spacing: true,
    },
    {
      label: <span className="bold">Coût total du projet</span>,
      value: (
        <span className="bold">
          {toMoney(Math.round(property * (1 + constants.notaryFees) / 1000) * 1000)}
        </span>
      ),
      spacing: true,
    },
    {
      label: 'Fonds propres',
      value: toMoney(fortune),
    },
    {
      label: 'Emprunt',
      value: toMoney(Math.round(borrowRatio * property / 1000) * 1000),
      spacing: true,
    },
    {
      label: 'Charges estimées*',
      value: Math.round(borrowRatio * 1000) / 1000 <= 0.8 && fortune < property
        ? <span>
          {toMoney(getMonthlyReal(income, fortune - property * 0.05, property, borrowRatio))}
          {' '}
          <small>/mois</small>
        </span>
        : '-',
    },
    {
      label: (
        <span style={{ fontSize: '0.8em' }}>
          *Taux indicatif de 1.5%
        </span>
      ),
      value: '',
    },
    {
      title: true,
      label: 'Calculs FINMA',
    },
    {
      label: "Emprunt/Prix d'achat",
      value: (
        <span>
          {Math.round(borrowRatio * 1000) / 10}%&nbsp;
          <span
            className={
              borrowRatio <= 0.8 + 0.001 // for rounding
                ? 'fa fa-check success'
                : borrowRatio <= 0.9 ? 'fa fa-exclamation warning' : 'fa fa-times error'
            }
          />
        </span>
      ),
    },
    {
      label: 'Charges/Revenus',
      value: (
        <span>
          {Math.round(incomeRatio * 1000) / 10}%&nbsp;
          <span
            className={
              incomeRatio <= 1 / 3 + 0.001 // for rounding
                ? 'fa fa-check success'
                : incomeRatio <= 0.38 ? 'fa fa-exclamation warning' : 'fa fa-times error'
            }
          />
        </span>
      ),
    },
    {
      title: true,
      label: 'e-Potek',
    },
    {
      label: 'Nb. de prêteurs potentiels',
      value: getLenderCount(borrowRatio, incomeRatio),
      spacing: true,
    },
  ];
};

const StartRecap = props => (
  <article className="validator">
    {isReady(props)
      ? <Recap array={getArray(props)} />
      : !props.noPlaceholder &&
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
  borrow: PropTypes.number,
  ratio: PropTypes.number,
};

export default StartRecap;
