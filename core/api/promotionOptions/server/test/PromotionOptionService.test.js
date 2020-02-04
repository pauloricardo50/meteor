//      
/* eslint-env mocha */
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import moment from 'moment';
import sinon from 'sinon';

import { ddpWithUserId } from 'core/api/methods/methodHelpers';
import { EMAIL_IDS } from 'core/api/email/emailConstants';
import { checkEmails } from '../../../../utils/testHelpers/index';
import { PROMOTION_LOT_STATUS } from '../../../promotionLots/promotionLotConstants';
import PromotionService from '../../../promotions/server/PromotionService';
import generator from '../../../factories';
import LoanService from '../../../loans/server/LoanService';
import PromotionOptionService from '../PromotionOptionService';
import {
  PROMOTION_OPTION_STATUS,
  PROMOTION_OPTION_DOCUMENTS,
  PROMOTION_OPTION_AGREEMENT_STATUS,
  PROMOTION_OPTION_DEPOSIT_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
  PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS,
} from '../../promotionOptionConstants';
import FileService from '../../../files/server/FileService';
import S3Service from '../../../files/server/S3Service';
import TaskService from '../../../tasks/server/TaskService';
import {
  PROMOTION_USERS_ROLES,
  PROMOTION_PERMISSIONS_FULL_ACCESS,
  PROMOTION_INVITED_BY_TYPE,
  PROMOTION_PERMISSIONS,
  PROMOTION_EMAIL_RECIPIENTS,
} from '../../../promotions/promotionConstants';

import { generateExpiringSoonReservationTasks } from '../methods';
import {
  setPromotionOptionProgress,
  promotionOptionActivateReservation,
} from '../../methodDefinitions';

const makePromotionLotWithReservation = ({
  key,
  status,
  promotionOptionStatus,
  expirationDate,
}) => ({
  _id: `pL${key}`,
  status,
  propertyLinks: [{ _id: `prop${key}` }],
  attributedTo: { _id: `loan${key}` },
  promotionOptions: [
    {
      _id: `pO${key}`,
      loan: { _id: `loan${key}` },
      status: promotionOptionStatus,
      promotionLots: [{ _id: `pL${key}` }],
      promotion: { _id: 'promo' },
      reservationAgreement: { expirationDate },
    },
  ],
});

