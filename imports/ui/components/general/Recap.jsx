import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import { toMoney } from '/imports/js/helpers/conversionFunctions';
import constants from '/imports/js/config/constants';
import AutoTooltip from './AutoTooltip.jsx';

import {
  getPropAndWork,
  getProjectValue,
  getTotalUsed,
  getLoanValue,
  getLenderCount,
} from '/imports/js/helpers/requestFunctions';

import {
  getMonthlyPayment,
  getIncomeRatio,
  getBorrowRatio,
  getExpenses,
  getBorrowerIncome,
  getRealEstateFortune,
  getRealEstateValue,
  getTotalFortune,
  getRealEstateDebt,
  getInsuranceFortune,
  getFortune,
  getBonusIncome,
  getOtherIncome,
  getBorrowerSalary,
} from '/imports/js/helpers/finance-math';

const getDashboardArray = props => {
  const r = props.loanRequest;
  const b = props.borrowers;

  const incomeRatio = getIncomeRatio(r, b);
  const borrowRatio = getBorrowRatio(r, b);
  const loan = getLoanValue(r);
  const project = getProjectValue(r);
  const propAndWork = getPropAndWork(r);
  const monthly = getMonthlyPayment(r, b)[0];
  const expenses = getExpenses(b);
  const bonusIncome = getBonusIncome(b);
  const otherIncome = getOtherIncome(b);
  const realEstateFortune = getRealEstateFortune(b);
  const realEstateValue = getRealEstateValue(b);
  const realEstateDebt = getRealEstateDebt(b);

  const fortune = getFortune(b);
  const insuranceFortune = getInsuranceFortune(b);
  const totalFortune = getTotalFortune(b);
  const lenderCount = getLenderCount(r, b);

  return [
    {
      title: true,
      label: `Projet (en ${constants.getCurrency()})`,
      props: {
        style: {
          marginTop: 0,
        },
      },
    },
    {
      label: "Prix d'Achat",
      value: toMoney(Math.round(r.property.value)),
    },
    {
      label: 'Travaux de plus-value',
      value: toMoney(Math.round(r.property.propertyWork)),
      hide: !r.property.propertyWork,
      spacing: true,
    },
    {
      label: 'Valeur du bien',
      value: toMoney(Math.round(propAndWork)),
      hide: !r.property.propertyWork,
    },
    {
      label: 'Frais de Notaire',
      value: toMoney(Math.round(r.property.value * constants.notaryFees)),
    },
    {
      label: 'Frais retrait LPP',
      value: toMoney(Math.round(r.general.insuranceFortuneUsed * constants.lppFees)),
      hide: !r.general.insuranceFortuneUsed,
    },
    {
      label: <span className="bold">Coût total du projet</span>,
      value: (
        <span className="bold sum">
          {toMoney(project)}
        </span>
      ),
      spacingTop: true,
      spacing: true,
    },
    {
      label: 'Fonds Propres',
      value: toMoney(getTotalUsed(r)),
      hide: r.general.insuranceFortuneUsed,
    },
    {
      label: 'Fonds Propres - Épargne',
      value: toMoney(r.general.fortuneUsed),
      hide: !r.general.insuranceFortuneUsed,
    },
    {
      label: 'Fonds Propres - LPP',
      value: toMoney(r.general.insuranceFortuneUsed),
      hide: !r.general.insuranceFortuneUsed,
    },
    {
      label: 'Fonds Propres - Total',
      value: (
        <span className=" sum">
          {toMoney(getTotalUsed(r))}
        </span>
      ),
      spacingTop: true,
      hide: !r.general.insuranceFortuneUsed,
    },
    {
      label: 'Emprunt',
      value: toMoney(loan),
    },
    {
      label: 'Charges estimées*',
      value: (
        <span>
          {toMoney(monthly)} <small>/mois</small>
        </span>
      ),
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
      label: r.property.propertyWork ? 'Emprunt/Valeur du bien' : "Emprunt/Prix d'achat",
      value: (
        <span>
          {Math.round(borrowRatio * 1000) / 10}%
          {' '}
          <span
            className={
              borrowRatio <= constants.maxLoan(r.property.usageType) + 0.001 // add 0.1% to avoid rounding errors
                ? 'fa fa-check success'
                : 'fa fa-times error'
            }
          />
        </span>
      ),
    },
    {
      label: 'Charges/Revenus',
      value: (
        <span>
          {Math.round(incomeRatio * 1000) / 10}%
          {' '}
          <span
            className={
              incomeRatio <= 1 / 3
                ? 'fa fa-check success'
                : incomeRatio <= 0.38 ? 'fa fa-exclamation warning' : 'fa fa-times error'
            }
          />
        </span>
      ),
    },
    {
      title: true,
      label: 'Fortune',
      hide: !(realEstateFortune || insuranceFortune),
    },
    {
      label: 'Épargne Bancaire',
      value: toMoney(fortune),
    },

    {
      label: 'Fortune de Prévoyance',
      value: toMoney(insuranceFortune),
      hide: !insuranceFortune,
    },
    {
      label: 'Fonds Propres Dispo.',
      value: (
        <span className="sum">
          {toMoney(totalFortune)}
        </span>
      ),
      hide: !realEstateFortune,
      spacingTop: true,
    },
    {
      label: 'Biens Immobiliers',
      value: toMoney(realEstateValue),
      hide: !realEstateFortune,
      spacingTop: true,
    },
    {
      label: 'Emprunts Actuels',
      value: `- ${toMoney(realEstateDebt)}`,
      hide: !realEstateFortune,
    },
    {
      label: 'Fortune Nette',
      value: (
        <span className="sum">
          {toMoney(totalFortune + realEstateFortune)}
        </span>
      ),
      spacingTop: true,
      hide: !realEstateFortune,
    },
    {
      title: true,
      label: 'Revenus',
    },
    {
      label: 'Salaire',
      value: toMoney(getBorrowerSalary(b)),
    },
    {
      label: 'Bonus considéré',
      value: toMoney(bonusIncome),
      hide: !bonusIncome,
    },
    {
      label: 'Autres Revenus',
      value: toMoney(otherIncome),
      hide: !otherIncome,
    },
    {
      label: 'Charges',
      value: `- ${toMoney(expenses)}`,
      hide: !expenses,
    },
    {
      label: 'Revenus considérés',
      value: (
        <span className="sum">
          {toMoney(getBorrowerIncome(b))}
        </span>
      ),
      spacingTop: true,
    },
    {
      title: true,
      label: 'e-Potek',
    },
    {
      label: 'Nb. de prêteurs potentiels',
      value: lenderCount,
      spacing: true,
    },
  ];
};

