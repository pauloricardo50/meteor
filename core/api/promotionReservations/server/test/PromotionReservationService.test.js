/* eslint-env mocha */
import { expect } from 'chai';
import moment from 'moment';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import sinon from 'sinon';

import FileService from 'core/api/files/server/FileService';
import S3Service from 'core/api/files/server/S3Service';
import { PROMOTION_LOT_STATUS } from 'core/api/promotionLots/promotionLotConstants';
import { PROMOTION_OPTION_SOLVENCY } from 'core/api/promotionOptions/promotionOptionConstants';
import PromotionService from 'core/api/promotions/server/PromotionService';
import { checkEmails } from 'core/utils/testHelpers';
import TaskService from 'core/api/tasks/server/TaskService';
import generator from '../../../factories';
import { LOAN_VERIFICATION_STATUS } from '../../../loans/loanConstants';
import PromotionReservationService from '../PromotionReservationService';
import {
  PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS,
  PROMOTION_RESERVATION_DOCUMENTS,
  PROMOTION_RESERVATION_STATUS,
  AGREEMENT_STATUSES,
  DEPOSIT_STATUSES,
  PROMOTION_RESERVATION_LENDER_STATUS,
} from '../../promotionReservationConstants';

const makePromotionLotWithReservation = ({
  key,
  status,
  reservationStatus,
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
      promotionReservation: {
        _id: `pR${key}`,
        status: reservationStatus,
        promotionLot: { _id: `pL${key}` },
        promotion: { _id: 'promo' },
        loan: { _id: `loan${key}` },
        expirationDate,
      },
    },
  ],
});

