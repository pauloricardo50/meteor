/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import Irs10yService from '../Irs10yService';

describe('Irs10yService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('insert', () => {
    it('inserts a rate', () => {
      const newRate = { date: new Date(), rate: 0.01 };
      Irs10yService.insert(newRate);

      const results = Irs10yService.find({}).fetch();

      expect(results[0]).to.deep.include(newRate);
    });

    it('inserts a rate if there is none in the same day', () => {
      const newRate = { date: new Date(), rate: 0.01 };
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      Irs10yService.insert({ date: yesterday, rate: 0.01 });
      Irs10yService.insert(newRate);

      const results = Irs10yService.find({}).fetch();

      expect(results.length).to.equal(2);
    });

    it('does not insert a rate if it already exists that day', () => {
      const newRate = { date: new Date(), rate: 0.01 };
      Irs10yService.insert(newRate);
      expect(() => Irs10yService.insert(newRate)).to.throw('existe déjà');

      const results = Irs10yService.find({}).fetch();

      expect(results.length).to.equal(1);
    });
  });
});
