// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import FileService from 'core/api/files/server/FileService';
import S3Service from 'core/api/files/server/S3Service';
import PromotionService from 'core/api/promotions/server/PromotionService';
import PromotionReservationService from 'core/api/promotionReservations/server/PromotionReservationService';
import { PROMOTION_RESERVATION_STATUS } from 'core/api/promotionReservations/promotionReservationConstants';
import generator from '../../../factories';
import { ddpWithUserId } from '../../../methods/server/methodHelpers';
import { bookPromotionLot } from '../../../methods/index';
import { checkEmails } from '../../../../utils/testHelpers';
import { PROMOTION_LOT_STATUS } from '../../promotionLotConstants';
import PromotionLotService from '../PromotionLotService';

const uploadTempPromotionAgreement = async (userId) => {
  const reservationAgreementFile = Buffer.from('hello', 'utf-8');
  const reservationAgreementFileKey = FileService.getTempS3FileKey(
    userId,
    { name: 'Convention de réservation.pdf' },
    { id: 'agreement' },
  );

  await S3Service.putObject(
    reservationAgreementFile,
    reservationAgreementFileKey,
  );

  return reservationAgreementFileKey;
};

describe('PromotionLotService', function () {
  this.timeout(10000);

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
              },
            },
            organisations: { _id: 'org1', name: 'Org 1' },
            emails: [{ address: 'pro1@e-potek.ch', verified: true }],
          },
          {
            _id: 'pro2',
            $metadata: {
              enableNotifications: true,
              permissions: { displayCustomerNames: { invitedBy: 'USER' } },
            },
            organisations: { _id: 'org2', name: 'Org 2' },
            emails: [{ address: 'pro2@e-potek.ch', verified: true }],
          },
          {
            _id: 'pro3',
            $metadata: { enableNotifications: false },
            organisations: { _id: 'org1', name: 'Org 1' },
          },
        ],
        loans: {
          _id: 'loanId',
          user: { firstName: 'John', lastName: 'Doe' },
          $metadata: { invitedBy: 'pro1' },
        },
        promotionLots: {
          _id: 'promotionLotId',
          propertyLinks: [{ _id: 'propId' }],
          promotionOptions: {
            _id: 'pOptId',
            loan: { _id: 'loanId' },
          },
        },
        assignedEmployee: { _id: 'adminId2' },
      },
    });
  });

  describe('bookPromotionLot', () => {
    it('sends emails to those who need it', async () => {
      const reservationAgreementFileKey = await uploadTempPromotionAgreement('pro1');
      PromotionService.setUserPermissions({
        promotionId: 'promoId',
        userId: 'pro1',
        permissions: {
          displayCustomerNames: {
            invitedBy: 'USER',
            forLotStatus: Object.values(PROMOTION_LOT_STATUS),
          },
          canBookLots: true,
        },
      });

      return ddpWithUserId('pro1', () =>
        bookPromotionLot.run({
          promotionOptionId: 'pOptId',
          promotionReservation: {
            startDate: new Date(),
            agreementFileKeys: [reservationAgreementFileKey],
          },
        }))
        .then(() => checkEmails(2))
        .then((emails) => {
          const [email1, email2] = emails.sort(({ address: a }, { address: b }) => a.localeCompare(b));
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
          expect(subject).to.equal('Promotion "Test promotion", lot réservé');
          expect(global_merge_vars.find(({ name }) => name === 'BODY').content).to.include('Le lot "Lot 1" a été réservé pour John Doe, par TestFirstName TestLastName.');
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
            expect(subject).to.equal('Promotion "Test promotion", lot réservé');
            expect(global_merge_vars.find(({ name }) => name === 'BODY').content).to.include('Le lot "Lot 1" a été réservé pour une personne anonymisée, par TestFirstName TestLastName.');
          }
        });
    });

    it('does not let a lot be booked by a pro who did not invite the customer', async () => {
      const reservationAgreementFileKey = await uploadTempPromotionAgreement('pro2');

      return ddpWithUserId('pro2', () =>
        bookPromotionLot.run({
          promotionOptionId: 'pOptId',
          promotionReservation: {
            startDate: new Date(),
            agreementFileKeys: [reservationAgreementFileKey],
          },
        }))
        .then(() => expect(1).to.equal(2, 'Should throw'))
        .catch(error =>
          expect(error.message).to.include('Vous ne pouvez pas réserver de lot à ce client'));
    });

    it('does not let a lot be booked by a pro who cannot book lots', async () => {
      const reservationAgreementFileKey = await uploadTempPromotionAgreement('pro1');

      return ddpWithUserId('pro1', () =>
        bookPromotionLot.run({
          promotionOptionId: 'pOptId',
          promotionReservation: {
            startDate: new Date(),
            agreementFileKeys: [reservationAgreementFileKey],
          },
        }))
        .then(() => expect(1).to.equal(2, 'Should throw'))
        .catch(error =>
          expect(error.message).to.include('Vous ne pouvez pas réserver de lot à ce client'));
    });

    it.only('can book, cancel, and then reactivate an existing promotionReservation', async () => {
      const reservationAgreementFileKey = await uploadTempPromotionAgreement('pro1');

      const pRId = await PromotionLotService.bookPromotionLot({
        promotionOptionId: 'pOptId',
        promotionReservation: {
          startDate: new Date(),
          agreementFileKeys: [reservationAgreementFileKey],
        },
      });

      await checkEmails(2);

      PromotionLotService.sellPromotionLot({
        promotionOptionId: 'pOptId',
      });

      await checkEmails(2);

      let pR = PromotionReservationService.get(pRId);
      let pL = PromotionLotService.get('promotionLotId');
      expect(pR.status).to.equal(PROMOTION_RESERVATION_STATUS.COMPLETED);
      expect(pL.status).to.equal(PROMOTION_LOT_STATUS.SOLD);

      PromotionLotService.cancelPromotionLotBooking({
        promotionOptionId: 'pOptId',
      });

      await checkEmails(2);

      pR = PromotionReservationService.get(pRId);
      pL = PromotionLotService.get('promotionLotId');
      expect(pR.status).to.equal(PROMOTION_RESERVATION_STATUS.CANCELED);
      expect(pL.status).to.equal(PROMOTION_LOT_STATUS.AVAILABLE);

      const pRId2 = await PromotionLotService.bookPromotionLot({
        promotionOptionId: 'pOptId',
      });

      await checkEmails(2);

      expect(pRId2).to.equal(pRId);

      pR = PromotionReservationService.findOne(pRId);
      pL = PromotionLotService.get('promotionLotId');
      expect(pR.status).to.equal(PROMOTION_RESERVATION_STATUS.ACTIVE);
      expect(pL.status).to.equal(PROMOTION_LOT_STATUS.BOOKED);
    });
  });
});
