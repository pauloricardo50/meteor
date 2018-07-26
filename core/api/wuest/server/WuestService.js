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
  ERRORS,
} from '../wuestConstants';
import Properties from '../../properties';
import { PROPERTY_STYLE, USAGE_TYPE } from '../../constants';

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
    let data;
    switch (property.type) {
    case PROPERTY_TYPE.HOUSE:
      data = this.buildHouse(property);
      break;
    case PROPERTY_TYPE.FLAT:
      data = this.buildFlat(property);
      break;
    default:
      return;
    }
    this.properties.push(data);
    return data;
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
      throw new Meteor.Error(ERRORS.NO_PROPERTY_FOUND);
    }

    switch (property.style) {
    case PROPERTY_STYLE.FLAT:
      data = this.addProperty({
        id: propertyId,
        type: PROPERTY_TYPE.FLAT,
        data: {
          address: {
            addressLine1: property.address1,
            zipCode: property.zipCode.toString(),
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
          floorType: FLOOR_NUMBER[2],
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
            zipCode: property.zipCode.toString(),
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
      return;
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

  handleResult(result) {
    return result.json().then((response) => {
      if (response.errorCode) {
        const errorMessage = response.message.replace(
          "'{0}'",
          response.validationErrors[0].message,
        );
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
    return Promise.all(promises).then(this.cleanUpResults);
  }
}

export default new WuestService();
