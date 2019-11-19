/* eslint-env mocha */
import { expect } from 'chai';
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import sinon from 'sinon';

import SecurityService, { SECURITY_ERROR } from '../..';
import {
  LoanSecurity,
  OfferSecurity,
  BorrowerSecurity,
  PropertySecurity,
  TaskSecurity,
} from '../../collections';
import { ROLES } from '../../../users/userConstants';
import { COLLECTIONS, PROPERTY_CATEGORY } from '../../../constants';

describe('Security service', () => {
  let userId;
  let devId;
  let proId;
  let adminId;

  beforeEach(() => {
    resetDatabase();
    userId = Factory.create('user')._id;
    proId = Factory.create('pro')._id;
    devId = Factory.create('dev')._id;
    adminId = Factory.create('admin')._id;
    sinon.stub(Meteor, 'userId').callsFake(() => userId);
  });

  afterEach(() => {
    Meteor.userId.restore();
  });

  describe('checkRole', () => {
    it('should throw if the user does not have the role', () => {
      expect(() =>
        SecurityService.checkRole(userId, 'incorrect-role'),
      ).to.throw(SECURITY_ERROR);
    });

    it('should not do anything if the user has the right role', () => {
      SecurityService.checkRole(userId, 'user');
    });

    it('should throw if no userId was passed', () => {
      expect(() =>
        SecurityService.checkRole(undefined, 'incorrect-role'),
      ).to.throw(SECURITY_ERROR);
      expect(() => SecurityService.checkRole(null, 'incorrect-role')).to.throw(
        SECURITY_ERROR,
      );
    });

    it('should throw if an inexistent userId was given', () => {
      expect(() => SecurityService.checkRole('invalid-id', 'user')).to.throw(
        SECURITY_ERROR,
      );
      expect(() => SecurityService.checkRole(123, 'user')).to.throw(
        SECURITY_ERROR,
      );
      expect(() => SecurityService.checkRole({}, 'user')).to.throw(
        SECURITY_ERROR,
      );
      expect(() => SecurityService.checkRole(() => {}, 'user')).to.throw(
        SECURITY_ERROR,
      );
    });
  });

  describe('checkLoggedIn', () => {
    it('should not do anything if the user is logged in', () => {
      SecurityService.checkLoggedIn();
    });

    it('should throw if the user is not logged in', () => {
      Meteor.userId.restore();
      sinon.stub(Meteor, 'userId').callsFake(() => undefined);

      expect(() => SecurityService.checkLoggedIn()).to.throw(SECURITY_ERROR);
    });
  });

  describe('checkOwnership', () => {
    let loan;

    beforeEach(() => {
      loan = Factory.create('loan', { userId });
    });

    it('should not do anything if ownership is correct', () => {
      SecurityService.checkOwnership(loan);
    });

    it('should throw if ownership is incorrect', () => {
      Meteor.userId.restore();
      sinon.stub(Meteor, 'userId').callsFake(() => devId);
      expect(() => SecurityService.checkOwnership(loan)).to.throw(
        SECURITY_ERROR,
      );
    });
  });

  describe('collection security getters', () => {
    it('loans should return LoanSecurity', () => {
      expect(SecurityService.loans).to.equal(LoanSecurity);
    });

    it('offers should return OfferSecurity', () => {
      expect(SecurityService.offers).to.equal(OfferSecurity);
    });

    it('borrowers should return BorrowerSecurity', () => {
      expect(SecurityService.borrowers).to.equal(BorrowerSecurity);
    });

    it('properties should return PropertySecurity', () => {
      expect(SecurityService.properties).to.equal(PropertySecurity);
    });

    it('tasks should return TaskSecurity', () => {
      expect(SecurityService.tasks).to.equal(TaskSecurity);
    });
  });

  describe('minimumRole', () => {
    it('throws if an unknown role is used', () => {
      expect(() => SecurityService.minimumRole('wut')(userId)).to.throw(
        'Invalid',
      );
    });

    it('does not let admins do dev-only stuff', () => {
      const devOnly = SecurityService.minimumRole(ROLES.DEV);
      expect(() => devOnly(devId)).to.not.throw('Unauthorized role');
      expect(() => devOnly(adminId)).to.throw('Unauthorized role');
      expect(() => devOnly(userId)).to.throw('Unauthorized role');
      expect(() => devOnly(proId)).to.throw('Unauthorized role');
    });

    it('does not let users do admin-only stuff', () => {
      const adminOnly = SecurityService.minimumRole(ROLES.ADMIN);
      expect(() => adminOnly(devId)).to.not.throw('Unauthorized role');
      expect(() => adminOnly(adminId)).to.not.throw('Unauthorized role');
      expect(() => adminOnly(userId)).to.throw('Unauthorized role');
      expect(() => adminOnly(proId)).to.throw('Unauthorized role');
    });
  });

  describe('isAllowedToModifyFiles', () => {
    it('does throw if docId is not it fileKey', () => {
      expect(() =>
        SecurityService.isAllowedToModifyFiles({
          fileKey: 'docId1/some/path',
          docId: 'docId2',
        }),
      ).to.throw('Invalid fileKey or docId');
    });

    it('does let admins modify files', () => {
      expect(() =>
        SecurityService.isAllowedToModifyFiles({
          fileKey: 'docId/some/path',
          docId: 'docId',
          userId: adminId,
        }),
      ).to.not.throw();
    });

    it('lets a user modify property files', () => {
      const propertyId = Factory.create('property', { userId })._id;
      expect(() =>
        SecurityService.isAllowedToModifyFiles({
          fileKey: `${propertyId}/some/path`,
          docId: propertyId,
          userId,
          collection: COLLECTIONS.PROPERTIES_COLLECTION,
        }),
      ).to.not.throw();
    });

    it('does not let a user modify property files if it does not own them', () => {
      const propertyId = Factory.create('property')._id;
      expect(() =>
        SecurityService.isAllowedToModifyFiles({
          fileKey: `${propertyId}/some/path`,
          docId: propertyId,
          userId,
          collection: COLLECTIONS.PROPERTIES_COLLECTION,
        }),
      ).to.throw('Checking ownership');
    });

    it('lets an admin modify promotion files', () => {
      const promotionId = Factory.create('promotion')._id;
      expect(() =>
        SecurityService.isAllowedToModifyFiles({
          fileKey: `${promotionId}/some/path`,
          docId: promotionId,
          userId: adminId,
          collection: COLLECTIONS.PROMOTIONS_COLLECTION,
        }),
      ).to.not.throw();
    });

    it('lets a pro modify promotion files', () => {
      const promotionId = Factory.create('promotion', {
        userLinks: [
          {
            _id: proId,
            permissions: { canManageDocuments: true },
          },
        ],
      })._id;
      expect(() =>
        SecurityService.isAllowedToModifyFiles({
          fileKey: `${promotionId}/some/path`,
          docId: promotionId,
          userId: proId,
          collection: COLLECTIONS.PROMOTIONS_COLLECTION,
        }),
      ).to.not.throw();
    });

    it('does not let a pro modify promotion files if he does not have the permissions', () => {
      const promotionId = Factory.create('promotion', {
        userLinks: [
          {
            _id: proId,
            permissions: { canManageDocuments: false },
          },
        ],
      })._id;
      expect(() =>
        SecurityService.isAllowedToModifyFiles({
          fileKey: `${promotionId}/some/path`,
          docId: promotionId,
          userId: proId,
          collection: COLLECTIONS.PROMOTIONS_COLLECTION,
        }),
      ).to.throw('Vous ne pouvez pas');
    });

    it('lets an admin modify promotion lot files', () => {
      const propertyId = Factory.create('property', {
        category: PROPERTY_CATEGORY.PROMOTION,
      })._id;
      const promotionLotId = Factory.create('promotionLot', {
        propertyLinks: [{ _id: propertyId }],
      })._id;
      Factory.create('promotion', {
        promotionLotLinks: [{ _id: promotionLotId }],
      });
      expect(() =>
        SecurityService.isAllowedToModifyFiles({
          fileKey: `${propertyId}/some/path`,
          docId: propertyId,
          userId: adminId,
          collection: COLLECTIONS.PROPERTIES_COLLECTION,
        }),
      ).to.not.throw();
    });

    it('lets a pro modify promotion lot files', () => {
      const propertyId = Factory.create('property', {
        category: PROPERTY_CATEGORY.PROMOTION,
      })._id;
      const promotionLotId = Factory.create('promotionLot', {
        propertyLinks: [{ _id: propertyId }],
      })._id;
      Factory.create('promotion', {
        promotionLotLinks: [{ _id: promotionLotId }],
        userLinks: [
          {
            _id: proId,
            permissions: { canManageDocuments: true },
          },
        ],
      });
      expect(() =>
        SecurityService.isAllowedToModifyFiles({
          fileKey: `${propertyId}/some/path`,
          docId: propertyId,
          userId: proId,
          collection: COLLECTIONS.PROPERTIES_COLLECTION,
        }),
      ).to.not.throw();
    });

    it('does not let a pro modify promotion lot files if he does not have permissions', () => {
      const propertyId = Factory.create('property', {
        category: PROPERTY_CATEGORY.PROMOTION,
      })._id;
      const promotionLotId = Factory.create('promotionLot', {
        propertyLinks: [{ _id: propertyId }],
      })._id;
      Factory.create('promotion', {
        promotionLotLinks: [{ _id: promotionLotId }],
        userLinks: [
          {
            _id: proId,
            permissions: { canManageDocuments: false },
          },
        ],
      });
      expect(() =>
        SecurityService.isAllowedToModifyFiles({
          fileKey: `${propertyId}/some/path`,
          docId: propertyId,
          userId: proId,
          collection: COLLECTIONS.PROPERTIES_COLLECTION,
        }),
      ).to.throw('Vous ne pouvez pas');
    });

    it('lets a user modify loan files', () => {
      const loanId = Factory.create('loan', { userId })._id;
      expect(() =>
        SecurityService.isAllowedToModifyFiles({
          fileKey: `${loanId}/some/path`,
          docId: loanId,
          userId,
          collection: COLLECTIONS.LOANS_COLLECTION,
        }),
      ).to.not.throw();
    });
  });
});
