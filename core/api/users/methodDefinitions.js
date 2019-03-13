import { Match } from 'meteor/check';
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

export const generateApiToken = new Method({
  name: 'generateApiToken',
  params: {
    userId: String,
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

export const proInviteUser = new Method({
  name: 'proInviteUser',
  params: {
    user: Object,
    referOnly: Boolean,
    propertyId: Match.Maybe(String),
    promotionId: Match.Maybe(String),
    property: Match.Maybe(Object),
    proUserId: Match.Maybe(String),
  },
});

export const getUserByEmail = new Method({
  name: 'getUserByEmail',
  params: {
    email: String,
    roles: Match.Maybe(Array),
  },
});

export const setUserReferredBy = new Method({
  name: 'setUserReferredBy',
  params: {
    userId: String,
    proId: String,
  },
});
