import fetch from 'node-fetch';
import { Meteor } from 'meteor/meteor';
import House from './House';
import Flat from './Flat';
import {
  URL,
  TOKEN,
  RESIDENCE_TYPE,
  HOUSE_TYPE,
  FLAT_TYPE,
  MINERGIE_CERTIFICATE,
  QUALITY,
  FLOOR_NUMBER,
  PROPERTY_TYPE,
  VOLUME_TYPE,
  AREA_TYPE,
  WUEST_ERRORS,
} from '../wuestConstants';
import Properties from '../../properties';
import { PROPERTY_STYLE, USAGE_TYPE } from '../../constants';

const valueIsDefined = value => (value === 0 ? true : !!value);
class WuestService {
  constructor() {
    this.properties = [];
  }

  getData = property =>
    fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(property),
    });

  addProperty(property) {
    this.checkPropertySanity(property);
    let data;
    switch (property.type) {
    case PROPERTY_TYPE.HOUSE:
      data = this.buildHouse(property);
      break;
    case PROPERTY_TYPE.FLAT:
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
        error: WUEST_ERRORS.NO_PROPERTY_DATA_PROVIDED,
      },
      {
        sanityCheck: ({ data: { address } }) => !!address,
        error: WUEST_ERRORS.NO_ADDRESS_PROVIDED,
      },
      {
        sanityCheck: ({ data: { address } }) =>
          !!address && !!address.addressLine1,
        error: WUEST_ERRORS.NO_ADDRESS_LINE_1_PROVIDED,
      },
      {
        sanityCheck: ({ data: { address } }) => !!address && !!address.zipCode,
        error: WUEST_ERRORS.NO_ZIPCODE_PROVIDED,
      },
      {
        sanityCheck: ({ data: { address } }) => !!address && !!address.place,
        error: WUEST_ERRORS.NO_CITY_PROVIDED,
      },
      {
        sanityCheck: ({ data: { address } }) =>
          !!address && !!address.countryIsoCode,
        error: WUEST_ERRORS.NO_COUNTRY_PROVIDED,
      },
      {
        sanityCheck: ({ data: { numberOfRooms } }) => !!numberOfRooms,
        error: WUEST_ERRORS.NO_NUMBER_OF_ROOMS_PROVIDED,
      },
      {
        sanityCheck: ({ data: { constructionYear } }) => !!constructionYear,
        error: WUEST_ERRORS.NO_CONSTRUCTION_YEAR_PROVIDED,
      },
      {
        sanityCheck: ({ data: { minergieCertificate } }) =>
          !!minergieCertificate,
        error: WUEST_ERRORS.NO_MINERGIE_CERTIFICATE_PROVIDED,
      },
      {
        sanityCheck: ({ data: { minergieCertificate } }) =>
          Object.values(MINERGIE_CERTIFICATE).includes(minergieCertificate),
        error: WUEST_ERRORS.INVALID_MINERGIE_CERTIFICATE,
      },
      {
        sanityCheck: ({ data: { parking } }) => !!parking,
        error: WUEST_ERRORS.NO_PARKING_PROVIDED,
      },
      {
        sanityCheck: ({ data: { parking } }) =>
          !!parking && valueIsDefined(parking.indoor),
        error: WUEST_ERRORS.NO_INSIDE_PARKING_PROVIDED,
      },
      {
        sanityCheck: ({ data: { parking } }) =>
          !!parking && valueIsDefined(parking.outdoor),
        error: WUEST_ERRORS.NO_OUTSIDE_PARKING_PROVIDED,
      },
      {
        sanityCheck: ({ data: { qualityProfile } }) => !!qualityProfile,
        error: WUEST_ERRORS.NO_QUALITY_PROFILE_PROVIDED,
      },
      {
        sanityCheck: ({ data: { qualityProfile } }) =>
          !!qualityProfile && !!qualityProfile.standard,
        error: WUEST_ERRORS.NO_QUALITY_PROFILE_STANDARD_PROVIDED,
      },
      {
        sanityCheck: ({ data: { qualityProfile } }) =>
          !!qualityProfile &&
          Object.values(QUALITY.STANDARD).includes(qualityProfile.standard),
        error: WUEST_ERRORS.INVALID_QUALITY_PROFILE_STANDARD,
      },
      {
        sanityCheck: ({ data: { qualityProfile } }) =>
          !!qualityProfile && !!qualityProfile.condition,
        error: WUEST_ERRORS.NO_QUALITY_PROFILE_CONDITION_PROVIDED,
      },
      {
        sanityCheck: ({ data: { qualityProfile } }) =>
          !!qualityProfile &&
          Object.values(QUALITY.CONDITION).includes(qualityProfile.condition),
        error: WUEST_ERRORS.INVALID_QUALITY_PROFILE_CONDITION,
      },
      {
        sanityCheck: ({ data: { qualityProfile } }) =>
          !!qualityProfile && !!qualityProfile.situation,
        error: WUEST_ERRORS.NO_QUALITY_PROFILE_SITUATION_PROVIDED,
      },
      {
        sanityCheck: ({ data: { qualityProfile } }) =>
          !!qualityProfile &&
          Object.values(QUALITY.SITUATION).includes(qualityProfile.situation),
        error: WUEST_ERRORS.INVALID_QUALITY_PROFILE_SITUATION,
      },
      {
        sanityCheck: ({ data: { residenceType } }) => !!residenceType,
        error: WUEST_ERRORS.NO_RESIDENCE_TYPE_PROVIDED,
      },
      {
        sanityCheck: ({ data: { residenceType } }) =>
          Object.values(RESIDENCE_TYPE).includes(residenceType),
        error: WUEST_ERRORS.INVALID_RESIDENCE_TYPE,
      },
      {
        sanityCheck: ({ type, data: { houseType } }) =>
          (type === PROPERTY_TYPE.FLAT ? true : !!houseType),
        error: WUEST_ERRORS.NO_HOUSE_TYPE_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { houseType } }) =>
          (type === PROPERTY_TYPE.FLAT
            ? true
            : Object.values(HOUSE_TYPE).includes(houseType)),
        error: WUEST_ERRORS.INVALID_HOUSE_TYPE,
      },
      {
        sanityCheck: ({ type, data: { buildingVolume } }) =>
          (type === PROPERTY_TYPE.FLAT ? true : !!buildingVolume),
        error: WUEST_ERRORS.NO_BUILDING_VOLUME_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { buildingVolume } }) =>
          (type === PROPERTY_TYPE.FLAT
            ? true
            : !!buildingVolume && !!buildingVolume.value),
        error: WUEST_ERRORS.NO_BUILDING_VOLUME_VALUE_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { buildingVolume } }) =>
          (type === PROPERTY_TYPE.FLAT
            ? true
            : !!buildingVolume && !!buildingVolume.type),
        error: WUEST_ERRORS.NO_BUILDING_VOLUME_TYPE_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { buildingVolume } }) =>
          (type === PROPERTY_TYPE.FLAT
            ? true
            : !!buildingVolume &&
              Object.values(VOLUME_TYPE).includes(buildingVolume.type)),
        error: WUEST_ERRORS.INVALID_BUILDING_VOLUME_TYPE,
      },
      {
        sanityCheck: ({ type, data: { landPlotArea } }) =>
          (type === PROPERTY_TYPE.FLAT ? true : !!landPlotArea),
        error: WUEST_ERRORS.NO_LANDPLOT_AREA_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { floorType } }) =>
          (type === PROPERTY_TYPE.HOUSE ? true : !!floorType),
        error: WUEST_ERRORS.NO_FLOOR_NUMBER_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { floorType } }) =>
          (type === PROPERTY_TYPE.HOUSE
            ? true
            : FLOOR_NUMBER.includes(floorType)),
        error: WUEST_ERRORS.INVALID_FLOOR_NUMBER,
      },
      {
        sanityCheck: ({ type, data: { flatType } }) =>
          (type === PROPERTY_TYPE.HOUSE ? true : !!flatType),
        error: WUEST_ERRORS.NO_FLAT_TYPE_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { flatType } }) =>
          (type === PROPERTY_TYPE.HOUSE
            ? true
            : Object.values(FLAT_TYPE).includes(flatType)),
        error: WUEST_ERRORS.INVALID_FLAT_TYPE,
      },
      {
        sanityCheck: ({ type, data: { numberOfFloors } }) =>
          (type === PROPERTY_TYPE.HOUSE ? true : !!numberOfFloors),
        error: WUEST_ERRORS.NO_NUMBER_OF_FLOORS_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { numberOfFloors, floorType } }) =>
          (type === PROPERTY_TYPE.HOUSE
            ? true
            : FLOOR_NUMBER.indexOf(floorType) <= numberOfFloors),
        error: WUEST_ERRORS.FLOOR_NUMBER_EXCEEDS_TOTAL_NUMBER_OF_FLOORS,
      },
      {
        sanityCheck: ({ type, data: { usableArea } }) =>
          (type === PROPERTY_TYPE.HOUSE ? true : !!usableArea),
        error: WUEST_ERRORS.NO_USABLE_AREA_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { usableArea } }) =>
          (type === PROPERTY_TYPE.HOUSE
            ? true
            : !!usableArea && !!usableArea.value),
        error: WUEST_ERRORS.NO_USABLE_AREA_VALUE_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { usableArea } }) =>
          (type === PROPERTY_TYPE.HOUSE
            ? true
            : !!usableArea && !!usableArea.type),
        error: WUEST_ERRORS.NO_USABLE_AREA_TYPE_PROVIDED,
      },
      {
        sanityCheck: ({ type, data: { usableArea } }) =>
          (type === PROPERTY_TYPE.HOUSE
            ? true
            : !!usableArea &&
              Object.values(AREA_TYPE).includes(usableArea.type)),
        error: WUEST_ERRORS.INVALID_USABLE_AREA_TYPE,
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
      throw new Meteor.Error(errors[0]);
    }
  }

  buildHouse(property) {
    const { id, type, data: houseData } = property;
    const house = new House();
    house.setValue({ path: 'address', value: houseData.address });
    house.setValue({ path: 'residenceType', value: houseData.residenceType });
    house.setValue({ path: 'houseType', value: houseData.houseType });
    house.setValue({ path: 'numberOfRooms', value: houseData.numberOfRooms });
    house.setValue({ path: 'parking', value: houseData.parking });
    house.setValue({
      path: 'constructionYear',
      value: houseData.constructionYear,
    });
    house.setValue({
      path: 'minergieCertificate',
      value: houseData.minergieCertificate,
    });
    house.setValue({
      path: 'buildingVolume',
      value: {
        value: houseData.buildingVolume.value,
        type: houseData.buildingVolume.type,
      },
    });
    house.setValue({ path: 'landPlotArea', value: houseData.landPlotArea });
    house.setValue({ path: 'qualityProfile', value: houseData.qualityProfile });
    return { id, type, property: house };
  }

  buildFlat(property) {
    const { id, type, data: flatData } = property;
    const flat = new Flat();
    flat.setValue({ path: 'address', value: flatData.address });
    flat.setValue({ path: 'residenceType', value: flatData.residenceType });
    flat.setValue({ path: 'flatType', value: flatData.flatType });
    flat.setValue({ path: 'numberOfRooms', value: flatData.numberOfRooms });
    flat.setValue({ path: 'numberOfFloors', value: flatData.numberOfFloors });
    flat.setValue({
      path: 'numberOfFlats',
      value: flatData.numberOfFloors * 2,
    });
    flat.setValue({ path: 'floorType', value: flatData.floorType });
    flat.setValue({ path: 'parking', value: flatData.parking });
    flat.setValue({
      path: 'constructionYear',
      value: flatData.constructionYear,
    });
    flat.setValue({
      path: 'minergieCertificate',
      value: flatData.minergieCertificate,
    });
    flat.setValue({
      path: 'usableArea',
      value: {
        value: flatData.usableArea.value,
        type: flatData.usableArea.type,
      },
    });
    flat.setValue({ path: 'terraceArea', value: flatData.terraceArea });
    flat.setValue({ path: 'qualityProfile', value: flatData.qualityProfile });

    return { id, type, property: flat };
  }

  evaluateById(propertyId) {
    const property = this.createPropertyFromCollection(propertyId);
    return this.evaluate([property]);
  }

  createPropertyFromCollection(propertyId) {
    let data;
    const property = Properties.findOne(propertyId);

    if (!property) {
      throw new Meteor.Error(WUEST_ERRORS.NO_PROPERTY_FOUND);
    }

    switch (property.style) {
    case PROPERTY_STYLE.FLAT:
      data = this.addProperty({
        id: propertyId,
        type: PROPERTY_TYPE.FLAT,
        data: {
          address: {
            addressLine1: property.address1,
            zipCode: `${property.zipCode}`,
            place: property.city,
            countryIsoCode: 'CH',
          },
          residenceType:
              property.usageType === USAGE_TYPE.PRIMARY
                ? RESIDENCE_TYPE.MAIN
                : RESIDENCE_TYPE.SECOND,
          flatType: FLAT_TYPE.SINGLE_FLOOR,
          numberOfRooms: property.roomCount,
          numberOfFloors: 4,
          floorType: FLOOR_NUMBER[property.floorNumber || 2],
          usableArea: {
            type: AREA_TYPE.NET,
            value: property.insideArea,
          },
          terraceArea: property.terraceArea,
          parking: {
            indoor: property.parking.inside || 0,
            outdoor: property.parking.outside || 0,
          },
          constructionYear: property.constructionYear,
          minergieCertificate: property.minergie
            ? MINERGIE_CERTIFICATE.P
            : MINERGIE_CERTIFICATE.WITHOUT,
          qualityProfile: {
            standard: QUALITY.STANDARD.AVERAGE,
            condition: QUALITY.CONDITION.INTACT,
            situation: QUALITY.SITUATION.AVERAGE,
          },
        },
      });
      break;

    case PROPERTY_STYLE.VILLA:
      data = this.addProperty({
        id: propertyId,
        type: PROPERTY_TYPE.HOUSE,
        data: {
          address: {
            addressLine1: property.address1,
            zipCode: `${property.zipCode}`,
            place: property.city,
            countryIsoCode: 'CH',
          },
          residenceType:
              property.usageType === USAGE_TYPE.PRIMARY
                ? RESIDENCE_TYPE.MAIN
                : RESIDENCE_TYPE.SECOND,
          houseType: HOUSE_TYPE.DETACHED,
          numberOfRooms: property.roomCount,
          landPlotArea: property.landArea,
          buildingVolume: {
            type: VOLUME_TYPE.SIA_416,
            value: property.volume,
          },
          parking: {
            indoor: property.parking.inside || 0,
            outdoor: property.parking.outside || 0,
          },
          constructionYear: property.constructionYear,
          minergieCertificate: property.minergie
            ? MINERGIE_CERTIFICATE.P
            : MINERGIE_CERTIFICATE.WITHOUT,
          qualityProfile: {
            standard: QUALITY.STANDARD.AVERAGE,
            condition: QUALITY.CONDITION.INTACT,
            situation: QUALITY.SITUATION.AVERAGE,
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

  formatResult({ keyFigures: { marketValueBeforeCorrection }, embedded }) {
    const {
      statisticalPriceRangeMin,
      statisticalPriceRangeMax,
    } = embedded.find(({ rel }) => rel === 'keyFigureExtension').value;
    return {
      value: marketValueBeforeCorrection,
      min: statisticalPriceRangeMin,
      max: statisticalPriceRangeMax,
    };
  }

  cleanUpResults(results) {
    if (results.length === 1) {
      return results[0];
    }
    return results;
  }

  formatError(error) {
    return error.message.replace(
      "{0}",
      error.validationErrors[0].message,
    );
  }
  handleResult(result) {
    return result.json().then((response) => {
      if (response.errorCode) {
        const errorMessage = this.formatError(response);
        throw new Meteor.Error(errorMessage);
      }
      return response;
    });
  }

  evaluate(properties) {
    const promises = properties.map((property) => {
      property.property.generateJSONData();
      return this.getData(property.property.JSONData)
        .then(this.handleResult)
        .then(this.formatResult);
    });
    this.properties = [];
    return Promise.all(promises).then(this.cleanUpResults);
  }
}

export default new WuestService();
