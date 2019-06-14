// @flow
import { Match } from 'meteor/check';
import { Method } from '../methods/methods';

export const loanInsert = new Method({
  name: 'loanInsert',
  params: {
    loan: Object,
    userId: Match.Optional(String),
  },
});

export const loanUpdate = new Method({
  name: 'loanUpdate',
  params: {
    loanId: String,
    object: Object,
  },
});

export const loanDelete = new Method({
  name: 'loanDelete',
  params: {
    loanId: String,
  },
});

export const requestLoanVerification = new Method({
  name: 'requestLoanVerification',
  params: {
    loanId: String,
  },
});

export const confirmClosing = new Method({
  name: 'confirmClosing',
  params: {
    loanId: String,
    object: Object,
  },
});

export const pushLoanValue = new Method({
  name: 'pushLoanValue',
  params: {
    loanId: String,
    object: Object,
  },
});

export const popLoanValue = new Method({
  name: 'popLoanValue',
  params: {
    loanId: String,
    object: Object,
  },
});

export const adminLoanInsert = new Method({
  name: 'adminLoanInsert',
  params: {
    userId: Match.Optional(String),
  },
});

export const userLoanInsert = new Method({
  name: 'userLoanInsert',
  params: {
    proPropertyId: Match.Maybe(String),
    test: Match.Optional(Boolean),
  },
});

export const addNewStructure = new Method({
  name: 'addNewStructure',
  params: {
    loanId: String,
  },
});

export const removeStructure = new Method({
  name: 'removeStructure',
  params: {
    loanId: String,
    structureId: String,
  },
});

export const updateStructure = new Method({
  name: 'updateStructure',
  params: {
    loanId: String,
    structureId: String,
    structure: Object,
  },
});

export const selectStructure = new Method({
  name: 'selectStructure',
  params: {
    loanId: String,
    structureId: String,
  },
});

export const duplicateStructure = new Method({
  name: 'duplicateStructure',
  params: {
    loanId: String,
    structureId: String,
  },
});

export const assignLoanToUser = new Method({
  name: 'assignLoanToUser',
  params: {
    loanId: String,
    userId: Match.OneOf(String, null),
  },
});

export const switchBorrower = new Method({
  name: 'switchBorrower',
  params: {
    loanId: String,
    borrowerId: String,
    oldBorrowerId: String,
  },
});

export const sendNegativeFeedbackToAllLenders = new Method({
  name: 'sendNegativeFeedbackToAllLenders',
  params: { loanId: String },
});

export const loanUpdatePromotionInvitedBy = new Method({
  name: 'loanUpdatePromotionInvitedBy',
  params: { loanId: String, promotionId: String, invitedBy: String },
});

export const reuseProperty = new Method({
  name: 'reuseProperty',
  params: { loanId: String, propertyId: String },
});

export const setMaxPropertyValueWithoutBorrowRatio = new Method({
  name: 'setMaxPropertyValueWithoutBorrowRatio',
  params: { loanId: String, canton: String },
});

export const addNewMaxStructure = new Method({
  name: 'addNewMaxStructure',
  params: {
    loanId: String,
    residenceType: Match.Maybe(String),
    canton: String,
  },
});

export const setLoanStep = new Method({
  name: 'setLoanStep',
  params: { loanId: String, nextStep: String },
});

export const loanShareSolvency = new Method({
  name: 'loanShareSolvency',
  params: { loanId: String, shareSolvency: Boolean },
});

export const anonymousLoanInsert = new Method({
  name: 'anonymousLoanInsert',
  params: {
    trackingId: String,
    proPropertyId: Match.Maybe(String),
    referralId: Match.Maybe(String),
  },
});

export const loanInsertBorrowers = new Method({
  name: 'loanInsertBorrowers',
  params: {
    loanId: String,
    amount: Number,
  },
});
