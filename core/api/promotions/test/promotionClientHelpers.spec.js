/* eslint-env mocha */
import { expect } from 'chai';

import {
  shouldAnonymize,
  getPromotionCustomerOwnerType,
} from '../promotionClientHelpers';
import { PROMOTION_INVITED_BY_TYPE } from '../promotionConstants';
import { PROMOTION_LOT_STATUS } from '../../promotionLots/promotionLotConstants';

describe('promotionClientHelpers', () => {
  context('shouldAnonymize', () => {
    it('returns true if user cannot view the promotion', () => {
      expect(shouldAnonymize({ permissions: {} })).to.equal(true);
    });

    it('returns true if user cannot see customers', () => {
      expect(
        shouldAnonymize({
          permissions: { displayCustomerNames: false },
        }),
      ).to.equal(true);
    });

    it('returns true if customer is invited by nobody', () => {
      const currentUser = { _id: 'bob' };
      const customerOwnerType = getPromotionCustomerOwnerType({
        currentUser,
      });
      expect(
        shouldAnonymize({
          customerOwnerType,
          permissions: {},
        }),
      ).to.equal(true);
    });

    it('returns true if lot status is not in permissions', () => {
      const currentUser = { _id: 'bob' };
      const invitedBy = 'bob';
      const customerOwnerType = getPromotionCustomerOwnerType({
        currentUser,
        invitedBy,
      });
      expect(
        shouldAnonymize({
          customerOwnerType,
          permissions: {
            displayCustomerNames: {
              invitedBy: PROMOTION_INVITED_BY_TYPE.ANY,
              forLotStatus: [PROMOTION_LOT_STATUS.AVAILABLE],
            },
          },
          promotionLotStatus: PROMOTION_LOT_STATUS.BOOKED,
        }),
      ).to.equal(true);
    });

    it('returns true if lot status is in permissions and belongs to owner, but not attributed', () => {
      const currentUser = { _id: 'bob' };
      const invitedBy = 'bob';
      const customerOwnerType = getPromotionCustomerOwnerType({
        currentUser,
        invitedBy,
      });
      expect(
        shouldAnonymize({
          customerOwnerType,
          permissions: {
            displayCustomerNames: {
              invitedBy: PROMOTION_INVITED_BY_TYPE.USER,
              forLotStatus: [
                PROMOTION_LOT_STATUS.AVAILABLE,
                PROMOTION_LOT_STATUS.BOOKED,
              ],
            },
          },
          promotionLotStatus: PROMOTION_LOT_STATUS.BOOKED,
          isAttributed: false,
        }),
      ).to.equal(true);
    });

    it('returns false if lot status is in permissions and belongs to owner', () => {
      const currentUser = { _id: 'bob' };
      const invitedBy = 'bob';
      const customerOwnerType = getPromotionCustomerOwnerType({
        currentUser,
        invitedBy,
      });
      expect(
        shouldAnonymize({
          customerOwnerType,
          permissions: {
            displayCustomerNames: {
              invitedBy: PROMOTION_INVITED_BY_TYPE.USER,
              forLotStatus: [
                PROMOTION_LOT_STATUS.AVAILABLE,
                PROMOTION_LOT_STATUS.BOOKED,
              ],
            },
          },
          promotionLotStatus: PROMOTION_LOT_STATUS.BOOKED,
          isAttributed: true,
        }),
      ).to.equal(false);
    });

    it('returns true if lot status is undefined', () => {
      const currentUser = { _id: 'bob' };
      const invitedBy = 'bob';
      const customerOwnerType = getPromotionCustomerOwnerType({
        currentUser,
        invitedBy,
      });
      expect(
        shouldAnonymize({
          customerOwnerType,
          permissions: {
            displayCustomerNames: {
              invitedBy: PROMOTION_INVITED_BY_TYPE.USER,
              forLotStatus: [
                PROMOTION_LOT_STATUS.BOOKED,
                PROMOTION_LOT_STATUS.SOLD,
              ],
            },
          },
        }),
      ).to.equal(true);
    });

    it('returns true if customer is not invited by current user', () => {
      const currentUser = { _id: 'bob' };
      const invitedBy = 'john';
      const customerOwnerType = getPromotionCustomerOwnerType({
        currentUser,
        invitedBy,
      });
      expect(
        shouldAnonymize({
          customerOwnerType,
          permissions: {
            displayCustomerNames: {
              invitedBy: PROMOTION_INVITED_BY_TYPE.USER,
            },
          },
        }),
      ).to.equal(true);
    });

    it('returns true if customer is not invited by current user organisation member', () => {
      const currentUser = {
        _id: 'bob',
        organisations: [{ users: [{ _id: 'bob' }, { _id: 'dylan' }] }],
      };
      const invitedBy = 'john';
      const customerOwnerType = getPromotionCustomerOwnerType({
        currentUser,
        invitedBy,
      });
      expect(
        shouldAnonymize({
          customerOwnerType,
          permissions: {
            displayCustomerNames: {
              invitedBy: PROMOTION_INVITED_BY_TYPE.ORGANISATION,
            },
          },
        }),
      ).to.equal(true);
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
      const customerOwnerType = getPromotionCustomerOwnerType({
        currentUser,
        invitedBy,
      });
      expect(
        shouldAnonymize({
          customerOwnerType,
          permissions: {
            displayCustomerNames: {
              invitedBy: PROMOTION_INVITED_BY_TYPE.ORGANISATION,
              forLotStatus: [PROMOTION_LOT_STATUS.AVAILABLE],
            },
          },
        }),
      ).to.equal(false);
    });

    it('returns true if current user has no organisation', () => {
      const currentUser = { _id: 'bob' };
      const invitedBy = 'john';
      const customerOwnerType = getPromotionCustomerOwnerType({
        currentUser,
        invitedBy,
      });
      expect(
        shouldAnonymize({
          customerOwnerType,
          permissions: {
            displayCustomerNames: {
              invitedBy: PROMOTION_INVITED_BY_TYPE.ORGANISATION,
            },
          },
        }),
      ).to.equal(true);
    });

    it('returns false if lot is user can see names for every lot status, can see all customer names and lot is not attributed', () => {
      const permissions = {
        displayCustomerNames: {
          forLotStatus: Object.values(PROMOTION_LOT_STATUS),
          invitedBy: PROMOTION_INVITED_BY_TYPE.ANY,
        },
      };

      expect(
        shouldAnonymize({
          customerOwnerType: null,
          permissions,
          promotionLotStatus: PROMOTION_LOT_STATUS.BOOKED,
          isAttributed: false,
        }),
      ).to.equal(false);
    });
  });
});
