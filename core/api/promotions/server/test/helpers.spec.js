/* eslint-env mocha */
import { expect } from 'chai';

import { shouldAnonymize } from '../../helpers';
import { PROMOTION_LOT_STATUS } from '../../../promotionLots/promotionLotConstants';
import {
  PROMOTION_PERMISSIONS,
  PROMOTION_PERMISSIONS_BUNDLES,
} from '../../promotionConstants';

describe('helpers', () => {
  context('shouldAnonymize', () => {
    const makePermissions = ({ forLotStatus, invitedBy }) => ({
      canViewPromotion: true,
      ...PROMOTION_PERMISSIONS_BUNDLES.CONSULTATION({
        consultation: {
          invitedBy,
          forLotStatus,
        },
      }),
    });

    it('returns true if user cannot view promotion', () => {
      expect(shouldAnonymize({ permissions: { canViewPromotion: false } })).to.equal(true);
    });

    it('returns true if user cannot see customers', () => {
      expect(shouldAnonymize({
        permissions: { canViewPromotion: true, canSeeCustomers: false },
      })).to.equal(true);
    });

    it('returns true if invitedBy is undefined', () => {
      expect(shouldAnonymize({
        permissions: { canViewPromotion: true, canSeeCustomers: true },
        invitedBy: undefined,
      })).to.equal(true);
    });

    it('returns true if lotStatus is not in permissions', () => {
      expect(shouldAnonymize({
        permissions: makePermissions({ forLotStatus: [] }),
        invitedBy: 'john',
        lotStatus: PROMOTION_LOT_STATUS.AVAILABLE,
      })).to.equal(true);

      expect(shouldAnonymize({
        permissions: makePermissions({
          forLotStatus: [
            PROMOTION_LOT_STATUS.BOOKED,
            PROMOTION_LOT_STATUS.SOLD,
          ],
        }),
        invitedBy: 'john',
        lotStatus: PROMOTION_LOT_STATUS.AVAILABLE,
      })).to.equal(true);
    });

    it('returns false if lotStatus is in permissions', () => {
      expect(shouldAnonymize({
        permissions: makePermissions({
          forLotStatus: [PROMOTION_LOT_STATUS.AVAILABLE],
          invitedBy:
              PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY.ANY,
        }),
        invitedBy: 'john',
        lotStatus: PROMOTION_LOT_STATUS.AVAILABLE,
      })).to.equal(false);
    });

    it('returns true if invitedBy is USER and customer is not invited by current user', () => {
      expect(shouldAnonymize({
        currentUser: { _id: 'michael' },
        permissions: makePermissions({
          forLotStatus: [PROMOTION_LOT_STATUS.AVAILABLE],
          invitedBy:
              PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY.USER,
        }),
        invitedBy: 'john',
        lotStatus: PROMOTION_LOT_STATUS.AVAILABLE,
      })).to.equal(true);
    });

    it('returns false if invitedBy is USER and customer is invited by current user', () => {
      expect(shouldAnonymize({
        currentUser: { _id: 'john' },
        permissions: makePermissions({
          forLotStatus: [PROMOTION_LOT_STATUS.AVAILABLE],
          invitedBy:
              PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY.USER,
        }),
        invitedBy: 'john',
        lotStatus: PROMOTION_LOT_STATUS.AVAILABLE,
      })).to.equal(false);
    });

    it('returns true if invitedBy is ORGANISATION and customer is not invited by a current user organisation member', () => {
      expect(shouldAnonymize({
        currentUser: {
          _id: 'john',
          organisations: [
            {
              users: [{ _id: 'john' }, { _id: 'paul' }],
            },
            {
              users: [{ _id: 'john' }, { _id: 'stephan' }],
            },
          ],
        },
        permissions: makePermissions({
          forLotStatus: [PROMOTION_LOT_STATUS.AVAILABLE],
          invitedBy:
              PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY
                .ORGANISATION,
        }),
        invitedBy: 'mike',
        lotStatus: PROMOTION_LOT_STATUS.AVAILABLE,
      })).to.equal(true);
    });

    it('returns true if invitedBy is ORGANISATION and current user is not in an organisation', () => {
      expect(shouldAnonymize({
        currentUser: {
          _id: 'john',
        },
        permissions: makePermissions({
          forLotStatus: [PROMOTION_LOT_STATUS.AVAILABLE],
          invitedBy:
              PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY
                .ORGANISATION,
        }),
        invitedBy: 'mike',
        lotStatus: PROMOTION_LOT_STATUS.AVAILABLE,
      })).to.equal(true);
    });

    it('returns false if invitedBy is ORGANISATION and customer is invited by a current user organisation member', () => {
      expect(shouldAnonymize({
        currentUser: {
          _id: 'john',
          organisations: [
            {
              users: [{ _id: 'john' }, { _id: 'paul' }],
            },
            {
              users: [{ _id: 'john' }, { _id: 'stephan' }, { _id: 'mike' }],
            },
          ],
        },
        permissions: makePermissions({
          forLotStatus: [PROMOTION_LOT_STATUS.AVAILABLE],
          invitedBy:
              PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY
                .ORGANISATION,
        }),
        invitedBy: 'mike',
        lotStatus: PROMOTION_LOT_STATUS.AVAILABLE,
      })).to.equal(false);
    });
  });
});
