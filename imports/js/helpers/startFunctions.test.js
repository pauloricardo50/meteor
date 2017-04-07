import { assert } from 'chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';

import { calculatePrimaryProperty, calculateProperty } from './startFunctions';

describe('Start Functions', () => {
  describe('Calculate primary property value', () => {
    it('Should return 1M if 250k fortune and 0 insurance fortune', () => {
      assert.equal(1000000, calculatePrimaryProperty(250000, 0));
    });

    it('Should return 1M if 160k fortune and 100k insurance fortune', () => {
      assert.equal(1000000, calculatePrimaryProperty(160000, 100000));
    });

    it('Should return 0 if 0 fortune and any insurance fortune', () => {
      assert.equal(0, calculatePrimaryProperty(0, 100000000));
    });

    it('Should return 0 if negative fortune and any insurance fortune', () => {
      assert.equal(0, calculatePrimaryProperty(-100, 100000000));
    });

    it('Should return 0 if negative insurance fortune', () => {
      assert.equal(0, calculatePrimaryProperty(100, -100000000));
    });
  });

  describe('Calculate property value', () => {
    it('Should return 1M with 250k fortune, 0 insurance fortune, 500k income', () => {
      assert.equal(
        1000000,
        calculatePrimaryProperty(250000, 0, 500000, 'primary'),
      );
    });
  });
});
