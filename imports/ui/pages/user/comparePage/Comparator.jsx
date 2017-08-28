import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

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
import { T } from '/imports/ui/components/general/Translation.jsx';

import CompareTable from './CompareTable.jsx';
import CompareOptions from './CompareOptions.jsx';

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
  // { id: 'nearestStore', type: 'text', noEdit: true },
  { id: 'nearestTrainStation', type: 'text', noEdit: true },
  { id: 'nearestBusStation', type: 'text', noEdit: true },
];

export default class Comparator extends Component {
  constructor(props) {
    super(props);

    this.setupProperties(this.props, true);
    this.hideFields(this.props);
  }

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
      ).then(callback),
    200,
  );

  addCustomField = (name, type, callback) =>
    cleanMethod(
      'addComparatorField',
      { name, type },
      this.props.comparator._id,
    ).then(() => {
      this.hideFields(this.props);
      if (typeof callback === 'function') {
        callback();
      }
    });

  removeCustomField = fieldId =>
    cleanMethod(
      'removeComparatorField',
      { fieldId },
      this.props.comparator._id,
    ).then(() => {
      this.hideFields(this.props);
    });

  toggleField = fieldId =>
    cleanMethod('toggleHiddenField', { fieldId }, this.props.comparator._id);

  addProperty = (object, callback) => {
    cleanMethod('insertProperty', object).then((result) => {
      if (typeof callback === 'function') {
        callback();
      }
      Meteor.defer(() => {
        this.callGoogleApi(result);
      });
    });
  };

  deleteProperty = id => cleanMethod('deleteProperty', null, id);

  addValueToProperty = (key, value, propertyId) => {
    const index = this.modifiedProperties.findIndex(
      prop => prop._id === propertyId,
    );
    if (index >= 0) {
      const property = this.modifiedProperties[index];

      this.modifiedProperties[index] = { ...property, [key]: value };
      this.forceUpdate();
    }
  };

  callGoogleApi = (propertyId, callback) => {
    const property = this.props.properties.find(p => p._id === propertyId);
    const lat = property.latitude;
    const lng = property.longitude;

    [
      {
        googId: 'train_station',
        id: 'nearestTrainStation',
        byDistance: true,
      },
      { googId: 'bus_station', id: 'nearestBusStation', byDistance: true },
    ].forEach(request =>
      this.addGooglePlace(
        propertyId,
        lat,
        lng,
        request.googId,
        request.id,
        request.byDistance,
      ),
    );

    if (typeof callback === 'function') {
      callback();
    }
  };

  addGooglePlace = (propertyId, lat, lng, type, id, byDistance) => {
    if (window.google) {
      return getNearbyPlace(lat, lng, type, byDistance)
        .then(result =>
          cleanMethod(
            'updateProperty',
            {
              [id]: {
                primary: result.name,
                secondary: toDistanceString(result.distance.value),
                value: result.distance.value,
              },
            },
            propertyId,
          ),
        )
        .catch(error => console.log(error));
    }

    return new Promise((res, reject) => reject("google doesn't exist"));
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
      usageType === 'primary',
      borrowRatio,
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
    const { comparator } = this.props;

    return (
      <section className="comparator flex-col center">
        <CompareOptions
          comparator={comparator}
          changeComparator={this.changeComparator}
          allFields={[...defaultFields, ...comparator.customFields]}
          toggleField={this.toggleField}
          removeCustomField={this.removeCustomField}
          addProperty={this.addProperty}
        />
        {this.modifiedProperties.length > 0
          ? <CompareTable
            comparator={comparator}
            properties={this.modifiedProperties}
            addCustomField={this.addCustomField}
            fields={this.filteredFields}
            deleteProperty={this.deleteProperty}
          />
          : <h2 className="secondary text-center">
            <T id="Comparator.empty" />
          </h2>}
      </section>
    );
  }
}

Comparator.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.object).isRequired,
  comparator: PropTypes.objectOf(PropTypes.any).isRequired,
};
