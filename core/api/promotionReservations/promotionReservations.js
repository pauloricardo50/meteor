import SimpleSchema from 'simpl-schema';

import { createCollection } from '../helpers/collectionHelpers';
import { createdAt, updatedAt, documentsField } from '../helpers/sharedSchemas';
import {
  PROMOTION_RESERVATIONS_COLLECTION,
  DEPOSIT_STATUSES,
  AGREEMENT_STATUSES,
  PROMOTION_RESERVATION_STATUS,
  PROMOTION_RESERVATION_LENDER_STATUS,
  PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS,
} from './promotionReservationConstants';

const dateAutoValue = (triggerField = 'status') =>
  function () {
    if (this.isInsert && !this.value) {
      return new Date();
    }

    if (this.isUpdate && !this.value) {
      const value = this.siblingField(triggerField);
      if (value.isSet) {
        return new Date();
      }
    }
  };

export const PromotionReservationSchema = new SimpleSchema({
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
    uniforms: { placeholder: null },
  },
  'deposit.date': { type: Date, autoValue: dateAutoValue() },
  reservationAgreement: { type: Object, defaultValue: {} },
  'reservationAgreement.status': {
    type: String,
    allowedValues: Object.values(AGREEMENT_STATUSES),
    defaultValue: AGREEMENT_STATUSES.UNSIGNED,
    uniforms: { placeholder: null },
  },
  'reservationAgreement.date': { type: Date, autoValue: dateAutoValue() },
  lender: { type: Object, defaultValue: {} },
  'lender.status': {
    type: String,
    allowedValues: Object.values(PROMOTION_RESERVATION_LENDER_STATUS),
    defaultValue: PROMOTION_RESERVATION_LENDER_STATUS.NONE,
    uniforms: { placeholder: null },
  },
  'lender.date': { type: Date, autoValue: dateAutoValue() },
  mortgageCertification: { type: Object, defaultValue: {} },
  'mortgageCertification.status': {
    type: String,
    allowedValues: Object.values(PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS),
    defaultValue:
      PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.UNDETERMINED,
    uniforms: { placeholder: null },
  },
  'mortgageCertification.date': { type: Date, autoValue: dateAutoValue() },
  adminNote: { type: Object, defaultValue: {} },
  'adminNote.note': { type: String, defaultValue: '' },
  'adminNote.date': {
    type: Date,
    autoValue: dateAutoValue(),
  },
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

const PromotionReservations = createCollection(
  PROMOTION_RESERVATIONS_COLLECTION,
  PromotionReservationSchema,
);

export default PromotionReservations;
