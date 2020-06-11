import { Factory } from 'meteor/dburles:factory';

/* eslint-env mocha */
import { expect } from 'chai';

import { checkEmails, resetDatabase } from '../../../../utils/testHelpers';
import { EMAIL_IDS } from '../../../email/emailConstants';
import generator from '../../../factories/server';
import LoanService from '../../../loans/server/LoanService';
import LotService from '../../../lots/server/LotService';
import { ddpWithUserId } from '../../../methods/methodHelpers';
import { PROMOTION_LOT_STATUS } from '../../../promotionLots/promotionLotConstants';
import PromotionLotService from '../../../promotionLots/server/PromotionLotService';
import {
  PROMOTION_OPTION_AGREEMENT_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
  PROMOTION_OPTION_DEPOSIT_STATUS,
  PROMOTION_OPTION_FULL_VERIFICATION_STATUS,
  PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS,
  PROMOTION_OPTION_STATUS,
} from '../../../promotionOptions/promotionOptionConstants';
import PromotionOptionService from '../../../promotionOptions/server/PromotionOptionService';
import PropertyService from '../../../properties/server/PropertyService';
import UserService from '../../../users/server/UserService';
import { ROLES } from '../../../users/userConstants';
import { removeLoanFromPromotion } from '../../methodDefinitions';
import {
  PROMOTION_STATUS,
  PROMOTION_TYPES,
  PROMOTION_USERS_ROLES,
} from '../../promotionConstants';
import PromotionService from '../PromotionService';

