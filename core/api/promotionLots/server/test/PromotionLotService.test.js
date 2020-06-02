/* eslint-env mocha */
import { expect } from 'chai';

import { checkEmails, resetDatabase } from '../../../../utils/testHelpers';
import { EMAIL_IDS } from '../../../email/emailConstants';
import generator from '../../../factories/server';
import { ddpWithUserId } from '../../../methods/methodHelpers';
import {
  PROMOTION_OPTION_AGREEMENT_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
  PROMOTION_OPTION_DEPOSIT_STATUS,
  PROMOTION_OPTION_FULL_VERIFICATION_STATUS,
  PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS,
  PROMOTION_OPTION_STATUS,
} from '../../../promotionOptions/promotionOptionConstants';
import PromotionOptionService from '../../../promotionOptions/server/PromotionOptionService';
import { PROMOTION_PERMISSIONS_FULL_ACCESS } from '../../../promotions/promotionConstants';
import PromotionService from '../../../promotions/server/PromotionService';
import {
  cancelPromotionLotReservation,
  reservePromotionLot,
} from '../../methodDefinitions';
import { PROMOTION_LOT_STATUS } from '../../promotionLotConstants';
import PromotionLotService from '../PromotionLotService';

describe('PromotionLotService', function() {
  this.timeout(20000);

  beforeEach(() => {
    resetDatabase();
    generator({
      users: [
        {
          _id: 'adminId1',
          _factory: 'admin',
          firstName: 'Admin',
          lastName: 'User 1',
          emails: [{ address: 'test1@e-potek.ch', verified: true }],
        },
        {
          _id: 'adminId2',
          _factory: 'admin',
          firstName: 'Admin',
          lastName: 'User 2',
          emails: [{ address: 'test2@e-potek.ch', verified: true }],
        },
      ],
      properties: { _id: 'propId', name: 'Lot 1' },
      promotions: {
        _id: 'promoId',
        name: 'Test promotion',
        users: [
          {
            _id: 'pro1',
            $metadata: {
              enableNotifications: true,
              permissions: {
                displayCustomerNames: {
                  invitedBy: 'USER',
                  forLotStatus: Object.values(PROMOTION_LOT_STATUS),
                },
                roles: ['BROKER'],
              },
            },
            organisations: { _id: 'org1', name: 'Org 1' },
            emails: [{ address: 'pro1@e-potek.ch', verified: true }],
            firstName: 'Pro',
            lastName: 'User 1',
          },
          {
            _id: 'pro2',
            $metadata: {
              enableNotifications: true,
              permissions: { displayCustomerNames: { invitedBy: 'USER' } },
              roles: ['BROKER'],
            },
            organisations: { _id: 'org2', name: 'Org 2' },
            emails: [{ address: 'pro2@e-potek.ch', verified: true }],
            firstName: 'Pro',
            lastName: 'User 2',
          },
          {
            _id: 'pro3',
            $metadata: { enableNotifications: false, roles: ['BROKER'] },
            organisations: { _id: 'org1', name: 'Org 1' },
            firstName: 'Pro',
            lastName: 'User 3',
          },
          {
            _id: 'pro4',
            $metadata: {
              enableNotifications: true,
              permissions: PROMOTION_PERMISSIONS_FULL_ACCESS(),
              roles: ['PROMOTER'],
            },
            organisations: { _id: 'org3', name: 'Org 3' },
            emails: [{ address: 'pro4@e-potek.ch', verified: true }],
            firstName: 'Pro',
            lastName: 'User 1',
          },
        ],
        loans: {
          _id: 'loanId',
          user: {
            firstName: 'John',
            lastName: 'Doe',
            emails: [{ address: 'user@e-potek.ch', verified: true }],
          },
          $metadata: { invitedBy: 'pro1' },
        },
        promotionLots: {
          _id: 'promotionLotId',
          propertyLinks: [{ _id: 'propId' }],
          promotionOptions: [
            {
              _id: 'pOptId',
              loan: {
                _id: 'loanId',
              },
              promotion: { _id: 'promoId' },
              reservationAgreement: {
                status: PROMOTION_OPTION_AGREEMENT_STATUS.RECEIVED,
              },
              reservationDeposit: {
                status: PROMOTION_OPTION_DEPOSIT_STATUS.PAID,
              },
              bank: { status: PROMOTION_OPTION_BANK_STATUS.VALIDATED },
              simpleVerification: {
                status: PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED,
              },
              fullVerification: {
                status: PROMOTION_OPTION_FULL_VERIFICATION_STATUS.VALIDATED,
              },
            },
            {
              _id: 'pOptId2',
              loan: { _id: 'loanId' },
              promotion: { _id: 'promoId' },
              reservationAgreement: {
                status: PROMOTION_OPTION_AGREEMENT_STATUS.RECEIVED,
              },
              reservationDeposit: {
                status: PROMOTION_OPTION_DEPOSIT_STATUS.PAID,
              },
              bank: { status: PROMOTION_OPTION_BANK_STATUS.VALIDATED },
              simpleVerification: {
                status: PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED,
              },
              fullVerification: {
                status: PROMOTION_OPTION_FULL_VERIFICATION_STATUS.VALIDATED,
              },
            },
          ],
        },
        assignedEmployee: { _id: 'adminId2' },
      },
    });
  });

  describe('reservePromotionLot', () => {
    it('sends emails to those who need it', async () => {
      PromotionService.setUserPermissions({
        promotionId: 'promoId',
        userId: 'pro1',
        permissions: {
          displayCustomerNames: {
            invitedBy: 'USER',
            forLotStatus: Object.values(PROMOTION_LOT_STATUS),
          },
          canReserveLots: true,
        },
      });

      await ddpWithUserId('pro1', () =>
        reservePromotionLot.run({ promotionOptionId: 'pOptId' }),
      );
      const emails = await checkEmails(4);

      const [
        email1,
        email2,
        email3,
        email4,
      ] = emails.sort(({ address: a }, { address: b }) => a.localeCompare(b));
      const {
        address,
        response: { status },
        template: {
          template_name,
          message: { from_email, subject, global_merge_vars, from_name },
        },
      } = email1;
      expect(status).to.equal('sent');
      expect(address).to.equal('pro1@e-potek.ch');
      expect(from_email).to.equal('test2@e-potek.ch');
      expect(from_name).to.equal('e-Potek');
      expect(subject).to.equal('Test promotion, Réservation du lot Lot 1');
      expect(
        global_merge_vars.find(({ name }) => name === 'TITLE').content,
      ).to.equal('Test promotion, Réservation du lot Lot 1');
      expect(
        global_merge_vars.find(({ name }) => name === 'BODY').content,
      ).to.equal(
        'Le lot Lot 1 au sein de la promotion Test promotion a été attribué à un client de Pro User 1 (Org 1).',
      );
      {
        const {
          address,
          response: { status },
          template: {
            message: { from_email, subject, global_merge_vars, from_name },
          },
        } = email2;
        expect(status).to.equal('sent');
        expect(address).to.equal('pro2@e-potek.ch');
        expect(from_email).to.equal('test2@e-potek.ch');
        expect(from_name).to.equal('e-Potek');
        expect(subject).to.equal('Test promotion, Réservation du lot Lot 1');
        expect(
          global_merge_vars.find(({ name }) => name === 'BODY').content,
        ).to.equal(
          'Le lot Lot 1 au sein de la promotion Test promotion a été attribué à un client de Pro User 1 (Org 1).',
        );
      }
      {
        const {
          address,
          response: { status },
          template: {
            message: { from_email, subject, global_merge_vars, from_name },
          },
        } = email3;
        expect(status).to.equal('sent');
        expect(address).to.equal('pro4@e-potek.ch');
        expect(from_email).to.equal('test2@e-potek.ch');
        expect(from_name).to.equal('e-Potek');
        expect(subject).to.equal('Test promotion, Réservation du lot Lot 1');
        expect(
          global_merge_vars.find(({ name }) => name === 'BODY').content,
        ).to.include(
          'Le lot Lot 1 au sein de la promotion Test promotion a été attribué à un client de Pro User 1 (Org 1).',
        );
      }
      {
        const {
          address,
          response: { status },
          template: {
            message: { from_email, subject, global_merge_vars, from_name },
          },
        } = email4;
        expect(status).to.equal('sent');
        expect(address).to.equal('user@e-potek.ch');
        expect(from_email).to.equal('test2@e-potek.ch');
        expect(from_name).to.equal('e-Potek');
        expect(subject).to.equal('Test promotion, Réservation du lot Lot 1');
        expect(
          global_merge_vars.find(({ name }) => name === 'BODY').content,
        ).to.include(
          'Admin User 2 va se mettre en relation avec Pro User 1 (Org 1)',
        );
      }
    });

    it('does not let a lot be reserved by a pro who did not invite the customer', async () => {
      PromotionService.setUserPermissions({
        promotionId: 'promoId',
        userId: 'pro2',
        permissions: {
          displayCustomerNames: {
            invitedBy: 'USER',
            forLotStatus: Object.values(PROMOTION_LOT_STATUS),
          },
          canReserveLots: true,
        },
      });

      return ddpWithUserId('pro2', () =>
        reservePromotionLot.run({ promotionOptionId: 'pOptId' }),
      )
        .then(() => expect(1).to.equal(2, 'Should throw'))
        .catch(error =>
          expect(error.message).to.include(
            'Vous ne pouvez pas gérer la réservation',
          ),
        );
    });

    it('does not let a lot be reserved by a pro who cannot reserve lots', async () =>
      ddpWithUserId('pro1', () =>
        reservePromotionLot.run({ promotionOptionId: 'pOptId' }),
      )
        .then(() => expect(1).to.equal(2, 'Should throw'))
        .catch(error =>
          expect(error.message).to.include(
            'Vous ne pouvez pas réserver des lots',
          ),
        ));

    it('can reserve, cancel, and then reactivate an existing promotionReservation', async () => {
      await PromotionLotService.reservePromotionLot({
        promotionOptionId: 'pOptId',
      });

      PromotionLotService.sellPromotionLot({
        promotionOptionId: 'pOptId',
      });

      let pO = PromotionOptionService.get('pOptId', { status: 1 });
      let pL = PromotionLotService.get('promotionLotId', { status: 1 });
      expect(pO.status).to.equal(PROMOTION_OPTION_STATUS.SOLD);
      expect(pL.status).to.equal(PROMOTION_LOT_STATUS.SOLD);

      PromotionLotService.cancelPromotionLotReservation({
        promotionOptionId: 'pOptId',
      });

      pO = PromotionOptionService.get('pOptId', { status: 1 });
      pL = PromotionLotService.get('promotionLotId', { status: 1 });
      expect(pO.status).to.equal(PROMOTION_OPTION_STATUS.RESERVATION_CANCELLED);
      expect(pL.status).to.equal(PROMOTION_LOT_STATUS.AVAILABLE);

      await PromotionLotService.reservePromotionLot({
        promotionOptionId: 'pOptId',
      });

      pO = PromotionOptionService.get('pOptId', { status: 1 });
      pL = PromotionLotService.get('promotionLotId', { status: 1 });
      expect(pO.status).to.equal(PROMOTION_OPTION_STATUS.RESERVED);
      expect(pL.status).to.equal(PROMOTION_LOT_STATUS.RESERVED);
    });
  });

  describe('cancelPromotionLotReservation', () => {
    it('makes the lot available again', () => {
      PromotionLotService.reservePromotionLot({
        promotionOptionId: 'pOptId',
      });

      PromotionLotService.cancelPromotionLotReservation({
        promotionOptionId: 'pOptId',
      });

      const pL = PromotionLotService.get('promotionLotId', { status: 1 });
      expect(pL.status).to.equal(PROMOTION_LOT_STATUS.AVAILABLE);
    });

    it('does not make the lot available again if another reservation is RESERVED', () => {
      PromotionLotService.reservePromotionLot({
        promotionOptionId: 'pOptId',
      });

      PromotionOptionService.activateReservation({
        promotionOptionId: 'pOptId2',
      });
      PromotionLotService.cancelPromotionLotReservation({
        promotionOptionId: 'pOptId2',
      });

      const pL = PromotionLotService.get('promotionLotId', { status: 1 });
      expect(pL.status).to.equal(PROMOTION_LOT_STATUS.RESERVED);
    });

    it('sends the right emails when reservation is RESERVED', async () => {
      PromotionLotService.reservePromotionLot({
        promotionOptionId: 'pOptId',
      });

      await ddpWithUserId('adminId1', () =>
        cancelPromotionLotReservation.run({ promotionOptionId: 'pOptId' }),
      );
      const emails = await checkEmails(3);
      emails.forEach(({ emailId }) => {
        expect(emailId).to.equal(EMAIL_IDS.CANCEL_PROMOTION_LOT_RESERVATION);
      });
      const [
        email1,
        email2,
        email3,
      ] = emails.sort(({ address: address1 }, { address: address2 }) =>
        address1.localeCompare(address2),
      );

      expect(email1.address).to.equal('pro1@e-potek.ch');
      expect(
        email1.template.message.global_merge_vars.find(
          ({ name }) => name === 'BODY',
        ).content,
      ).to.include(
        'Admin User 1 a annulé la réservation pour John Doe sur le lot Lot 1',
      );

      expect(email2.address).to.equal('pro2@e-potek.ch');
      expect(
        email2.template.message.global_merge_vars.find(
          ({ name }) => name === 'BODY',
        ).content,
      ).to.include(
        'Admin User 1 a annulé la réservation pour un acquéreur sur le lot Lot 1',
      );

      expect(email3.address).to.equal('pro4@e-potek.ch');
      expect(
        email3.template.message.global_merge_vars.find(
          ({ name }) => name === 'BODY',
        ).content,
      ).to.include(
        'Admin User 1 a annulé la réservation pour John Doe sur le lot Lot 1',
      );
    });

    it('sends the right emails when reservation is RESERVATION_ACTIVE', async () => {
      PromotionOptionService.activateReservation({
        promotionOptionId: 'pOptId',
      });

      await ddpWithUserId('adminId1', () =>
        cancelPromotionLotReservation.run({ promotionOptionId: 'pOptId' }),
      );
      const emails = await checkEmails(3);
      emails.forEach(({ emailId }) => {
        expect(emailId).to.equal(
          EMAIL_IDS.CANCEL_PROMOTION_LOT_RESERVATION_PROCESS,
        );
      });
      const [
        email1,
        email2,
        email3,
      ] = emails.sort(({ address: address1 }, { address: address2 }) =>
        address1.localeCompare(address2),
      );

      expect(email1.address).to.equal('pro1@e-potek.ch');
      expect(
        email1.template.message.global_merge_vars.find(
          ({ name }) => name === 'BODY',
        ).content,
      ).to.include(
        'Admin User 1 a interompu la réservation en cours pour John Doe sur le lot Lot 1',
      );

      expect(email2.address).to.equal('pro2@e-potek.ch');
      expect(
        email2.template.message.global_merge_vars.find(
          ({ name }) => name === 'BODY',
        ).content,
      ).to.include(
        'Admin User 1 a interompu la réservation en cours pour un acquéreur sur le lot Lot 1',
      );

      expect(email3.address).to.equal('pro4@e-potek.ch');
      expect(
        email3.template.message.global_merge_vars.find(
          ({ name }) => name === 'BODY',
        ).content,
      ).to.include(
        'Admin User 1 a interompu la réservation en cours pour John Doe sur le lot Lot 1',
      );
    });
  });

  describe('promotionLotGroupIds', () => {
    it('adds a promotionLotGroup to the promotionLot', () => {
      generator({
        promotions: {
          _id: 'promotion',
          promotionLotGroups: [{ id: 'group1', label: 'Group 1' }],
          promotionLots: { _id: 'promotionLot' },
        },
      });

      PromotionLotService.addToPromotionLotGroup({
        promotionLotId: 'promotionLot',
        promotionLotGroupId: 'group1',
      });

      const {
        promotionLotGroupIds = [],
      } = PromotionLotService.get('promotionLot', { promotionLotGroupIds: 1 });

      expect(promotionLotGroupIds.length).to.equal(1);
      const [groupId] = promotionLotGroupIds;
      expect(groupId).to.equal('group1');
    });

    it('appends a promotionLotGroup to the promotionLot', () => {
      generator({
        promotions: {
          _id: 'promotion',
          promotionLotGroups: [
            { id: 'group1', label: 'Group 1' },
            { id: 'group2', label: 'Group 2' },
          ],
          promotionLots: {
            _id: 'promotionLot',
            promotionLotGroupIds: ['group1'],
          },
        },
      });

      PromotionLotService.addToPromotionLotGroup({
        promotionLotId: 'promotionLot',
        promotionLotGroupId: 'group2',
      });

      const {
        promotionLotGroupIds = [],
      } = PromotionLotService.get('promotionLot', { promotionLotGroupIds: 1 });

      expect(promotionLotGroupIds.length).to.equal(2);
      const [groupId1, groupId2] = promotionLotGroupIds;
      expect(groupId1).to.equal('group1');
      expect(groupId2).to.equal('group2');
    });

    it('throws if promotionLotGroupId does not exist in promotion', () => {
      generator({
        promotions: {
          _id: 'promotion',
          promotionLotGroups: [{ id: 'group1', label: 'Group 1' }],
          promotionLots: { _id: 'promotionLot' },
        },
      });

      expect(() =>
        PromotionLotService.addToPromotionLotGroup({
          promotionLotId: 'promotionLot',
          promotionLotGroupId: 'group2',
        }),
      ).to.throw('Group "group2" does not exist');
    });

    it('throws if promotionLotGroupId is already in promotionLotGroupIds', () => {
      generator({
        promotions: {
          _id: 'promotion',
          promotionLotGroups: [{ id: 'group1', label: 'Group 1' }],
          promotionLots: {
            _id: 'promotionLot',
            promotionLotGroupIds: ['group1'],
          },
        },
      });

      expect(() =>
        PromotionLotService.addToPromotionLotGroup({
          promotionLotId: 'promotionLot',
          promotionLotGroupId: 'group1',
        }),
      ).to.throw('Promotion lot is already part of "group1"');
    });

    it('removes a promotionLotGroupId from the promotionLot', () => {
      generator({
        promotions: {
          _id: 'promotion',
          promotionLotGroups: [{ id: 'group1', label: 'Group 1' }],
          promotionLots: {
            _id: 'promotionLot',
            promotionLotGroupIds: ['group1'],
          },
        },
      });

      PromotionLotService.removeFromPromotionLotGroup({
        promotionLotId: 'promotionLot',
        promotionLotGroupId: 'group1',
      });

      const {
        promotionLotGroupIds = [],
      } = PromotionLotService.get('promotionLot', { promotionLotGroupIds: 1 });

      expect(promotionLotGroupIds.length).to.equal(0);
    });

    it('removes only one promotionLotGroup from the promotionLot', () => {
      generator({
        promotions: {
          _id: 'promotion',
          promotionLotGroups: [
            { id: 'group1', label: 'Group 1' },
            { id: 'group2', label: 'Group 2' },
            { id: 'group3', label: 'Group 3' },
          ],
          promotionLots: {
            _id: 'promotionLot',
            promotionLotGroupIds: ['group1', 'group2', 'group3'],
          },
        },
      });

      PromotionLotService.removeFromPromotionLotGroup({
        promotionLotId: 'promotionLot',
        promotionLotGroupId: 'group2',
      });

      const {
        promotionLotGroupIds = [],
      } = PromotionLotService.get('promotionLot', { promotionLotGroupIds: 1 });

      expect(promotionLotGroupIds.length).to.equal(2);
      const [groupId1, groupId3] = promotionLotGroupIds;
      expect(groupId1).to.equal('group1');
      expect(groupId3).to.equal('group3');
    });

    it('throws if promotionLotGroupId does not exist in promotionLot promotionLotGroupIds', () => {
      generator({
        promotions: {
          _id: 'promotion',
          promotionLots: {
            _id: 'promotionLot',
          },
        },
      });

      expect(() =>
        PromotionLotService.removeFromPromotionLotGroup({
          promotionLotId: 'promotionLot',
          promotionLotGroupId: 'group1',
        }),
      ).to.throw('Group "group1" not found in PromotionLotGroupIds');
    });
  });
});
