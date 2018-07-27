/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import WuestService from '../WuestService';
import {
  WUEST_ERRORS,
  FLOOR_NUMBER,
  PROPERTY_TYPE,
} from '../../wuestConstants';
import { PROPERTY_STYLE } from '../../../properties/propertyConstants';

describe('WuestService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('createPropertyFromCollection', () => {
    it('throws an error if it can not find the property', () => {
      expect(() => WuestService.createPropertyFromCollection('test')).to.throw(WUEST_ERRORS.NO_PROPERTY_FOUND);
    });
  });

  describe('getErrors returns an error when ', () => {
    it('floor number is not provided', () => {
      const property = {
        type: PROPERTY_TYPE.FLAT,
        data: { floorType: null },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_FLOOR_NUMBER_PROVIDED);
    });

    it('floor number exceeds 20', () => {
      const property = {
        type: PROPERTY_TYPE.FLAT,
        data: { floorType: FLOOR_NUMBER[21] },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.INVALID_FLOOR_NUMBER);
    });

    it('no address is provided', () => {
      const property = {
        data: {
          address: null,
        },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_ADDRESS_PROVIDED);
    });

    it('no address line 1 is provided', () => {
      const property = { data: { address: { addressLine1: '' } } };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_ADDRESS_LINE_1_PROVIDED);
    });

    it('no zipCode is provided', () => {
      const property = { data: { address: { zipCode: '' } } };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_ZIPCODE_PROVIDED);
    });

    it('no city is provided', () => {
      const property = { data: { address: { place: '' } } };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_CITY_PROVIDED);
    });

    it('no country is provided', () => {
      const property = { data: { address: { countryIsoCode: '' } } };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_COUNTRY_PROVIDED);
    });

    it('no residence type is provided', () => {
      const property = {
        data: {
          residenceType: null,
        },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_RESIDENCE_TYPE_PROVIDED);
    });

    it('residence type is invalid', () => {
      const property = {
        data: { redidenceType: 'not known' },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.INVALID_RESIDENCE_TYPE);
    });

    it('no number of rooms is provided', () => {
      const property = {
        data: { numberOfRooms: null },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_NUMBER_OF_ROOMS_PROVIDED);
    });

    it('no construction year is provided', () => {
      const property = {
        data: { constructionYear: null },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_CONSTRUCTION_YEAR_PROVIDED);
    });

    it('no minergie certificate is provided', () => {
      const property = {
        data: { minergieCertificate: null },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_MINERGIE_CERTIFICATE_PROVIDED);
    });

    it('minergie certificate is invalid', () => {
      const property = {
        data: { minergieCertificate: 'not known' },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.INVALID_MINERGIE_CERTIFICATE);
    });

    it('no parking is provided', () => {
      const property = {
        data: { parking: null },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_PARKING_PROVIDED);
    });

    it('no inside parking is provided', () => {
      const property = {
        data: {
          parking: {
            indoor: null,
          },
        },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_INSIDE_PARKING_PROVIDED);
    });

    it('no outside parking is provided', () => {
      const property = {
        data: {
          parking: {
            outdoor: null,
          },
        },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_OUTSIDE_PARKING_PROVIDED);
    });

    it('no house type is provided', () => {
      const property = { type: PROPERTY_TYPE.HOUSE, data: { houseType: '' } };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_HOUSE_TYPE_PROVIDED);
    });

    it('house type is invalid', () => {
      const property = {
        type: PROPERTY_TYPE.HOUSE,
        data: { houseType: 'not known' },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.INVALID_HOUSE_TYPE);
    });

    it('no building volume is provided', () => {
      const property = {
        type: PROPERTY_TYPE.HOUSE,
        data: { buildingVolume: {} },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_HOUSE_TYPE_PROVIDED);
    });

    it('no building volume value is provided', () => {
      const property = {
        type: PROPERTY_TYPE.HOUSE,
        data: { buildingVolume: { value: null } },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_BUILDING_VOLUME_VALUE_PROVIDED);
    });

    it('no building volume type is provided', () => {
      const property = {
        type: PROPERTY_TYPE.HOUSE,
        data: { buildingVolume: { type: '' } },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_BUILDING_VOLUME_TYPE_PROVIDED);
    });

    it('building volume type is invalid', () => {
      const property = {
        type: PROPERTY_TYPE.HOUSE,
        data: { buildingVolume: { type: 'not known' } },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.INVALID_BUILDING_VOLUME_TYPE);
    });

    it('no landplot area is provided', () => {
      const property = {
        type: PROPERTY_TYPE.HOUSE,
        data: { landPlotAres: null },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_LANDPLOT_AREA_PROVIDED);
    });

    it('no quality profile is provided', () => {
      const property = {
        data: { qualityProfile: null },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_QUALITY_PROFILE_PROVIDED);
    });

    it('no quality profile standard is provided', () => {
      const property = {
        data: {
          qualityProfile: {
            standard: null,
          },
        },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_QUALITY_PROFILE_STANDARD_PROVIDED);
    });

    it('no quality profile condition is provided', () => {
      const property = {
        data: {
          qualityProfile: {
            condition: null,
          },
        },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_QUALITY_PROFILE_CONDITION_PROVIDED);
    });

    it('no quality profile situation is provided', () => {
      const property = {
        data: {
          qualityProfile: {
            situation: null,
          },
        },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_QUALITY_PROFILE_SITUATION_PROVIDED);
    });

    it('quality profile standard is invalid', () => {
      const property = {
        data: {
          qualityProfile: {
            standard: 'not known',
          },
        },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.INVALID_QUALITY_PROFILE_STANDARD);
    });

    it('quality profile condition is invalid', () => {
      const property = {
        data: {
          qualityProfile: {
            condition: 'not known',
          },
        },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.INVALID_QUALITY_PROFILE_CONDITION);
    });

    it('quality profile situation is invalid', () => {
      const property = {
        data: {
          qualityProfile: {
            situation: 'not known',
          },
        },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.INVALID_QUALITY_PROFILE_SITUATION);
    });

    it('no flat type is provided', () => {
      const property = {
        type: PROPERTY_TYPE.FLAT,
        data: {
          flatType: null,
        },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_FLAT_TYPE_PROVIDED);
    });

    it('flat type is invalid', () => {
      const property = {
        type: PROPERTY_TYPE.FLAT,
        data: {
          flatType: 'not known',
        },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.INVALID_FLAT_TYPE);
    });

    it('no number of floors is provided', () => {
      const property = {
        type: PROPERTY_TYPE.FLAT,
        data: {
          numberOfFloors: null,
        },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_NUMBER_OF_FLOORS_PROVIDED);
    });

    it('floor number exceeds total number of floors', () => {
      const property = {
        type: PROPERTY_TYPE.FLAT,
        data: {
          numberOfFloors: 5,
          floorType: FLOOR_NUMBER[6],
        },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.FLOOR_NUMBER_EXCEEDS_TOTAL_NUMBER_OF_FLOORS);
    });

    it('no usable area is provided', () => {
      const property = {
        type: PROPERTY_TYPE.FLAT,
        data: {
          usableArea: null,
        },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_USABLE_AREA_PROVIDED);
    });

    it('no usable area value is provided', () => {
      const property = {
        type: PROPERTY_TYPE.FLAT,
        data: {
          usableArea: {
            value: null,
          },
        },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_USABLE_AREA_VALUE_PROVIDED);
    });

    it('no usable area type is provided', () => {
      const property = {
        type: PROPERTY_TYPE.FLAT,
        data: {
          usableArea: {
            type: null,
          },
        },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.NO_USABLE_AREA_TYPE_PROVIDED);
    });

    it('usable area type is invalid', () => {
      const property = {
        type: PROPERTY_TYPE.FLAT,
        data: {
          usableArea: {
            type: 'not known',
          },
        },
      };
      expect(WuestService.getErrors(property)).to.include(WUEST_ERRORS.INVALID_USABLE_AREA_TYPE);
    });
  });

  describe('formatError', () => {
    it('formats an error correctly', () => {
      const error = {
        message: 'Error {0}',
        validationErrors: [
          {
            field: 'field1',
            message: 'on field1',
          },
        ],
      };

      expect(WuestService.formatError(error)).to.equal('Error on field1');
    });
  });

  describe('evaluateById', () => {
    it('returns min and max', () => {
      const propertyId = Factory.create('property', {
        style: PROPERTY_STYLE.FLAT,
        address1: 'rue du four 2',
        zipCode: '1400',
        city: 'Yverdon-les-Bains',
        roomCount: 4,
        constructionYear: 2000,
        insideArea: 100,
        terraceArea: 20,
      })._id;
      return WuestService.evaluateById(propertyId).then((result) => {
        expect(result).to.deep.equal({
          min: 580000,
          max: 690000,
          value: 633000,
        });
      });
    }).timeout(10000);
  });
});