describe('PromotionService', function() {
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
        const user = UserService.getByEmail(newUser.email, {
          assignedEmployeeId: 1,
        });
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
                status: PROMOTION_OPTION_STATUS.SOLD,
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
        LoanService.get('loanId2', { promotionLinks: 2 }).promotionLinks[0]
          .invitedBy,
      ).to.equal('proId');
    });

    it('throws if it has customers in promotion', () => {
      generator({
        promotions: [
          {
            _id: 'promotionId',
            users: { _id: 'proId' },
            loans: { _id: 'loanId', $metadata: { invitedBy: 'proId' } },
          },
        ],
      });

      expect(() =>
        PromotionService.removeProUser({
          promotionId: 'promotionId',
          userId: 'proId',
        }),
      ).to.throw('des clients dans cette promotion');

      expect(
        LoanService.get('loanId', { promotionLinks: 2 }).promotionLinks[0]
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

  describe('removeLoanFromPromotion', () => {
    beforeEach(() => {
      generator({
        users: [
          { _id: 'user' },
          { _id: 'user2' },
          { _id: 'admin', _factory: 'admin' },
          {
            _id: 'pro',
            _factory: 'pro',
            promotions: {
              _id: 'promotion',
              $metadata: { roles: [PROMOTION_USERS_ROLES.BROKER] },
            },
            emails: [{ address: 'pro@e-potek.ch', verified: true }],
            organisations: { _id: 'org' },
          },
        ],
        promotions: {
          _id: 'promotion',
          promotionLots: [{ _id: 'pL' }, { _id: 'pL2' }],
        },
        loans: [
          {
            _id: 'loan',
            promotionOptions: {
              _id: 'pO',
              promotionLots: { _id: 'pL' },
              promotion: { _id: 'promotion' },
            },
            promotions: { _id: 'promotion', $metadata: { invitedBy: 'pro' } },
            user: { _id: 'user' },
          },
          {
            _id: 'loan2',
            promotionOptions: {
              _id: 'pO2',
              promotionLots: { _id: 'pL' },
              promotion: { _id: 'promotion' },
              bank: { status: PROMOTION_OPTION_BANK_STATUS.VALIDATED },
              simpleVerification: {
                status: PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED,
              },
              fullVerification: {
                status: PROMOTION_OPTION_FULL_VERIFICATION_STATUS.VALIDATED,
              },
              reservationAgreement: {
                status: PROMOTION_OPTION_AGREEMENT_STATUS.RECEIVED,
              },
              reservationDeposit: {
                status: PROMOTION_OPTION_DEPOSIT_STATUS.PAID,
              },
            },
            promotions: { _id: 'promotion' },
          },
          {
            _id: 'loan3',
            promotionOptions: [
              {
                _id: 'pO3',
                promotionLots: { _id: 'pL' },
                promotion: { _id: 'promotion' },
              },
              {
                _id: 'pO4',
                promotionLots: { _id: 'pL2' },
                promotion: { _id: 'promotion' },
              },
            ],
            promotions: { _id: 'promotion', $metadata: { invitedBy: 'pro' } },
            user: { _id: 'user' },
          },
        ],
      });
    });

    it('removes the promotion from the loan', async () => {
      await ddpWithUserId('admin', () =>
        removeLoanFromPromotion.run({
          loanId: 'loan',
          promotionId: 'promotion',
        }),
      );
      await checkEmails(1);

      const { promotions = [] } = LoanService.get('loan', {
        promotions: { _id: 1 },
      });

      expect(promotions.length).to.equal(0);
    });

    it('removes the related promotion option', async () => {
      await ddpWithUserId('admin', () =>
        removeLoanFromPromotion.run({
          loanId: 'loan',
          promotionId: 'promotion',
        }),
      );
      await checkEmails(1);

      const { promotionOptions = [] } = PromotionService.get('promotion', {
        promotionOptions: { _id: 1 },
      });
      expect(promotionOptions.length).to.equal(3);
      expect(promotionOptions.some(({ _id }) => _id === 'pO')).to.equal(false);
    });

    it('removes the related promotion options', async () => {
      await ddpWithUserId('admin', () =>
        removeLoanFromPromotion.run({
          loanId: 'loan3',
          promotionId: 'promotion',
        }),
      );
      await checkEmails(2);

      const { promotionOptions = [] } = PromotionService.get('promotion', {
        promotionOptions: { _id: 1 },
      });
      expect(promotionOptions.length).to.equal(2);
      expect(
        promotionOptions.some(({ _id }) => _id === 'pO3' || _id === 'pO4'),
      ).to.equal(false);
    });

    it('changes the promotionLotStatus if it was attributed to this loan', async () => {
      PromotionOptionService.update({
        promotionOptionId: 'pO',
        object: {
          bank: { status: PROMOTION_OPTION_BANK_STATUS.VALIDATED },
          simpleVerification: {
            status: PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED,
          },
          fullVerification: {
            status: PROMOTION_OPTION_FULL_VERIFICATION_STATUS.VALIDATED,
          },
          reservationAgreement: {
            status: PROMOTION_OPTION_AGREEMENT_STATUS.RECEIVED,
          },
          reservationDeposit: { status: PROMOTION_OPTION_DEPOSIT_STATUS.PAID },
        },
      });
      PromotionLotService.reservePromotionLot({
        promotionOptionId: 'pO',
      });
      await ddpWithUserId('admin', () =>
        removeLoanFromPromotion.run({
          loanId: 'loan',
          promotionId: 'promotion',
        }),
      );
      await checkEmails(1);

      const { status, attributedTo } = PromotionLotService.get('pL', {
        status: 1,
        attributedTo: { _id: 1 },
      });
      expect(status).to.equal(PROMOTION_LOT_STATUS.AVAILABLE);
      expect(attributedTo).to.equal(undefined);
    });

    it('does not change the promotionLotStatus if it was not attributed to this loan', async () => {
      PromotionLotService.reservePromotionLot({
        promotionOptionId: 'pO2',
      });
      await ddpWithUserId('admin', () =>
        removeLoanFromPromotion.run({
          loanId: 'loan',
          promotionId: 'promotion',
        }),
      );
      await checkEmails(1);

      const { status, attributedTo } = PromotionLotService.get('pL', {
        status: 1,
        attributedTo: { _id: 1 },
      });
      expect(status).to.equal(PROMOTION_LOT_STATUS.RESERVED);
      expect(attributedTo._id).to.equal('loan2');
    });

    it('sends the email if a reservation was active', async () => {
      await ddpWithUserId('admin', () =>
        removeLoanFromPromotion.run({
          loanId: 'loan',
          promotionId: 'promotion',
        }),
      );
      const [{ emailId }] = await checkEmails(1);
      expect(emailId).to.equal(
        EMAIL_IDS.CANCEL_PROMOTION_LOT_RESERVATION_PROCESS,
      );
    });

    it('sends the email if a reservation was reserved', async () => {
      PromotionOptionService.update({
        promotionOptionId: 'pO',
        object: {
          bank: { status: PROMOTION_OPTION_BANK_STATUS.VALIDATED },
          simpleVerification: {
            status: PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED,
          },
          fullVerification: {
            status: PROMOTION_OPTION_FULL_VERIFICATION_STATUS.VALIDATED,
          },
          reservationAgreement: {
            status: PROMOTION_OPTION_AGREEMENT_STATUS.RECEIVED,
          },
          reservationDeposit: { status: PROMOTION_OPTION_DEPOSIT_STATUS.PAID },
        },
      });
      PromotionLotService.reservePromotionLot({
        promotionOptionId: 'pO',
      });
      await ddpWithUserId('admin', () =>
        removeLoanFromPromotion.run({
          loanId: 'loan',
          promotionId: 'promotion',
        }),
      );
      await checkEmails(1);

      const [{ emailId }] = await checkEmails(1);
      expect(emailId).to.equal(EMAIL_IDS.CANCEL_PROMOTION_LOT_RESERVATION);
    });

    it('sends emails for each reservation', async () => {
      await ddpWithUserId('admin', () =>
        removeLoanFromPromotion.run({
          loanId: 'loan3',
          promotionId: 'promotion',
        }),
      );
      const emails = await checkEmails(2);
      emails.forEach(({ emailId }) =>
        expect(emailId).to.equal(
          EMAIL_IDS.CANCEL_PROMOTION_LOT_RESERVATION_PROCESS,
        ),
      );
    });
  });

  describe('promotionLotGroups', () => {
    it('adds new promotionLotGroup to the promotion', () => {
      generator({ promotions: { _id: 'promotion' } });

      PromotionService.addPromotionLotGroup({
        promotionId: 'promotion',
        promotionLotGroup: { label: 'Group 1' },
      });

      const { promotionLotGroups = [] } = PromotionService.get('promotion', {
        promotionLotGroups: 1,
      });

      expect(promotionLotGroups.length).to.equal(1);
      const [group] = promotionLotGroups;
      expect(group.label).to.equal('Group 1');
      expect(group.id).to.not.equal(undefined);
    });

    it('appends new promotionLotGroup to the promotion', () => {
      generator({
        promotions: {
          _id: 'promotion',
          promotionLotGroups: [
            {
              id: 'group1',
              label: 'Group 1',
            },
            {
              id: 'group2',
              label: 'Group 2',
            },
          ],
        },
      });

      PromotionService.addPromotionLotGroup({
        promotionId: 'promotion',
        promotionLotGroup: { label: 'Group 3' },
      });

      const { promotionLotGroups = [] } = PromotionService.get('promotion', {
        promotionLotGroups: 1,
      });

      expect(promotionLotGroups.length).to.equal(3);
      const [group1, group2, group3] = promotionLotGroups;
      expect(group1).to.deep.equal({
        id: 'group1',
        label: 'Group 1',
      });
      expect(group2).to.deep.equal({
        id: 'group2',
        label: 'Group 2',
      });
      expect(group3.label).to.equal('Group 3');
      expect(group3.id).to.not.equal(undefined);
    });

    it('throws when adding a promotionLotGroup with the same label', () => {
      generator({
        promotions: {
          _id: 'promotion',
          promotionLotGroups: [
            {
              id: 'group1',
              label: 'Group 1',
            },
            {
              id: 'group2',
              label: 'Group 2',
            },
          ],
        },
      });

      expect(() =>
        PromotionService.addPromotionLotGroup({
          promotionId: 'promotion',
          promotionLotGroup: { label: 'Group 1' },
        }),
      ).to.throw('Le groupe "Group 1" existe déjà');
    });

    it('removes a promotionLotGroup from the promotion', () => {
      generator({
        promotions: {
          _id: 'promotion',
          promotionLotGroups: [
            {
              id: 'group1',
              label: 'Group 1',
            },
          ],
        },
      });

      PromotionService.removePromotionLotGroup({
        promotionId: 'promotion',
        promotionLotGroupId: 'group1',
      });

      const { promotionLotGroups = [] } = PromotionService.get('promotion', {
        promotionLotGroups: 1,
      });

      expect(promotionLotGroups.length).to.equal(0);
    });

    it('removes only one promotionLotGroup from the promotion', () => {
      generator({
        promotions: {
          _id: 'promotion',
          promotionLotGroups: [
            {
              id: 'group1',
              label: 'Group 1',
            },
            {
              id: 'group2',
              label: 'Group 2',
            },
            {
              id: 'group3',
              label: 'Group 3',
            },
          ],
        },
      });

      PromotionService.removePromotionLotGroup({
        promotionId: 'promotion',
        promotionLotGroupId: 'group2',
      });

      const { promotionLotGroups = [] } = PromotionService.get('promotion', {
        promotionLotGroups: 1,
      });

      expect(promotionLotGroups.length).to.equal(2);
      const [group1, group3] = promotionLotGroups;
      expect(group1).to.deep.equal({ id: 'group1', label: 'Group 1' });
      expect(group3).to.deep.equal({ id: 'group3', label: 'Group 3' });
    });

    it('throws if promotionLotGroup does not exist when removing', () => {
      generator({
        promotions: {
          _id: 'promotion',
        },
      });

      expect(() =>
        PromotionService.removePromotionLotGroup({
          promotionId: 'promotion',
          promotionLotGroupId: 'group1',
        }),
      ).to.throw('PromotionLotGroup id "group1" not found');
    });

    it('updates a promotionLotGroup', () => {
      generator({
        promotions: {
          _id: 'promotion',
          promotionLotGroups: [
            {
              id: 'group1',
              label: 'Group 1',
            },
          ],
        },
      });

      PromotionService.updatePromotionLotGroup({
        promotionId: 'promotion',
        promotionLotGroupId: 'group1',
        object: { label: 'New group 1' },
      });

      const { promotionLotGroups = [] } = PromotionService.get('promotion', {
        promotionLotGroups: 1,
      });

      expect(promotionLotGroups.length).to.equal(1);
      const [group] = promotionLotGroups;
      expect(group).to.deep.equal({ id: 'group1', label: 'New group 1' });
    });

    it('updates only one promotionLotGroup', () => {
      generator({
        promotions: {
          _id: 'promotion',
          promotionLotGroups: [
            {
              id: 'group1',
              label: 'Group 1',
            },
            {
              id: 'group2',
              label: 'Group 2',
            },
            {
              id: 'group3',
              label: 'Group 3',
            },
          ],
        },
      });

      PromotionService.updatePromotionLotGroup({
        promotionId: 'promotion',
        promotionLotGroupId: 'group2',
        object: { label: 'New group 2' },
      });

      const { promotionLotGroups = [] } = PromotionService.get('promotion', {
        promotionLotGroups: 1,
      });

      expect(promotionLotGroups.length).to.equal(3);
      const [group1, group2, group3] = promotionLotGroups;
      expect(group1).to.deep.equal({ id: 'group1', label: 'Group 1' });
      expect(group2).to.deep.equal({ id: 'group2', label: 'New group 2' });
      expect(group3).to.deep.equal({ id: 'group3', label: 'Group 3' });
    });

    it('throws if promotionLotGroup does not exist when updating', () => {
      generator({
        promotions: {
          _id: 'promotion',
        },
      });

      expect(() =>
        PromotionService.updatePromotionLotGroup({
          promotionId: 'promotion',
          promotionLotGroupId: 'group1',
          object: { label: 'Group 1' },
        }),
      ).to.throw('PromotionLotGroup id "group1" not found');
    });

    it('removes the promotionLots from the group when removing it', () => {
      generator({
        promotions: {
          _id: 'promotion',
          promotionLotGroups: [
            {
              id: 'group1',
              label: 'Group 1',
            },
            {
              id: 'group2',
              label: 'Group 2',
            },
          ],
          promotionLots: {
            _id: 'promotionLot',
            promotionLotGroupIds: ['group1', 'group2'],
          },
        },
      });

      PromotionService.removePromotionLotGroup({
        promotionId: 'promotion',
        promotionLotGroupId: 'group2',
      });

      const { promotionLotGroupIds } = PromotionLotService.get('promotionLot', {
        promotionLotGroupIds: 1,
      });

      expect(promotionLotGroupIds).to.deep.equal(['group1']);
    });
  });
});
