import React, { PropTypes } from 'react';

import { toMoney } from '/imports/js/helpers/conversionFunctions';
import constants from '/imports/js/config/constants';

import Recap from '/imports/ui/components/general/Recap.jsx';
import Tooltip from '/imports/ui/components/general/Tooltip.jsx';

const isReady = ({ income, fortune, property }) =>
  property && income && fortune;

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

const getArray = ({ income, fortune, property, borrow, ratio }) => {
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
      label: <Tooltip id="notaryFees">Frais de notaire</Tooltip>,
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
      spacing: true,
    },
    {
      label: 'Coût réel estimé*',
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
      label: (
        <span style={{ fontSize: '0.8em' }}>
          *Taux indicatif de 1.5%
        </span>
      ),
      value: '',
    },
    {
      title: true,
      label: <span>Calculs <Tooltip id="finma">FINMA</Tooltip></span>,
    },
    {
      label: <Tooltip id="borrowRatio">Emprunt/Prix d'achat</Tooltip>,
      value: (
        <span>
          {Math.round(borrow * 1000) / 10}%&nbsp;
          <span
            className={
              borrow <= 0.8 + 0.001 // for rounding
                ? 'fa fa-check success'
                : borrow <= 0.9
                    ? 'fa fa-exclamation warning'
                    : 'fa fa-times error'
            }
          />
        </span>
      ),
    },
    {
      label: <Tooltip id="incomeRatio">Charges/Revenus</Tooltip>,
      value: (
        <span>
          {Math.round(ratio * 1000) / 10}%&nbsp;
          <span
            className={
              ratio <= 1 / 3 + 0.001 // for rounding
                ? 'fa fa-check success'
                : ratio <= 0.38
                    ? 'fa fa-exclamation warning'
                    : 'fa fa-times error'
            }
          />
        </span>
      ),
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