const getStart2Array = props => {
  const p = props;

  return [
    {
      title: true,
      label: `Projet (en ${constants.getCurrency()})`,
      props: {
        style: {
          marginTop: 0,
        },
      },
    },
    {
      label: p.type === 'test' ? "Prix d'Achat maximal" : "Prix d'Achat",
      value: toMoney(Math.round(p.property)),
    },
    {
      label: 'Travaux de plus-value',
      value: toMoney(Math.round(p.propertyWork)),
      hide: !p.propertyWork,
      spacing: true,
    },
    {
      label: 'Valeur du bien',
      value: toMoney(Math.round(p.propAndWork)),
      hide: !p.propertyWork,
    },
    {
      label: 'Frais de Notaire',
      value: toMoney(Math.round(p.property * constants.notaryFees)),
    },
    {
      label: 'Frais retrait LPP',
      value: toMoney(Math.round(p.lppFees)),
      hide: !p.insuranceFortuneUsed,
    },
    {
      label: <span className="bold">Coût total du projet</span>,
      value: (
        <span className="bold sum">
          {toMoney(
            Math.round(p.property * (1 + constants.notaryFees) + p.propertyWork + p.lppFees),
          )}
        </span>
      ),
      spacingTop: true,
      spacing: p.fortuneUsed,
    },
    {
      label: 'Fonds Propres',
      value: toMoney(Math.round(p.fortuneUsed)),
      hide: !p.fortuneUsed || p.insuranceFortuneUsed,
    },
    {
      label: 'Fonds Propres - Épargne',
      value: toMoney(p.fortuneUsed),
      hide: !p.fortuneUsed || !p.insuranceFortuneUsed,
    },
    {
      label: 'Fonds Propres - LPP',
      value: toMoney(p.insuranceFortuneUsed),
      hide: !p.fortuneUsed || !p.insuranceFortuneUsed,
    },
    {
      label: 'Fonds Propres - Total',
      value: (
        <span className=" sum">
          {toMoney(Math.round(p.fortuneUsed + p.insuranceFortuneUsed))}
        </span>
      ),
      spacingTop: true,
      hide: !p.fortuneUsed || !p.insuranceFortuneUsed,
    },
    {
      label: 'Emprunt',
      value: toMoney(Math.round(p.loanWanted)),
      hide: !p.loanWanted,
      spacing: !p.loanWanted,
    },
    {
      label: 'Charges estimées*',
      value: (
        <span>
          {toMoney(Math.round(p.monthlyReal))} <small>/mois</small>
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
              p.borrow <= constants.maxLoan(p.usageType) + 0.001 // add 0.1% to avoid rounding errors
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
                : p.ratio <= 0.38 ? 'fa fa-exclamation warning' : 'fa fa-times error'
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
      label: 'Épargne Bancaire',
      value: toMoney(Math.round(p.fortune)),
      hide: !p.fortune,
    },

    {
      label: 'Fortune de Prévoyance',
      value: toMoney(Math.round(p.insuranceFortuneDisplayed)),
      hide: !p.insuranceFortuneDisplayed,
    },
    {
      label: 'Fonds Propres Dispo.',
      value: (
        <span className="sum">
          {toMoney(Math.round(p.fortune + p.insuranceFortuneDisplayed))}
        </span>
      ),
      hide: !p.insuranceFortuneDisplayed,
      spacingTop: true,
    },
    {
      label: 'Biens Immobiliers',
      value: toMoney(Math.round(p.realEstateValue)),
      hide: !p.realEstate,
      spacingTop: true,
    },
    {
      label: 'Emprunts Actuels',
      value: `- ${toMoney(Math.round(p.realEstateDebt))}`,
      hide: !p.realEstate,
    },

    {
      label: 'Fortune Nette',
      value: (
        <span className="sum">
          {toMoney(Math.round(p.fortune + p.insuranceFortuneDisplayed + p.realEstate))}
        </span>
      ),
      spacingTop: true,
      hide: !p.realEstate,
    },
    {
      title: true,
      label: 'Revenus',
      hide: !(p.salary || p.bonus || p.otherIncome || p.expenses || p.propertyRent),
    },
    {
      label: 'Loyer perçu',
      value: toMoney(Math.round(p.propertyRent * 12)),
      hide: p.usageType !== 'investment',
    },
    {
      label: 'Salaire',
      value: toMoney(Math.round(p.salary)),
      hide: !p.salary,
    },
    {
      label: 'Bonus considéré',
      value: toMoney(Math.round(p.bonus)),
      hide: !p.bonus,
    },
    {
      label: 'Autres Revenus',
      value: toMoney(Math.round(p.otherIncome)),
      hide: !p.otherIncome,
    },
    {
      label: 'Charges',
      value: `- ${toMoney(Math.round(p.expenses))}`,
      hide: !p.expenses,
    },
    {
      label: 'Revenus considérés',
      value: (
        <span className="sum">
          {toMoney(Math.round(p.income - p.expenses))}
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

const getBorrowerArray = props => {
  const b = [props.borrower];

  const expenses = getExpenses(b);
  const bonusIncome = getBonusIncome(b);
  const otherIncome = getOtherIncome(b);
  const realEstateFortune = getRealEstateFortune(b);
  const realEstateValue = getRealEstateValue(b);
  const realEstateDebt = getRealEstateDebt(b);
  const fortune = getFortune(b);
  const insuranceFortune = getInsuranceFortune(b);
  const totalFortune = getTotalFortune(b);

  return [
    {
      title: true,
      label: 'Fortune',
      hide: !(realEstateFortune || insuranceFortune),
    },
    {
      label: 'Épargne Bancaire',
      value: toMoney(fortune),
    },

    {
      label: 'Fortune de Prévoyance',
      value: toMoney(insuranceFortune),
      hide: !insuranceFortune,
    },
    {
      label: 'Fonds Propres Dispo.',
      value: (
        <span className="sum">
          {toMoney(totalFortune)}
        </span>
      ),
      hide: !realEstateFortune,
      spacingTop: true,
    },
    {
      label: 'Biens Immobiliers',
      value: toMoney(realEstateValue),
      hide: !realEstateFortune,
      spacingTop: true,
    },
    {
      label: 'Emprunts Actuels',
      value: `- ${toMoney(realEstateDebt)}`,
      hide: !realEstateFortune,
    },
    {
      label: 'Fortune Nette',
      value: (
        <span className="sum">
          {toMoney(totalFortune + realEstateFortune)}
        </span>
      ),
      spacingTop: true,
      hide: !realEstateFortune,
    },
    {
      title: true,
      label: 'Revenus',
    },
    {
      label: 'Salaire',
      value: toMoney(getBorrowerSalary(b)),
    },
    {
      label: 'Bonus considéré',
      value: toMoney(bonusIncome),
      hide: !bonusIncome,
    },
    {
      label: 'Autres Revenus',
      value: toMoney(otherIncome),
      hide: !otherIncome,
    },
    {
      label: 'Charges',
      value: `- ${toMoney(expenses)}`,
      hide: !expenses,
    },
    {
      label: 'Revenus considérés',
      value: (
        <span className="sum">
          {toMoney(getBorrowerIncome(b))}
        </span>
      ),
      spacingTop: true,
    },
  ];
};

const arraySwitch = props => {
  switch (props.arrayName) {
    case 'start1':
      return null;
    case 'start2':
      return getStart2Array(props);
    case 'dashboard':
      return getDashboardArray(props);
    case 'borrower':
      return getBorrowerArray(props);
    default:
      throw new Meteor.Error('Not a valid recap array');
  }
};

const Recap = props => {
  const array = props.array || arraySwitch(props);
  return (
    <article className="validator">
      <div className="result animated fadeIn">
        {array.map((item, i) => {
          if (item.hide) {
            return null;
          } else if (item.title) {
            return (
              <label className="text-center" {...item.props} key={item.label}>
                <AutoTooltip>{item.label}</AutoTooltip>
              </label>
            );
          }
          return (
            <div
              className={classnames({
                'fixed-size': true,
                'no-scale': props.noScale,
              })}
              style={{
                marginBottom: item.spacing && 16,
                marginTop: item.spacingTop && 16,
              }}
              key={i}
            >
              <h4 className="secondary">
                <AutoTooltip placement="right">{item.label}</AutoTooltip>
              </h4>
              <h3 {...item.props}>{item.value}</h3>
            </div>
          );
        })}
      </div>
    </article>
  );
};

Recap.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any),
  borrowers: PropTypes.arrayOf(PropTypes.object),
  borrower: PropTypes.objectOf(PropTypes.any),
  array: PropTypes.arrayOf(PropTypes.object),
  noScale: PropTypes.bool,
};

Recap.defaultProps = {
  loanRequest: {},
  borrowers: [{}],
  borrower: {},
  array: undefined,
  noScale: false,
};

export default Recap;
