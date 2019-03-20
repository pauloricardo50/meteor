import fetch from 'node-fetch';
import camelCase from 'lodash/camelCase';
import omit from 'lodash/omit';
import merge from 'lodash/merge';
import invert from 'lodash/invert';

import { Meteor } from 'meteor/meteor';
import WuestHouse from './WuestHouse';
import WuestFlat from './WuestFlat';
import { URL, TOKEN } from './API_KEY';
import * as wuestConstants from '../wuestConstants';
import Properties from '../../properties';
import {
  PROPERTY_TYPE,
  RESIDENCE_TYPE,
  VALUATION_RANGE_FACTOR,
} from '../../constants';

const valueIsDefined = value => (value === 0 ? true : !!value);
class WuestService {
  constructor() {
    this.properties = [];
  }

  getData(property) {
    return fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(property),
    });
  }

  addProperty(property) {
    this.checkPropertySanity(property);
    let data;
    switch (property.type) {
    case wuestConstants.WUEST_PROPERTY_TYPE.HOUSE:
      data = this.buildHouse(property);
      break;
    case wuestConstants.WUEST_PROPERTY_TYPE.FLAT:
      data = this.buildFlat(property);
      break;
    default:
      return null;
    }
    this.properties.push(data);
    return data;
  }

  getErrors(property = {}) {
    const sanityChecks = [
      {
        sanityCheck: ({ data }) => !!data,
        error: wuestConstants.WUEST_ERRORS.NO_PROPERTY_DATA_PROVIDED,
      },
      {
        sanityCheck: ({ data: { address } }) => !!address,
        error: wuestConstants.WUEST_ERRORS.NO_ADDRESS_PROVIDED,
      },
      {
        sanityCheck: ({ data: { address } }) =>
          !!address && !!address.addressLine1,
        error: wuestConstants.WUEST_ERRORS.NO_ADDRESS_LINE_1_PROVIDED,
      },
      {
        sanityCheck: ({ data: { address } }) => !!address && !!address.zipCode,
        error: wuestConstants.WUEST_ERRORS.NO_ZIPCODE_PROVIDED,
      },
      {
        sanityCheck: ({ data: { address } }) => !!address && !!address.place,
        error: wuestConstants.WUEST_ERRORS.NO_CITY_PROVIDED,
      },
      {
        sanityCheck: ({ data: { address } }) =>
          !!address && !!address.countryIsoCode,
        error: wuestConstants.WUEST_ERRORS.NO_COUNTRY_PROVIDED,
      },
      {
        sanityCheck: ({ data: { numberOfRooms } }) => !!numberOfRooms,
        error: wuestConstants.WUEST_ERRORS.NO_NUMBER_OF_ROOMS_PROVIDED,
      },
      {
        sanityCheck: ({ data: { constructionYear } }) => !!constructionYear,
        error: wuestConstants.WUEST_ERRORS.NO_CONSTRUCTION_YEAR_PROVIDED,
      },
      {
        sanityCheck: ({ data: { minergieCertificate } }) =>
          !!minergieCertificate,
        error: wuestConstants.WUEST_ERRORS.NO_MINERGIE_CERTIFICATE_PROVIDED,
      },
      {
        sanityCheck: ({ data: { minergieCertificate } }) =>
          Object.values(wuestConstants.WUEST_MINERGIE_CERTIFICATE).includes(minergieCertificate),
        error: wuestConstants.WUEST_ERRORS.INVALID_MINERGIE_CERTIFICATE,
      },
      {
        sanityCheck: ({ data: { parking } }) => !!parking,
        error: wuestConstants.WUEST_ERRORS.NO_PARKING_PROVIDED,
      },
      {
        sanityCheck: ({ data: { parking } }) =>
          !!parking && valueIsDefined(parking.indoor),
        error: wuestConstants.WUEST_ERRORS.NO_INSIDE_PARKING_PROVIDED,
      },
      {
        sanityCheck: ({ data: { parking } }) =>
          !!parking && valueIsDefined(parking.outdoor),
        error: wuestConstants.WUEST_ERRORS.NO_OUTSIDE_PARKING_PROVIDED,
      },
      {
        sanityCheck: ({ data: { qualityProfile } }) => !!qualityProfile,
        error: wuestConstants.WUEST_ERRORS.NO_QUALITY_PROFILE_PROVIDED,
      },
      {
        sanityCheck: ({ data: { qualityProfile } }) =>
          !!qualityProfile && !!qualityProfile.standard,
        error: wuestConstants.WUEST_ERRORS.NO_QUALITY_PROFILE_STANDARD_PROVIDED,
      },
      {
        sanityCheck: ({ data: { qualityProfile } }) =>
          !!qualityProfile
          && Object.values(wuestConstants.WUEST_QUALITY.STANDARD).includes(qualityProfile.standard),
        error: wuestConstants.WUEST_ERRORS.INVALID_QUALITY_PROFILE_STANDARD,
      },
      {
        sanityCheck: ({ data: { qualityProfile } }) =>
          !!qualityProfile && !!qualityProfile.condition,
        error:
          wuestConstants.WUEST_ERRORS.NO_QUALITY_PROFILE_CONDITION_PROVIDED,
      },
      {
        sanityCheck: ({ data: { qualityProfile } }) =>
          !!qualityProfile
          && Object.values(wuestConstants.WUEST_QUALITY.CONDITION).includes(qualityProfile.condition),
        error: wuestConstants.WUEST_ERRORS.INVALID_QUALITY_PROFILE_CONDITION,
      },
      {
        sanityCheck: ({ data: { residenceType } }) => !!residenceType,
        error: wuestConstants.WUEST_ERRORS.NO_RESIDENCE_TYPE_PROVIDED,
      },
      {
        sanityCheck: ({ data: { residenceType } }) =>
          Object.values(wuestConstants.WUEST_RESIDENCE_TYPE).includes(residenceType),
        error: wuestConstants.WUEST_ERRORS.INVALID_RESIDENCE_TYPE,
      },
      {
        sanityCheck: ({ type, data: { houseType } }) =>
          (type === wuestConstants.WUEST_PROPERTY_TYPE.FLAT ? true : !!houseType),
        error: wuestConstants.WUEST_ERRORS.NO_HOUSE_TYPE_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { houseType } }) =>
          (type === wuestConstants.WUEST_PROPERTY_TYPE.FLAT
            ? true
            : Object.values(wuestConstants.WUEST_HOUSE_TYPE).includes(houseType)),
        error: wuestConstants.WUEST_ERRORS.INVALID_HOUSE_TYPE,
      },
      {
        sanityCheck: ({ type, data: { buildingVolume } }) =>
          (type === wuestConstants.WUEST_PROPERTY_TYPE.FLAT
            ? true
            : !!buildingVolume),
        error: wuestConstants.WUEST_ERRORS.NO_BUILDING_VOLUME_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { buildingVolume } }) =>
          (type === wuestConstants.WUEST_PROPERTY_TYPE.FLAT
            ? true
            : !!buildingVolume && !!buildingVolume.value),
        error: wuestConstants.WUEST_ERRORS.NO_BUILDING_VOLUME_VALUE_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { buildingVolume } }) =>
          (type === wuestConstants.WUEST_PROPERTY_TYPE.FLAT
            ? true
            : !!buildingVolume && !!buildingVolume.type),
        error: wuestConstants.WUEST_ERRORS.NO_BUILDING_VOLUME_TYPE_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { buildingVolume } }) =>
          (type === wuestConstants.WUEST_PROPERTY_TYPE.FLAT
            ? true
            : !!buildingVolume
              && Object.values(wuestConstants.WUEST_VOLUME_TYPE).includes(buildingVolume.type)),
        error: wuestConstants.WUEST_ERRORS.INVALID_BUILDING_VOLUME_TYPE,
      },
      {
        sanityCheck: ({ type, data: { landPlotArea } }) =>
          (type === wuestConstants.WUEST_PROPERTY_TYPE.FLAT
            ? true
            : !!landPlotArea),
        error: wuestConstants.WUEST_ERRORS.NO_LANDPLOT_AREA_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { floorType } }) =>
          (type === wuestConstants.WUEST_PROPERTY_TYPE.HOUSE
            ? true
            : !!floorType),
        error: wuestConstants.WUEST_ERRORS.NO_FLOOR_NUMBER_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { floorType } }) =>
          (type === wuestConstants.WUEST_PROPERTY_TYPE.HOUSE
            ? true
            : wuestConstants.WUEST_FLOOR_NUMBER.includes(floorType)),
        error: wuestConstants.WUEST_ERRORS.INVALID_FLOOR_NUMBER,
      },
      {
        sanityCheck: ({ type, data: { flatType } }) =>
          (type === wuestConstants.WUEST_PROPERTY_TYPE.HOUSE ? true : !!flatType),
        error: wuestConstants.WUEST_ERRORS.NO_FLAT_TYPE_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { flatType } }) =>
          (type === wuestConstants.WUEST_PROPERTY_TYPE.HOUSE
            ? true
            : Object.values(wuestConstants.WUEST_FLAT_TYPE).includes(flatType)),
        error: wuestConstants.WUEST_ERRORS.INVALID_FLAT_TYPE,
      },
      {
        sanityCheck: ({ type, data: { numberOfFloors } }) =>
          (type === wuestConstants.WUEST_PROPERTY_TYPE.HOUSE
            ? true
            : !!numberOfFloors),
        error: wuestConstants.WUEST_ERRORS.NO_NUMBER_OF_FLOORS_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { numberOfFloors, floorType } }) =>
          (type === wuestConstants.WUEST_PROPERTY_TYPE.HOUSE
            ? true
            : wuestConstants.WUEST_FLOOR_NUMBER.indexOf(floorType)
              <= numberOfFloors),
        error:
          wuestConstants.WUEST_ERRORS
            .FLOOR_NUMBER_EXCEEDS_TOTAL_NUMBER_OF_FLOORS,
      },
      {
        sanityCheck: ({ type, data: { usableArea } }) =>
          (type === wuestConstants.WUEST_PROPERTY_TYPE.HOUSE
            ? true
            : !!usableArea),
        error: wuestConstants.WUEST_ERRORS.NO_USABLE_AREA_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { usableArea } }) =>
          (type === wuestConstants.WUEST_PROPERTY_TYPE.HOUSE
            ? true
            : !!usableArea && !!usableArea.value),
        error: wuestConstants.WUEST_ERRORS.NO_USABLE_AREA_VALUE_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { usableArea } }) =>
          (type === wuestConstants.WUEST_PROPERTY_TYPE.HOUSE
            ? true
            : !!usableArea && !!usableArea.type),
        error: wuestConstants.WUEST_ERRORS.NO_USABLE_AREA_TYPE_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { usableArea } }) =>
          (type === wuestConstants.WUEST_PROPERTY_TYPE.HOUSE
            ? true
            : !!usableArea
              && Object.values(wuestConstants.WUEST_AREA_TYPE).includes(usableArea.type)),
        error: wuestConstants.WUEST_ERRORS.INVALID_USABLE_AREA_TYPE,
      },
    ];

    const errors = sanityChecks.reduce(
      (acc, { sanityCheck, error }) =>
        (sanityCheck(property) ? acc : [...acc, error]),
      [],
    );

    return errors;
  }

  checkPropertySanity(property) {
    const errors = this.getErrors(property);

    if (errors.length > 0) {
      throw new Meteor.Error(
        wuestConstants.WUEST_ERRORS.WUEST_SERVICE_ERROR,
        errors[0],
      );
    }
  }

  buildHouse(property) {
    const {
      id,
      type,
      data: {
        address,
        residenceType,
        houseType,
        numberOfRooms,
        parking,
        constructionYear,
        minergieCertificate,
        buildingVolume,
        landPlotArea,
        qualityProfile,
      },
    } = property;
    const house = new WuestHouse();
    house.setValue({ path: 'address', value: address });
    house.setValue({ path: 'residenceType', value: residenceType });
    house.setValue({ path: 'houseType', value: houseType });
    house.setValue({ path: 'numberOfRooms', value: numberOfRooms });
    house.setValue({ path: 'parking', value: parking });
    house.setValue({
      path: 'constructionYear',
      value: constructionYear,
    });
    house.setValue({
      path: 'minergieCertificate',
      value: minergieCertificate,
    });
    house.setValue({
      path: 'buildingVolume',
      value: {
        value: buildingVolume.value,
        type: buildingVolume.type,
      },
    });
    house.setValue({ path: 'landPlotArea', value: landPlotArea });
    house.setValue({ path: 'qualityProfile', value: qualityProfile });
    return { id, type, property: house };
  }

  buildFlat(property) {
    const {
      id,
      type,
      data: {
        address,
        residenceType,
        flatType,
        numberOfRooms,
        numberOfFloors,
        floorType,
        parking,
        constructionYear,
        minergieCertificate,
        usableArea,
        terraceArea,
        qualityProfile,
      },
    } = property;
    const flat = new WuestFlat();
    flat.setValue({ path: 'address', value: address });
    flat.setValue({ path: 'residenceType', value: residenceType });
    flat.setValue({ path: 'flatType', value: flatType });
    flat.setValue({ path: 'numberOfRooms', value: numberOfRooms });
    flat.setValue({ path: 'numberOfFloors', value: numberOfFloors });
    flat.setValue({
      path: 'numberOfFlats',
      value: numberOfFloors * 2,
    });
    flat.setValue({ path: 'floorType', value: floorType });
    flat.setValue({ path: 'parking', value: parking });
    flat.setValue({
      path: 'constructionYear',
      value: constructionYear,
    });
    flat.setValue({
      path: 'minergieCertificate',
      value: minergieCertificate,
    });
    flat.setValue({
      path: 'usableArea',
      value: {
        value: usableArea.value,
        type: usableArea.type,
      },
    });
    flat.setValue({ path: 'terraceArea', value: terraceArea });
    flat.setValue({ path: 'qualityProfile', value: qualityProfile });

    return { id, type, property: flat };
  }

  evaluateById({ propertyId, loanResidenceType }) {
    const property = this.createPropertyFromCollection({
      propertyId,
      loanResidenceType,
    });
    return this.evaluate([property]);
  }

  getFloorType({ flatType, numberOfFloors, floorNumber }) {
    switch (flatType) {
    case wuestConstants.WUEST_FLAT_TYPE.PENTHOUSE_APARTMENT:
      return wuestConstants.WUEST_FLOOR_NUMBER[numberOfFloors];
    case wuestConstants.WUEST_FLAT_TYPE.PENTHOUSE_MAISONETTE:
      return wuestConstants.WUEST_FLOOR_NUMBER[numberOfFloors];
    case wuestConstants.WUEST_FLAT_TYPE.TERRACE_APARTMENT:
      return wuestConstants.WUEST_FLOOR_NUMBER[0];
    default:
      return wuestConstants.WUEST_FLOOR_NUMBER[floorNumber];
    }
  }

  createPropertyFromCollection({ propertyId, loanResidenceType }) {
    let data;
    const property = Properties.findOne(propertyId);

    if (!property) {
      throw new Meteor.Error(wuestConstants.WUEST_ERRORS.NO_PROPERTY_FOUND);
    }

    const {
      propertyType,
      address1,
      zipCode,
      city,
      flatType,
      houseType,
      landArea,
      volumeNorm,
      volume,
      roomCount,
      numberOfFloors,
      floorNumber,
      areaNorm,
      insideArea,
      terraceArea,
      parkingInside,
      parkingOutside,
      constructionYear,
      minergie,
      qualityProfileStandard,
      qualityProfileCondition,
    } = property;

    switch (propertyType) {
    case PROPERTY_TYPE.FLAT:
      data = this.addProperty({
        id: propertyId,
        type: wuestConstants.WUEST_PROPERTY_TYPE.FLAT,
        data: {
          address: {
            addressLine1: address1,
            zipCode: `${zipCode}`,
            place: city,
            countryIsoCode: 'CH',
          },
          residenceType:
              loanResidenceType
              && wuestConstants.WUEST_RESIDENCE_TYPE[
                invert(RESIDENCE_TYPE)[loanResidenceType]
              ],
          flatType,
          numberOfRooms: roomCount,
          numberOfFloors,
          floorType: this.getFloorType({
            flatType,
            numberOfFloors,
            floorNumber,
          }),
          usableArea: {
            type: areaNorm,
            value: insideArea,
          },
          terraceArea: terraceArea || 0,
          parking: {
            indoor: parkingInside || 0,
            outdoor: parkingOutside || 0,
          },
          constructionYear,
          minergieCertificate: minergie,
          qualityProfile: {
            standard:
                wuestConstants.WUEST_QUALITY.STANDARD[qualityProfileStandard],
            condition:
                wuestConstants.WUEST_QUALITY.CONDITION[qualityProfileCondition],
          },
        },
      });
      break;

    case PROPERTY_TYPE.HOUSE:
      data = this.addProperty({
        id: propertyId,
        type: wuestConstants.WUEST_PROPERTY_TYPE.HOUSE,
        data: {
          address: {
            addressLine1: address1,
            zipCode: `${zipCode}`,
            place: city,
            countryIsoCode: 'CH',
          },
          residenceType:
              loanResidenceType
              && wuestConstants.WUEST_RESIDENCE_TYPE[
                invert(RESIDENCE_TYPE)[loanResidenceType]
              ],
          houseType,
          numberOfRooms: roomCount,
          landPlotArea: landArea,
          buildingVolume: {
            type: volumeNorm,
            value: volume,
          },
          parking: {
            indoor: parkingInside || 0,
            outdoor: parkingOutside || 0,
          },
          constructionYear,
          minergieCertificate: minergie,
          qualityProfile: {
            standard:
                wuestConstants.WUEST_QUALITY.STANDARD[qualityProfileStandard],
            condition:
                wuestConstants.WUEST_QUALITY.CONDITION[qualityProfileCondition],
          },
        },
      });
      break;

    default:
      return null;
    }

    return data;
  }

  evaluateAll() {
    return this.evaluate(this.properties);
  }

  hasWuestPrefix = string => string.includes('.');

  formatMicrolocationId(type, filter) {
    let id = type;
    if (this.hasWuestPrefix(id)) {
      id = type.replace(filter, '');
    }
    return camelCase(id);
  }

  buildMicrolocationObject(filter, microlocationData) {
    const factors = microlocationData
      .filter(({ type }) => type.startsWith(filter))
      .reduce((acc, factor) => {
        const { grade, text, type } = factor;
        return {
          ...acc,
          [this.formatMicrolocationId(type, filter)]: { grade, text },
        };
      }, {});

    const rootFactor = microlocationData.filter(({ type }) => type === filter)[0];

    return merge({ grade: rootFactor.grade }, omit(factors, filter));
  }

  formatMicrolocation(microlocationData) {
    const terrain = this.buildMicrolocationObject(
      'TERRAIN',
      microlocationData.factors,
    );

    const infrastructure = this.buildMicrolocationObject(
      'INFRASTRUCTURE',
      microlocationData.factors,
    );

    const immission = this.buildMicrolocationObject(
      'IMMISSION',
      microlocationData.factors,
    );

    return {
      grade: microlocationData.grade,
      factors: { terrain, infrastructure, immission },
    };
  }

  getPriceRange({
    marketValueBeforeCorrection,
    statisticalPriceRangeMin,
    statisticalPriceRangeMax,
  }) {
    return {
      min:
        marketValueBeforeCorrection
        - VALUATION_RANGE_FACTOR
          * (marketValueBeforeCorrection - statisticalPriceRangeMin),
      max:
        marketValueBeforeCorrection
        + VALUATION_RANGE_FACTOR
          * (statisticalPriceRangeMax - marketValueBeforeCorrection),
    };
  }

  formatResult({ keyFigures: { marketValueBeforeCorrection }, embedded }) {
    const {
      statisticalPriceRangeMin,
      statisticalPriceRangeMax,
    } = embedded.find(({ rel }) => rel === 'keyFigureExtension').value;

    // Get first element of 'content' because wuest API returns an array of microlocations
    const {
      value: {
        content: [microlocation],
      },
    } = embedded.find(({ rel }) => rel === 'microLocationProfiles');

    return {
      value: marketValueBeforeCorrection,
      ...this.getPriceRange({
        marketValueBeforeCorrection,
        statisticalPriceRangeMin,
        statisticalPriceRangeMax,
      }),
      microlocation: this.formatMicrolocation(microlocation),
    };
  }

  cleanUpResults(results) {
    if (results.length === 1) {
      return results[0];
    }
    return results;
  }

  formatError(error) {
    return error.message.replace('{0}', error.validationErrors[0].message);
  }

  handleResult(result) {
    if (result.status === 503) {
      throw new Meteor.Error(
        wuestConstants.WUEST_ERRORS.WUEST_API_ERROR,
        'En maintenance, réessayez plus tard',
      );
    }

    return result.json().then((response) => {
      if (response.errorCode) {
        const errorMessage = this.formatError(response);
        throw new Meteor.Error(
          wuestConstants.WUEST_ERRORS.WUEST_API_ERROR,
          errorMessage,
        );
      }

      return response;
    });
  }

  evaluate(properties) {
    const promises = properties.map((property) => {
      property.property.generateJSONData();

      return this.getData(property.property.JSONData)
        .then(result => this.handleResult(result))
        .then(result => this.formatResult(result));
    });
    this.properties = [];
    return Promise.all(promises).then(this.cleanUpResults);
  }
}

export default new WuestService();
