/* eslint-env mocha */
import { expect } from 'chai';

import zipcodes from '../zipcodes';

describe('zipcodes', () => {
  it('returns the canton for a zipcode', () => {
    expect(zipcodes(1201)).to.equal('GE');
    expect(zipcodes(1400)).to.equal('VD');
    expect(zipcodes(8004)).to.equal('ZH');
    expect(zipcodes(9485)).to.equal('LI');
  });

  it('allows using 1200 for geneva', () => {
    expect(zipcodes(1200)).to.equal('GE');
  });

  it('returns null if no canton is found', () => {
    expect(zipcodes(100)).to.equal(null);
    expect(zipcodes(100)).to.equal(null);
  });
});
