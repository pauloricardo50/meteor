// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { Accounts } from 'meteor/accounts-base';
import sinon from 'sinon';

import { PROMOTION_STATUS } from 'core/api/constants';
import { EMAIL_IDS } from 'core/api/email/emailConstants';
import UserService from 'core/api/users/UserService';
import { ROLES } from 'core/api/users/userConstants';
import LoanService from 'core/api/loans/LoanService';
import PromotionService, {
  PromotionService as PromotionServiceClass,
} from '../../PromotionService';
import PromotionLotService from '../../../promotionLots/PromotionLotService';
import PromotionOptionService from '../../../promotionOptions/PromotionOptionService';
import LotService from '../../../lots/LotService';
import PropertyService from '../../../properties/PropertyService';

describe('PromotionService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('update', () => {
    let promotionId;

    it('sets the address on all properties', () => {
      promotionId = Factory.create('promotion')._id;

      PromotionService.insertPromotionProperty({
        promotionId,
        property: { value: 500000 },
      });
      PromotionService.insertPromotionProperty({
        promotionId,
        property: { value: 1000000 },
      });

      PromotionService.update({
        promotionId,
        object: {
          address1: 'address1',
          address2: 'address2',
          city: 'Geneva',
          zipCode: 1200,
        },
      });

      PropertyService.find({}).forEach((property) => {
        expect(property).to.deep.include({
          address1: 'address1',
          address2: 'address2',
          city: 'Geneva',
          zipCode: 1200,
          canton: 'GE',
        });
      });
    });
  });

  describe('remove', () => {
    let promotionOptionId;
    let loanId;
    let promotionId;
    let promotionLotId;
    let lotId;

    beforeEach(() => {
      lotId = Factory.create('lot')._id;
      promotionLotId = Factory.create('promotionLot')._id;
      promotionId = Factory.create('promotion', {
        _id: 'promotion',
        lotLinks: [{ _id: lotId }],
        promotionLotLinks: [{ _id: promotionLotId }],
      })._id;
      promotionOptionId = Factory.create('promotionOption', {
        promotionLotLinks: [{ _id: promotionLotId }],
      })._id;
      loanId = Factory.create('loan', {
        promotionOptionLinks: [{ _id: promotionOptionId }],
        promotionLinks: [
          { _id: 'promotion', priorityOrder: [promotionOptionId] },
        ],
      })._id;
    });

    it('deletes the promotion', () => {
      expect(PromotionService.collection.find({}).count()).to.equal(1);
      PromotionService.remove({ promotionId });
      expect(PromotionService.collection.find({}).count()).to.equal(0);
    });

    it('deletes all promotionLots', () => {
      expect(PromotionLotService.collection.find({}).count()).to.equal(1);
      PromotionService.remove({ promotionId });
      expect(PromotionLotService.collection.find({}).count()).to.equal(0);
    });

    it('deletes all promotionOptions', () => {
      expect(PromotionOptionService.collection.find({}).count()).to.equal(1);
      PromotionService.remove({ promotionId });
      expect(PromotionOptionService.collection.find({}).count()).to.equal(0);
    });

    it('deletes all lots', () => {
      expect(LotService.collection.find({}).count()).to.equal(1);
      PromotionService.remove({ promotionId });
      expect(LotService.collection.find({}).count()).to.equal(0);
    });
  });

  describe('inviteUser', () => {
    let promotionId;
    let sendEmail;
    let FakePromotionService;
    let adminId;

    beforeEach(() => {
      sendEmail = { run: sinon.spy() };
      FakePromotionService = new PromotionServiceClass({
        sendEmail,
      });
      adminId = Factory.create('admin')._id;
      promotionId = Factory.create('promotion', {
        _id: 'promotion',
        status: PROMOTION_STATUS.OPEN,
        assignedEmployeeId: adminId,
      })._id;
    });

    it('creates user and sends the invitation email if user does not exist', () => {
      const newUser = {
        email: 'new@user.com',
        firstName: 'New',
        lastName: 'User',
        phoneNumber: '1234',
      };

      return FakePromotionService.inviteUser({
        promotionId,
        user: newUser,
      }).then((loanId) => {
        const user = Accounts.findUserByEmail(newUser.email);
        const {
          _id: userId,
          services: {
            password: {
              reset: { token },
            },
          },
        } = user;
        const {
          emailId,
          params: { ctaUrl },
        } = sendEmail.run.args[0][0];
        expect(!!loanId).to.equal(true);
        expect(!!userId).to.equal(true);
        expect(ctaUrl.split('/').slice(-1)[0]).to.equal(token);
        expect(UserService.hasPromotion({ userId, promotionId })).to.equal(true);
        expect(sendEmail.run.called).to.equal(true);
        expect(emailId).to.equal(EMAIL_IDS.INVITE_USER_TO_PROMOTION);
      });
    });

    it('sends the invitation email if user exists', () => {
      const newUser = {
        email: 'new@user.com',
        firstName: 'New',
        lastName: 'User',
        phoneNumber: '1234',
      };

      const userId = UserService.adminCreateUser({
        options: {
          email: newUser.email,
          sendEnrollmentEmail: false,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phoneNumbers: [newUser.phoneNumber],
        },
        role: ROLES.USER,
      });

      return FakePromotionService.inviteUser({
        promotionId,
        user: newUser,
      }).then((loanId) => {
        expect(!!loanId).to.equal(true);
        expect(UserService.hasPromotion({ userId, promotionId })).to.equal(true);
        expect(sendEmail.run.called).to.equal(true);
        expect(sendEmail.run.args[0][0].emailId).to.equal(EMAIL_IDS.INVITE_USER_TO_PROMOTION);
      });
    });

    it('throws an error if user is already invited to the promotion', () => {
      const newUser = {
        email: 'new@user.com',
        firstName: 'New',
        lastName: 'User',
        phoneNumber: '1234',
      };

      const userId = UserService.adminCreateUser({
        options: {
          email: newUser.email,
          sendEnrollmentEmail: false,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phoneNumbers: [newUser.phoneNumber],
        },
        role: ROLES.USER,
      });

      LoanService.insertPromotionLoan({ userId, promotionId });

      expect(() =>
        FakePromotionService.inviteUser({
          promotionId,
          user: newUser,
        })).to.throw('déjà invité');
    });

    it('throws an error if promotion status is not OPEN', () => {
      const newUser = {
        email: 'new@user.com',
        firstName: 'New',
        lastName: 'User',
        phoneNumber: '1234',
      };

      Object.values(PROMOTION_STATUS)
        .filter(status => status !== PROMOTION_STATUS.OPEN)
        .forEach((status) => {
          PromotionService.update({
            promotionId,
            object: { status },
          });

          expect(() =>
            FakePromotionService.inviteUser({
              promotionId,
              user: newUser,
            })).to.throw('Vous ne pouvez pas inviter');
        });
    });

    it('assigns the assignedEmployee to the user', () => {
      const newUser = {
        email: 'new@user.com',
        firstName: 'New',
        lastName: 'User',
        phoneNumber: '1234',
      };

      return FakePromotionService.inviteUser({
        promotionId,
        user: newUser,
      }).then(() => {
        const user = Accounts.findUserByEmail(newUser.email);
        const { assignedEmployeeId } = user;
        expect(assignedEmployeeId).to.equal(adminId);
      });
    });
  });

  describe('removeUser', () => {
    let promotionId;
    let loanId;
    let loan;

    it('removes the promotion from the loan', () => {
      promotionId = Factory.create('promotion')._id;
      loanId = Factory.create('loan', {
        promotionLinks: [
          { _id: promotionId, priorityOrder: [] },
          { _id: 'someOtherPromotion', priorityOrder: [] },
        ],
      })._id;

      PromotionService.removeUser({ promotionId, loanId });

      loan = LoanService.get(loanId);
      expect(loan.promotionLinks).to.deep.equal([
        { _id: 'someOtherPromotion', priorityOrder: [] },
      ]);
    });

    it('removes all promotionOptions from the loan', () => {
      const promotionLotId1 = Factory.create('promotionLot')._id;
      const promotionLotId2 = Factory.create('promotionLot')._id;
      promotionId = Factory.create('promotion', {
        promotionLotLinks: [{ _id: promotionLotId1 }, { _id: promotionLotId2 }],
      })._id;

      const promotionOptionId1 = Factory.create('promotionOption', {
        promotionLotLinks: [{ _id: promotionLotId1 }],
      })._id;
      const promotionOptionId2 = Factory.create('promotionOption', {
        promotionLotLinks: [{ _id: promotionLotId2 }],
      })._id;

      loanId = Factory.create('loan', {
        promotionOptionLinks: [
          { _id: promotionOptionId1 },
          { _id: promotionOptionId2 },
        ],
      })._id;

      PromotionService.removeUser({ promotionId, loanId });

      expect(loan.promotionOptionLinks).to.deep.equal([]);
      expect(PromotionOptionService.find({}).count()).to.equal(0);
    });
  });

  describe('insertPromotionProperty', () => {
    let promotionId;

    it('inserts a property and promotionLot', () => {
      promotionId = Factory.create('promotion')._id;

      PromotionService.insertPromotionProperty({
        promotionId,
        property: { value: 1000000 },
      });

      expect(PropertyService.find().count()).to.equal(1);
      expect(PromotionLotService.find().count()).to.equal(1);
    });

    it('adds the promotions address on the property', () => {
      promotionId = Factory.create('promotion', {
        address1: 'address1',
        address2: 'address2',
        city: 'city',
        zipCode: 1400,
      })._id;

      PromotionService.insertPromotionProperty({
        promotionId,
        property: { value: 1000000 },
      });

      expect(PropertyService.findOne()).to.deep.include({
        address1: 'address1',
        address2: 'address2',
        city: 'city',
        zipCode: 1400,
        canton: 'VD',
      });
    });
  });
});
