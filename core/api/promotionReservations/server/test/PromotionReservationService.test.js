/* eslint-env mocha */
import { expect } from 'chai';
import moment from 'moment';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import FileService from 'core/api/files/server/FileService';
import S3Service from 'core/api/files/server/S3Service';
import { PROMOTION_LOT_STATUS } from 'core/api/promotionLots/promotionLotConstants';
import { PROMOTION_OPTION_SOLVENCY } from 'core/api/promotionOptions/promotionOptionConstants';
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

    it('throws if start date is anterior to half agreement duration', () => {
      const agreementDuration = 11;
      const startDate = moment()
        .subtract(7, 'days')
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
      })).format('DD-MM-YYYY HH:MM')).to.equal(moment(startDate)
        .add(agreementDuration, 'days')
        .endOf('day')
        .format('DD-MM-YYYY HH:MM'));
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

      const startDate = new Date();

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
});
