import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';

import { createdAt, updatedAt, cacheField } from '../helpers/sharedSchemas';
import { ROLES, ACQUISITION_CHANNELS } from './userConstants';
import { autoValueSentenceCase } from '../helpers/sharedSchemaValues';

export const UserSchema = new SimpleSchema({
  username: {
    type: String,
    // For accounts-password, either emails or username is required, but not both. It is OK to make this
    // optional here because the accounts-password package does its own validation.
    // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
    optional: true,
  },
  isDisabled: {
    type: Boolean,
    defaultValue: false,
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
  createdAt,
  updatedAt,
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
    defaultValue: [ROLES.USER],
  },
  'roles.$': {
    type: String,
    allowedValues: Object.values(ROLES),
  },
  // In order to avoid an 'Exception in setInterval callback' from Meteor
  heartbeat: {
    type: Date,
    optional: true,
  },
  assignedEmployeeId: {
    type: String,
    optional: true,
  },
  firstName: {
    type: String,
    optional: true,
    autoValue: autoValueSentenceCase,
  },
  lastName: {
    type: String,
    optional: true,
    autoValue: autoValueSentenceCase,
  },
  phoneNumbers: {
    type: Array,
    optional: true,
  },
  'phoneNumbers.$': {
    type: String,
  },
  apiPublicKey: {
    type: Object,
    optional: true,
  },
  'apiPublicKey.publicKey': {
    type: String,
    optional: true,
  },
  'apiPublicKey.createdAt': { type: Date, optional: true },
  referredByUserLink: { type: String, optional: true },
  referredByOrganisationLink: { type: String, optional: true },
  assignedEmployeeCache: cacheField,
  acquisitionChannel: {
    type: String,
    optional: true,
    uniforms: {
      recommendedValues: Object.values(ACQUISITION_CHANNELS),
      withCustomOther: true,
    },
  },
  frontUserId: { type: String, optional: true },
  defaultBoardId: {
    type: String,
    optional: true,
    allowedValues: ['loans', 'insuranceRequests'],
    defaultValue: 'loans',
  },
});

Meteor.users.attachSchema(UserSchema);

const Users = Meteor.users;
export default Users;
