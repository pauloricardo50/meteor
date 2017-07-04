import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { start1Monthly } from '/imports/js/helpers/startFunctions';

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
      income: '',
      fortune: '',
      borrowRatio: 0.8,
    };
  }

  changeOptions = (key, value, callback) =>
    this.setState({ [key]: value }, callback);

  addCustomField = name => true;

  handleAddProperty = (value, address, latlng, callback) => {
    callback();
  };

  modifyProperty = (property) => {
    const { income, fortune, borrowRatio } = this.state;
    const monthly = start1Monthly(income, fortune, property.value, borrowRatio);
    const loan = borrowRatio * property.value;
    const ownFunds = (1 - borrowRatio) * property.value;
    return {
      ...property,
      monthly,
      loan,
      ownFunds,
    };
  };

  render() {
    return (
      <section className="comparator">
        <CompareOptions
          options={this.state}
          changeOptions={this.changeOptions}
          handleAddProperty={this.handleAddProperty}
        />
        <CompareTable
          {...this.props}
          addCustomField={this.addCustomField}
          properties={properties.map(this.modifyProperty)}
        />
      </section>
    );
  }
}

Comparator.propTypes = {};
