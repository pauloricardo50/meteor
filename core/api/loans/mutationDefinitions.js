export const LOAN_INSERT = {
  name: 'LOAN_INSERT',
  params: {
    object: { type: Object },
    userId: { type: String, optional: true },
  },
};

export const LOAN_UPDATE = {
  name: 'LOAN_UPDATE',
  params: {
    loanId: { type: String },
    object: { type: Object },
  },
};

export const LOAN_DELETE = {
  name: 'LOAN_DELETE',
  params: {
    loanId: { type: String },
  },
};

export const INCREMENT_LOAN_STEP = {
  name: 'INCREMENT_LOAN_STEP',
  params: {
    loanId: { type: String },
  },
};

export const REQUEST_LOAN_VERIFICATION = {
  name: 'REQUEST_LOAN_VERIFICATION',
  params: {
    loanId: { type: String },
  },
};

export const START_AUCTION = {
  name: 'START_AUCTION',
  params: {
    loanId: { type: String },
  },
};

export const END_AUCTION = {
  name: 'END_AUCTION',
  params: {
    loanId: { type: String },
  },
};

export const CANCEL_AUCTION = {
  name: 'CANCEL_AUCTION',
  params: {
    loanId: { type: String },
  },
};

export const CONFIRM_CLOSING = {
  name: 'CONFIRM_CLOSING',
  params: {
    loanId: { type: String },
    object: { type: Object },
  },
};
