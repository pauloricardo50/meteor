/* eslint-env jest */
import { Factory } from 'meteor/dburles:factory';
import { Meteor } from 'meteor/meteor';

import { borrowerFiles } from '/imports/js/arrays/files';
import { previousDone, filesPercent } from '../steps';

describe('Steps', () => {
  describe('Previous Done', () => {
    it('Should return true for a basic setup', () => {
      const steps = [
        {
          items: [
            { isDone: () => true },
            { isDone: () => true },
            { isDone: () => true },
          ],
        },
      ];

      expect(previousDone(steps, 0, 4)).to.be.true;
    });

    it('Should return false for a basic setup', () => {
      const steps = [
        {
          items: [
            { isDone: () => true },
            { isDone: () => false },
            { isDone: () => true },
          ],
        },
      ];

      expect(previousDone(steps, 0, 4)).to.be.false;
    });
  });

  describe('filesPercent', () => {
    let borrower = {};

    beforeEach(() => {
      borrower = Factory.tree('borrower');
      if (Meteor.isServer) {
        // Required because of the isDemo() dependency of this function
        global.window = { location: { host: '' } };
      }
    });

    it('Returns 0 for an empty borrower', () => {
      expect(filesPercent(borrower, borrowerFiles, 'auction')).to.equal(0);
    });

    it('Returns 0.2 with a single file', () => {
      borrower.files = { identity: {} };
      expect(filesPercent(borrower, borrowerFiles, 'auction')).to.equal(0.2);
    });

    it('Returns 0 for two empty borrowers', () => {
      expect(
        filesPercent([borrower, borrower], borrowerFiles, 'auction'),
      ).to.equal(0);
    });

    it('Returns 0.1 for one empty borrower and one with a single file', () => {
      const borrower2 = {
        ...borrower,
        files: {
          identity: {},
        },
      };

      expect(
        filesPercent([borrower, borrower2], borrowerFiles, 'auction'),
      ).to.equal(0.1);
    });
  });
});
