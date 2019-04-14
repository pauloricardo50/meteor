// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import generator from 'core/api/factories';
import { PROMOTION_LOT_STATUS } from 'core/api/promotionLots/promotionLotConstants';
import { checkEmails } from '../../../../utils/testHelpers';
import { PROMOTION_STATUS } from '../../../constants';
import { EMAIL_IDS } from '../../../email/emailConstants';
import UserService from '../../../users/server/UserService';
import { ROLES } from '../../../users/userConstants';
import LoanService from '../../../loans/server/LoanService';
import PromotionService from '../PromotionService';
import PromotionLotService from '../../../promotionLots/server/PromotionLotService';
import PromotionOptionService from '../../../promotionOptions/server/PromotionOptionService';
import LotService from '../../../lots/server/LotService';
import PropertyService from '../../../properties/server/PropertyService';

describe('PromotionService', function () {
  this.timeout(10000);

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
      promotionId = 'promoId';
      promotionLotId = 'pLotId';
      promotionOptionId = 'pOptId';
      loanId = 'loanId';
      generator({
        properties: { _id: 'propId' },
        promotions: {
          _id: promotionId,
          promotionLots: {
            _id: promotionLotId,
            propertyLinks: [{ _id: 'propId' }],
            promotionOptions: { _id: promotionOptionId, loan: { _id: loanId } },
          },
          loans: { _id: loanId },
          lots: {},
        },
      });
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
    let adminId;

    beforeEach(() => {
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

      let resetToken;

      const { userId, isNewUser } = UserService.proCreateUser({
        user: newUser,
      });

      return PromotionService.inviteUser({ promotionId, userId, isNewUser })
        .then((loanId) => {
          const user = UserService.getByEmail(newUser.email);
          const {
            services: {
              password: {
                reset: { token },
              },
            },
          } = user;

          resetToken = token;

          expect(!!loanId).to.equal(true);
          expect(!!userId).to.equal(true);
          expect(UserService.hasPromotion({ userId, promotionId })).to.equal(true);

          return checkEmails(1);
        })
        .then((emails) => {
          expect(emails.length).to.equal(1);
          const {
            emailId,
            response: { status },
            template: {
              message: { merge_vars },
            },
          } = emails[0];

          expect(status).to.equal('sent');
          expect(emailId).to.equal(EMAIL_IDS.INVITE_USER_TO_PROMOTION);
          expect(merge_vars[0].vars.find(({ name }) => name === 'CTA_URL').content).to.include(resetToken);
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

      return PromotionService.inviteUser({
        promotionId,
        userId,
      })
        .then((loanId) => {
          expect(!!loanId).to.equal(true);
          expect(UserService.hasPromotion({ userId, promotionId })).to.equal(true);

          return checkEmails(1);
        })
        .then((emails) => {
          expect(emails.length).to.equal(1);
          const {
            emailId,
            response: { status },
          } = emails[0];

          expect(status).to.equal('sent');
          expect(emailId).to.equal(EMAIL_IDS.INVITE_USER_TO_PROMOTION);
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
        PromotionService.inviteUser({
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
            PromotionService.inviteUser({
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

      const { userId, isNewUser } = UserService.proCreateUser({
        user: newUser,
      });

      return PromotionService.inviteUser({
        promotionId,
        userId,
        isNewUser,
      }).then(() => {
        const user = UserService.getByEmail(newUser.email);
        const { assignedEmployeeId } = user;
        expect(assignedEmployeeId).to.equal(adminId);

        return checkEmails(1);
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
      generator({
        properties: [{ _id: 'prop1' }, { _id: 'prop2' }],
        promotions: {
          _id: 'promotionId',
          promotionLots: [
            {
              promotionOptions: { loan: { _id: 'loanId' } },
              propertyLinks: [{ _id: 'prop1' }],
            },
            {
              promotionOptions: { loan: { _id: 'loanId' } },
              propertyLinks: [{ _id: 'prop2' }],
            },
          ],
          loans: { _id: 'loanId' },
        },
      });

      PromotionService.removeUser({
        promotionId: 'promotionId',
        loanId: 'loanId',
      });
      loan = LoanService.fetchOne({
        $filters: { _id: 'loanId' },
        promotionOptionLinks: 1,
      });

      expect(loan.promotionOptionLinks).to.deep.equal([]);
      expect(PromotionOptionService.find({}).count()).to.equal(0);
    });

    it('removes any status from the promotionLot as well as the attributedTo', () => {
      generator({
        properties: [{ _id: 'prop1' }, { _id: 'prop2' }],
        promotions: {
          _id: 'promotionId',
          promotionLots: {
            _id: 'lot1',
            status: 'SOLD',
            promotionOptions: { loan: { _id: 'loanId' } },
            propertyLinks: [{ _id: 'prop1' }],
            attributedTo: { _id: 'loanId' },
          },
          loans: { _id: 'loanId' },
        },
      });

      PromotionService.removeUser({
        promotionId: 'promotionId',
        loanId: 'loanId',
      });
      const promotionLot = PromotionLotService.get('lot1');

      expect(promotionLot.status).to.equal(PROMOTION_LOT_STATUS.AVAILABLE);
      expect(promotionLot.attributedToLink).to.deep.equal({});
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
