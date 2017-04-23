import { expect } from 'chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';

import { previousDone } from '../steps';

describe('Steps', () => {
  describe('Previous Done', () => {
    it('Should return true for a basic setup', () => {
      const steps = [
        {
          items: [{ isDone: () => true }, { isDone: () => true }, { isDone: () => true }],
        },
      ];

      expect(previousDone(steps, 0, 4)).to.be.true;
    });

    it('Should return false for a basic setup', () => {
      const steps = [
        {
          items: [{ isDone: () => true }, { isDone: () => false }, { isDone: () => true }],
        },
      ];

      expect(previousDone(steps, 0, 4)).to.be.false;
    });
  });
});
