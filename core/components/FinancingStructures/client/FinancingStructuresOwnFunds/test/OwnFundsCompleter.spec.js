// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import { completeValue } from '../OwnFundsCompleter';

describe.only('OwnFundsCompleter', () => {
  describe('completeValue', () => {
    it('completes nothing if there are no funds to add', () => {
      const props = {
        value: 250,
        structure: {
          propertyWork: 0,
          propertyId: 'propertyId',
          wantedLoan: 800,
          fortuneUsed: 250,
          thirdPillarPledged: 0,
          secondPillarPledged: 0,
          thirdPillarWithdrawal: 0,
          secondPillarWithdrawal: 0,
        },
        properties: [{ _id: 'propertyId', value: 1000 }],
      };
      expect(completeValue(props, 0)).to.equal(250);
    });

    it('reduces value to 0 at minimum', () => {
      const props = {
        value: 100,
        structure: {
          propertyWork: 0,
          propertyId: 'propertyId',
          wantedLoan: 800,
          fortuneUsed: 250,
          thirdPillarPledged: 0,
          secondPillarPledged: 0,
          thirdPillarWithdrawal: 0,
          secondPillarWithdrawal: 150,
        },
        properties: [{ _id: 'propertyId', value: 1000 }],
      };
      expect(completeValue(props, -150)).to.equal(0);
    });

    it('reduces value', () => {
      const props = {
        value: 100,
        structure: {
          propertyWork: 0,
          propertyId: 'propertyId',
          wantedLoan: 800,
          fortuneUsed: 250,
          thirdPillarPledged: 0,
          secondPillarPledged: 0,
          thirdPillarWithdrawal: 0,
          secondPillarWithdrawal: 50,
        },
        properties: [{ _id: 'propertyId', value: 1000 }],
      };
      expect(completeValue(props, -50)).to.equal(50);
    });

    it('increases value', () => {
      const props = {
        value: 150,
        max: () => 300,
        structure: {
          propertyWork: 0,
          propertyId: 'propertyId',
          wantedLoan: 800,
          fortuneUsed: 150,
          thirdPillarPledged: 0,
          secondPillarPledged: 0,
          thirdPillarWithdrawal: 0,
          secondPillarWithdrawal: 0,
        },
        properties: [{ _id: 'propertyId', value: 1000 }],
      };
      expect(completeValue(props, 100)).to.equal(250);
    });

    it('increases value, but caps it at the max', () => {
      const max = 199;
      const props = {
        value: 150,
        max: () => max,
        structure: {
          propertyWork: 0,
          propertyId: 'propertyId',
          wantedLoan: 800,
          fortuneUsed: 150,
          thirdPillarPledged: 0,
          secondPillarPledged: 0,
          thirdPillarWithdrawal: 0,
          secondPillarWithdrawal: 0,
        },
        properties: [{ _id: 'propertyId', value: 1000 }],
      };
      expect(completeValue(props, 250)).to.equal(max);
    });
  });
});
