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
    bool: true,
  },
  {
    name: 'Rue du Four 3',
    value: 467000,
    createdAt: new Date().setHours(now.getHours() + 3),
    bool: false,
  },
  {
    name: 'Avenue du parc 17',
    value: 564000,
    createdAt: new Date(),
    bool: true,
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

  changeOptions = (key, value, callback) => {
    console.log(key, value);
    this.setState({ [key]: value }, callback);
  };

  addCustomField = name => {
    return true;
  };

  modifyProperty = property => {
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
