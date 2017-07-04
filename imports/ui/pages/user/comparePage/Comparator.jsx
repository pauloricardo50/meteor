import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  getRealMonthly,
  getTheoreticalMonthly,
  getIncomeRatio,
  getBorrowRatio,
} from '/imports/js/helpers/startFunctions';
import { validateRatiosCompletely } from '/imports/js/helpers/requestFunctions';
import constants from '/imports/js/config/constants';

import CompareTable from './CompareTable.jsx';
import CompareOptions from './CompareOptions.jsx';

const now = new Date();
const properties = [
  {
    name: 'Chemin des Paquerettes 13',
    value: 519000,
    createdAt: new Date().setHours(now.getHours() - 1),
    minergy: true,
  },
  {
    name: 'Rue du Four 3',
    value: 467000,
    createdAt: new Date().setHours(now.getHours() - 3),
    minergy: false,
  },
  {
    name: 'Avenue du parc 17',
    value: 564000,
    createdAt: new Date(),
    minergy: true,
  },
  {
    name: 'Chemin du Lac 9',
    value: 434000,
    createdAt: new Date().setHours(now.getHours() - 30),
    minergy: true,
  },
  {
    name: 'Place Rousseau 4',
    value: 532000,
    createdAt: new Date().setHours(now.getHours() - 67),
    minergy: true,
  },
  {
    name: 'Rue des vignerons 17',
    value: 604000,
    createdAt: new Date().setHours(now.getHours() - 45),
    minergy: false,
  },
];

export default class Comparator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      useBorrowers: false,
      income: '80000',
      fortune: '120000',
      borrowRatio: 0.8,
      addedProperties: [],
    };
  }

  changeOptions = (key, value, callback) =>
    this.setState({ [key]: value }, callback);

  addCustomField = name => true;

  handleAddProperty = (address, latlng, value, callback) => {
    this.setState(
      prev => ({
        addedProperties: [
          ...prev.addedProperties,
          { name: address.split(',')[0], value, latlng, createdAt: new Date() },
        ],
      }),
      callback,
    );
  };

  modifyProperty = (property) => {
    const { income, fortune, borrowRatio } = this.state;
    const loan = borrowRatio * property.value;
    const ownFunds = (1 - borrowRatio + constants.notaryFees) * property.value;
    const theoreticalMonthly = getTheoreticalMonthly(
      ownFunds,
      property.value,
      borrowRatio,
    );
    const realMonthly = getRealMonthly(ownFunds, property.value, borrowRatio);
    const incomeRatio = getIncomeRatio(theoreticalMonthly, income);
    const realBorrowRatio = getBorrowRatio(property.value, fortune);

    const {
      isValid,
      message: error,
      className: errorClass,
    } = validateRatiosCompletely(incomeRatio, realBorrowRatio);

    return {
      ...property,
      realMonthly,
      theoreticalMonthly,
      loan,
      ownFunds,
      isValid,
      error,
      errorClass,
    };
  };

  render() {
    return (
      <section className="comparator flex-col center">
        <CompareOptions
          options={this.state}
          changeOptions={this.changeOptions}
          handleAddProperty={this.handleAddProperty}
        />
        <CompareTable
          {...this.props}
          addCustomField={this.addCustomField}
          properties={[...properties, ...this.state.addedProperties].map(
            this.modifyProperty,
          )}
        />
      </section>
    );
  }
}

Comparator.propTypes = {};
