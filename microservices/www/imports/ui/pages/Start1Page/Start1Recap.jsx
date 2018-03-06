import PropTypes from 'prop-types';
import React from 'react';

import { toMoney } from 'core/utils/conversionFunctions';
import constants from 'core/config/constants';
import { getLenderCount, getRealMonthly } from 'core/utils/startFunctions';

import Recap from 'core/components/Recap';
import { T, IntlNumber } from 'core/components/Translation';

const isReady = ({ income, fortune, property }) =>
  property && income && fortune;

const getArray = ({ income, fortune, property, borrowRatio, incomeRatio }) => [
  {
    title: true,
    label: 'Recap.title',
  },
  {
    label: 'Recap.purchasePrice',
    value: toMoney(Math.round(property / 1000) * 1000),
  },
  {
    label: 'general.notaryFees',
    value: toMoney(Math.round(property * constants.notaryFees / 1000) * 1000),
    spacing: true,
  },
  {
    label: 'Recap.totalCost',
    labelStyle: {
      fontWeight: 400,
    },
    value: (
      <span>
        {toMoney(Math.round(property * (1 + constants.notaryFees) / 1000) * 1000)}
      </span>
    ),
    spacing: true,
    bold: true,
  },
  {
    label: 'general.ownFunds',
    value: toMoney(fortune),
  },
  {
    label: 'general.mortgageLoan',
    value: toMoney(Math.round(borrowRatio * property / 1000) * 1000),
    spacing: true,
  },
  {
    label: 'Recap.monthlyCost',
    value:
      Math.round(borrowRatio * 1000) / 1000 <= 0.8 && fortune < property ? (
        <span>
          {toMoney(getRealMonthly(fortune - property * 0.05, property, borrowRatio))}{' '}
          <small>/mois</small>
        </span>
      ) : (
        '-'
      ),
  },
  {
    title: true,
    label: 'Recap.finmaRules',
  },
  {
    label: 'Recap.borrowRatio',
    value: (
      <span>
        <IntlNumber value={borrowRatio} format="percentage" />{' '}
        <span
          className={
            borrowRatio <= 0.8 + 0.001 // for rounding
              ? 'fa fa-check success'
              : borrowRatio <= 0.9
                ? 'fa fa-exclamation warning'
                : 'fa fa-times error'
          }
        />
      </span>
    ),
  },
  {
    label: 'Recap.incomeRatio',
    value: (
      <span>
        <IntlNumber value={incomeRatio} format="percentage" />{' '}
        <span
          className={
            incomeRatio <= 1 / 3 + 0.001 // for rounding
              ? 'fa fa-check success'
              : incomeRatio <= 0.38
                ? 'fa fa-exclamation warning'
                : 'fa fa-times error'
          }
        />
      </span>
    ),
  },
  {
    title: true,
    label: 'general.lenders',
  },
  {
    label: 'Recap.interestedLenders',
    value: getLenderCount(borrowRatio, incomeRatio),
    spacing: true,
  },
];

const Start1Recap = props => (
  <article className="validator">
    {isReady(props) ? (
      <Recap array={getArray(props)} />
    ) : (
      !props.noPlaceholder && (
        <div>
          <h4 className="secondary" style={{ textAlign: 'center' }}>
            <T id="Start1Recap.temporaryTitle" />
          </h4>
        </div>
      )
    )}
  </article>
);

Start1Recap.propTypes = {
  income: PropTypes.number,
  fortune: PropTypes.number,
  property: PropTypes.number,
  noPlaceholder: PropTypes.bool,
  borrow: PropTypes.number,
  ratio: PropTypes.number,
};

export default Start1Recap;
