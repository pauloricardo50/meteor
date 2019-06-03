import { Match } from 'meteor/check';
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
  rateLimit: {
    global: {
      limit: 1,
      timeRange: 5000,
    },
  },
});

export const addUserToDoc = new Method({
  name: 'addUserToDoc',
  params: {
    docId: String,
    collection: String,
    options: Object,
    userId: String,
  },
});

export const throwDevError = new Method({
  name: 'throwDevError',
  params: {
    promise: Match.Maybe(Boolean),
    promiseNoReturn: Match.Maybe(Boolean),
  },
});

export const setAdditionalDoc = new Method({
  name: 'setAdditionalDoc',
  params: {
    collection: String,
    id: String,
    additionalDocId: String,
    requiredByAdmin: Boolean,
    label: Match.Optional(String),
    category: Match.Optional(String),
  },
});

export const removeAdditionalDoc = new Method({
  name: 'removeAdditionalDoc',
  params: {
    collection: String,
    id: String,
    additionalDocId: String,
  },
});

export const migrateToLatest = new Method({
  name: 'migrateToLatest',
});

export const updateDocument = new Method({
  name: 'updateDocument',
  params: {
    collection: String,
    docId: String,
    object: Object,
  },
});

export const updateDocumentUnset = new Method({
  name: 'updateDocumentUnset',
  params: {
    collection: String,
    docId: String,
    object: Object,
  },
});

export const generateScenario = new Method({
  name: 'generateScenario',
  params: {
    scenario: Object,
  },
});
