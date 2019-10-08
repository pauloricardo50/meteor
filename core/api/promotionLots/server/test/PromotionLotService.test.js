// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import FileService from 'core/api/files/server/FileService';
import S3Service from 'core/api/files/server/S3Service';
import generator from '../../../factories';
import { ddpWithUserId } from '../../../methods/server/methodHelpers';
import { bookPromotionLot } from '../../../methods/index';
import { checkEmails } from '../../../../utils/testHelpers';
import { PROMOTION_LOT_STATUS } from '../../promotionLotConstants';

describe('PromotionLotService', function () {
  this.timeout(10000);

  beforeEach(() => {
    resetDatabase();
  });

  describe('bookPromotionLot', () => {
    it('sends emails to those who need it', () => {
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

      const reservationAgreementFile = Buffer.from('hello', 'utf-8');
      const reservationAgreementFileKey = FileService.getTempS3FileKey(
        'adminId1',
        { name: 'Convention de réservation.pdf' },
        { id: 'agreement' },
      );
      S3Service.putObject(
        reservationAgreementFile,
        reservationAgreementFileKey,
      );

      return ddpWithUserId('adminId1', () =>
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
          expect(global_merge_vars.find(({ name }) => name === 'BODY').content).to.include('Le lot "Lot 1" a été réservé pour John Doe, par Admin User 1.');
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
            expect(global_merge_vars.find(({ name }) => name === 'BODY').content).to.include('Le lot "Lot 1" a été réservé pour une personne anonymisée, par Admin User 1.');
          }
        });
    });
  });
});
