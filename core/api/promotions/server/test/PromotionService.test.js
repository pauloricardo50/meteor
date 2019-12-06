// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import generator from 'core/api/factories';
import { PROMOTION_LOT_STATUS } from 'core/api/promotionLots/promotionLotConstants';
import { PROMOTION_STATUS } from '../../../constants';
import UserService from '../../../users/server/UserService';
import { ROLES } from '../../../users/userConstants';
import LoanService from '../../../loans/server/LoanService';
import PromotionService from '../PromotionService';
import PromotionLotService from '../../../promotionLots/server/PromotionLotService';
import PromotionOptionService from '../../../promotionOptions/server/PromotionOptionService';
import LotService from '../../../lots/server/LotService';
import PropertyService from '../../../properties/server/PropertyService';
import { PROMOTION_TYPES } from '../../promotionConstants';

describe('PromotionService', function () {
  this.timeout(10000);

  beforeEach(() => {
    resetDatabase();
  });

  describe('insert', () => {
    it('inserts a promotion without issue', () => {
      PromotionService.insert({
        promotion: {
          name: 'Promo 1',
          type: PROMOTION_TYPES.CREDIT,
          zipCode: 1200,
          agreementDuration: 30,
          contacts: [{ name: 'joe', title: 'CEO' }],
        },
      });

      expect(PromotionService.countAll()).to.equal(1);
    });
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

      PropertyService.find({}).forEach(property => {
        expect(property).to.deep.include({
          address1: 'Address1',
          address2: 'Address2',
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
            promotionOptions: {
              _id: promotionOptionId,
              loan: { _id: loanId },
              promotion: { _id: 'promoId' },
            },
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
      adminId = 'adminId';
      promotionId = 'promotionId';
      generator({
        users: [
          {
            _id: adminId,
            _factory: 'admin',
            firstName: 'Admin',
            lastName: 'User',
          },
          {
            _id: 'proId',
            _factory: 'pro',
            firstName: 'Pro',
            lastName: 'User',
          },
        ],
        promotions: {
          _id: promotionId,
          status: PROMOTION_STATUS.OPEN,
          assignedEmployeeId: adminId,
          promotionLots: [{ _id: 'pL1' }],
        },
      });
    });

    it('creates user and sends the invitation email if user does not exist', async () => {
      const newUser = {
        email: 'new@user.com',
        firstName: 'New',
        lastName: 'User',
        phoneNumber: '1234',
      };

      const { userId, isNewUser } = UserService.proCreateUser({
        user: newUser,
      });

      const loanId = await PromotionService.inviteUser({
        promotionId,
        userId,
        isNewUser,
        pro: { _id: 'proId' },
      });

      expect(!!loanId).to.equal(true);
      expect(!!userId).to.equal(true);
      expect(UserService.hasPromotion({ userId, promotionId })).to.equal(true);
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
        }),
      ).to.throw('déjà invité');
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
        .forEach(status => {
          PromotionService.update({
            promotionId,
            object: { status },
          });

          expect(() =>
            PromotionService.inviteUser({
              promotionId,
              user: newUser,
            }),
          ).to.throw('Vous ne pouvez pas inviter');
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
      });
    });
  });

  describe('removeLoan', () => {
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

      PromotionService.removeLoan({ promotionId, loanId });

      loan = LoanService.get(loanId, { promotionLinks: 1 });
      expect(loan.promotionLinks).to.deep.equal([
        { _id: 'someOtherPromotion', priorityOrder: [], showAllLots: true },
      ]);
    });

    it('removes all promotionOptions from the loan', () => {
      generator({
        properties: [{ _id: 'prop1' }, { _id: 'prop2' }],
        promotions: {
          _id: 'promotionId',
          promotionLots: [
            {
              promotionOptions: {
                loan: { _id: 'loanId' },
                promotion: { _id: 'promotionId' },
              },
              propertyLinks: [{ _id: 'prop1' }],
            },
            {
              promotionOptions: {
                loan: { _id: 'loanId' },
                promotion: { _id: 'promotionId' },
              },
              propertyLinks: [{ _id: 'prop2' }],
            },
          ],
          loans: { _id: 'loanId' },
        },
      });

      PromotionService.removeLoan({
        promotionId: 'promotionId',
        loanId: 'loanId',
      });
      loan = LoanService.get('loanId', { promotionOptionLinks: 1 });

      expect(loan.promotionOptionLinks).to.deep.equal([]);
      expect(PromotionOptionService.find({}).count()).to.equal(0);
    });

    it('removes any status from the promotionLot as well as the attributedTo', () => {
      generator({
        properties: [{ _id: 'prop1' }, { _id: 'prop2' }],
        promotions: {
          _id: 'promotionId',
          promotionLots: [
            {
              _id: 'lot1',
              status: 'SOLD',
              promotionOptions: {
                _id: 'promotionOptionId',
                loan: { _id: 'loanId' },
                promotion: { _id: 'promotionId' },
              },
              propertyLinks: [{ _id: 'prop1' }],
              attributedTo: { _id: 'loanId' },
            },
          ],
          loans: { _id: 'loanId' },
        },
      });

      PromotionService.removeLoan({
        promotionId: 'promotionId',
        loanId: 'loanId',
      });
      const promotionLot = PromotionLotService.get('lot1', {
        status: 1,
        attributedToLink: 1,
      });

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

      expect(
        PropertyService.get(
          {},
          { address1: 1, address2: 1, city: 1, zipCode: 1, canton: 1 },
        ),
      ).to.deep.include({
        address1: 'Address1',
        address2: 'Address2',
        city: 'City',
        zipCode: 1400,
        canton: 'VD',
      });
    });
  });

  describe('removeProUser', () => {
    it('removes the pro from the promotion', () => {
      generator({
        promotions: {
          _id: 'promotionId',
          users: { _id: 'proId', _factory: 'pro' },
        },
      });

      expect(
        PromotionService.get('promotionId', { userLinks: 1 }).userLinks.length,
      ).to.equal(1);

      PromotionService.removeProUser({
        promotionId: 'promotionId',
        userId: 'proId',
      });

      expect(
        PromotionService.get('promotionId', { userLinks: 1 }).userLinks.length,
      ).to.equal(0);
    });

    it('does not fail if no loans are attributed to the pro', () => {
      generator({
        promotions: {
          _id: 'promotionId',
          users: { _id: 'proId', _factory: 'pro' },
          loans: [{}, {}],
        },
      });

      expect(
        PromotionService.get('promotionId', { userLinks: 1 }).userLinks.length,
      ).to.equal(1);

      PromotionService.removeProUser({
        promotionId: 'promotionId',
        userId: 'proId',
      });

      expect(
        PromotionService.get('promotionId', { userLinks: 1 }).userLinks.length,
      ).to.equal(0);
    });

    it('only removes him from the current promotion', () => {
      generator({
        promotions: [
          {
            _id: 'promotionId',
            users: { _id: 'proId', _factory: 'pro' },
            loans: { _id: 'loanId', $metadata: { invitedBy: 'proId' } },
          },
          {
            _id: 'promotionId2',
            users: { _id: 'proId' },
            loans: { _id: 'loanId2', $metadata: { invitedBy: 'proId' } },
          },
        ],
      });

      expect(
        PromotionService.get('promotionId', { userLinks: 1 }).userLinks.length,
      ).to.equal(1);
      expect(
        PromotionService.get('promotionId2', { userLinks: 1 }).userLinks.length,
      ).to.equal(1);

      PromotionService.removeProUser({
        promotionId: 'promotionId',
        userId: 'proId',
      });

      expect(
        PromotionService.get('promotionId', { userLinks: 1 }).userLinks.length,
      ).to.equal(0);
      expect(
        PromotionService.get('promotionId2', { userLinks: 1 }).userLinks.length,
      ).to.equal(1);
      expect(
        LoanService.get('loanId', { promotionLinks: 1 }).promotionLinks[0]
          .invitedBy,
      ).to.equal(undefined);
      expect(
        LoanService.get('loanId2', { promotionLinks: 2 }).promotionLinks[0]
          .invitedBy,
      ).to.equal('proId');
    });
  });

  describe('editPromotionLoan', () => {
    it('updates showAllLots without overwriting other metadata', () => {
      generator({
        properties: { _id: 'prop' },
        promotions: {
          _id: 'promoId',
          promotionLots: {
            _id: 'pLot1',
            propertyLinks: [{ _id: 'prop' }],
            promotionOptions: { _id: 'pOpt1' },
          },
          loans: {
            _id: 'loanId',
            $metadata: { showAllLots: true, priorityOrder: ['pOpt1'] },
          },
        },
      });

      const { loans: loans1 } = PromotionService.get('promoId', {
        loans: { _id: 1 },
      });

      expect(loans1[0].$metadata.showAllLots).to.equal(true);

      expect(loans1[0].$metadata.priorityOrder).to.deep.equal(['pOpt1']);

      PromotionService.editPromotionLoan({
        loanId: 'loanId',
        promotionId: 'promoId',
        promotionLotIds: [],
        showAllLots: false,
      });

      const { loans } = PromotionService.get('promoId', { loans: { _id: 1 } });

      expect(loans[0].$metadata.showAllLots).to.equal(false);
      expect(loans[0].$metadata.priorityOrder).to.deep.equal(['pOpt1']);
    });

    it('adds new promotionOptions', () => {
      generator({
        properties: { _id: 'prop' },
        promotions: {
          _id: 'promoId',
          promotionLots: [
            {
              _id: 'pLot1',
              propertyLinks: [{ _id: 'prop' }],
            },
            {
              _id: 'pLot2',
              propertyLinks: [{ _id: 'prop' }],
            },
          ],
          loans: { _id: 'loanId' },
        },
      });

      const { loans: loans1 } = PromotionService.get('promoId', {
        loans: { promotionOptionLinks: 1 },
      });

      expect(loans1[0].promotionOptionLinks.length).to.equal(0);

      PromotionService.editPromotionLoan({
        loanId: 'loanId',
        promotionId: 'promoId',
        promotionLotIds: ['pLot2'],
      });

      const { loans } = PromotionService.get('promoId', {
        loans: { promotionOptions: { promotionLots: { _id: 1 } } },
      });

      expect(loans[0].promotionOptions.length).to.equal(1);
      expect(loans[0].promotionOptions[0].promotionLots[0]._id).to.equal(
        'pLot2',
      );
    });

    it('removes any old promotionOptions', () => {
      generator({
        properties: { _id: 'prop' },
        promotions: {
          _id: 'promoId',
          promotionLots: [
            {
              _id: 'pLot1',
              propertyLinks: [{ _id: 'prop' }],
              promotionOptions: { _id: 'pOpt1', promotion: { _id: 'promoId' } },
            },
            {
              _id: 'pLot2',
              propertyLinks: [{ _id: 'prop' }],
              promotionOptions: { _id: 'pOpt2', promotion: { _id: 'promoId' } },
            },
          ],
          loans: {
            _id: 'loanId',
            promotionOptions: [
              { _id: 'pOpt1', promotion: { _id: 'promoId' } },
              { _id: 'pOpt2', promotion: { _id: 'promoId' } },
            ],
          },
        },
      });

      const { loans: loans1 } = PromotionService.get('promoId', {
        loans: { promotionOptionLinks: 1 },
      });

      expect(loans1[0].promotionOptionLinks.length).to.equal(2);

      PromotionService.editPromotionLoan({
        loanId: 'loanId',
        promotionId: 'promoId',
        promotionLotIds: ['pLot2'],
      });

      const { loans } = PromotionService.get('promoId', {
        loans: { promotionOptions: { promotionLots: { _id: 1 } } },
      });

      expect(loans[0].promotionOptions.length).to.equal(1);
      expect(loans[0].promotionOptions[0].promotionLots[0]._id).to.equal(
        'pLot2',
      );
    });

    it('throws if one of the promotionOptions is attributed to this loan', () => {
      generator({
        properties: { _id: 'prop', name: 'lot 1' },
        promotions: {
          _id: 'promoId',
          promotionLots: [
            {
              _id: 'pLot1',
              propertyLinks: [{ _id: 'prop' }],
              promotionOptions: { _id: 'pOpt1' },
              attributedTo: {
                _id: 'loanId',
                promotionOptions: [{ _id: 'pOpt1' }],
              },
            },
          ],
          loans: { _id: 'loanId' },
        },
      });

      expect(() =>
        PromotionService.editPromotionLoan({
          loanId: 'loanId',
          promotionId: 'promoId',
          promotionLotIds: [],
        }),
      ).to.throw('"Lot 1"');
    });
  });

  describe('toggleNotifications', () => {
    it('toggles enableNotifications metadata', () => {
      generator({
        promotions: {
          _id: 'promoId',
          users: {
            _id: 'userId',
            $metadata: {
              permissions: { canAddLots: true },
            },
          },
        },
      });

      const result = PromotionService.toggleNotifications({
        promotionId: 'promoId',
        userId: 'userId',
      });

      const promotion = PromotionService.get('promoId', { userLinks: 1 });

      expect(result).to.equal(false);
      expect(promotion.userLinks[0]).to.deep.include({
        _id: 'userId',
        enableNotifications: false,
      });

      const result2 = PromotionService.toggleNotifications({
        promotionId: 'promoId',
        userId: 'userId',
      });

      const promotion2 = PromotionService.get('promoId', { userLinks: 1 });

      expect(result2).to.equal(true);
      expect(promotion2.userLinks[0]).to.deep.include({
        _id: 'userId',
        enableNotifications: true,
      });
    });
  });

  describe('addProUser', () => {
    it('sets displayCustomerNames to an empty object ', () => {
      generator({
        promotions: { _id: 'promo' },
        users: { _id: 'proId', _factory: 'pro' },
      });

      PromotionService.addProUser({ promotionId: 'promo', userId: 'proId' });

      const promotion = PromotionService.get('promo', { userLinks: 1 });

      expect(promotion.userLinks[0].permissions.displayCustomerNames).to.equal(
        false,
      );
    });
  });
});
