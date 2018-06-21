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

export const editUser = new Method({
  name: 'editUser',
  params: {
    userId: String,
    object: Object,
  },
});