describe('PromotionReservationService', function () {
  this.timeout(10000);

  beforeEach(() => {
    resetDatabase();
  });

  describe('getInititialMortgageCertification', () => {
    it('returns default values when no maxPropertyValue has been calculated', () => {
      const startDate = new Date();
      const mortgageCertification = PromotionReservationService.getInitialMortgageCertification({ loan: {}, startDate });

      expect(mortgageCertification).to.deep.include({
        status:
          PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.UNDETERMINED,
        date: startDate,
      });
    });

    it('returns CALCULATED status when solvency is not SOLVENT', () => {
      const startDate = new Date();
      const yesterday = moment()
        .subtract(1, 'days')
        .toDate();
      const mortgageCertification = PromotionReservationService.getInitialMortgageCertification({
        loan: {
          maxPropertyValue: { date: yesterday },
        },
        startDate,
      });

      expect(mortgageCertification).to.deep.include({
        status: PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.CALCULATED,
        date: yesterday,
      });
    });

    it('returns VALIDATED status when solvency is SOLVENT', () => {
      const startDate = new Date();
      const yesterday = moment()
        .subtract(1, 'days')
        .toDate();
      const mortgageCertification = PromotionReservationService.getInitialMortgageCertification({
        loan: {
          maxPropertyValue: { date: yesterday },
          verificationStatus: LOAN_VERIFICATION_STATUS.OK,
        },
        startDate,
        solvency: PROMOTION_OPTION_SOLVENCY.SOLVENT,
      });

      expect(mortgageCertification).to.deep.include({
        status: PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.SOLVENT,
        date: yesterday,
      });
    });
  });

  describe('getExpirationDate', () => {
    it('throws if no agreement duration is set', () => {
      expect(() =>
        PromotionReservationService.getExpirationDate({
          startDate: new Date(),
        })).to.throw('Aucun délai');
    });

    it('throws if start date is in the future', () => {
      const startDate = moment()
        .add(1, 'days')
        .toDate();

      expect(() =>
        PromotionReservationService.getExpirationDate({
          startDate,
          agreementDuration: 14,
        })).to.throw('ne peut pas être dans le futur');
    });

    it('does not throw if start date is today', () => {
      const startDate = moment()
        .add(1, 'hour')
        .toDate();

      expect(() =>
        PromotionReservationService.getExpirationDate({
          startDate,
          agreementDuration: 14,
        })).to.not.throw();
    });

    it('throws if start date is anterior to agreement duration', () => {
      const agreementDuration = 11;
      const startDate = moment()
        .subtract(13, 'days')
        .toDate();

      expect(() =>
        PromotionReservationService.getExpirationDate({
          startDate,
          agreementDuration,
        })).to.throw('ne peut pas être antérieur');
    });

    it('returns expiration date', () => {
      const agreementDuration = 11;
      const startDate = moment()
        .subtract(6, 'days')
        .toDate();

      expect(moment(PromotionReservationService.getExpirationDate({
        startDate,
        agreementDuration,
      })).format('DD-MM-YYYY')).to.equal(moment(startDate)
        .add(agreementDuration, 'days')
        .endOf('day')
        .format('DD-MM-YYYY'));
    });
  });

  describe('mergeAgreementFiles', () => {
    it('merges temp agreement files to promotion reservation', async () => {
      generator({
        users: { _id: 'adminId', _factory: 'admin' },
        promotionReservations: {
          _id: 'promotionReservation',
          _factory: 'promotionReservation',
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
        {
          file: Buffer.from('hello2', 'utf-8'),
          key: FileService.getTempS3FileKey(
            'adminId',
            { name: 'agreement2.pdf' },
            { id: 'agreement2' },
          ),
        },
      ];

      await Promise.all(files.map(({ file, key }) => S3Service.putObject(file, key)));

      await PromotionReservationService.mergeAgreementFiles({
        promotionReservationId: 'promotionReservation',
        agreementFileKeys: files.map(({ key }) => key),
      });

      const promotionReservation = PromotionReservationService.findOne({
        _id: 'promotionReservation',
      });

      expect(promotionReservation.documents[
        PROMOTION_RESERVATION_DOCUMENTS.RESERVATION_AGREEMENT
      ].length).to.equal(2);

      const tempFiles = await S3Service.listObjects('temp/adminId');
      expect(tempFiles.length).to.equal(0);

      await FileService.deleteAllFilesForDoc('promotionReservation');
    });
  });

  describe('insert', () => {
    it('throws if promotion lot is already booked', () => {
      const expirationDate = moment()
        .add(1, 'days')
        .endOf('day')
        .toDate();
      generator({
        properties: { _id: 'propId' },
        promotions: {
          _id: 'promo',
          loans: [{ _id: 'loan1' }, { _id: 'loan2' }],
          promotionLots: {
            _id: 'pL1',
            status: PROMOTION_LOT_STATUS.BOOKED,
            propertyLinks: [{ _id: 'prop1' }],
            promotionOptions: [
              {
                _id: 'pO1',
                loan: { _id: 'loan1' },
                promotionReservation: {
                  _id: 'pR1',
                  status: PROMOTION_RESERVATION_STATUS.ACTIVE,
                  promotionLot: { _id: 'pL1' },
                  expirationDate,
                },
              },
              { _id: 'pO2', loan: { _id: 'loan2' } },
            ],
          },
        },
      });

      return PromotionReservationService.insert({
        promotionReservation: {},
        promotionOptionId: 'pO2',
      })
        .then(() => expect(1).to.equal(2, 'This should not throw'))
        .catch((error) => {
          expect(error.message).to.include(`Ce lot est déjà réservé jusqu'au ${moment(expirationDate).format('D MMM YYYY')}`);
        });
    });

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
            promotionOptions: [{ _id: 'pO2', loan: { _id: 'loan2' } }],
          },
        },
      });

      return PromotionReservationService.insert({
        promotionReservation: {},
        promotionOptionId: 'pO2',
      })
        .then(() => expect(1).to.equal(2, 'This should not throw'))
        .catch((error) => {
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
            promotionOptions: [{ _id: 'pO2', loan: { _id: 'loan2' } }],
          },
        },
      });

      return PromotionReservationService.insert({
        promotionReservation: {
          agreementFileKeys: ['wrongKey'],
          startDate: new Date(),
        },
        promotionOptionId: 'pO2',
      })
        .then(() => expect(1).to.equal(2, 'This should not throw'))
        .catch((error) => {
          expect(error).to.not.equal(undefined);
          expect(error.message).to.include('Aucune convention');
        });
    });

    it('inserts the promotion reservation', async () => {
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
            promotionOptions: [{ _id: 'pO2', loan: { _id: 'loan2' } }],
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

      const startDate = moment().startOf('day').toDate();

      return PromotionReservationService.insert({
        promotionReservation: {
          agreementFileKeys: [key],
          startDate,
        },
        promotionOptionId: 'pO2',
      }).then((promotionReservationId) => {
        const promotionReservation = PromotionReservationService.findOne({
          _id: promotionReservationId,
        });
        expect(promotionReservation).to.deep.include({
          status: PROMOTION_RESERVATION_STATUS.ACTIVE,
          startDate,
          reservationAgreement: {
            date: startDate,
            status: AGREEMENT_STATUSES.SIGNED,
          },
          deposit: { date: startDate, status: DEPOSIT_STATUSES.UNPAID },
          lender: {
            date: startDate,
            status: PROMOTION_RESERVATION_LENDER_STATUS.NONE,
          },
          mortgageCertification: {
            date: startDate,
            status:
              PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.UNDETERMINED,
          },
          promotionOptionLink: { _id: 'pO2' },
          promotionLotLink: { _id: 'pL1' },
          promotionLink: { _id: 'promo' },
          loanLink: { _id: 'loan2' },
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
        promotionReservations: {
          _id: 'promotionReservation',
          _factory: 'promotionReservation',
          lender: { date: fiveDaysAgo },
        },
      });

      PromotionReservationService._update({
        id: 'promotionReservation',
        object: {
          'lender.status': PROMOTION_RESERVATION_LENDER_STATUS.VALIDATED,
        },
      });
      const pR = PromotionReservationService.findOne('promotionReservation');

      expect(moment(pR.lender.date).isAfter(now)).to.equal(true);
    });

    it('does not update date if both are provided', () => {
      const fiveDaysAgo = moment()
        .subtract(5, 'd')
        .toDate();
      generator({
        users: { _id: 'adminId', _factory: 'admin' },
        promotionReservations: {
          _id: 'promotionReservation',
          _factory: 'promotionReservation',
        },
      });

      PromotionReservationService._update({
        id: 'promotionReservation',
        object: {
          lender: {
            status: PROMOTION_RESERVATION_LENDER_STATUS.VALIDATED,
            date: fiveDaysAgo,
          },
        },
      });
      const pR = PromotionReservationService.findOne('promotionReservation');

      expect(moment(pR.lender.date).isBefore(moment().subtract(5, 'd'))).to.equal(true);
    });

    it('sets any expirationDate and startDate at end/start of day', () => {
      generator({
        users: { _id: 'adminId', _factory: 'admin' },
        promotionReservations: {
          _id: 'promotionReservation',
          _factory: 'promotionReservation',
        },
      });
      const now = new Date();
      PromotionReservationService._update({
        id: 'promotionReservation',
        object: { startDate: now, expirationDate: now },
      });

      const pR = PromotionReservationService.findOne('promotionReservation');
      expect(pR.startDate.getHours()).to.equal(0);
      expect(pR.startDate.getMinutes()).to.equal(0);
      expect(pR.startDate.getSeconds()).to.equal(0);
      expect(pR.expirationDate.getHours()).to.equal(23);
      expect(pR.expirationDate.getMinutes()).to.equal(59);
      expect(pR.expirationDate.getSeconds()).to.equal(59);
    });
  });

  describe('expirePromotionReservations', () => {
    it('expires required promotion reservations', async () => {
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
              status: PROMOTION_LOT_STATUS.BOOKED,
              reservationStatus: PROMOTION_RESERVATION_STATUS.ACTIVE,
              expirationDate: yesterday,
            }),
            makePromotionLotWithReservation({
              key: 2,
              status: PROMOTION_LOT_STATUS.BOOKED,
              reservationStatus: PROMOTION_RESERVATION_STATUS.ACTIVE,
              expirationDate: today,
            }),
            makePromotionLotWithReservation({
              key: 3,
              status: PROMOTION_LOT_STATUS.BOOKED,
              reservationStatus: PROMOTION_RESERVATION_STATUS.ACTIVE,
              expirationDate: tomorrow,
            }),
            makePromotionLotWithReservation({
              key: 4,
              status: PROMOTION_LOT_STATUS.SOLD,
              reservationStatus: PROMOTION_RESERVATION_STATUS.COMPLETED,
              expirationDate: yesterday,
            }),
          ],
        },
      });

      const expiredPromotionReservations = await PromotionReservationService.expirePromotionReservations();
      const emails = await checkEmails(2);

      expect(expiredPromotionReservations).to.equal(1);

      const { promotionLots = [] } = PromotionService.fetchOne({
        $filters: { _id: 'promo' },
        promotionLots: {
          status: 1,
          promotionOptions: { promotionReservation: { status: 1 } },
          attributedTo: { _id: 1 },
        },
      });

      const [pL1, pL2, pL3, pL4] = promotionLots;

      expect(pL1.status).to.equal(PROMOTION_LOT_STATUS.AVAILABLE);
      expect(pL1.attributedTo).to.equal(undefined);
      expect(pL1.promotionOptions[0].promotionReservation.status).to.equal(PROMOTION_RESERVATION_STATUS.EXPIRED);

      expect(pL2.status).to.equal(PROMOTION_LOT_STATUS.BOOKED);
      expect(pL2.attributedTo).to.deep.include({ _id: 'loan2' });
      expect(pL2.promotionOptions[0].promotionReservation.status).to.equal(PROMOTION_RESERVATION_STATUS.ACTIVE);

      expect(pL3.status).to.equal(PROMOTION_LOT_STATUS.BOOKED);
      expect(pL3.attributedTo).to.deep.include({ _id: 'loan3' });
      expect(pL3.promotionOptions[0].promotionReservation.status).to.equal(PROMOTION_RESERVATION_STATUS.ACTIVE);

      expect(pL4.status).to.equal(PROMOTION_LOT_STATUS.SOLD);
      expect(pL4.attributedTo).to.deep.include({ _id: 'loan4' });
      expect(pL4.promotionOptions[0].promotionReservation.status).to.equal(PROMOTION_RESERVATION_STATUS.COMPLETED);

      const [email1] = emails.sort(({ address: a }, { address: b }) =>
        a.localeCompare(b));
      const {
        address,
        response: { status },
        template: {
          message: { from_email, subject, global_merge_vars, from_name },
        },
      } = email1;
      expect(status).to.equal('sent');
      expect(address).to.equal('pro1@e-potek.ch');
      expect(from_email).to.equal('info@e-potek.ch');
      expect(from_name).to.equal('e-Potek');
      expect(subject).to.equal('Promotion "Test promotion", réservation annulée');
      expect(global_merge_vars.find(({ name }) => name === 'BODY').content).to.include('La réservation pour le lot "Lot 1" a été annulée par e-Potek.');
    });
  });

  describe('generateExpiringTomorrowTasks', () => {
    it('inserts tasks for soon expiring reservations', async () => {
      const nextFriday = moment().isoWeekday() <= 5
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
              status: PROMOTION_LOT_STATUS.BOOKED,
              reservationStatus: PROMOTION_RESERVATION_STATUS.ACTIVE,
              expirationDate: in2Days,
            }),
            makePromotionLotWithReservation({
              key: 2,
              status: PROMOTION_LOT_STATUS.BOOKED,
              reservationStatus: PROMOTION_RESERVATION_STATUS.ACTIVE,
              expirationDate: today,
            }),
            makePromotionLotWithReservation({
              key: 3,
              status: PROMOTION_LOT_STATUS.BOOKED,
              reservationStatus: PROMOTION_RESERVATION_STATUS.ACTIVE,
              expirationDate: tomorrow,
            }),
            makePromotionLotWithReservation({
              key: 4,
              status: PROMOTION_LOT_STATUS.BOOKED,
              reservationStatus: PROMOTION_RESERVATION_STATUS.ACTIVE,
              expirationDate: in3Days,
            }),
            makePromotionLotWithReservation({
              key: 4,
              status: PROMOTION_LOT_STATUS.SOLD,
              reservationStatus: PROMOTION_RESERVATION_STATUS.COMPLETED,
              expirationDate: tomorrow,
            }),
          ],
        },
      });

      await PromotionReservationService.generateExpiringTomorrowTasks();

      const tasks = TaskService.fetch({
        assignee: { _id: 1 },
        promotion: { _id: 1 },
        title: 1,
        description: 1,
      });

      expect(tasks.length).to.equal(3);
      tasks.forEach(({
        assignee: { _id: assigneeId },
        promotion: { _id: promotionId },
      }) => {
        expect(assigneeId).to.equal('admin');
        expect(promotionId).to.equal('promo');
      });
      expect(tasks[0]).to.deep.include({
        title: 'La réservation de User1 Lastname1 sur Lot 1 arrive à échéance',
        description: `Valable jusqu'au ${moment(in2Days).format('DD MMM')}`,
      });
      expect(tasks[1]).to.deep.include({
        title: 'La réservation de User2 Lastname2 sur Lot 2 arrive à échéance',
        description: `Valable jusqu'au ${moment(today).format('DD MMM')}`,
      });
      expect(tasks[2]).to.deep.include({
        title: 'La réservation de User3 Lastname3 sur Lot 3 arrive à échéance',
        description: `Valable jusqu'au ${moment(tomorrow).format('DD MMM')}`,
      });
      clock.restore();
    });
  });
});
