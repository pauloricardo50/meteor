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

    describe('isAllowedToRead', () => {
      it('throws if the user has no loan linked to this promotion', () => {
        userId = Factory.create('user')._id;
        const promotionId = Factory.create('promotion')._id;

        expect(() =>
          SecurityService.promotions.isAllowedToRead(promotionId, userId)).to.throw(SECURITY_ERROR);
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
          SecurityService.promotions.isAllowedToRead(promotionId, userId)).to.not.throw();
      });

      it('does not throw if the user is a PRO with READ on it', () => {
        userId = Factory.create('pro')._id;
        const promotionId = Factory.create('promotion')._id;
        PromotionService.addLink({
          id: promotionId,
          linkName: 'users',
          linkId: userId,
          metadata: { permissions: DOCUMENT_USER_PERMISSIONS.READ },
        });

        expect(() =>
          SecurityService.promotions.isAllowedToRead(promotionId, userId)).to.not.throw();
      });

      it('does not throw if the user is a PRO with MODIFY on it', () => {
        userId = Factory.create('pro')._id;
        const promotionId = Factory.create('promotion')._id;
        PromotionService.addLink({
          id: promotionId,
          linkName: 'users',
          linkId: userId,
          metadata: { permissions: DOCUMENT_USER_PERMISSIONS.MODIFY },
        });

        expect(() =>
          SecurityService.promotions.isAllowedToRead(promotionId, userId)).to.not.throw();
      });
    });

    describe('isAllowedToReadPromotionLot', () => {
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
          SecurityService.promotions.isAllowedToReadPromotionLot(
            promotionLotId,
            userId,
          )).to.throw(SECURITY_ERROR);
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
          SecurityService.promotions.isAllowedToReadPromotionLot(
            promotionLotId,
            userId,
          )).to.not.throw(SECURITY_ERROR);
      });
    });

    describe('isAllowedToReadPromotionOption', () => {
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
          SecurityService.promotions.isAllowedToReadPromotionOption(
            promotionOptionId,
            userId,
          )).to.throw(SECURITY_ERROR);
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
          SecurityService.promotions.isAllowedToReadPromotionOption(
            promotionOptionId,
            userId,
          )).to.not.throw(SECURITY_ERROR);
      });
    });
  });
});
