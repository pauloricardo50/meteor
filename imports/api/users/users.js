import 'babel-polyfill';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';

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

const BorrowerFilesSchema = new SimpleSchema({
  'taxes.$': FileSchema,
  identity: {
    // ID document(s), passport, id, etc.
    type: Array,
    optional: true,
    maxCount: 100,
  },
  'identity.$': FileSchema,
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
  taxes: {
    // Declaration d'impots
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

const BorrowerSchema = new SimpleSchema({
  gender: {
    type: String,
    optional: true,
  },
  age: {
    type: Number,
    optional: true,
    min: 18,
    max: 99,
  },
  firstName: {
    type: String,
    optional: true,
  },
  lastName: {
    type: String,
    optional: true,
  },
  address1: {
    type: String,
    optional: true,
  },
  address2: {
    type: String,
    optional: true,
  },
  zipCode: {
    type: Number,
    optional: true,
    min: 1000,
    max: 9999,
  },
  city: {
    type: String,
    optional: true,
  },
  citizenships: {
    type: String,
    optional: true,
  },
  residencyPermit: {
    type: String,
    optional: true,
  },
  birthDate: {
    type: String,
    optional: true,
    regEx: '/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/', // YYYY-MM-DD
  },
  birthPlace: {
    type: String,
    optional: true,
  },
  civilStatus: {
    // 'married', 'pacsed', 'single', 'divorced'
    type: String,
    defaultValue: 'single',
  },
  company: {
    type: String,
    optional: true,
  },
  grossIncome: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  bonusExists: {
    type: Boolean,
    defaultValue: false,
  },
  bonus: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  otherIncome: {
    type: Array,
    optional: true,
  },
  'otherIncome.$.value': {
    type: Number,
    min: 0,
    max: 100000000,
  },
  'otherIncome.$.description': String,
  personalBank: {
    type: String,
    optional: true,
  },
  corporateBankExists: {
    type: Boolean,
    defaultValue: false,
  },
  corporateBank: {
    type: String,
    optional: true,
  },
  currentRentExists: {
    type: Boolean,
    defaultValue: false,
  },
  currentRent: {
    // Monthly
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  realEstateFortune: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  cashAndSecurities: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  existingDebt: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  otherFortune: {
    type: Array,
    optional: true,
  },
  'otherFortune.$.amount': {
    type: Number,
    min: 0,
    max: 100000000,
  },
  'otherFortune.$.description': String,
  insuranceLpp: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  insurance3A: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  insurance3B: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  insurancePureRisk: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  files: {
    type: BorrowerFilesSchema,
    defaultValue: {},
  },
});

const UserSchema = new SimpleSchema({
  username: {
    type: String,
    // For accounts-password, either emails or username is required, but not both. It is OK to make this
    // optional here because the accounts-password package does its own validation.
    // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
    optional: true,
  },
  emails: {
    type: Array,
    // For accounts-password, either emails or username is required, but not both. It is OK to make this
    // optional here because the accounts-password package does its own validation.
    // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
    optional: true,
  },
  'emails.$': {
    type: Object,
  },
  'emails.$.address': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  'emails.$.verified': {
    type: Boolean,
  },
  createdAt: {
    type: Date,
  },
  borrowers: {
    type: Array,
  },
  'borrowers.$': {
    type: BorrowerSchema,
  },
  // Make sure this services field is in your schema if you're using any of the accounts packages
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  // Add `roles` to your schema if you use the meteor-roles package.
  // Option 1: Object type
  // If you specify that type as Object, you must also specify the
  // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
  // Example:
  // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
  // You can't mix and match adding with and without a group since
  // you will fail validation in some cases.
  // roles: {
  //   type: Object,
  //   optional: true,
  //   blackbox: true,
  // },
  // Option 2: [String] type
  // If you are sure you will never need to use role groups, then
  // you can specify [String] as the type
  roles: {
    type: Array,
    optional: true,
  },
  'roles.$': {
    type: String,
  },
  // In order to avoid an 'Exception in setInterval callback' from Meteor
  heartbeat: {
    type: Date,
    optional: true,
  },
});

Meteor.users.attachSchema(UserSchema);
