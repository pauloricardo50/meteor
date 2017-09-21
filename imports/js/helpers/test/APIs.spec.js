/* eslint-env mocha */
import { expect } from 'chai';
import testRequire from '/imports/js/helpers/testRequire';

const { getLocations } = testRequire('../APIs') || require('../APIs');

describe('getLocations', () => {
  it('fetches all locations based on zip 1400', () =>
    getLocations(1400).then(result =>
      expect(result).to.deep.equal(['Cheseaux-Noréaz', 'Yverdon-les-Bains']),
    ));

  it('fetches all locations based on zip 1201', () =>
    getLocations(1201).then(result =>
      expect(result).to.deep.equal(['Genève']),
    ));

  it('fetches all locations based on zip 1000', () =>
    getLocations(1000).then(result =>
      expect(result).to.deep.equal(['Lausanne']),
    ));
});
