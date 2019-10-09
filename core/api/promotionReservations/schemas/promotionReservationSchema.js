import SimpleSchema from 'simpl-schema';

import {
  createdAt,
  updatedAt,
  documentsField,
} from '../../helpers/sharedSchemas';
import {
  DEPOSIT_STATUSES,
  AGREEMENT_STATUSES,
  PROMOTION_RESERVATION_STATUS,
  PROMOTION_RESERVATION_LENDER_STATUS,
  PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS,
} from '../promotionReservationConstants';

const PromotionReservationSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  startDate: Date,
  expirationDate: Date,
  status: {
    type: String,
    allowedValues: Object.values(PROMOTION_RESERVATION_STATUS),
    defaultValue: PROMOTION_RESERVATION_STATUS.ACTIVE,
  },
  deposit: { type: Object, defaultValue: {} },
  'deposit.status': {
    type: String,
    allowedValues: Object.values(DEPOSIT_STATUSES),
    defaultValue: DEPOSIT_STATUSES.UNPAID,
  },
  'deposit.date': { type: Date, optional: true },
  reservationAgreement: { type: Object, defaultValue: {} },
  'reservationAgreement.status': {
    type: String,
    allowedValues: Object.values(AGREEMENT_STATUSES),
    defaultValue: AGREEMENT_STATUSES.UNSIGNED,
  },
  'reservationAgreement.date': { type: Date, optional: true },
  lender: { type: Object, defaultValue: {} },
  'lender.status': {
    type: String,
    allowedValues: Object.values(PROMOTION_RESERVATION_LENDER_STATUS),
    defaultValue: PROMOTION_RESERVATION_LENDER_STATUS.NONE,
  },
  'lender.date': { type: Date, optional: true },
  mortgageCertification: { type: Object, defaultValue: {} },
  'mortgageCertification.status': {
    type: String,
    allowedValues: Object.values(PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS),
    defaultValue: PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.UNDETERMINED,
  },
  'mortgageCertification.date': { type: Date, optional: true },
  adminNote: { type: Object, defaultValue: {} },
  'adminNote.note': { type: String, optional: true },
  'adminNote.date': { type: Date, optional: true },
  promotionLink: { type: Object, optional: true },
  'promotionLink._id': { type: String, optional: true },
  promotionLotLink: { type: Object, optional: true },
  'promotionLotLink._id': { type: String, optional: true },
  promotionOptionLink: { type: Object, optional: true },
  'promotionOptionLink._id': { type: String, optional: true },
  loanLink: { type: Object, optional: true },
  'loanLink._id': { type: String, optional: true },
  documents: documentsField,
});

export default PromotionReservationSchema;
