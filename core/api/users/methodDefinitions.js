import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import { Method } from '../methods/methods';

export const doesUserExist = new Method({
  name: 'doesUserExist',
  params: {
    email: String,
  },
});

export const sendVerificationLink = new Method({
  name: 'sendVerificationLink',
  params: {
    userId: Match.Optional(String),
  },
});

export const assignAdminToUser = new Method({
  name: 'assignAdminToUser',
  params: {
    userId: String,
    adminId: String,
  },
});

export const assignAdminToNewUser = new Method({
  name: 'assignAdminToNewUser',
  params: {
    userId: String,
    adminId: String,
  },
});

export const setRole = new Method({
  name: 'setRole',
  params: {
    userId: String,
    role: String,
  },
});

export const adminCreateUser = new Method({
  name: 'adminCreateUser',
  params: {
    options: Object,
    role: String,
  },
});

export const updateUser = new Method({
  name: 'updateUser',
  params: {
    userId: String,
    object: Object,
  },
});

export const getUserByPasswordResetToken = new Method({
  name: 'getUserByPasswordResetToken',
  params: {
    token: String,
  },
});

export const testCreateUser = new Method({
  name: 'testCreateUser',
  params: {
    user: Object,
  },
});

export const removeUser = new Method({
  name: 'removeUser',
  params: {
    userId: String,
  },
});

export const sendEnrollmentEmail = new Method({
  name: 'sendEnrollmentEmail',
  params: {
    userId: String,
  },
});

export const changeEmail = new Method({
  name: 'changeEmail',
  params: {
    userId: String,
    newEmail: String,
  },
});

export const userUpdateOrganisations = new Method({
  name: 'userUpdateOrganisations',
  params: {
    userId: String,
    newOrganisations: Array,
  },
});

export const testUserAccount = new Method({
  name: 'testUserAccount',
  params: {
    email: String,
    password: String,
    role: String,
  },
});

export const generateApiKeyPair = new Method({
  name: 'generateApiKeyPair',
  params: {
    userId: String,
  },
});

export const proInviteUser = new Method({
  name: 'proInviteUser',
  params: {
    user: Object,
    propertyIds: Match.Maybe(Match.Where((x) => {
      check(x, [String]);
      if (x && x.length === 0) {
        throw new Meteor.Error('properties cannot be empty');
      }

      return true;
    })),
    promotionIds: Match.Maybe(Match.Where((x) => {
      check(x, [String]);
      if (x && x.length === 0) {
        throw new Meteor.Error('promotionIds cannot be empty');
      }

      return true;
    })),
    properties: Match.Maybe(Array),
    shareSolvency: Match.OneOf(Boolean, undefined),
  },
});

export const getUserByEmail = new Method({
  name: 'getUserByEmail',
  params: {
    email: String,
  },
});

export const setUserReferredBy = new Method({
  name: 'setUserReferredBy',
  params: {
    userId: String,
    proId: String,
  },
});

export const setUserReferredByOrganisation = new Method({
  name: 'setUserReferredByOrganisation',
  params: { userId: String, organisationId: String },
});

export const proInviteUserToOrganisation = new Method({
  name: 'proInviteUserToOrganisation',
  params: { user: Object, organisationId: String, title: String },
});

export const proSetShareCustomers = new Method({
  name: 'proSetShareCustomers',
  params: { userId: String, organisationId: String, shareCustomers: Boolean },
});

export const anonymousCreateUser = new Method({
  name: 'anonymousCreateUser',
  params: {
    loanId: Match.Maybe(String),
    user: {
      firstName: String,
      lastName: String,
      email: String,
      phoneNumbers: [String],
    },
  },
});
