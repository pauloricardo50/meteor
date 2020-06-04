import SimpleSchema from 'simpl-schema';

import { CUSTOM_AUTOFIELD_TYPES } from '../../../components/AutoForm2/autoFormConstants';
import {
  cacheField,
  createdAt,
  documentsField,
  updatedAt,
} from '../../helpers/sharedSchemas';
import {
  PROMOTION_OPTION_AGREEMENT_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
  PROMOTION_OPTION_DEPOSIT_STATUS,
  PROMOTION_OPTION_FULL_VERIFICATION_STATUS,
  PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS,
  PROMOTION_OPTION_STATUS,
} from '../promotionOptionConstants';

const dateAutoValue = (triggerField = 'status') =>
  function() {
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
  promotionLink: { type: Object, optional: true },
  'promotionLink._id': { type: String, optional: true },
  documents: documentsField,
  status: {
    type: String,
    allowedValues: Object.values(PROMOTION_OPTION_STATUS),
    defaultValue: PROMOTION_OPTION_STATUS.INTERESTED,
  },
  reservationAgreement: { type: Object, defaultValue: {} },
  'reservationAgreement.status': {
    type: String,
    allowedValues: Object.values(PROMOTION_OPTION_AGREEMENT_STATUS),
    defaultValue: PROMOTION_OPTION_AGREEMENT_STATUS.WAITING,
    uniforms: { placeholder: null },
  },
  'reservationAgreement.date': {
    type: Date,
    autoValue: dateAutoValue(),
    optional: true,
    uniforms: {
      withUtcOffset: true,
    },
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
  reservationDeposit: { type: Object, defaultValue: {} },
  'reservationDeposit.status': {
    type: String,
    allowedValues: Object.values(PROMOTION_OPTION_DEPOSIT_STATUS),
    defaultValue: PROMOTION_OPTION_DEPOSIT_STATUS.WAITING,
    uniforms: { placeholder: null },
  },
  'reservationDeposit.date': {
    type: Date,
    autoValue: dateAutoValue(),
    optional: true,
  },
  bank: { type: Object, defaultValue: {} },
  'bank.status': {
    type: String,
    allowedValues: Object.values(PROMOTION_OPTION_BANK_STATUS),
    defaultValue: PROMOTION_OPTION_BANK_STATUS.INCOMPLETE,
    uniforms: { placeholder: null },
  },
  'bank.date': {
    type: Date,
    autoValue: dateAutoValue(),
    optional: true,
  },
  simpleVerification: { type: Object, defaultValue: {} },
  'simpleVerification.status': {
    type: String,
    allowedValues: Object.values(PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS),
    defaultValue: PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.INCOMPLETE,
    uniforms: { placeholder: null },
  },
  'simpleVerification.date': {
    type: Date,
    autoValue: dateAutoValue(),
    optional: true,
  },
  fullVerification: { type: Object, defaultValue: {} },
  'fullVerification.status': {
    type: String,
    allowedValues: Object.values(PROMOTION_OPTION_FULL_VERIFICATION_STATUS),
    defaultValue: PROMOTION_OPTION_FULL_VERIFICATION_STATUS.INCOMPLETE,
    uniforms: { placeholder: null },
  },
  'fullVerification.date': {
    type: Date,
    autoValue: dateAutoValue(),
    optional: true,
  },
  loanCache: { type: Array, optional: true },
  'loanCache.$': cacheField,
  promotionLotCache: { type: Array, optional: true },
  'promotionLotCache.$': cacheField,
  priorityOrder: { type: SimpleSchema.Integer },
});

export default PromotionOptionSchema;
