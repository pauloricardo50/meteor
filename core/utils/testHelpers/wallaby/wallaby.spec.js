/* eslint-env mocha */
import { expect } from 'chai';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

import dummyFunc from 'core/utils/testHelpers/wallaby/wallabyDummy';

describe('Wallaby examples', () => {
  it('should work', () => {
    expect(1 + 1).to.equal(2);
    expect(true).to.not.equal(false);
  });

  it('should set the IS_WALLABY global variable', () => {
    if (global.IS_WALLABY) {
      expect(global.IS_WALLABY).to.equal(true);
    }
  });

  it('should mock meteor packages', () => {
    if (global.IS_WALLABY) {
      expect(Meteor.userId()).to.equal('userId');
    }
  });

  it('should import from core properly with stubbed packages', () => {
    if (global.IS_WALLABY) {
      expect(dummyFunc()).to.equal(Bert.alert());
    }
  });
});