describe('PromotionOptionService', function() {
  this.timeout(10000);

  before(function() {
    // This test causes conflicts between microservices when ran in parallel
    // since it will remove all files
    if (Meteor.settings.public.microservice !== 'pro') {
      this.parent.pending = true;
      this.skip();
    }
  });

  beforeEach(() => {
    resetDatabase();
  });

  describe('remove', () => {
    let promotionOptionId;
    let promotionOptionId2;
    let loanId;
    let promotionId;
    let promotionLotId;
    let promotionLotId2;

    beforeEach(() => {
      promotionId = 'promoId';
      promotionLotId = 'pLotId';
      promotionLotId2 = 'pLotId2';
      promotionOptionId = 'pOptId';
      promotionOptionId2 = 'pOptId2';
      loanId = 'loanId';
      generator({
        properties: [{ _id: 'propId' }, { _id: 'propId2' }],
        promotions: {
          _id: promotionId,
          promotionLots: [
            {
              _id: promotionLotId,
              propertyLinks: [{ _id: 'propId' }],
              promotionOptions: {
                _id: promotionOptionId,
                loan: { _id: loanId },
                promotion: { _id: promotionId },
              },
            },
            {
              _id: promotionLotId2,
              propertyLinks: [{ _id: 'propId2' }],
              promotionOptions: {
                _id: promotionOptionId2,
                loan: { _id: loanId },
                promotion: { _id: promotionId },
              },
            },
          ],
          loans: { _id: loanId },
        },
      });
    });

    it('Removes the promotionOption', () => {
      expect(
        PromotionOptionService.get(promotionOptionId, { _id: 1 }),
      ).to.not.equal(undefined);
      PromotionOptionService.remove({ promotionOptionId });
      expect(
        PromotionOptionService.get(promotionOptionId, { _id: 1 }),
      ).to.equal(undefined);
    });

    it('Removes the link from the loan', () => {
      PromotionOptionService.remove({ promotionOptionId });
      const loan = LoanService.get(loanId, { promotionOptionLinks: 1 });
      expect(loan.promotionOptionLinks).to.deep.equal([
        { _id: promotionOptionId2 },
      ]);
    });

    it('Removes the priority order from the loan', () => {
      PromotionOptionService.remove({ promotionOptionId });
      const loan = LoanService.get(loanId, { promotionLinks: 1 });
      expect(loan.promotionLinks).to.deep.equal([
        { _id: promotionId, priorityOrder: [], showAllLots: true },
      ]);
    });

    it('throws if there is an active/completed reservation', () => {
      PromotionOptionService.updateStatus({
        promotionOptionId,
        status: PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
      });
      expect(() =>
        PromotionOptionService.remove({ promotionOptionId }),
      ).to.throw('active');
    });

    it('does not throw if there is a cancelled reservation', () => {
      PromotionOptionService.updateStatus({
        promotionOptionId,
        status: PROMOTION_OPTION_STATUS.RESERVATION_CANCELLED,
      });

      expect(() =>
        PromotionOptionService.remove({ promotionOptionId }),
      ).to.not.throw('active');
    });
  });

  describe('insert', () => {
    let loanId;
    let promotionId;
    let promotionLotId;

    beforeEach(() => {
      promotionId = 'promoId';
      promotionLotId = 'pLotId';
      loanId = 'loanId';
      generator({
        properties: { _id: 'propId' },
        promotions: {
          _id: promotionId,
          promotionLots: {
            _id: promotionLotId,
            propertyLinks: [{ _id: 'propId' }],
          },
          loans: { _id: loanId, $metadata: { priorityOrder: [] } },
        },
      });
    });

    it('inserts a new promotionOption', () => {
      const id = PromotionOptionService.insert({
        promotionLotId,
        loanId,
        promotionId,
      });
      expect(PromotionOptionService.get(id, { _id: 1 })).to.not.equal(
        undefined,
      );
    });

    it('throws if promotion lot exists in another promotionOption in the loan', () => {
      const id = PromotionOptionService.insert({
        promotionLotId,
        loanId,
        promotionId,
      });
      expect(PromotionOptionService.get(id, { _id: 1 })).to.not.equal(
        undefined,
      );

      expect(() =>
        PromotionOptionService.insert({ promotionLotId, loanId, promotionId }),
      ).to.throw('Vous avez déjà');
    });

    it('adds a link on the loan', () => {
      PromotionOptionService.insert({ promotionLotId, loanId, promotionId });
      const loan = LoanService.get(loanId, { promotionOptionLinks: 1 });
      expect(loan.promotionOptionLinks.length).to.equal(1);
    });

    it('inserts the promotionOptionId in the priorityOrder', () => {
      const id = PromotionOptionService.insert({
        promotionLotId,
        loanId,
        promotionId,
      });
      const loan = LoanService.get(loanId, { promotionLinks: 1 });
      expect(loan.promotionLinks[0].priorityOrder[0]).to.equal(id);
    });

    it('inserts the promotionOptionId at the end of the priorityOrder', () => {
      LoanService.remove(loanId);
      loanId = Factory.create('loan', {
        promotionLinks: [{ _id: promotionId, priorityOrder: ['test'] }],
      })._id;
      let loan = LoanService.get(loanId, { promotionLinks: 1 });
      expect(loan.promotionLinks[0].priorityOrder.length).to.equal(1);

      const id = PromotionOptionService.insert({
        promotionLotId,
        loanId,
        promotionId,
      });
      loan = LoanService.get(loanId, { promotionLinks: 1 });

      expect(loan.promotionLinks[0].priorityOrder.length).to.equal(2);
      expect(loan.promotionLinks[0].priorityOrder[1]).to.equal(id);
    });
  });

  describe('increasePriorityOrder', () => {
    let promotionOptionId;
    let loanId;
    let promotionId;
    let promotionLotId;

    beforeEach(() => {
      promotionId = 'promoId';
      promotionLotId = 'pLotId';
      promotionOptionId = 'pOptId';
      loanId = 'loanId';

      generator({
        properties: { _id: 'propId' },
        promotions: {
          _id: promotionId,
          loans: {
            _id: loanId,
            $metadata: { priorityOrder: [promotionOptionId] },
          },
          promotionLots: {
            _id: promotionLotId,
            propertyLinks: [{ _id: 'propId' }],
            promotionOptions: {
              _id: promotionOptionId,
              loan: { _id: loanId },
              promotion: { _id: promotionId },
            },
          },
        },
      });
    });

    it('does nothing if priority is already max', () => {
      PromotionOptionService.increasePriorityOrder({ promotionOptionId });
      const loan = LoanService.get(loanId, { promotionLinks: 1 });
      expect(loan.promotionLinks[0].priorityOrder).to.deep.equal([
        promotionOptionId,
      ]);
    });

    it('moves the promotionOption up by one', () => {
      generator({
        promotionOptions: {
          _id: 'pOptId2',
          promotion: { _id: promotionId },
          promotionLots: { _id: promotionLotId },
          loan: {
            _id: 'loanId2',
            promotionLinks: [
              { _id: promotionId, priorityOrder: ['test', 'pOptId2'] },
            ],
          },
        },
      });
      PromotionOptionService.increasePriorityOrder({
        promotionOptionId: 'pOptId2',
      });
      const loan = LoanService.get('loanId2', { promotionLinks: 1 });
      expect(loan.promotionLinks[0].priorityOrder).to.deep.equal([
        'pOptId2',
        'test',
      ]);
    });
  });

  describe('reducePriorityOrder', () => {
    let promotionOptionId;
    let loanId;
    let promotionId;
    let promotionLotId;

    beforeEach(() => {
      promotionId = 'promoId';
      promotionLotId = 'pLotId';
      promotionOptionId = 'pOptId';
      loanId = 'loanId';

      generator({
        properties: { _id: 'propId' },
        promotions: {
          _id: promotionId,
          loans: {
            _id: loanId,
            $metadata: { priorityOrder: [promotionOptionId] },
          },
          promotionLots: {
            _id: promotionLotId,
            propertyLinks: [{ _id: 'propId' }],
            promotionOptions: {
              _id: promotionOptionId,
              loan: { _id: loanId },
              promotion: { _id: promotionId },
            },
          },
        },
      });
    });

    it('does nothing if priority is already max', () => {
      PromotionOptionService.reducePriorityOrder({ promotionOptionId });
      const loan = LoanService.get(loanId, { promotionLinks: 1 });
      expect(loan.promotionLinks[0].priorityOrder).to.deep.equal([
        promotionOptionId,
      ]);
    });

    it('moves the promotionOption down by one', () => {
      generator({
        promotionOptions: {
          _id: 'pOptId2',
          promotion: { _id: promotionId },
          promotionLots: { _id: promotionLotId },
          loan: {
            _id: 'loanId2',
            promotionLinks: [
              { _id: promotionId, priorityOrder: ['pOptId2', 'test'] },
            ],
          },
        },
      });
      PromotionOptionService.reducePriorityOrder({
        promotionOptionId: 'pOptId2',
      });
      const loan = LoanService.get('loanId2', { promotionLinks: 1 });
      expect(loan.promotionLinks[0].priorityOrder).to.deep.equal([
        'test',
        'pOptId2',
      ]);
    });
  });

  describe('getReservationExpirationDate', () => {
    it('throws if no agreement duration is set', () => {
      expect(() =>
        PromotionOptionService.getReservationExpirationDate({
          startDate: new Date(),
        }),
      ).to.throw('Aucun délai');
    });

    it('throws if start date is in the future', () => {
      const startDate = moment()
        .add(1, 'days')
        .toDate();

      expect(() =>
        PromotionOptionService.getReservationExpirationDate({
          startDate,
          agreementDuration: 14,
        }),
      ).to.throw('ne peut pas être dans le futur');
    });

    it('does not throw if start date is today', () => {
      const startDate = moment()
        .add(1, 'hour')
        .toDate();

      expect(() =>
        PromotionOptionService.getReservationExpirationDate({
          startDate,
          agreementDuration: 14,
        }),
      ).to.not.throw();
    });

    it('throws if start date is anterior to agreement duration', () => {
      const agreementDuration = 11;
      const startDate = moment()
        .subtract(13, 'days')
        .toDate();

      expect(() =>
        PromotionOptionService.getReservationExpirationDate({
          startDate,
          agreementDuration,
        }),
      ).to.throw('ne peut pas être avant');
    });

    it('returns expiration date', () => {
      const agreementDuration = 11;
      const startDate = moment()
        .subtract(6, 'days')
        .toDate();

      expect(
        moment(
          PromotionOptionService.getReservationExpirationDate({
            startDate,
            agreementDuration,
          }),
        ).format('DD-MM-YYYY'),
      ).to.equal(
        moment(startDate)
          .add(agreementDuration, 'days')
          .endOf('day')
          .format('DD-MM-YYYY'),
      );
    });
  });

  describe('mergeReservationAgreementFiles', () => {
    it('merges temp agreement files to promotion option', async () => {
      generator({
        users: { _id: 'adminId', _factory: 'admin' },
        promotionOptions: {
          _id: 'promotionOption',
          _factory: 'promotionOption',
        },
      });

      const files = [
        {
          file: Buffer.from('hello1', 'utf-8'),
          key: FileService.getTempS3FileKey(
            'adminId',
            { name: 'agreement1.pdf' },
            { id: 'agreement1' },
          ),
        },
      ];

      await Promise.all(
        files.map(({ file, key }) => S3Service.putObject(file, key)),
      );

      await PromotionOptionService.mergeReservationAgreementFiles({
        promotionOptionId: 'promotionOption',
        agreementFileKeys: files.map(({ key }) => key),
      });

      const promotionOption = PromotionOptionService.get('promotionOption', {
        documents: 1,
      });

      expect(
        promotionOption.documents[
          PROMOTION_OPTION_DOCUMENTS.RESERVATION_AGREEMENT
        ].length,
      ).to.equal(1);

      const tempFiles = await S3Service.listObjects('temp/adminId');
      expect(tempFiles.length).to.equal(0);

      await FileService.deleteAllFilesForDoc('promotionOption');
    });
  });

  describe('uploadAgreement', () => {
    it('throws if no reservation agreement has been uploaded', () => {
      generator({
        properties: { _id: 'propId' },
        promotions: {
          _id: 'promo',
          loans: [{ _id: 'loan1' }, { _id: 'loan2' }],
          promotionLots: {
            _id: 'pL1',
            status: PROMOTION_LOT_STATUS.AVAILABLE,
            propertyLinks: [{ _id: 'prop1' }],
            promotionOptions: [
              {
                _id: 'pO2',
                loan: { _id: 'loan2' },
                promotion: { _id: 'promo' },
              },
            ],
          },
        },
      });

      return PromotionOptionService.uploadAgreement({
        promotionOptionId: 'pO2',
      })
        .then(() => expect(1).to.equal(2, 'This should not throw'))
        .catch(error => {
          expect(error.message).to.include('Aucune convention');
        });
    });

    it('throws if reservation agreement file keys are wrong', () => {
      generator({
        properties: { _id: 'propId' },
        promotions: {
          _id: 'promo',
          loans: [{ _id: 'loan1' }, { _id: 'loan2' }],
          promotionLots: {
            _id: 'pL1',
            status: PROMOTION_LOT_STATUS.AVAILABLE,
            propertyLinks: [{ _id: 'prop1' }],
            promotionOptions: [
              {
                _id: 'pO2',
                loan: { _id: 'loan2' },
                promotion: { _id: 'promo' },
              },
            ],
          },
        },
      });

      return PromotionOptionService.uploadAgreement({
        agreementFileKeys: ['wrongKey'],
        startDate: new Date(),
        promotionOptionId: 'pO2',
      })
        .then(() => expect(1).to.equal(2, 'This should not throw'))
        .catch(error => {
          expect(error).to.not.equal(undefined);
          expect(error.message).to.include('Aucune convention');
        });
    });

    it('uploads the agreement', async () => {
      generator({
        properties: { _id: 'propId' },
        promotions: {
          _id: 'promo',
          agreementDuration: 14,
          loans: [{ _id: 'loan1' }, { _id: 'loan2' }],
          promotionLots: {
            _id: 'pL1',
            status: PROMOTION_LOT_STATUS.AVAILABLE,
            propertyLinks: [{ _id: 'prop1' }],
            promotionOptions: [
              {
                _id: 'pO2',
                loan: { _id: 'loan2' },
                promotion: { _id: 'promo' },
              },
            ],
          },
        },
      });

      const file = Buffer.from('hello1', 'utf-8');
      const key = FileService.getTempS3FileKey(
        'adminId',
        { name: 'agreement1.pdf' },
        { id: 'agreement1' },
      );

      await S3Service.putObject(file, key);

      const startDate = moment()
        .startOf('day')
        .toDate();

      return PromotionOptionService.uploadAgreement({
        agreementFileKeys: [key],
        startDate,
        promotionOptionId: 'pO2',
      }).then(() => {
        const promotionOption = PromotionOptionService.get('pO2', {
          reservationDeposit: 1,
          promotionLink: 1,
          reservationAgreement: 1,
        });
        expect(promotionOption).to.deep.include({
          reservationDeposit: {
            date: startDate,
            status: PROMOTION_OPTION_DEPOSIT_STATUS.WAITING,
          },
          promotionLink: { _id: 'promo' },
          reservationAgreement: {
            expirationDate: moment(startDate)
              .add(14, 'days')
              .endOf('day')
              .toDate(),
            startDate,
            date: startDate,
            status: PROMOTION_OPTION_AGREEMENT_STATUS.RECEIVED,
          },
        });
      });
    });
  });

  describe('update', () => {
    it('updates related date fields', () => {
      const fiveDaysAgo = moment()
        .subtract(5, 'd')
        .toDate();
      const now = new Date();
      generator({
        users: { _id: 'adminId', _factory: 'admin' },
        promotionOptions: {
          _id: 'promotionOption',
          _factory: 'promotionOption',
          bank: { date: fiveDaysAgo },
        },
      });

      PromotionOptionService._update({
        id: 'promotionOption',
        object: {
          'bank.status': PROMOTION_OPTION_BANK_STATUS.VALIDATED,
        },
      });
      const pO = PromotionOptionService.get('promotionOption', { bank: 1 });

      expect(moment(pO.bank.date).isAfter(now)).to.equal(true);
    });

    it('does not update date if both are provided', () => {
      const fiveDaysAgo = moment()
        .subtract(5, 'd')
        .toDate();
      generator({
        users: { _id: 'adminId', _factory: 'admin' },
        promotionOptions: {
          _id: 'promotionOption',
          _factory: 'promotionOption',
        },
      });

      PromotionOptionService._update({
        id: 'promotionOption',
        object: {
          bank: {
            status: PROMOTION_OPTION_BANK_STATUS.VALIDATED,
            date: fiveDaysAgo,
          },
        },
      });
      const pO = PromotionOptionService.get('promotionOption', { bank: 1 });

      expect(moment(pO.bank.date).isBefore(moment().subtract(5, 'd'))).to.equal(
        true,
      );
    });

    it('sets any expirationDate and startDate at end/start of day', () => {
      generator({
        users: { _id: 'adminId', _factory: 'admin' },
        promotionOptions: {
          _id: 'promotionOption',
          _factory: 'promotionOption',
        },
      });
      const now = new Date();
      PromotionOptionService._update({
        id: 'promotionOption',
        object: {
          'reservationAgreement.startDate': now,
          'reservationAgreement.expirationDate': now,
        },
      });

      const pO = PromotionOptionService.get('promotionOption', {
        reservationAgreement: 1,
      });
      expect(pO.reservationAgreement.startDate.getHours()).to.equal(0);
      expect(pO.reservationAgreement.startDate.getMinutes()).to.equal(0);
      expect(pO.reservationAgreement.startDate.getSeconds()).to.equal(0);
      expect(pO.reservationAgreement.expirationDate.getHours()).to.equal(23);
      expect(pO.reservationAgreement.expirationDate.getMinutes()).to.equal(59);
      expect(pO.reservationAgreement.expirationDate.getSeconds()).to.equal(59);
    });
  });

  describe('expireReservations', () => {
    it('expires required reservations', async () => {
      const today = moment().toDate();
      const yesterday = moment()
        .subtract(1, 'days')
        .toDate();
      const tomorrow = moment()
        .add(1, 'days')
        .toDate();

      generator({
        properties: [
          { _id: 'prop1', name: 'Lot 1' },
          { _id: 'prop2', name: 'Lot 2' },
          { _id: 'prop3', name: 'Lot 3' },
          { _id: 'prop4', name: 'Lot 4' },
        ],
        promotions: {
          _id: 'promo',
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
          loans: [
            {
              _id: 'loan1',
              user: { firstName: 'John', lastName: 'Doe' },
              $metadata: { invitedBy: 'pro1' },
            },
            { _id: 'loan2' },
            { _id: 'loan3' },
            { _id: 'loan4' },
          ],
          promotionLots: [
            makePromotionLotWithReservation({
              key: 1,
              status: PROMOTION_LOT_STATUS.RESERVED,
              promotionOptionStatus: PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
              expirationDate: yesterday,
            }),
            makePromotionLotWithReservation({
              key: 2,
              status: PROMOTION_LOT_STATUS.RESERVED,
              promotionOptionStatus: PROMOTION_OPTION_STATUS.RESERVED,
              expirationDate: today,
            }),
            makePromotionLotWithReservation({
              key: 3,
              status: PROMOTION_LOT_STATUS.RESERVED,
              promotionOptionStatus: PROMOTION_OPTION_STATUS.RESERVED,
              expirationDate: tomorrow,
            }),
            makePromotionLotWithReservation({
              key: 4,
              status: PROMOTION_LOT_STATUS.SOLD,
              promotionOptionStatus: PROMOTION_OPTION_STATUS.SOLD,
              expirationDate: yesterday,
            }),
          ],
        },
      });

      const expiredReservations = await PromotionOptionService.expireReservations();
      expect(expiredReservations.length).to.equal(1);

      const emails = await checkEmails(1);

      const { promotionLots = [] } = PromotionService.get('promo', {
        promotionLots: {
          status: 1,
          promotionOptions: { status: 1 },
          attributedTo: { _id: 1 },
        },
      });

      const [pL1, pL2, pL3, pL4] = promotionLots;

      expect(pL1.status).to.equal(PROMOTION_LOT_STATUS.RESERVED);
      expect(pL1.attributedTo).to.deep.include({ _id: 'loan1' });
      expect(pL1.promotionOptions[0].status).to.equal(
        PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
      );

      expect(pL2.status).to.equal(PROMOTION_LOT_STATUS.RESERVED);
      expect(pL2.attributedTo).to.deep.include({ _id: 'loan2' });
      expect(pL2.promotionOptions[0].status).to.equal(
        PROMOTION_OPTION_STATUS.RESERVED,
      );

      expect(pL3.status).to.equal(PROMOTION_LOT_STATUS.RESERVED);
      expect(pL3.attributedTo).to.deep.include({ _id: 'loan3' });
      expect(pL3.promotionOptions[0].status).to.equal(
        PROMOTION_OPTION_STATUS.RESERVED,
      );

      expect(pL4.status).to.equal(PROMOTION_LOT_STATUS.SOLD);
      expect(pL4.attributedTo).to.deep.include({ _id: 'loan4' });
      expect(pL4.promotionOptions[0].status).to.equal(
        PROMOTION_OPTION_STATUS.SOLD,
      );

      const [email1] = emails.sort(({ address: a }, { address: b }) =>
        a.localeCompare(b),
      );
      const {
        address,
        response: { status },
        template: {
          message: { from_email, subject, global_merge_vars, from_name },
        },
      } = email1;
      expect(status).to.equal('sent');
      expect(address).to.equal('pro1@e-potek.ch');
      expect(from_email).to.include('info');
      expect(from_name).to.equal('e-Potek');
      expect(subject).to.equal(
        'Test promotion, Convention de réservation expirée',
      );
      expect(
        global_merge_vars.find(({ name }) => name === 'BODY').content,
      ).to.include(
        'La convention de réservation du client John Doe pour le lot Lot 1 a expiré',
      );
    });
  });

  describe('generateExpiringSoonTasks', () => {
    it('inserts tasks for soon expiring reservations', async () => {
      const nextFriday =
        moment().isoWeekday() <= 5
          ? moment().isoWeekday(5)
          : moment()
              .add(1, 'weeks')
              .isoWeekday(5);

      const clock = sinon.useFakeTimers(nextFriday.unix() * 1000);

      const today = moment().toDate();
      const tomorrow = moment()
        .add(1, 'days')
        .toDate();
      const in2Days = moment()
        .add(2, 'days')
        .toDate();
      const in3Days = moment()
        .add(3, 'days')
        .toDate();

      generator({
        properties: [
          { _id: 'prop1', name: 'Lot 1' },
          { _id: 'prop2', name: 'Lot 2' },
          { _id: 'prop3', name: 'Lot 3' },
          { _id: 'prop4', name: 'Lot 4' },
        ],
        users: {
          _id: 'admin',
          _factory: 'admin',
        },
        promotions: {
          _id: 'promo',
          assignedEmployee: { _id: 'admin' },
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
          loans: [
            {
              _id: 'loan1',
              user: { firstName: 'User1', lastName: 'Lastname1' },
              $metadata: { invitedBy: 'pro1' },
            },
            {
              _id: 'loan2',
              user: { firstName: 'User2', lastName: 'Lastname2' },
              $metadata: { invitedBy: 'pro2' },
            },
            {
              _id: 'loan3',
              user: { firstName: 'User3', lastName: 'Lastname3' },
              $metadata: { invitedBy: 'pro3' },
            },
            {
              _id: 'loan4',
              user: { firstName: 'User4', lastName: 'Lastname4' },
              $metadata: { invitedBy: 'pro3' },
            },
            {
              _id: 'loan5',
              user: { firstName: 'User5', lastName: 'Lastname5' },
              $metadata: { invitedBy: 'pro3' },
            },
          ],
          promotionLots: [
            makePromotionLotWithReservation({
              key: 1,
              status: PROMOTION_LOT_STATUS.RESERVED,
              promotionOptionStatus: PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
              expirationDate: in2Days,
            }),
            makePromotionLotWithReservation({
              key: 2,
              status: PROMOTION_LOT_STATUS.RESERVED,
              promotionOptionStatus: PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
              expirationDate: today,
            }),
            makePromotionLotWithReservation({
              key: 3,
              status: PROMOTION_LOT_STATUS.RESERVED,
              promotionOptionStatus: PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
              expirationDate: tomorrow,
            }),
            makePromotionLotWithReservation({
              key: 4,
              status: PROMOTION_LOT_STATUS.RESERVED,
              promotionOptionStatus: PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
              expirationDate: in3Days,
            }),
            makePromotionLotWithReservation({
              key: 4,
              status: PROMOTION_LOT_STATUS.RESERVED,
              promotionOptionStatus: PROMOTION_OPTION_STATUS.RESERVED,
              expirationDate: tomorrow,
            }),
          ],
        },
      });

      await generateExpiringSoonReservationTasks.run({});

      const tasks = TaskService.fetch({
        assignee: { _id: 1 },
        loan: { _id: 1 },
        title: 1,
        description: 1,
      });

      expect(tasks.length).to.equal(4);
      tasks.forEach(
        (
          { assignee: { _id: assigneeId } = {}, loan: { _id: loanId } = {} },
          index,
        ) => {
          expect(assigneeId).to.equal('admin');
          expect(loanId).to.equal(`loan${index + 1}`);
        },
      );
      expect(tasks[0]).to.deep.include({
        title:
          'La réservation de User1 Lastname1 sur le lot Lot 1 arrive à échéance',
        description: `La convention de réservation est valable jusqu'au ${moment(
          in2Days,
        ).format('DD MMM')}`,
      });
      expect(tasks[1]).to.deep.include({
        title:
          'La réservation de User2 Lastname2 sur le lot Lot 2 arrive à échéance',
        description: `La convention de réservation est valable jusqu'au ${moment(
          today,
        ).format('DD MMM')}`,
      });
      expect(tasks[2]).to.deep.include({
        title:
          'La réservation de User3 Lastname3 sur le lot Lot 3 arrive à échéance',
        description: `La convention de réservation est valable jusqu'au ${moment(
          tomorrow,
        ).format('DD MMM')}`,
      });
      clock.restore();
    });
  });

  describe('getEmailRecipients', () => {
    const generatePro = ({ id, org }) => ({
      _id: id,
      _factory: 'pro',
      emails: [{ address: `${id}@${org}.com`, verified: true }],
      organisations: [{ _id: org }],
    });
    const addProToPromotion = ({ id, permissions, role }) => ({
      _id: id,
      $metadata: {
        roles: [role],
        permissions,
      },
    });
    const addLoanToPromotion = ({ id, invitedBy }) => ({
      _id: `loan${id}`,
      user: {
        _id: `user${id}`,
        firstName: 'Customer',
        lastName: `No${id}`,
        emails: [{ address: `customer${id}@test.com`, verified: true }],
        assignedEmployeeId: 'admin',
      },
      $metadata: { invitedBy },
    });

    const generatePromotion = ({ pros = [], loans = [] }) => {
      generator({
        users: [
          {
            _id: 'admin',
            _factory: 'admin',
            emails: [{ address: 'admin@e-potek.ch', verified: true }],
          },
          ...pros.map(({ id, org }) => generatePro({ id, org })),
        ],
        properties: [
          { _id: 'prop1', name: 'Lot 1' },
          { _id: 'prop2', name: 'Lot 2' },
          { _id: 'prop3', name: 'Lot 3' },
          { _id: 'prop4', name: 'Lot 4' },
        ],
        promotions: [
          {
            _id: 'promo',
            users: pros.map(({ id, permissions, role }) =>
              addProToPromotion({ id, permissions, role }),
            ),
            promotionLots: loans.map(
              ({ id, promotionLotStatus, promotionOptionStatus }) =>
                makePromotionLotWithReservation({
                  key: id,
                  status: promotionLotStatus,
                  promotionOptionStatus,
                  expirationDate: new Date(),
                }),
            ),
            loans: loans.map(({ id, invitedBy }) =>
              addLoanToPromotion({ id, invitedBy }),
            ),
          },
        ],
      });
    };

    beforeEach(() => {
      generatePromotion({
        pros: [
          {
            id: 'pro1',
            org: 'org1',
            role: PROMOTION_USERS_ROLES.PROMOTER,
            permissions: PROMOTION_PERMISSIONS_FULL_ACCESS(),
          },
          {
            id: 'pro2',
            org: 'org1',
            role: PROMOTION_USERS_ROLES.BROKER,
            permissions: {
              displayCustomerNames: {
                invitedBy: PROMOTION_INVITED_BY_TYPE.ORGANISATION,
                forLotStatus: Object.values(
                  PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.FOR_LOT_STATUS,
                ),
              },
            },
          },
          {
            id: 'pro3',
            org: 'org2',
            role: PROMOTION_USERS_ROLES.BROKER,
            permissions: {
              displayCustomerNames: {
                invitedBy: PROMOTION_INVITED_BY_TYPE.USER,
                forLotStatus: Object.values(
                  PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.FOR_LOT_STATUS,
                ),
              },
            },
          },
          {
            id: 'pro4',
            org: 'org3',
            role: PROMOTION_USERS_ROLES.NOTARY,
            permissions: {
              displayCustomerNames: {
                invitedBy: PROMOTION_INVITED_BY_TYPE.ANY,
                forLotStatus: [
                  PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.FOR_LOT_STATUS
                    .SOLD,
                ],
              },
            },
          },
          {
            id: 'pro5',
            org: 'org3',
            role: PROMOTION_USERS_ROLES.VISITOR,
            permissions: {
              displayCustomerNames: false,
            },
          },
        ],
        loans: [
          {
            id: 1,
            invitedBy: 'pro1',
            promotionLotStatus: PROMOTION_LOT_STATUS.RESERVED,
            promotionOptionStatus: PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
          },
          {
            id: 2,
            invitedBy: 'pro2',
            promotionLotStatus: PROMOTION_LOT_STATUS.RESERVED,
            promotionOptionStatus: PROMOTION_OPTION_STATUS.RESERVED,
          },
          {
            id: 3,
            invitedBy: 'pro3',
            promotionLotStatus: PROMOTION_LOT_STATUS.RESERVED,
            promotionOptionStatus: PROMOTION_OPTION_STATUS.RESERVED,
          },
          {
            id: 4,
            invitedBy: 'pro2',
            promotionLotStatus: PROMOTION_LOT_STATUS.SOLD,
            promotionOptionStatus: PROMOTION_OPTION_STATUS.SOLD,
          },
        ],
      });
    });

    context('when promoter invited customer', () => {
      it('returns promoter as PROMOTER and BROKER', () => {
        const recipients = PromotionOptionService.getEmailRecipients({
          promotionOptionId: 'pO1',
        });

        expect(recipients).to.deep.include({
          [PROMOTION_EMAIL_RECIPIENTS.USER]: [
            { email: 'customer1@test.com', anonymize: false, userId: 'user1' },
          ],
          [PROMOTION_EMAIL_RECIPIENTS.ADMIN]: [
            { email: 'admin@e-potek.ch', anonymize: false, userId: 'admin' },
          ],
          [PROMOTION_EMAIL_RECIPIENTS.BROKER]: [
            { email: 'pro1@org1.com', anonymize: false, userId: 'pro1' },
          ],
          [PROMOTION_EMAIL_RECIPIENTS.PROMOTER]: [
            { email: 'pro1@org1.com', anonymize: false, userId: 'pro1' },
          ],
        });
      });
    });

    context('when a broker invited a customer', () => {
      it('does not return the broker in BROKERS', () => {
        const recipients = PromotionOptionService.getEmailRecipients({
          promotionOptionId: 'pO2',
        });
        expect(recipients).to.deep.include({
          [PROMOTION_EMAIL_RECIPIENTS.USER]: [
            { email: 'customer2@test.com', anonymize: false, userId: 'user2' },
          ],
          [PROMOTION_EMAIL_RECIPIENTS.ADMIN]: [
            { email: 'admin@e-potek.ch', anonymize: false, userId: 'admin' },
          ],
          [PROMOTION_EMAIL_RECIPIENTS.BROKER]: [
            { email: 'pro2@org1.com', anonymize: false, userId: 'pro2' },
          ],
          [PROMOTION_EMAIL_RECIPIENTS.BROKERS]: [
            { email: 'pro3@org2.com', anonymize: true, userId: 'pro3' },
          ],
          [PROMOTION_EMAIL_RECIPIENTS.PROMOTER]: [
            { email: 'pro1@org1.com', anonymize: false, userId: 'pro1' },
          ],
        });
      });

      it('anonymize for the notary when required', () => {
        const recipients = PromotionOptionService.getEmailRecipients({
          promotionOptionId: 'pO3',
        });

        expect(recipients).to.deep.include({
          [PROMOTION_EMAIL_RECIPIENTS.USER]: [
            { email: 'customer3@test.com', anonymize: false, userId: 'user3' },
          ],
          [PROMOTION_EMAIL_RECIPIENTS.ADMIN]: [
            { email: 'admin@e-potek.ch', anonymize: false, userId: 'admin' },
          ],
          [PROMOTION_EMAIL_RECIPIENTS.BROKER]: [
            { email: 'pro3@org2.com', anonymize: false, userId: 'pro3' },
          ],
          [PROMOTION_EMAIL_RECIPIENTS.BROKERS]: [
            { email: 'pro2@org1.com', anonymize: true, userId: 'pro2' },
          ],
          [PROMOTION_EMAIL_RECIPIENTS.PROMOTER]: [
            { email: 'pro1@org1.com', anonymize: false, userId: 'pro1' },
          ],
          [PROMOTION_EMAIL_RECIPIENTS.NOTARY]: [
            { email: 'pro4@org3.com', anonymize: true, userId: 'pro4' },
          ],
        });
      });

      it('does not anonymize for the notary when not required', () => {
        const recipients = PromotionOptionService.getEmailRecipients({
          promotionOptionId: 'pO4',
        });

        expect(recipients).to.deep.include({
          [PROMOTION_EMAIL_RECIPIENTS.USER]: [
            { email: 'customer4@test.com', anonymize: false, userId: 'user4' },
          ],
          [PROMOTION_EMAIL_RECIPIENTS.ADMIN]: [
            { email: 'admin@e-potek.ch', anonymize: false, userId: 'admin' },
          ],
          [PROMOTION_EMAIL_RECIPIENTS.BROKER]: [
            { email: 'pro2@org1.com', anonymize: false, userId: 'pro2' },
          ],
          [PROMOTION_EMAIL_RECIPIENTS.BROKERS]: [
            { email: 'pro3@org2.com', anonymize: true, userId: 'pro3' },
          ],
          [PROMOTION_EMAIL_RECIPIENTS.PROMOTER]: [
            { email: 'pro1@org1.com', anonymize: false, userId: 'pro1' },
          ],
          [PROMOTION_EMAIL_RECIPIENTS.NOTARY]: [
            { email: 'pro4@org3.com', anonymize: false, userId: 'pro4' },
          ],
        });
      });
    });
  });

  describe('setProgress', () => {
    it('updates a status and its date', () => {
      const startDate = new Date();
      generator({
        promotionOptions: {
          _id: 'id',
          bank: {
            status: PROMOTION_OPTION_BANK_STATUS.INCOMPLETE,
            date: startDate,
          },
        },
      });

      PromotionOptionService.setProgress({
        promotionOptionId: 'id',
        id: 'bank',
        object: { status: PROMOTION_OPTION_BANK_STATUS.VALIDATED },
      });

      const promotionOption = PromotionOptionService.get('id', { bank: 1 });

      expect(promotionOption.bank.status).to.equal(
        PROMOTION_OPTION_BANK_STATUS.VALIDATED,
      );
      expect(promotionOption.bank.date.getTime()).to.be.above(
        startDate.getTime(),
      );
    });

    it('does not update the date if the status has not changed', () => {
      const startDate = new Date();
      generator({
        promotionOptions: {
          _id: 'id',
          bank: {
            status: PROMOTION_OPTION_BANK_STATUS.INCOMPLETE,
            date: startDate,
          },
        },
      });

      const result = PromotionOptionService.setProgress({
        promotionOptionId: 'id',
        id: 'bank',
        object: { status: PROMOTION_OPTION_BANK_STATUS.INCOMPLETE },
      });
      expect(result).to.deep.equal({});

      const promotionOption = PromotionOptionService.get('id', { bank: 1 });

      expect(promotionOption.bank.status).to.equal(
        PROMOTION_OPTION_BANK_STATUS.INCOMPLETE,
      );
      expect(promotionOption.bank.date.getTime()).to.equal(startDate.getTime());
    });

    it('returns the next and previous status if changed', () => {
      generator({ promotionOptions: { _id: 'id' } });

      const result = PromotionOptionService.setProgress({
        promotionOptionId: 'id',
        id: 'simpleVerification',
        object: {
          status: PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED,
        },
      });

      expect(result).to.deep.equal({
        prevStatus: PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.INCOMPLETE,
        nextStatus: PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED,
      });
    });

    it('returns an empty object if only a date is changed, to not trigger emails', () => {
      generator({ promotionOptions: { _id: 'id' } });

      const updatedDate = new Date();
      const result = PromotionOptionService.setProgress({
        promotionOptionId: 'id',
        id: 'simpleVerification',
        object: { date: updatedDate },
      });

      expect(result).to.deep.equal({});

      const promotionOption = PromotionOptionService.get('id', {
        simpleVerification: 1,
      });

      expect(promotionOption.simpleVerification.status).to.equal(
        PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.INCOMPLETE,
      );
      expect(promotionOption.simpleVerification.date.getTime()).to.equal(
        updatedDate.getTime(),
      );
    });

    describe('emails', () => {
      it('sends emails when changing simpleVerification to VALIDATED', async () => {
        generator({
          users: { _id: 'adminId', _factory: 'admin' },
          promotions: {
            users: [
              {
                _id: 'proId',
                _factory: 'pro',
                emails: [{ address: 'pro@e-potek.ch', verified: true }],
              },
              {
                _id: 'proId2',
                $metadata: { roles: [PROMOTION_USERS_ROLES.NOTARY] },
                _factory: 'pro',
                emails: [{ address: 'notary@e-potek.ch', verified: true }],
              },
            ],
            loans: {
              user: {
                emails: [{ address: 'user@e-potek.ch', verified: true }],
              },
              promotionOptions: { _id: 'pOptId', promotionLots: {} },
              $metadata: { invitedBy: 'proId' },
            },
            promotionOptions: { _id: 'pOptId' },
          },
        });

        await ddpWithUserId('adminId', () =>
          setPromotionOptionProgress.run({
            promotionOptionId: 'pOptId',
            id: 'simpleVerification',
            object: {
              status: PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED,
            },
          }),
        );

        const emails = await checkEmails(2);

        const emailIds = emails.map(({ emailId }) => emailId);
        expect(emailIds).to.include(
          EMAIL_IDS.SIMPLE_VERIFICATION_VALIDATED_PRO,
        );
        expect(emailIds).to.include(
          EMAIL_IDS.SIMPLE_VERIFICATION_VALIDATED_USER,
        );

        const proEmail = emails.find(
          ({ emailId }) =>
            emailId === EMAIL_IDS.SIMPLE_VERIFICATION_VALIDATED_PRO,
        );
        const userEmail = emails.find(
          ({ emailId }) =>
            emailId === EMAIL_IDS.SIMPLE_VERIFICATION_VALIDATED_USER,
        );

        expect(proEmail.address).to.equal('pro@e-potek.ch');
        expect(userEmail.address).to.equal('user@e-potek.ch');
      });

      it('sends emails when changing simpleVerification to REJECTED', async () => {
        generator({
          users: { _id: 'adminId', _factory: 'admin' },
          promotions: {
            users: {
              _id: 'proId',
              _factory: 'pro',
              emails: [{ address: 'pro@e-potek.ch', verified: true }],
            },
            loans: {
              user: {
                emails: [{ address: 'user@e-potek.ch', verified: true }],
              },
              promotionOptions: { _id: 'pOptId', promotionLots: {} },
              $metadata: { invitedBy: 'proId' },
            },
            promotionOptions: { _id: 'pOptId' },
          },
        });

        await ddpWithUserId('adminId', () =>
          setPromotionOptionProgress.run({
            promotionOptionId: 'pOptId',
            id: 'simpleVerification',
            object: {
              status: PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.REJECTED,
            },
          }),
        );

        const emails = await checkEmails(2);

        const emailIds = emails.map(({ emailId }) => emailId);
        expect(emailIds).to.include(EMAIL_IDS.SIMPLE_VERIFICATION_REJECTED_PRO);
        expect(emailIds).to.include(
          EMAIL_IDS.SIMPLE_VERIFICATION_REJECTED_USER,
        );

        const proEmail = emails.find(
          ({ emailId }) =>
            emailId === EMAIL_IDS.SIMPLE_VERIFICATION_REJECTED_PRO,
        );
        const userEmail = emails.find(
          ({ emailId }) =>
            emailId === EMAIL_IDS.SIMPLE_VERIFICATION_REJECTED_USER,
        );

        expect(proEmail.address).to.equal('pro@e-potek.ch');
        expect(userEmail.address).to.equal('user@e-potek.ch');
      });

      it('sends emails when changing bank to SENT', async () => {
        generator({
          users: { _id: 'adminId', _factory: 'admin' },
          promotions: {
            users: [
              {
                _id: 'proId1',
                $metadata: { roles: [PROMOTION_USERS_ROLES.BROKER] },
                _factory: 'pro',
                emails: [{ address: 'broker@e-potek.ch', verified: true }],
              },
              {
                _id: 'proId2',
                $metadata: { roles: [PROMOTION_USERS_ROLES.PROMOTER] },
                _factory: 'pro',
                emails: [{ address: 'promoter@e-potek.ch', verified: true }],
              },
              {
                _id: 'proId3',
                $metadata: { roles: [PROMOTION_USERS_ROLES.VISITOR] },
                _factory: 'pro',
                emails: [{ address: 'visitor@e-potek.ch', verified: true }],
              },
            ],
            loans: {
              user: {
                emails: [{ address: 'user@e-potek.ch', verified: true }],
              },
              promotionOptions: { _id: 'pOptId', promotionLots: {} },
              $metadata: { invitedBy: 'proId1' },
            },
            promotionOptions: { _id: 'pOptId' },
          },
        });

        await ddpWithUserId('adminId', () =>
          setPromotionOptionProgress.run({
            promotionOptionId: 'pOptId',
            id: 'bank',
            object: { status: PROMOTION_OPTION_BANK_STATUS.SENT },
          }),
        );

        const emails = await checkEmails(2);

        const emailIds = emails.map(({ emailId }) => emailId);
        expect(emailIds).to.deep.equal([
          EMAIL_IDS.PROMOTION_LOAN_SENT_TO_BANK,
          EMAIL_IDS.PROMOTION_LOAN_SENT_TO_BANK,
        ]);

        expect(
          !!emails.find(({ address }) => address === 'broker@e-potek.ch'),
        ).to.equal(true);
        expect(
          !!emails.find(({ address }) => address === 'promoter@e-potek.ch'),
        ).to.equal(true);
      });

      it('sends emails when changing bank to VALIDATED', async () => {
        generator({
          users: { _id: 'adminId', _factory: 'admin' },
          promotions: {
            users: [
              {
                _id: 'proId1',
                $metadata: { roles: [PROMOTION_USERS_ROLES.BROKER] },
                _factory: 'pro',
                emails: [{ address: 'broker@e-potek.ch', verified: true }],
              },
              {
                _id: 'proId2',
                $metadata: { roles: [PROMOTION_USERS_ROLES.PROMOTER] },
                _factory: 'pro',
                emails: [{ address: 'promoter1@e-potek.ch', verified: true }],
              },
              {
                _id: 'proId3',
                $metadata: { roles: [PROMOTION_USERS_ROLES.PROMOTER] },
                _factory: 'pro',
                emails: [{ address: 'promoter2@e-potek.ch', verified: true }],
              },
              {
                _id: 'proId4',
                $metadata: { roles: [PROMOTION_USERS_ROLES.VISITOR] },
                _factory: 'pro',
                emails: [{ address: 'visitor@e-potek.ch', verified: true }],
              },
            ],
            loans: {
              user: {
                emails: [{ address: 'user@e-potek.ch', verified: true }],
              },
              promotionOptions: { _id: 'pOptId', promotionLots: {} },
              $metadata: { invitedBy: 'proId1' },
            },
            promotionOptions: { _id: 'pOptId' },
          },
        });

        await ddpWithUserId('adminId', () =>
          setPromotionOptionProgress.run({
            promotionOptionId: 'pOptId',
            id: 'bank',
            object: { status: PROMOTION_OPTION_BANK_STATUS.VALIDATED },
          }),
        );

        const emails = await checkEmails(4);

        const emailIds = emails.map(({ emailId }) => emailId).sort();
        expect(emailIds).to.deep.equal([
          EMAIL_IDS.LOAN_VALIDATED_BY_BANK_PRO,
          EMAIL_IDS.LOAN_VALIDATED_BY_BANK_PRO,
          EMAIL_IDS.LOAN_VALIDATED_BY_BANK_PRO,
          EMAIL_IDS.LOAN_VALIDATED_BY_BANK_USER,
        ]);

        expect(
          !!emails.find(({ address }) => address === 'broker@e-potek.ch'),
        ).to.equal(true);
        expect(
          !!emails.find(({ address }) => address === 'promoter1@e-potek.ch'),
        ).to.equal(true);
        expect(
          !!emails.find(({ address }) => address === 'promoter2@e-potek.ch'),
        ).to.equal(true);
        expect(
          !!emails.find(({ address }) => address === 'user@e-potek.ch'),
        ).to.equal(true);
      });
    });
  });

  describe('activateReservation', () => {
    it('sends emails when the user activates the reservation', async () => {
      generator({
        users: {
          _id: 'adminId',
          _factory: 'admin',
          emails: [{ address: 'admin@e-potek.ch', verified: true }],
        },
        promotions: {
          _id: 'promo',
          users: [
            {
              _id: 'proId',
              _factory: 'pro',
              emails: [{ address: 'pro@e-potek.ch', verified: true }],
              $metadata: {
                permissions: PROMOTION_PERMISSIONS_FULL_ACCESS(),
                roles: [PROMOTION_USERS_ROLES.BROKER],
              },
            },
            {
              _id: 'proId2',
              $metadata: { roles: [PROMOTION_USERS_ROLES.NOTARY] },
              _factory: 'pro',
              emails: [{ address: 'notary@e-potek.ch', verified: true }],
            },
          ],
          loans: {
            user: {
              _id: 'userId',
              emails: [{ address: 'user@e-potek.ch', verified: true }],
              firstName: 'Bob',
              lastName: 'Dylan',
            },
            promotionOptions: {
              _id: 'pOptId',
              promotionLots: {
                _id: 'pLot',
                promotion: { _id: 'promo' },
              },
            },
            $metadata: { invitedBy: 'proId' },
          },
          promotionOptions: { _id: 'pOptId' },
          assignedEmployee: { _id: 'adminId' },
        },
      });

      await ddpWithUserId('userId', () =>
        promotionOptionActivateReservation.run({
          promotionOptionId: 'pOptId',
        }),
      );

      const [email] = await checkEmails(1);

      const {
        emailId,
        address,
        template: {
          message: { from_email, subject, global_merge_vars, from_name },
        },
      } = email;

      expect(emailId).to.equal(EMAIL_IDS.PROMOTION_RESERVATION_ACTIVATION);
      expect(address).to.equal('pro@e-potek.ch');
      expect(from_email).to.equal('admin@e-potek.ch');
      expect(from_name).to.equal('e-Potek');
      expect(subject).to.equal(
        'Test promotion, Début de la réservation du logement Lot A',
      );
      expect(
        global_merge_vars.find(({ name }) => name === 'BODY').content,
      ).to.include(
        'Bob Dylan a démontré son intérêt et souhaiterait avancer sur une réservation du logement Lot A.',
      );
    });

    it('sends emails when the broker activates the reservation', async () => {
      generator({
        users: {
          _id: 'adminId',
          _factory: 'admin',
          emails: [{ address: 'admin@e-potek.ch', verified: true }],
        },
        promotions: {
          _id: 'promo',
          users: [
            {
              _id: 'proId',
              _factory: 'pro',
              emails: [{ address: 'pro@e-potek.ch', verified: true }],
              $metadata: {
                permissions: PROMOTION_PERMISSIONS_FULL_ACCESS(),
                roles: [PROMOTION_USERS_ROLES.BROKER],
              },
            },
            {
              _id: 'proId2',
              $metadata: { roles: [PROMOTION_USERS_ROLES.NOTARY] },
              _factory: 'pro',
              emails: [{ address: 'notary@e-potek.ch', verified: true }],
            },
          ],
          loans: {
            user: {
              _id: 'userId',
              emails: [{ address: 'user@e-potek.ch', verified: true }],
              firstName: 'Bob',
              lastName: 'Dylan',
            },
            promotionOptions: {
              _id: 'pOptId',
              promotionLots: {
                _id: 'pLot',
                promotion: { _id: 'promo' },
              },
            },
            $metadata: { invitedBy: 'proId' },
          },
          promotionOptions: { _id: 'pOptId' },
          assignedEmployee: { _id: 'adminId' },
        },
      });

      await ddpWithUserId('proId', () =>
        promotionOptionActivateReservation.run({
          promotionOptionId: 'pOptId',
        }),
      );

      const [email] = await checkEmails(1);

      const {
        emailId,
        address,
        template: {
          message: { from_email, subject, global_merge_vars, from_name },
        },
      } = email;

      expect(emailId).to.equal(EMAIL_IDS.PROMOTION_RESERVATION_ACTIVATION);
      expect(address).to.equal('pro@e-potek.ch');
      expect(from_email).to.equal('admin@e-potek.ch');
      expect(from_name).to.equal('e-Potek');
      expect(subject).to.equal(
        'Test promotion, Début de la réservation du logement Lot A',
      );
      expect(
        global_merge_vars.find(({ name }) => name === 'BODY').content,
      ).to.include(
        'Bob Dylan a démontré son intérêt et souhaiterait avancer sur une réservation du logement Lot A.',
      );
    });
  });
});
