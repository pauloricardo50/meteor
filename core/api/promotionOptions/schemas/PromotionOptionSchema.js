import SimpleSchema from 'simpl-schema';
import { documentsField } from 'core/api/helpers/sharedSchemas';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import { createdAt, updatedAt } from '../../helpers/sharedSchemas';
import {
  DEPOSIT_STATUS,
  AGREEMENT_STATUS,
  PROMOTION_OPTION_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
  PROMOTION_OPTION_MORTGAGE_CERTIFICATION_STATUS,
  PROMOTION_OPTION_USER_MORTGAGE_CERTIFICATION_STATUS,
  PROMOTION_OPTION_MORTGAGE_CERTIFICATION_OF_PRINCIPLE_STATUS,
  PROMOTION_OPTION_EPOTEK_MORTGAGE_CERTIFICATION_STATUS,
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
  promotionLink: { type: Object, optional: true },
  'promotionLink._id': { type: String, optional: true },
  documents: documentsField,
  adminNote: { type: Object, defaultValue: {} },
  'adminNote.note': { type: String, defaultValue: '', optional: true },
  'adminNote.date': {
    type: Date,
    autoValue: dateAutoValue('note'),
    optional: true,
  },
  status: {
    type: String,
    allowedValues: Object.values(PROMOTION_OPTION_STATUS),
    defaultValue: PROMOTION_OPTION_STATUS.INTERESTED,
  },
  reservationAgreement: { type: Object, defaultValue: {} },
  'reservationAgreement.status': {
    type: String,
    allowedValues: Object.values(AGREEMENT_STATUS),
    defaultValue: AGREEMENT_STATUS.WAITING,
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
  deposit: { type: Object, defaultValue: {} },
  'deposit.status': {
    type: String,
    allowedValues: Object.values(DEPOSIT_STATUS),
    defaultValue: DEPOSIT_STATUS.UNPAID,
    uniforms: { placeholder: null },
  },
  'deposit.date': {
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
  userMortgageCertification: { type: Object, defaultValue: {} },
  'userMortgageCertification.status': {
    type: String,
    allowedValues: Object.values(PROMOTION_OPTION_USER_MORTGAGE_CERTIFICATION_STATUS),
    defaultValue:
      PROMOTION_OPTION_USER_MORTGAGE_CERTIFICATION_STATUS.INCOMPLETE,
    uniforms: { placeholder: null },
  },
  'userMortgageCertification.date': {
    type: Date,
    autoValue: dateAutoValue(),
    optional: true,
  },
  mortgageCertificationOfPrinciple: { type: Object, defaultValue: {} },
  'mortgageCertificationOfPrinciple.status': {
    type: String,
    allowedValues: Object.values(PROMOTION_OPTION_MORTGAGE_CERTIFICATION_OF_PRINCIPLE_STATUS),
    defaultValue:
      PROMOTION_OPTION_MORTGAGE_CERTIFICATION_OF_PRINCIPLE_STATUS.INCOMPLETE,
    uniforms: { placeholder: null },
  },
  'mortgageCertificationOfPrinciple.date': {
    type: Date,
    autoValue: dateAutoValue(),
    optional: true,
  },
  ePotekMortgageCertification: { type: Object, defaultValue: {} },
  'ePotekMortgageCertification.status': {
    type: String,
    allowedValues: Object.values(PROMOTION_OPTION_EPOTEK_MORTGAGE_CERTIFICATION_STATUS),
    defaultValue:
      PROMOTION_OPTION_EPOTEK_MORTGAGE_CERTIFICATION_STATUS.INCOMPLETE,
    uniforms: { placeholder: null },
  },
  'ePotekMortgageCertification.date': {
    type: Date,
    autoValue: dateAutoValue(),
    optional: true,
  },
});

export default PromotionOptionSchema;
