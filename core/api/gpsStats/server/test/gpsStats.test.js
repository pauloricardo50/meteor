/* eslint-env mocha */

import { expect } from 'chai';

import { getCitiesFromZipCode } from '../gpsStats';

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
});
