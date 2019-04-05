/* eslint-env mocha */
import { expect } from 'chai';
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import sinon from 'sinon';

import SecurityService, { SECURITY_ERROR } from '../..';
import { ROLES } from '../../../constants';
import { DOCUMENT_USER_PERMISSIONS } from '../../constants';
import PromotionService from '../../../promotions/server/PromotionService';
import LoanService from '../../../loans/server/LoanService';
import generator from '../../../factories/factoriesHelpers';
import { PROPERTY_CATEGORY } from '../../../properties/propertyConstants';

describe('Collection Security', () => {
  describe('UserSecurity', () => {
    beforeEach(() => {
      resetDatabase();
    });

    describe('isAllowedToInsertByRole', () => {
      const userRole = ROLES.USER;
      const adminRole = ROLES.ADMIN;
      const devRole = ROLES.DEV;
      const otherRole = 'OTHER';
      let admin;

      beforeEach(() => {
        admin = Factory.create('admin');
        sinon.stub(Meteor, 'userId').callsFake(() => admin._id);
      });

      afterEach(() => {
        if (Meteor.userId.restore) {
          Meteor.userId.restore();
        }
      });

      it('throws if no argument is provided', () => {
        expect(() =>
          SecurityService.users.isAllowedToInsertByRole()).to.throw();
      });

      it('throws if no role is provided', () => {
        expect(() =>
          SecurityService.users.isAllowedToInsertByRole({})).to.throw(SECURITY_ERROR);
      });

      it('throws if passed another role than the ones defined', () => {
        expect(() =>
          SecurityService.users.isAllowedToInsertByRole({ role: otherRole })).to.throw(SECURITY_ERROR);
      });

      it('throws if you try to add devs without dev privileges', () => {
        expect(() =>
          SecurityService.users.isAllowedToInsertByRole({ role: devRole })).to.throw(SECURITY_ERROR);
      });

      it('throws if you try to add admins without dev privileges', () => {
        expect(() =>
          SecurityService.users.isAllowedToInsertByRole({ role: adminRole })).to.throw(SECURITY_ERROR);
      });

      it('throws if you try to add users with user privileges', () => {
        const user = Factory.create('user')._id;
        Meteor.userId.restore();
        sinon.stub(Meteor, 'userId').callsFake(() => user._id);

        expect(() =>
          SecurityService.users.isAllowedToInsertByRole({ role: userRole })).to.throw(SECURITY_ERROR);
      });
    });
  });

  describe('LoanSecurity', () => {
    let userId;
    let userId2;
    let adminId;
    let devId;
    let loanId;

    beforeEach(() => {
      resetDatabase();
      userId = Factory.create('user')._id;
      userId2 = Factory.create('user')._id;
      adminId = Factory.create('admin')._id;
      devId = Factory.create('dev')._id;
      loanId = Factory.create('loan', { userId })._id;
      sinon.stub(Meteor, 'userId').callsFake(() => userId);
    });

    afterEach(() => {
      Meteor.userId.restore();
    });

    describe('isAllowedToInsert', () => {
      it('should throw if the user is not logged in', () => {
        Meteor.userId.restore();
        sinon.stub(Meteor, 'userId').callsFake(() => undefined);

        expect(() => SecurityService.loans.isAllowedToInsert()).to.throw(SECURITY_ERROR);
      });

      it('should not do anything if the user is logged in', () => {
        SecurityService.loans.isAllowedToInsert();
      });
    });

    describe('isAllowedToUpdate', () => {
      it('should not do anything if the user is the owner', () => {
        expect(() =>
          SecurityService.loans.isAllowedToUpdate(loanId)).to.not.throw();
      });

      it('should not do anything if the user is an admin', () => {
        Meteor.userId.restore();
        sinon.stub(Meteor, 'userId').callsFake(() => adminId);

        expect(() =>
          SecurityService.loans.isAllowedToUpdate(loanId)).to.not.throw();
      });

      it('should not do anything if the user is a dev', () => {
        Meteor.userId.restore();
        sinon.stub(Meteor, 'userId').callsFake(() => devId);

        expect(() =>
          SecurityService.loans.isAllowedToUpdate(loanId)).to.not.throw();
      });

      it('should throw if the user is not the owner', () => {
        Meteor.userId.restore();
        sinon.stub(Meteor, 'userId').callsFake(() => userId2);

        expect(userId).to.not.equal(userId2);
        expect(() => SecurityService.loans.isAllowedToUpdate(loanId)).to.throw(SECURITY_ERROR);
      });
    });
  });

  describe('PromotionSecurity', () => {
    let userId;
    beforeEach(() => {
      resetDatabase();
    });

    beforeEach(() => {
      sinon.stub(Meteor, 'userId').callsFake(() => userId);
    });

    afterEach(() => {
      if (Meteor.userId.restore) {
        Meteor.userId.restore();
      }
    });

    describe('isAllowedToModify', () => {
      it('throws if the user is not linked to this promotion', () => {
        userId = Factory.create('pro')._id;
        const promotionId = Factory.create('promotion')._id;

        expect(() =>
          SecurityService.promotions.isAllowedToModify({ promotionId, userId })).to.throw(SECURITY_ERROR);
      });

      it('throws if the user is a PRO without permissions', () => {
        userId = Factory.create('user')._id;
        const promotionId = Factory.create('promotion')._id;
        PromotionService.addProUser({ promotionId, userId });
        PromotionService.setUserPermissions({
          promotionId,
          userId,
          permissions: { canModifyPromotion: false },
        });

        expect(() =>
          SecurityService.promotions.isAllowedToModify({ promotionId, userId })).to.throw(SECURITY_ERROR);
      });

      it('does not throw if the user is a PRO with MODIFY on it', () => {
        userId = Factory.create('pro')._id;
        const promotionId = Factory.create('promotion')._id;
        PromotionService.addProUser({ promotionId, userId });
        PromotionService.setUserPermissions({
          promotionId,
          userId,
          permissions: { canModifyPromotion: true },
        });

        expect(() =>
          SecurityService.promotions.isAllowedToModify({ promotionId, userId })).to.not.throw();
      });
    });

    describe('hasAccessToPromotion', () => {
      it('throws if the user has no loan linked to this promotion', () => {
        userId = Factory.create('user')._id;
        const promotionId = Factory.create('promotion')._id;

        expect(() =>
          SecurityService.promotions.hasAccessToPromotion({
            promotionId,
            userId,
          })).to.throw(SECURITY_ERROR);
      });

      it('does not throw if the user has a loan linked to this promotion', () => {
        userId = Factory.create('user')._id;
        const loanId = Factory.create('loan', { userId })._id;
        const promotionId = Factory.create('promotion')._id;

        PromotionService.addLink({
          id: promotionId,
          linkName: 'loans',
          linkId: loanId,
        });

        expect(() =>
          SecurityService.promotions.hasAccessToPromotion({
            promotionId,
            userId,
          })).to.not.throw();
      });

      it('does not throw if the user is a PRO with right permissions', () => {
        userId = Factory.create('pro')._id;
        const promotionId = Factory.create('promotion')._id;
        PromotionService.addProUser({ promotionId, userId });
        PromotionService.setUserPermissions({
          promotionId,
          userId,
          permissions: {},
        });

        expect(() =>
          SecurityService.promotions.hasAccessToPromotion({
            promotionId,
            userId,
          })).to.not.throw();
      });

      it('does not throw if user is an admin', () => {
        userId = Factory.create('admin')._id;
        const promotionId = Factory.create('promotion')._id;

        expect(() =>
          SecurityService.promotions.hasAccessToPromotion({
            promotionId,
            userId,
          })).to.not.throw();
      });
    });

    describe('hasAccessToPromotionLot', () => {
      it('throws if the user is not on this promotion', () => {
        userId = Factory.create('user')._id;
        const loanId = Factory.create('loan', { userId })._id;
        const promotionId = Factory.create('promotion')._id;
        const promotionId2 = Factory.create('promotion', {
          promotionLotLinks: [],
        })._id;
        const promotionLotId = Factory.create('promotionLot')._id;

        PromotionService.addLink({
          id: promotionId,
          linkName: 'promotionLots',
          linkId: promotionLotId,
        });
        PromotionService.addLink({
          id: promotionId2,
          linkName: 'loans',
          linkId: loanId,
        });

        expect(() =>
          SecurityService.promotions.hasAccessToPromotionLot({
            promotionLotId,
            userId,
          })).to.throw(SECURITY_ERROR);
      });

      it('does not throw if the user is on the promotion', () => {
        userId = Factory.create('user')._id;
        const loanId = Factory.create('loan', { userId })._id;
        const promotionId = Factory.create('promotion')._id;
        const promotionLotId = Factory.create('promotionLot')._id;

        PromotionService.addLink({
          id: promotionId,
          linkName: 'promotionLots',
          linkId: promotionLotId,
        });
        PromotionService.addLink({
          id: promotionId,
          linkName: 'loans',
          linkId: loanId,
        });

        expect(() =>
          SecurityService.promotions.hasAccessToPromotionLot({
            promotionLotId,
            userId,
          })).to.not.throw(SECURITY_ERROR);
      });
    });

    describe('hasAccessToPromotionOption', () => {
      it('throws if the option is not on the users loan', () => {
        userId = Factory.create('user')._id;
        const loanId = Factory.create('loan', { userId })._id;
        const promotionId = Factory.create('promotion')._id;
        const promotionOptionId = Factory.create('promotionOption')._id;

        PromotionService.addLink({
          id: promotionId,
          linkName: 'loans',
          linkId: loanId,
        });

        expect(() =>
          SecurityService.promotions.hasAccessToPromotionOption({
            promotionOptionId,
            userId,
          })).to.throw(SECURITY_ERROR);
      });

      it('does not throw if the option is on the users loan', () => {
        userId = Factory.create('user')._id;
        const loanId = Factory.create('loan', { userId })._id;
        const promotionId = Factory.create('promotion')._id;
        const promotionOptionId = Factory.create('promotionOption')._id;

        PromotionService.addLink({
          id: promotionId,
          linkName: 'loans',
          linkId: loanId,
        });
        LoanService.addLink({
          id: loanId,
          linkName: 'promotionOptions',
          linkId: promotionOptionId,
        });

        expect(() =>
          SecurityService.promotions.hasAccessToPromotionOption({
            promotionOptionId,
            userId,
          })).to.not.throw(SECURITY_ERROR);
      });
    });
  });

  describe('PropertySecurity', () => {
    beforeEach(() => {
      resetDatabase();
    });

    describe('isAllowedToUpdate', () => {
      it('does not throw if user is admin', () => {
        generator({
          users: [{ _id: 'adminId', _factory: 'admin' }],
          properties: [{ _id: 'propertyId' }],
        });

        expect(() =>
          SecurityService.properties.isAllowedToUpdate('propertyId', 'adminId')).to.not.throw();
      });

      it('does throw if user is pro and is not allowed to update', () => {
        generator({
          users: [{ _id: 'proId', _factory: 'pro' }],
          properties: [{ _id: 'propertyId' }],
        });

        expect(() =>
          SecurityService.properties.isAllowedToUpdate('propertyId', 'proId')).to.throw('Vous ne pouvez pas modifier ce bien immobilier');
      });

      it('does throw if user is user and is not allowed to update', () => {
        generator({
          users: [{ _id: 'userId' }],
          properties: [{ _id: 'propertyId' }],
        });

        expect(() =>
          SecurityService.properties.isAllowedToUpdate('propertyId', 'userId')).to.throw('Checking ownership [NOT_AUTHORIZED]');
      });

      it('does not throw if user is user and is allowed to update', () => {
        generator({
          users: [{ _id: 'userId' }],
          properties: [{ _id: 'propertyId', userId: 'userId' }],
        });

        expect(() =>
          SecurityService.properties.isAllowedToUpdate('propertyId', 'userId')).to.not.throw();
      });

      it('does not throw if user is pro and is allowed to update PRO property', () => {
        generator({
          users: [{ _id: 'proId', _factory: 'pro' }],
          properties: [
            {
              _id: 'propertyId',
              category: PROPERTY_CATEGORY.PRO,
              users: [
                {
                  _id: 'proId',
                  $metadata: { permissions: { canModifyProperty: true } },
                },
              ],
            },
          ],
        });

        expect(() =>
          SecurityService.properties.isAllowedToUpdate('propertyId', 'proId')).to.not.throw();
      });

      it('does throw if user is pro and is not allowed to update PRO property', () => {
        generator({
          users: [{ _id: 'proId', _factory: 'pro' }],
          properties: [
            {
              _id: 'propertyId',
              category: PROPERTY_CATEGORY.PRO,
              users: [
                {
                  _id: 'proId',
                  $metadata: { permissions: { canModifyProperty: false } },
                },
              ],
            },
          ],
        });

        expect(() =>
          SecurityService.properties.isAllowedToUpdate('propertyId', 'proId')).to.throw('Vous ne pouvez pas modifier ce bien immobilier');
      });

      it('does throw if user is pro and is not allowed to update PROMOTION property', () => {
        generator({
          users: [{ _id: 'proId', _factory: 'pro' }],
          properties: [
            {
              _id: 'propertyId',
              category: PROPERTY_CATEGORY.PROMOTION,
            },
          ],
          promotions: [
            {
              _id: 'promotionId',
              users: [
                {
                  _id: 'proId',
                  $metadata: { permissions: { canModifyPromotion: false } },
                },
              ],
              propertyLinks: [{ _id: 'propertyId' }],
            },
          ],
        });

        expect(() =>
          SecurityService.properties.isAllowedToUpdate('propertyId', 'proId')).to.throw('Vous ne pouvez pas modifier cette promotion');
      });

      it('does not throw if user is pro and is allowed to update PROMOTION property', () => {
        generator({
          users: [{ _id: 'proId', _factory: 'pro' }],
          properties: [
            {
              _id: 'propertyId',
              category: PROPERTY_CATEGORY.PROMOTION,
            },
          ],
          promotions: [
            {
              _id: 'promotionId',
              users: [
                {
                  _id: 'proId',
                  $metadata: { permissions: { canModifyPromotion: true } },
                },
              ],
              propertyLinks: [{ _id: 'propertyId' }],
            },
          ],
        });

        expect(() =>
          SecurityService.properties.isAllowedToUpdate('propertyId', 'proId')).to.not.throw();
      });
    });
  });
});
