import React, { Component } from 'react';
import PropTypes from 'prop-types';

import throttle from 'lodash/throttle';

import {
  getRealMonthly,
  getTheoreticalMonthly,
  getIncomeRatio,
  getBorrowRatio,
} from '/imports/js/helpers/startFunctions';
import { validateRatiosCompletely } from '/imports/js/helpers/requestFunctions';
import { toDistanceString } from '/imports/js/helpers/conversionFunctions';
import constants from '/imports/js/config/constants';
import { getClosestStations, getNearbyPlace } from '/imports/js/helpers/APIs';
import cleanMethod from '/imports/api/cleanMethods';

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
  { id: 'notaryFees', type: 'money', noEdit: true },
  { id: 'loan', type: 'money', noEdit: true },
  { id: 'ownFunds', type: 'money', noEdit: true },
  { id: 'realMonthly', type: 'money', noEdit: true },
  { id: 'theoreticalMonthly', type: 'money', noEdit: true },
  { id: 'createdAt', type: 'date', noEdit: true },
  { id: 'realBorrowRatio', type: 'percent', noEdit: true },
  { id: 'incomeRatio', type: 'percent', noEdit: true },
  { id: 'nearestStore', type: 'text', noEdit: true },
  { id: 'nearestTrainStation', type: 'text', noEdit: true },
  { id: 'nearestBusStation', type: 'text', noEdit: true },
];

export default class Comparator extends Component {
  constructor(props) {
    super(props);

    this.setupProperties(this.props);
    this.hideFields(this.props);
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.properties.length !== this.props.properties.length) {
  //     this.setupProperties(this.props);
  //     this.filterFields(this.props);
  //     this.forceUpdate();
  //   }
  // }

  componentWillReceiveProps(nextProps) {
    this.setupProperties(nextProps);
    this.hideFields(nextProps);
    this.forceUpdate();
  }

  // Throttle this function because of the slider
  changeComparator = throttle(
    (key, value, callback) =>
      cleanMethod(
        'updateComparator',
        { [key]: value },
        this.props.comparator._id,
        callback,
      ),
    200,
  );

  addCustomField = (name, type, callback) =>
    cleanMethod(
      'addComparatorField',
      { name, type },
      this.props.comparator._id,
      () => {
        this.hideFields(this.props);
        if (typeof callback === 'function') {
          callback();
        }
      },
    );

  removeCustomField = fieldId =>
    cleanMethod(
      'removeComparatorField',
      { fieldId },
      this.props.comparator._id,
      () => {
        this.hideFields(this.props);
      },
    );

  toggleField = fieldId =>
    cleanMethod('toggleHiddenField', { fieldId }, this.props.comparator._id);

  deleteProperty = id => cleanMethod('deleteProperty', null, id);

  // addValueToProperty = (key, value, propertyName) => {
  //   const property = this.state.addedProperties.find(
  //     p => p.name === propertyName,
  //   );
  //
  //   this.setState(prev => ({
  //     addedProperties: [
  //       ...prev.addedProperties.filter(p => p.name !== propertyName),
  //       {
  //         ...property,
  //         [key]: value,
  //       },
  //     ],
  //   }));
  // };

  // handleAddProperty = (address, latlng, value, callback) => {
  //   const name = address.split(',')[0];
  //   const lat = latlng.lat;
  //   const lng = latlng.lng;
  //   // TODO: Make sure name is unique identifier
  //
  //   this.setState(
  //     prev => ({
  //       addedProperties: [
  //         ...prev.addedProperties,
  //         {
  //           name,
  //           address,
  //           value,
  //           latlng,
  //           createdAt: new Date(),
  //         },
  //       ],
  //     }),
  //     () => {
  //       // getClosestStations(lat, lng)
  //       //   .then((stations) => {
  //       //     this.addValueToProperty(
  //       //       'nearestStation',
  //       //       {
  //       //         primary: stations[0].name,
  //       //         secondary: toDistanceString(stations[0].distance),
  //       //         value: stations[0].distance,
  //       //       },
  //       //       name,
  //       //     );
  //       //   })
  //       //   .catch(error => console.log(error));
  //
  //       [
  //         { googId: 'department_store', id: 'nearestStore', byDistance: true },
  //         {
  //           googId: 'train_station',
  //           id: 'nearestTrainStation',
  //           byDistance: true,
  //         },
  //         { googId: 'bus_station', id: 'nearestBusStation', byDistance: true },
  //       ].forEach(request =>
  //         this.addGooglePlace(
  //           name,
  //           lat,
  //           lng,
  //           request.googId,
  //           request.id,
  //           request.byDistance,
  //         ),
  //       );
  //
  //       if (typeof callback === 'function') {
  //         callback();
  //       }
  //     },
  //   );
  // };

  addGooglePlace = (name, lat, lng, type, id, byDistance) => {
    if (window.google) {
      getNearbyPlace(lat, lng, type, byDistance)
        .then((result) => {
          this.addValueToProperty(
            id,
            {
              primary: result.name,
              secondary: toDistanceString(result.distance.value),
              value: result.distance.value,
            },
            name,
          );
        })
        .catch(error => console.log(error));
    }
  };

  modifyProperty = (property) => {
    const {
      income,
      fortune,
      borrowRatio,
      interestRate,
      usageType,
    } = this.props.comparator;

    const loan = borrowRatio * property.value;
    const notaryFees = property.value * constants.notaryFees;
    const ownFunds = (1 - borrowRatio) * property.value + notaryFees;
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
    } = validateRatiosCompletely(
      incomeRatio,
      realBorrowRatio,
      borrowRatio,
      usageType === 'primary',
    );

    return {
      ...property,
      realMonthly,
      theoreticalMonthly,
      notaryFees,
      loan,
      ownFunds,
      isValid,
      error,
      errorClass,
      realBorrowRatio,
      incomeRatio,
    };
  };

  setupProperties = (props) => {
    this.modifiedProperties = [...props.properties].map(this.modifyProperty);
  };

  hideFields = (props) => {
    const { comparator } = props;
    this.filteredFields = [
      ...defaultFields,
      ...comparator.customFields.map(f => ({ ...f, custom: true })),
    ].filter(field => comparator.hiddenFields.indexOf(field.id) < 0);
  };

  render() {
    // const { customFields, addedProperties, hiddenFields } = this.state;
    const { comparator } = this.props;

    return (
      <section className="comparator flex-col center">
        <CompareOptions
          comparator={comparator}
          changeComparator={this.changeComparator}
          // handleAddProperty={this.handleAddProperty}
          allFields={[...defaultFields, ...comparator.customFields]}
          toggleField={this.toggleField}
          removeCustomField={this.removeCustomField}
        />
        <CompareTable
          // {...this.props}
          comparator={comparator}
          properties={this.modifiedProperties}
          addCustomField={this.addCustomField}
          fields={this.filteredFields}
          deleteProperty={this.deleteProperty}
        />
      </section>
    );
  }
}

Comparator.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.object).isRequired,
  comparator: PropTypes.objectOf(PropTypes.any).isRequired,
};
