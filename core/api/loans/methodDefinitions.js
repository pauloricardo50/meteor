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
