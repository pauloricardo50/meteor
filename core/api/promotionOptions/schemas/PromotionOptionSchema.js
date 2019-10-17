import SimpleSchema from 'simpl-schema';
import { documentsField } from 'core/api/helpers/sharedSchemas';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import { createdAt, updatedAt } from '../../helpers/sharedSchemas';
import {
  DEPOSIT_STATUSES,
  AGREEMENT_STATUSES,
  PROMOTION_OPTION_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
  PROMOTION_OPTION_MORTGAGE_CERTIFICATION_STATUS,
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
  documents: documentsField,
  adminNote: { type: Object, defaultValue: {} },
  'adminNote.note': { type: String, defaultValue: '' },
  'adminNote.date': {
    type: Date,
    autoValue: dateAutoValue('note'),
  },
  status: {
    type: String,
    allowedValues: Object.values(PROMOTION_OPTION_STATUS),
    defaultValue: PROMOTION_OPTION_STATUS.INTERESTED,
  },
  reservationAgreement: { type: Object, defaultValue: {} },
  'reservationAgreement.status': {
    type: String,
    allowedValues: Object.values(AGREEMENT_STATUSES),
    defaultValue: AGREEMENT_STATUSES.UNSIGNED,
    uniforms: { placeholder: null },
  },
  'reservationAgreement.date': {
    type: Date,
    autoValue: dateAutoValue(),
  },
  'reservationAgreement.startDate': {
    type: Date,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
    optional: true,
  },
  'reservationAgreement.expirationDate': {
    type: Date,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
    optional: true,
  },
  deposit: { type: Object, defaultValue: {} },
  'deposit.status': {
    type: String,
    allowedValues: Object.values(DEPOSIT_STATUSES),
    defaultValue: DEPOSIT_STATUSES.UNPAID,
    uniforms: { placeholder: null },
  },
  'deposit.date': { type: Date, autoValue: dateAutoValue() },
  bank: { type: Object, defaultValue: {} },
  'bank.status': {
    type: String,
    allowedValues: Object.values(PROMOTION_OPTION_BANK_STATUS),
    defaultValue: PROMOTION_OPTION_BANK_STATUS.NONE,
    uniforms: { placeholder: null },
  },
  'bank.date': { type: Date, autoValue: dateAutoValue() },
  mortgageCertification: { type: Object, defaultValue: {} },
  'mortgageCertification.status': {
    type: String,
    allowedValues: Object.values(PROMOTION_OPTION_MORTGAGE_CERTIFICATION_STATUS),
    defaultValue: PROMOTION_OPTION_MORTGAGE_CERTIFICATION_STATUS.UNDETERMINED,
    uniforms: { placeholder: null },
  },
  'mortgageCertification.date': {
    type: Date,
    autoValue: dateAutoValue(),
  },
});

export default PromotionOptionSchema;
