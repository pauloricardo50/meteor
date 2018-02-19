/* eslint-env mocha */
import { expect } from 'chai';

import constants, { logismataValues } from '../../constants';

describe('constants', () => {
  it('returns the right values', () => {
    expect(constants.host).to.exist;
    expect(constants.calcUrl()).to.equal('https://uat.logismata.ch/puma/calculator/onlinetax/calculate');
    expect(constants.authUrl()).to.exist;
  });
});
