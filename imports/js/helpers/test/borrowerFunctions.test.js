import { expect } from 'chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';

import { getFortune } from '../borrowerFunctions';

describe('Borrower Functions', () => {
  describe('Get Fortune', () => {
    it('Should return 100k for 2 borrowers with 50k cash', () => {
      const b = [{ bankFortune: 50000 }, { bankFortune: 50000 }];

      expect(getFortune(b)).to.equal(100000);
    });

    it('Should return 0 if no borrowers', () => {
      expect(getFortune()).to.equal(0);
    });
  });
});
