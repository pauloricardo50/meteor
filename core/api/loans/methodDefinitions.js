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

export const incrementLoanStep = new Method({
  name: 'incrementLoanStep',
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

export const startAuction = new Method({
  name: 'startAuction',
  params: {
    loanId: String,
  },
});

export const endAuction = new Method({
  name: 'endAuction',
  params: {
    loanId: String,
  },
});

export const cancelAuction = new Method({
  name: 'cancelAuction',
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

export const loanChangeAdminNote = new Method({
  name: 'loanChangeAdminNote',
  params: {
    loanId: String,
    adminNote: String,
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

export const disableUserForms = new Method({
  name: 'disableUserForms',
  params: {
    loanId: String,
  },
});

export const enableUserForms = new Method({
  name: 'enableUserForms',
  params: {
    loanId: String,
  },
});

export const adminLoanInsert = new Method({
  name: 'adminLoanInsert',
  params: {
    userId: String,
  },
});

export const addStructure = new Method({
  name: 'addStructure',
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
