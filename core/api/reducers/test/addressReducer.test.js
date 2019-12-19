/* eslint-env mocha */
import { expect } from 'chai';

import addressReducer from '../addressReducer';

const address1 = 'Rue du test 1';
const zipCode = '1201';
const city = 'Genève';
const canton = 'GE';

describe('addressReducer', () => {
  context('returns the correct address when', () => {
    it('no address component is given', () => {
      expect(addressReducer.address.reduce({})).to.equal(
        'Aucune addresse indiquée',
      );
    });
    it('only canton is given', () => {
      expect(addressReducer.address.reduce({ canton })).to.equal(canton);
    });
    it('only city is given', () => {
      expect(addressReducer.address.reduce({ city })).to.equal(city);
    });
    it('city and canton are given', () => {
      expect(addressReducer.address.reduce({ city, canton })).to.equal(
        `${city} (${canton})`,
      );
    });
    it('only zipCode is given', () => {
      expect(addressReducer.address.reduce({ zipCode })).to.equal(zipCode);
    });
    it('zipCode and canton are given', () => {
      expect(addressReducer.address.reduce({ zipCode, canton })).to.equal(
        `${zipCode} (${canton})`,
      );
    });
    it('zipCode and city are given', () => {
      expect(addressReducer.address.reduce({ zipCode, city })).to.equal(
        `${zipCode} ${city}`,
      );
    });
    it('zipCode, city and canton are given', () => {
      expect(addressReducer.address.reduce({ zipCode, city, canton })).to.equal(
        `${zipCode} ${city} (${canton})`,
      );
    });
    it('only address1 is given', () => {
      expect(addressReducer.address.reduce({ address1 })).to.equal(address1);
    });
    it('address1 and canton are given', () => {
      expect(addressReducer.address.reduce({ address1, canton })).to.equal(
        `${address1} (${canton})`,
      );
    });
    it('address1 and city are given', () => {
      expect(addressReducer.address.reduce({ address1, city })).to.equal(
        `${address1}, ${city}`,
      );
    });
    it('address1, city and canton are gievn', () => {
      expect(
        addressReducer.address.reduce({ address1, city, canton }),
      ).to.equal(`${address1}, ${city} (${canton})`);
    });
    it('address1 and zipCode are given', () => {
      expect(addressReducer.address.reduce({ address1, zipCode })).to.equal(
        `${address1}, ${zipCode}`,
      );
    });
    it('address1, zipCode and canton are given', () => {
      expect(
        addressReducer.address.reduce({ address1, zipCode, canton }),
      ).to.equal(`${address1}, ${zipCode} (${canton})`);
    });
    it('address1, zipCode and city are given', () => {
      expect(
        addressReducer.address.reduce({ address1, zipCode, city }),
      ).to.equal(`${address1}, ${zipCode} ${city}`);
    });
    it('every address component are given', () => {
      expect(
        addressReducer.address.reduce({ address1, zipCode, city, canton }),
      ).to.equal(`${address1}, ${zipCode} ${city} (${canton})`);
    });
  });
});
