import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { _ } from 'lodash';

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

const defaultFields = [
  { id: 'name', type: 'text' },
  { id: 'isValid', type: 'boolean', noEdit: true },
  { id: 'value', type: 'money' },
  { id: 'loan', type: 'money', noEdit: true },
  { id: 'ownFunds', type: 'money', noEdit: true },
  { id: 'realMonthly', type: 'money', noEdit: true },
  { id: 'theoreticalMonthly', type: 'money', noEdit: true },
  { id: 'createdAt', type: 'date', noEdit: true },
  { id: 'minergy', type: 'boolean' },
  { id: 'realBorrowRatio', type: 'percent', noEdit: true },
  { id: 'incomeRatio', type: 'percent', noEdit: true },
];

export default class Comparator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      useBorrowers: false,
      income: 80000,
      fortune: 110000,
      interestRate: 0.015,
      borrowRatio: 0.8,
      usageType: 'primary',
      addedProperties: [],
      customFields: [],
      hiddenFields: ['realBorrowRatio', 'incomeRatio', 'theoreticalMonthly'],
    };
    this.setupProperties(this.props, this.state);
    this.filterFields(this.props, this.state);
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(prevState, this.state)) {
      this.setupProperties(this.props, this.state);
      this.filterFields(this.props, this.state);
      this.forceUpdate();
    }
  }

  changeOptions = (key, value, callback) =>
    this.setState({ [key]: value }, callback);

  addCustomField = (name, type, callback) =>
    this.setState(
      prev => ({
        customFields: [
          ...prev.customFields,
          {
            name,
            type,
            id: `custom${prev.customFields.length}${1}`, // FIXME: This will fail if fields are added, deleted, and added again
            custom: true,
          },
        ],
      }),
      callback,
    );

  toggleField = (fieldId) => {
    if (this.state.hiddenFields.indexOf(fieldId) >= 0) {
      this.setState(prev => ({
        hiddenFields: [...prev.hiddenFields.filter(id => id !== fieldId)],
      }));
    } else {
      this.setState(prev => ({
        hiddenFields: [...prev.hiddenFields, fieldId],
      }));
    }
  };

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
    const { income, fortune, borrowRatio, interestRate } = this.state;
    const loan = borrowRatio * property.value;
    const ownFunds = (1 - borrowRatio + constants.notaryFees) * property.value;
    const theoreticalMonthly = getTheoreticalMonthly(
      ownFunds,
      property.value,
      borrowRatio,
    );
    const realMonthly = getRealMonthly(
      ownFunds,
      property.value,
      borrowRatio,
      interestRate,
    );
    const incomeRatio = getIncomeRatio(theoreticalMonthly, income);
    const realBorrowRatio = getBorrowRatio(property.value, fortune);

    const {
      isValid,
      message: error,
      className: errorClass,
    } = validateRatiosCompletely(incomeRatio, realBorrowRatio, borrowRatio);

    return {
      ...property,
      realMonthly,
      theoreticalMonthly,
      loan,
      ownFunds,
      isValid,
      error,
      errorClass,
      realBorrowRatio,
      incomeRatio,
    };
  };

  setupProperties = (props, state) => {
    this.modifiedProperties = [...properties, ...state.addedProperties].map(
      this.modifyProperty,
    );
  };

  filterFields = (props, state) => {
    this.filteredFields = [...defaultFields, ...state.customFields].filter(
      field => state.hiddenFields.indexOf(field.id) < 0,
    );
  };

  render() {
    const { customFields, addedProperties, hiddenFields } = this.state;

    return (
      <section className="comparator flex-col center">
        <CompareOptions
          options={this.state}
          changeOptions={this.changeOptions}
          handleAddProperty={this.handleAddProperty}
          allFields={[...defaultFields, ...customFields]}
          hiddenFields={hiddenFields}
          toggleField={this.toggleField}
        />
        <CompareTable
          {...this.props}
          addCustomField={this.addCustomField}
          properties={this.modifiedProperties}
          fields={this.filteredFields}
        />
      </section>
    );
  }
}

Comparator.propTypes = {};
