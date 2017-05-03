import 'babel-polyfill';
import SimpleSchema from 'simpl-schema';

const FileSchema = new SimpleSchema({
  name: {
    type: String,
  },
  size: Number,
  type: String,
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
  key: String,
  fileCount: Number,
});

export const GeneralFilesSchema = new SimpleSchema({
  buyersContract: {
    type: Array,
    optional: true,
    maxCount: 100,
  },
  'buyersContract.$': FileSchema,
});

export const BorrowerFilesSchema = new SimpleSchema({
  taxes: {
    // Declaration d'impots
    type: Array,
    optional: true,
    maxCount: 100,
  },
  'taxes.$': FileSchema,
  identity: {
    // ID document(s), passport, id, etc.
    type: Array,
    optional: true,
    maxCount: 100,
  },
  'identity.$': FileSchema,
  salaryChange: {
    // Si changement de salaire depuis la déclaration d'impots
    type: Array,
    optional: true,
    maxCount: 100,
  },
  'salaryChange.$': FileSchema,
  salaryCertificate: {
    // Yearly salary certificate of last year
    type: Array,
    optional: true,
    maxCount: 100,
  },
  'salaryCertificate.$': FileSchema,
  lastSalaries: {
    // Fiches de salaire, last 3 are required
    type: Array,
    optional: true,
    maxCount: 100,
  },
  'lastSalaries.$': FileSchema,
  debtCollectionExtract: {
    // Extrait de l'office des poursuites
    type: Array,
    optional: true,
    maxCount: 100,
  },
  'debtCollectionExtract.$': FileSchema,
  pensionFundCertificate: {
    // Certificat de la caisse de pension
    type: Array,
    optional: true,
    maxCount: 100,
  },
  'pensionFundCertificate.$': FileSchema,
  bankStatements: {
    type: Array,
    optional: true,
    maxCount: 100,
  },
  'bankStatements.$': FileSchema,
  insurance3AStatement: {
    type: Array,
    optional: true,
    maxCount: 100,
  },
  'insurance3AStatement.$': FileSchema,
  policy3A: {
    type: Array,
    optional: true,
    maxCount: 100,
  },
  'policy3A.$': FileSchema,
  policy3B: {
    type: Array,
    optional: true,
    maxCount: 100,
  },
  'policy3B.$': FileSchema,
});

export const PropertyFilesSchema = new SimpleSchema({
  plan: {
    type: Array,
    optional: true,
    maxCount: 100,
  },
  'plan.$': FileSchema,
});
