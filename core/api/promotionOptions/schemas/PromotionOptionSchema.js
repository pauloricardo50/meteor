import SimpleSchema from 'simpl-schema';
import { documentsField } from 'core/api/helpers/sharedSchemas';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import { createdAt, updatedAt } from '../../helpers/sharedSchemas';
import {
  PROMOTION_RESERVATION_STATUS,
  DEPOSIT_STATUSES,
  AGREEMENT_STATUSES,
  PROMOTION_RESERVATION_BANK_STATUS,
  PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS,
} from '../promotionOptionConstants';

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

const reservationSchema = {
  reservation: { type: Object, optional: true, defaultValue: {} },
  'reservation.startDate': {
    type: Date,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
  },
  'reservation.expirationDate': {
    type: Date,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
  },
  'reservation.status': {
    type: String,
    allowedValues: Object.values(PROMOTION_RESERVATION_STATUS),
    defaultValue: PROMOTION_RESERVATION_STATUS.ACTIVE,
  },
  'reservation.deposit': { type: Object, defaultValue: {} },
  'reservation.deposit.status': {
    type: String,
    allowedValues: Object.values(DEPOSIT_STATUSES),
    defaultValue: DEPOSIT_STATUSES.UNPAID,
    uniforms: { placeholder: null },
  },
  'reservation.deposit.date': { type: Date, autoValue: dateAutoValue() },
  'reservation.reservationAgreement': { type: Object, defaultValue: {} },
  'reservation.reservationAgreement.status': {
    type: String,
    allowedValues: Object.values(AGREEMENT_STATUSES),
    defaultValue: AGREEMENT_STATUSES.UNSIGNED,
    uniforms: { placeholder: null },
  },
  'reservation.reservationAgreement.date': {
    type: Date,
    autoValue: dateAutoValue(),
  },
  'reservation.bank': { type: Object, defaultValue: {} },
  'reservation.bank.status': {
    type: String,
    allowedValues: Object.values(PROMOTION_RESERVATION_BANK_STATUS),
    defaultValue: PROMOTION_RESERVATION_BANK_STATUS.NONE,
    uniforms: { placeholder: null },
  },
  'reservation.bank.date': { type: Date, autoValue: dateAutoValue() },
  'reservation.mortgageCertification': { type: Object, defaultValue: {} },
  'reservation.mortgageCertification.status': {
    type: String,
    allowedValues: Object.values(PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS),
    defaultValue:
      PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.UNDETERMINED,
    uniforms: { placeholder: null },
  },
  'reservation.mortgageCertification.date': {
    type: Date,
    autoValue: dateAutoValue(),
  },
  'reservation.adminNote': { type: Object, defaultValue: {} },
  'reservation.adminNote.note': { type: String, defaultValue: '' },
  'reservation.adminNote.date': {
    type: Date,
    autoValue: dateAutoValue('note'),
  },
};

const PromotionOptionSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  promotionLotLinks: { type: Array, defaultValue: [] },
  'promotionLotLinks.$': Object,
  'promotionLotLinks.$._id': { type: String, optional: true },
  lotLinks: { type: Array, optional: true },
  'lotLinks.$': Object,
  'lotLinks.$._id': { type: String, optional: true },
  custom: {
    type: String,
    optional: true,
  },
  promotionLink: { type: Object, optional: true },
  'promotionLink._id': { type: String, optional: true },
  proNote: { type: String, optional: true },
  documents: documentsField,
  ...reservationSchema,
});

export default PromotionOptionSchema;
