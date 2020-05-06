/* eslint-env mocha */
import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers';
import generator from '../../../factories/server';
import { getBestPromotionLotStatus } from '../promotionServerHelpers';

describe('promotionServerHelpers', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('getBestPromotionLotStatus', () => {
    it('finds the best status of any promotionLot', () => {
      generator({
        properties: { _id: 'prop' },
        loans: {
          _id: 'loanId',
          promotionOptions: [
            {
              promotionLots: {
                status: 'SOLD',
                propertyLinks: [{ _id: 'prop' }],
                attributedTo: { _id: 'loanId' },
              },
            },
            {
              promotionLots: {
                status: 'AVAILABLE',
                propertyLinks: [{ _id: 'prop' }],
                attributedTo: { _id: 'loanId' },
              },
            },
          ],
        },
      });

      expect(getBestPromotionLotStatus({ loanId: 'loanId' })).to.equal('SOLD');
    });

    it('finds the best status of any promotionLot 2', () => {
      generator({
        properties: { _id: 'prop' },
        loans: {
          _id: 'loanId',
          promotionOptions: [
            {
              promotionLots: {
                status: 'SOLD',
                propertyLinks: [{ _id: 'prop' }],
                attributedTo: { _id: 'loanId2' },
              },
            },
            {
              promotionLots: {
                status: 'AVAILABLE',
                propertyLinks: [{ _id: 'prop' }],
                attributedTo: { _id: 'loanId' },
              },
            },
          ],
        },
      });

      expect(getBestPromotionLotStatus({ loanId: 'loanId' })).to.equal(
        'AVAILABLE',
      );
    });

    it('finds the best status of any promotionLot 3', () => {
      generator({
        properties: { _id: 'prop' },
        loans: {
          _id: 'loanId',
          promotionOptions: [
            {
              promotionLots: {
                status: 'RESERVED',
                propertyLinks: [{ _id: 'prop' }],
                attributedTo: { _id: 'loanId' },
              },
            },
          ],
        },
      });

      expect(getBestPromotionLotStatus({ loanId: 'loanId' })).to.equal(
        'RESERVED',
      );
    });
  });
});
