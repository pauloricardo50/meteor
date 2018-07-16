/* eslint-env mocha */
import { expect } from 'chai';

import getSteps from '../steps';

describe('steps', () => {
  it('returns an array of 4 objects', () => {
    expect(getSteps().length).to.equal(4);
    getSteps().forEach((step) => {
      expect(typeof step.id).to.equal('string');
    });
  });
});
