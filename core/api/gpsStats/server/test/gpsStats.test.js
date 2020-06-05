/* eslint-env mocha */

import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers';
import generator from '../../../factories/server';
import { getCitiesFromZipCode, getStats } from '../gpsStats';

describe('gpsStats', () => {
  describe('getCitiesFromZipCode', () => {
    it('returns Lausanne for zipCode 1001', () => {
      const cities = getCitiesFromZipCode({ zipCode: 1001 });
      expect(cities.length).to.equal(1);
      expect(cities[0]).to.equal('Lausanne');
    });

    it('works with a String', () => {
      const cities = getCitiesFromZipCode({ zipCode: '1001' });
      expect(cities.length).to.equal(1);
      expect(cities[0]).to.equal('Lausanne');
    });

    it('returns [null] if no city was found', () => {
      const cities = getCitiesFromZipCode({ zipCode: 9999 });
      expect(cities.length).to.equal(1);
      expect(cities[0]).to.equal(null);
    });

    it('returns all cities matching the a zipCode pattern', () => {
      const cities = getCitiesFromZipCode({ zipCode: 140 });
      expect(cities.length).to.equal(8);
    });

    it('does not return more than one city for a 4-digits zipCode', () => {
      // Raw data for zipCode 1000 contains 3 cities
      const cities = getCitiesFromZipCode({ zipCode: 1000 });
      expect(cities.length).to.equal(1);
    });

    it('does not include numerical characters in city name', () => {
      // Raw data for zipCode 1000 contains numbers in city name
      const cities = getCitiesFromZipCode({ zipCode: 1000 });
      expect(cities.length).to.equal(1);
      expect(cities[0].match(/[0-9 ]/g)).to.equal(null);
    });
  });

  describe('getStats', () => {
    beforeEach(resetDatabase);

    it('returns data grouped by cities', () => {
      generator({
        loans: [
          {
            structures: [{ id: 'a', propertyId: 'p1' }],
            selectedStructure: 'a',
            properties: { _id: 'p1', zipCode: 1201, country: 'CH' },
          },
          {
            structures: [{ id: 'a', propertyId: 'p2' }],
            selectedStructure: 'a',
            properties: { _id: 'p2', zipCode: 1218, country: 'CH' },
          },
          {
            structures: [{ id: 'a', propertyId: 'p3' }],
            selectedStructure: 'a',
            properties: { _id: 'p3', zipCode: 1400, country: 'CH' },
          },
        ],
      });

      const result = getStats({ cantons: ['GE', 'VD'] });
      expect(result).to.deep.equal([
        {
          city: 'Genève',
          zipCode: 1200,
          lat: 46.2058,
          long: 6.1416,
          count: 2,
        },
        {
          city: 'Yverdon-les-Bains',
          zipCode: 1400,
          lat: 46.7785,
          long: 6.6411,
          count: 1,
        },
      ]);
    });

    it('ignores data from other cantons', () => {
      generator({
        loans: [
          {
            structures: [{ id: 'a', propertyId: 'p1' }],
            selectedStructure: 'a',
            properties: { _id: 'p1', zipCode: 1201, country: 'CH' },
          },
          {
            structures: [{ id: 'a', propertyId: 'p2' }],
            selectedStructure: 'a',
            properties: { _id: 'p2', zipCode: 1400, country: 'CH' },
          },
        ],
      });

      const result = getStats({ cantons: ['GE'] });
      expect(result).to.deep.equal([
        {
          city: 'Genève',
          zipCode: 1200,
          lat: 46.2058,
          long: 6.1416,
          count: 1,
        },
      ]);
    });

    it('ignores properties outside switzerland', () => {
      generator({
        loans: [
          {
            structures: [{ id: 'a', propertyId: 'p1' }],
            selectedStructure: 'a',
            properties: { _id: 'p1', zipCode: 1201, country: 'US' },
          },
        ],
      });

      const result = getStats({ cantons: ['GE'] });
      expect(result).to.deep.equal([]);
    });
  });
});
