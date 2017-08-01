/* eslint-env mocha */
import { expect } from 'chai';

import proxyquire from 'proxyquire';
import meteorStubs from '/imports/js/helpers/meteorStubs';

let getFormArray;
if (global.Meteor && global.Meteor.isTest) {
  getFormArray = require('../StartFormArray.js').default; // eslint-disable-line global-require
} else {
  getFormArray = proxyquire('../StartFormArray.js', {
    ...meteorStubs,
  }).default;
}

describe('wuut?', () => {
  it('works', () => {
    expect(true).to.equal(true);
  });
});

describe('StartFormArray', () => {
  describe('getFormArray', () => {
    it('returns an array', () => {
      const array = getFormArray({}, {}, () => {});

      expect(array).to.have.length.above(0);
    });
  });
});
