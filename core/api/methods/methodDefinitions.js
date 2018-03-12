import { Method } from './methods';

export const getMixpanelAuthorization = new Method({
  name: 'getMixpanelAuthorization',
});

export const getServerTime = new Method({
  name: 'getServerTime',
});

export const downloadPDF = new Method({
  name: 'downloadPDF',
  params: {
    loanId: String,
    type: String,
  },
});

export const addBorrower = new Method({
  name: 'addBorrower',
  params: {
    loanId: String,
  },
});

export const setUserToLoan = new Method({
  name: 'setUserToLoan',
  params: {
    loanId: String,
  },
});

export const removeBorrower = new Method({
  name: 'removeBorrower',
  params: {
    loanId: String,
    borrowerId: String,
  },
});

export const createUserAndLoan = new Method({
  name: 'createUserAndLoan',
  params: {
    email: String,
    formState: Object,
  },
});
