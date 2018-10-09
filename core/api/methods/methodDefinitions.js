import { Match } from 'meteor/check';
import { Method } from './methods';

import rateLimit from '../../utils/rate-limit';

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
    borrower: Match.Optional(Object),
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

export const submitContactForm = new Method({
  name: 'submitContactForm',
  params: {
    name: String,
    email: String,
    phoneNumber: String,
    details: Match.Optional(String),
  },
});

rateLimit({
  methods: [submitContactForm.config.name],
  limit: 1,
  timeRange: 5000,
});

export const addUserToDoc = new Method({
  name: 'addUserToDoc',
  paramas: {
    docId: String,
    collection: String,
    options: Object,
    userId: String,
  },
});
