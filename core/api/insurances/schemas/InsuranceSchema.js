import SimpleSchema from 'simpl-schema';

import {
  additionalDocuments,
  adminNotesSchema,
  cacheField,
  createdAt,
  dateField,
  decimalMoneyField,
  documentsField,
  updatedAt,
} from '../../helpers/sharedSchemas';
import {
  INSURANCE_PREMIUM_FREQUENCY,
  INSURANCE_STATUS,
} from '../insuranceConstants';

const InsuranceSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  name: { type: String, unique: true, regEx: /^\d{2}-\d{4}-[A-Z]\d{2}/ },
  status: {
    type: String,
    allowedValues: Object.values(INSURANCE_STATUS),
    defaultValue: INSURANCE_STATUS.SUGGESTED,
  },
  borrowerLink: { type: Object, optional: true },
  'borrowerLink._id': String,
  organisationLink: { type: Object, optional: true },
  'organisationLink._id': String,
  premium: decimalMoneyField,
  premiumFrequency: {
    type: String,
    allowedValues: Object.values(INSURANCE_PREMIUM_FREQUENCY),
    defaultValue: INSURANCE_PREMIUM_FREQUENCY.MONTHLY,
    uniforms: { checkboxes: true },
  },
  startDate: {
    ...dateField,
    optional: false,
    uniforms: { ...dateField.uniforms, label: 'Début du contrat' },
  },
  endDate: {
    ...dateField,
    optional: false,
    uniforms: { ...dateField.uniforms, label: 'Fin du contrat' },
  },
  insuranceProductLink: { type: Object, optional: true },
  'insuranceProductLink._id': String,
  revenueLinks: { type: Array, optional: true },
  'revenueLinks.$': Object,
  'revenueLinks.$._id': String,
  tasksCache: { type: Array, optional: true },
  'tasksCache.$': cacheField,
  ...adminNotesSchema,
  proNote: {
    type: new SimpleSchema(adminNotesSchema).getObjectSchema('adminNotes.$'),
    optional: true,
  },
  ...additionalDocuments([]),
  documents: documentsField,
});

export default InsuranceSchema;
