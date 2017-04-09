import React, { PropTypes } from 'react';
import classNames from 'classnames';

import { toMoney } from '/imports/js/helpers/conversionFunctions';
import constants from '/imports/js/config/constants';

const getArray = props => {
  const p = props;

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
      label: 'Frais retrait 2e Pilier',
      value: `CHF ${toMoney(Math.round(p.lppFees))}`,
      hide: !p.insuranceFortuneUsed,
    },
    {
      label: <span className="bold">Coût total du projet</span>,
      value: (
        <span className="bold sum">
          CHF
          {' '}
          {toMoney(
            Math.round(
              p.property * (1 + constants.notaryFees) +
                p.propertyWork +
                p.lppFees,
            ),
          )}
        </span>
      ),
      spacingTop: true,
      spacing: p.fortuneUsed,
    },
    {
      label: 'Fonds Propres',
      value: `CHF ${toMoney(Math.round(p.fortuneUsed + p.insuranceFortuneUsed))}`,
      hide: !p.fortuneUsed,
    },
    {
      label: 'Emprunt',
      value: `CHF ${toMoney(Math.round(p.project - (p.fortuneUsed + p.insuranceFortuneUsed)))}`,
      hide: !p.fortuneUsed,
      spacing: !p.fortuneUsed,
    },
    {
      label: 'Charges estimées*',
      value: (
        <span>
          CHF {toMoney(Math.round(p.monthlyReal))} <small>/mois</small>
        </span>
      ),
      hide: !p.fortuneUsed,
    },
    {
      label: (
        <span style={{ fontSize: '0.8em' }}>
          *Taux indicatif de 1.5%
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
          {Math.round(p.borrow * 1000) / 10}%
          {' '}
          <span
            className={
              p.borrow <= constants.maxLoan(p.usageType)
                ? 'fa fa-check success'
                : 'fa fa-times error'
            }
          />
        </span>
      ),
      hide: !p.fortuneUsed,
    },
    {
      label: 'Charges/Revenus',
      value: (
        <span>
          {Math.round(p.ratio * 1000) / 10}%
          {' '}
          <span
            className={
              p.ratio <= 1 / 3
                ? 'fa fa-check success'
                : p.ratio <= 0.38
                    ? 'fa fa-exclamation warning'
                    : 'fa fa-times error'
            }
          />
        </span>
      ),
      hide: !p.fortuneUsed,
    },
    {
      title: true,
      label: 'Fortune',
      hide: !(p.realEstate || p.insuranceFortune),
    },
    {
      label: 'Fortune Bancaire',
      value: `CHF ${toMoney(Math.round(p.fortune))}`,
      hide: !p.fortune,
    },

    {
      label: 'Fortune de Prévoyance',
      value: `CHF ${toMoney(Math.round(p.insuranceFortune))}`,
      hide: !p.insuranceFortune,
    },
    {
      label: 'Fonds Propres Dispo.',
      value: (
        <span className="sum">
          CHF {toMoney(Math.round(p.fortune + p.insuranceFortune))}
        </span>
      ),
      hide: !p.insuranceFortune,
      spacingTop: true,
    },
    {
      label: 'Biens Immobiliers',
      value: `CHF ${toMoney(Math.round(p.realEstateValue))}`,
      hide: !p.realEstate,
      spacingTop: true,
    },
    {
      label: 'Emprunts Actuels',
      value: `- CHF ${toMoney(Math.round(p.realEstateDebt))}`,
      hide: !p.realEstate,
    },

    {
      label: 'Fortune Nette',
      value: (
        <span className="sum">
          CHF
          {' '}
          {toMoney(Math.round(p.fortune + p.insuranceFortune + p.realEstate))}
        </span>
      ),
      spacingTop: true,
      hide: !p.realEstate,
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
      label: 'Charges',
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
      value: p.lenderCount,
      spacing: true,
    },
  ];
};

const Start2Recap = props => (
  <article className="validator">
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
  </article>
);

Start2Recap.defaultProps = {
  income: 0,
  otherIncome: 0,
  fortune: 0,
  insuranceFortune: 0,
  property: 0,
  expenses: 0,
  propertyWork: 0,
  fortuneUsed: 0,
  insuranceFortuneUsed: 0,
  realEstate: 0,
};

Start2Recap.propTypes = {
  income: PropTypes.number,
  otherIncome: PropTypes.number,
  fortune: PropTypes.number,
  insuranceFortune: PropTypes.number,
  property: PropTypes.number,
  expenses: PropTypes.number,
  insuranceFortune: PropTypes.number,
  propertyWork: PropTypes.number,
  fortuneUsed: PropTypes.number,
  insuranceFortuneUsed: PropTypes.number,
  realEstate: PropTypes.number,
};

export default Start2Recap;
