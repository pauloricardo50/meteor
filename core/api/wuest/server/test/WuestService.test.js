/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import WuestService from '../WuestService';

import * as wuestConstants from '../../wuestConstants';
import { QUALITY } from '../../../constants';
import { PROPERTY_TYPE } from '../../../properties/propertyConstants';

describe.skip('WuestService', function () {
  this.timeout(10000);

  beforeEach(() => {
    resetDatabase();
  });

  context('createPropertyFromCollection', () => {
    it('throws an error if it can not find the property', () => {
      expect(() => WuestService.createPropertyFromCollection('test')).to.throw(wuestConstants.WUEST_ERRORS.NO_PROPERTY_FOUND);
    });
  });

  context('getErrors ', () => {
    it('returns an empty array if provided data is correct', () => {
      const property = {
        type: wuestConstants.WUEST_PROPERTY_TYPE.HOUSE,
        data: {
          address: {
            addressLine1: 'Rue du test 12',
            zipCode: '1201',
            place: 'Genève',
            countryIsoCode: 'CH',
          },
          residenceType: wuestConstants.WUEST_RESIDENCE_TYPE.MAIN_RESIDENCE,
          houseType: wuestConstants.WUEST_HOUSE_TYPE.DETACHED,
          numberOfRooms: 4,
          parking: {
            indoor: 1,
            outdoor: 1,
          },
          constructionYear: 2000,
          minergieCertificate:
            wuestConstants.WUEST_MINERGIE_CERTIFICATE.WITHOUT_CERTIFICATE,
          buildingVolume: {
            type: wuestConstants.WUEST_VOLUME_TYPE.SIA_416,
            value: 1000,
          },
          landPlotArea: 1000,
          qualityProfile: {
            standard: wuestConstants.WUEST_QUALITY.STANDARD.AVERAGE,
            condition: wuestConstants.WUEST_QUALITY.CONDITION.NEEDS_RENOVATION,
          },
        },
      };

      expect(WuestService.getErrors(property)).to.deep.equal([]);
    });

    context('returns an error when ', () => {
      it('floor number is not provided', () => {
        const property = {
          type: wuestConstants.WUEST_PROPERTY_TYPE.FLAT,
          data: { floorType: null },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_FLOOR_NUMBER_PROVIDED);
      });

      it('floor number exceeds 20', () => {
        const property = {
          type: wuestConstants.WUEST_PROPERTY_TYPE.FLAT,
          data: { floorType: wuestConstants.WUEST_FLOOR_NUMBER[21] },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.INVALID_FLOOR_NUMBER);
      });

      it('no address is provided', () => {
        const property = {
          data: {
            address: null,
          },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_ADDRESS_PROVIDED);
      });

      it('no address line 1 is provided', () => {
        const property = { data: { address: { addressLine1: '' } } };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_ADDRESS_LINE_1_PROVIDED);
      });

      it('no zipCode is provided', () => {
        const property = { data: { address: { zipCode: '' } } };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_ZIPCODE_PROVIDED);
      });

      it('no city is provided', () => {
        const property = { data: { address: { place: '' } } };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_CITY_PROVIDED);
      });

      it('no country is provided', () => {
        const property = { data: { address: { countryIsoCode: '' } } };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_COUNTRY_PROVIDED);
      });

      it('no residence type is provided', () => {
        const property = {
          data: {
            residenceType: null,
          },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_RESIDENCE_TYPE_PROVIDED);
      });

      it('residence type is invalid', () => {
        const property = {
          data: { redidenceType: 'not known' },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.INVALID_RESIDENCE_TYPE);
      });

      it('no number of rooms is provided', () => {
        const property = {
          data: { numberOfRooms: null },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_NUMBER_OF_ROOMS_PROVIDED);
      });

      it('no construction year is provided', () => {
        const property = {
          data: { constructionYear: null },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_CONSTRUCTION_YEAR_PROVIDED);
      });

      it('no minergie certificate is provided', () => {
        const property = {
          data: { minergieCertificate: null },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_MINERGIE_CERTIFICATE_PROVIDED);
      });

      it('minergie certificate is invalid', () => {
        const property = {
          data: { minergieCertificate: 'not known' },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.INVALID_MINERGIE_CERTIFICATE);
      });

      it('no parking is provided', () => {
        const property = {
          data: { parking: null },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_PARKING_PROVIDED);
      });

      it('no inside parking is provided', () => {
        const property = {
          data: {
            parking: {
              indoor: null,
            },
          },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_INSIDE_PARKING_PROVIDED);
      });

      it('no outside parking is provided', () => {
        const property = {
          data: {
            parking: {
              outdoor: null,
            },
          },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_OUTSIDE_PARKING_PROVIDED);
      });

      it('no house type is provided', () => {
        const property = {
          type: wuestConstants.WUEST_PROPERTY_TYPE.HOUSE,
          data: { houseType: '' },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_HOUSE_TYPE_PROVIDED);
      });

      it('house type is invalid', () => {
        const property = {
          type: wuestConstants.WUEST_PROPERTY_TYPE.HOUSE,
          data: { houseType: 'not known' },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.INVALID_HOUSE_TYPE);
      });

      it('no building volume is provided', () => {
        const property = {
          type: wuestConstants.WUEST_PROPERTY_TYPE.HOUSE,
          data: { buildingVolume: {} },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_HOUSE_TYPE_PROVIDED);
      });

      it('no building volume value is provided', () => {
        const property = {
          type: wuestConstants.WUEST_PROPERTY_TYPE.HOUSE,
          data: { buildingVolume: { value: null } },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_BUILDING_VOLUME_VALUE_PROVIDED);
      });

      it('no building volume type is provided', () => {
        const property = {
          type: wuestConstants.WUEST_PROPERTY_TYPE.HOUSE,
          data: { buildingVolume: { type: '' } },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_BUILDING_VOLUME_TYPE_PROVIDED);
      });

      it('building volume type is invalid', () => {
        const property = {
          type: wuestConstants.WUEST_PROPERTY_TYPE.HOUSE,
          data: { buildingVolume: { type: 'not known' } },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.INVALID_BUILDING_VOLUME_TYPE);
      });

      it('no landplot area is provided', () => {
        const property = {
          type: wuestConstants.WUEST_PROPERTY_TYPE.HOUSE,
          data: { landPlotArea: null },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_LANDPLOT_AREA_PROVIDED);
      });

      it('no quality profile is provided', () => {
        const property = {
          data: { qualityProfile: null },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_QUALITY_PROFILE_PROVIDED);
      });

      it('no quality profile standard is provided', () => {
        const property = {
          data: {
            qualityProfile: {
              standard: null,
            },
          },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_QUALITY_PROFILE_STANDARD_PROVIDED);
      });

      it('no quality profile condition is provided', () => {
        const property = {
          data: {
            qualityProfile: {
              condition: null,
            },
          },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_QUALITY_PROFILE_CONDITION_PROVIDED);
      });

      it('quality profile standard is invalid', () => {
        const property = {
          data: {
            qualityProfile: {
              standard: 'not known',
            },
          },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.INVALID_QUALITY_PROFILE_STANDARD);
      });

      it('quality profile condition is invalid', () => {
        const property = {
          data: {
            qualityProfile: {
              condition: 'not known',
            },
          },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.INVALID_QUALITY_PROFILE_CONDITION);
      });

      it('no flat type is provided', () => {
        const property = {
          type: wuestConstants.WUEST_PROPERTY_TYPE.FLAT,
          data: {
            flatType: null,
          },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_FLAT_TYPE_PROVIDED);
      });

      it('flat type is invalid', () => {
        const property = {
          type: wuestConstants.WUEST_PROPERTY_TYPE.FLAT,
          data: {
            flatType: 'not known',
          },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.INVALID_FLAT_TYPE);
      });

      it('no number of floors is provided', () => {
        const property = {
          type: wuestConstants.WUEST_PROPERTY_TYPE.FLAT,
          data: {
            numberOfFloors: null,
          },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_NUMBER_OF_FLOORS_PROVIDED);
      });

      it('floor number exceeds total number of floors', () => {
        const property = {
          type: wuestConstants.WUEST_PROPERTY_TYPE.FLAT,
          data: {
            numberOfFloors: 5,
            floorType: wuestConstants.WUEST_FLOOR_NUMBER[6],
          },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS
          .FLOOR_NUMBER_EXCEEDS_TOTAL_NUMBER_OF_FLOORS);
      });

      it('no usable area is provided', () => {
        const property = {
          type: wuestConstants.WUEST_PROPERTY_TYPE.FLAT,
          data: {
            usableArea: null,
          },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_USABLE_AREA_PROVIDED);
      });

      it('no usable area value is provided', () => {
        const property = {
          type: wuestConstants.WUEST_PROPERTY_TYPE.FLAT,
          data: {
            usableArea: {
              value: null,
            },
          },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_USABLE_AREA_VALUE_PROVIDED);
      });

      it('no usable area type is provided', () => {
        const property = {
          type: wuestConstants.WUEST_PROPERTY_TYPE.FLAT,
          data: {
            usableArea: {
              type: null,
            },
          },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.NO_USABLE_AREA_TYPE_PROVIDED);
      });

      it('usable area type is invalid', () => {
        const property = {
          type: wuestConstants.WUEST_PROPERTY_TYPE.FLAT,
          data: {
            usableArea: {
              type: 'not known',
            },
          },
        };
        expect(WuestService.getErrors(property)).to.include(wuestConstants.WUEST_ERRORS.INVALID_USABLE_AREA_TYPE);
      });
    });
  });

  context('formatError', () => {
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

  context('formatMicrolocationId', () => {
    context('formats the id correctly when', () => {
      it('a prefix is given', () => {
        const prefix = 'SOME_PREFIX';
        const id = `${prefix}.SOME_ID_WITH_PREFIX`;

        expect(WuestService.formatMicrolocationId(id, prefix)).to.equal('someIdWithPrefix');
      });

      it('no prefix is given', () => {
        const prefix = 'SOME_PREFIX';
        const id = 'SOME_ID_WITHOUT_PREFIX';

        expect(WuestService.formatMicrolocationId(id, prefix)).to.equal('someIdWithoutPrefix');
      });
    });
  });

  context('getFloorType', () => {
    it('should return GROUND_FLOOR if flat type is TERRACE_APARTMENT', () => {
      const terraceAppartment = {
        flatType: wuestConstants.WUEST_FLAT_TYPE.TERRACE_APARTMENT,
        numberOfFloors: 8,
      };
      expect(WuestService.getFloorType(terraceAppartment)).to.equal(wuestConstants.WUEST_FLOOR_NUMBER[0]);
    });

    it('should return last floor if flat type is PENTHOUSE_APARTMENT', () => {
      const penthouseAppartment = {
        flatType: wuestConstants.WUEST_FLAT_TYPE.PENTHOUSE_APARTMENT,
        numberOfFloors: 4,
      };

      expect(WuestService.getFloorType(penthouseAppartment)).to.equal(wuestConstants.WUEST_FLOOR_NUMBER[penthouseAppartment.numberOfFloors]);
    });

    it('should return last floor if flat type is PENTHOUSE_MAISONETTE', () => {
      const penthouseMaisonette = {
        flatType: wuestConstants.WUEST_FLAT_TYPE.PENTHOUSE_MAISONETTE,
        numberOfFloors: 2,
      };

      expect(WuestService.getFloorType(penthouseMaisonette)).to.equal(wuestConstants.WUEST_FLOOR_NUMBER[penthouseMaisonette.numberOfFloors]);
    });

    it('should return the floor number if flat type is not TERRACE_APARTMENT, PENTHOUSE_APARTMENT nor PENTHOUSE_MAISONETTE', () => {
      const typesToNotInclude = [
        wuestConstants.WUEST_FLAT_TYPE.TERRACE_APARTMENT,
        wuestConstants.WUEST_FLAT_TYPE.PENTHOUSE_APARTMENT,
        wuestConstants.WUEST_FLAT_TYPE.PENTHOUSE_MAISONETTE,
      ];
      const appartments = Object.values(wuestConstants.WUEST_FLAT_TYPE)
        .filter(flatType => !typesToNotInclude.includes(flatType))
        .map(flatType => ({
          flatType,
          numberOfFloors: 10,
          floorNumber: 5,
        }));

      appartments.forEach(appartment =>
        expect(WuestService.getFloorType(appartment)).to.equal(wuestConstants.WUEST_FLOOR_NUMBER[appartment.floorNumber]));
    });
  });

  context('evaluateById', () => {
    const getValueRange = value => ({ min: value * 0.9, max: value * 1.1 });

    it('returns min, max and value', () => {
      const propertyId = Factory.create('property', {
        propertyType: PROPERTY_TYPE.FLAT,
        address1: 'rue du four 2',
        zipCode: '1400',
        city: 'Yverdon-les-Bains',
        roomCount: 4,
        constructionYear: 2000,
        insideArea: 100,
        terraceArea: 20,
        numberOfFloors: 10,
        floorNumber: 3,
        qualityProfileCondition: QUALITY.CONDITION.INTACT,
        qualityProfileStandard: QUALITY.STANDARD.AVERAGE,
      })._id;

      const loanResidenceType = wuestConstants.WUEST_RESIDENCE_TYPE.MAIN_RESIDENCE;

      return WuestService.evaluateById({ propertyId, loanResidenceType }).then((result) => {
        const marketValueBeforeCorrection = 709000;
        const statisticalPriceRangeMin = 640000;
        const statisticalPriceRangeMax = 770000;
        const priceRange = WuestService.getPriceRange({
          marketValueBeforeCorrection,
          statisticalPriceRangeMin,
          statisticalPriceRangeMax,
        });
        const valueRange = getValueRange(marketValueBeforeCorrection);
        const minRange = getValueRange(priceRange.min);
        const maxRange = getValueRange(priceRange.max);
        expect(result.value).to.be.within(valueRange.min, valueRange.max);
        expect(result.min).to.be.within(minRange.min, minRange.max);
        expect(result.max).to.be.within(maxRange.min, maxRange.max);
      });
    });

    it('returns micro location', () => {
      const propertyId = Factory.create('property', {
        propertyType: PROPERTY_TYPE.FLAT,
        address1: 'rue du four 2',
        zipCode: '1400',
        city: 'Yverdon-les-Bains',
        roomCount: 4,
        constructionYear: 2000,
        insideArea: 100,
        terraceArea: 20,
        numberOfFloors: 10,
        floorNumber: 3,
        qualityProfileCondition: QUALITY.CONDITION.INTACT,
        qualityProfileStandard: QUALITY.STANDARD.AVERAGE,
      })._id;

      const loanResidenceType = wuestConstants.WUEST_RESIDENCE_TYPE.MAIN_RESIDENCE;

      return WuestService.evaluateById({ propertyId, loanResidenceType }).then((result) => {
        expect(result).to.have.property('microlocation');
        expect(result.microlocation).to.have.property('grade');
        expect(result.microlocation.factors).to.have.property('terrain');
        expect(result.microlocation.factors).to.have.property('infrastructure');
        expect(result.microlocation.factors).to.have.property('immission');
      });
    });
  });
});
