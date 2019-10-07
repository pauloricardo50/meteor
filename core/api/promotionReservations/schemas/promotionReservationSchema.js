import SimpleSchema from 'simpl-schema';
import {
  DEPOSIT_STATUSES,
  AGREEMENT_STATUSES,
} from 'core/api/promotionOptions/promotionOptionConstants';
import {
  createdAt,
  updatedAt,
  documentsField,
} from '../../helpers/sharedSchemas';
import {
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
  deposit: Object,
  'deposit.status': {
    type: String,
    allowedValues: Object.values(DEPOSIT_STATUSES),
    defaultValue: DEPOSIT_STATUSES.UNPAID,
  },
  'deposit.date': { type: Date, optional: true },
  agreement: Object,
  'agreement.status': {
    type: String,
    allowedValues: Object.values(AGREEMENT_STATUSES),
    defaultValue: AGREEMENT_STATUSES.UNSIGNED,
  },
  'agreement.date': { type: Date, optional: true },
  lender: Object,
  'lender.status': {
    type: String,
    allowedValues: Object.values(PROMOTION_RESERVATION_LENDER_STATUS),
    defaultValue: PROMOTION_RESERVATION_LENDER_STATUS.NONE,
  },
  'lender.date': { type: Date, optional: true },
  mortgageCertification: Object,
  'mortgageCertification.status': {
    type: String,
    allowedValues: Object.values(PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS),
    defaultValue: PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.NONE,
  },
  'mortgageCertification.date': { type: Date, optional: true },
  adminNote: { type: Object, optional: true },
  'adminNote.note': String,
  'adminNote.date': Date,
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
