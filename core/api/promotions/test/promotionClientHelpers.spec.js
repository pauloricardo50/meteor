/* eslint-env mocha */
import { expect } from 'chai';

import {
  shouldAnonymize,
  getPromotionCustomerOwningGroup,
} from '../promotionClientHelpers';
import { PROMOTION_INVITED_BY } from '../promotionConstants';
import { PROMOTION_LOT_STATUS } from '../../promotionLots/promotionLotConstants';

describe('promotionClientHelpers', () => {
  context('shouldAnonymize', () => {
    it('returns true if user cannot view the promotion', () => {
      expect(shouldAnonymize({ permissions: { canViewPromotion: false } })).to.equal(true);
    });

    it('returns true if user cannot see customers', () => {
      expect(shouldAnonymize({
        permissions: { canViewPromotion: true, canSeeCustomers: false },
      })).to.equal(true);
    });

    it('returns true if customer is invited by nobody', () => {
      const currentUser = { _id: 'bob' };
      const customerOwningGroup = getPromotionCustomerOwningGroup({
        currentUser,
      });
      expect(shouldAnonymize({
        customerOwningGroup,
        permissions: { canViewPromotion: true, canSeeCustomers: true },
      })).to.equal(true);
    });

    it('returns true if lot status is not in permissions', () => {
      const currentUser = { _id: 'bob' };
      const invitedBy = 'bob';
      const customerOwningGroup = getPromotionCustomerOwningGroup({
        currentUser,
        invitedBy,
      });
      expect(shouldAnonymize({
        customerOwningGroup,
        permissions: {
          canViewPromotion: true,
          canSeeCustomers: true,
          displayCustomerNames: {
            invitedBy: PROMOTION_INVITED_BY.ANY,
            forLotStatus: [PROMOTION_LOT_STATUS.AVAILABLE],
          },
        },
        promotionLotStatus: PROMOTION_LOT_STATUS.BOOKED,
      })).to.equal(true);
    });

    it('returns false if lot status is in permissions', () => {
      const currentUser = { _id: 'bob' };
      const invitedBy = 'bob';
      const customerOwningGroup = getPromotionCustomerOwningGroup({
        currentUser,
        invitedBy,
      });
      expect(shouldAnonymize({
        customerOwningGroup,
        permissions: {
          canViewPromotion: true,
          canSeeCustomers: true,
          displayCustomerNames: {
            invitedBy: PROMOTION_INVITED_BY.USER,
            forLotStatus: [
              PROMOTION_LOT_STATUS.AVAILABLE,
              PROMOTION_LOT_STATUS.BOOKED,
            ],
          },
        },
        promotionLotStatus: PROMOTION_LOT_STATUS.BOOKED,
      })).to.equal(false);
    });

    it('returns true if customer is not invited by current user', () => {
      const currentUser = { _id: 'bob' };
      const invitedBy = 'john';
      const customerOwningGroup = getPromotionCustomerOwningGroup({
        currentUser,
        invitedBy,
      });
      expect(shouldAnonymize({
        customerOwningGroup,
        permissions: {
          canViewPromotion: true,
          canSeeCustomers: true,
          displayCustomerNames: {
            invitedBy: PROMOTION_INVITED_BY.USER,
          },
        },
      })).to.equal(true);
    });

    it('returns true if customer is not invited by current user organisation member', () => {
      const currentUser = {
        _id: 'bob',
        organisations: [{ users: [{ _id: 'bob' }, { _id: 'dylan' }] }],
      };
      const invitedBy = 'john';
      const customerOwningGroup = getPromotionCustomerOwningGroup({
        currentUser,
        invitedBy,
      });
      expect(shouldAnonymize({
        customerOwningGroup,
        permissions: {
          canViewPromotion: true,
          canSeeCustomers: true,
          displayCustomerNames: {
            invitedBy: PROMOTION_INVITED_BY.ORGANISATION,
          },
        },
      })).to.equal(true);
    });

    it('returns false if customer is invited by current user organisation member', () => {
      const currentUser = {
        _id: 'bob',
        organisations: [
          { users: [{ _id: 'bob' }, { _id: 'dylan' }] },
          { users: [{ _id: 'bob' }, { _id: 'john' }] },
        ],
      };
      const invitedBy = 'john';
      const customerOwningGroup = getPromotionCustomerOwningGroup({
        currentUser,
        invitedBy,
      });
      expect(shouldAnonymize({
        customerOwningGroup,
        permissions: {
          canViewPromotion: true,
          canSeeCustomers: true,
          displayCustomerNames: {
            invitedBy: PROMOTION_INVITED_BY.ORGANISATION,
          },
        },
      })).to.equal(false);
    });

    it('returns true if current user has no organisation', () => {
      const currentUser = {
        _id: 'bob',
      };
      const invitedBy = 'john';
      const customerOwningGroup = getPromotionCustomerOwningGroup({
        currentUser,
        invitedBy,
      });
      expect(shouldAnonymize({
        customerOwningGroup,
        permissions: {
          canViewPromotion: true,
          canSeeCustomers: true,
          displayCustomerNames: {
            invitedBy: PROMOTION_INVITED_BY.ORGANISATION,
          },
        },
      })).to.equal(true);
    });
  });
});
