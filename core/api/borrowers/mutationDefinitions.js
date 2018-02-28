export const BORROWER_INSERT = {
  name: 'BORROWER_INSERT',
  params: {
    borrower: { type: Object },
    userId: { type: String, optional: true },
  },
};

export const BORROWER_UPDATE = {
  name: 'BORROWER_UPDATE',
  params: {
    borrowerId: { type: String },
    object: { type: Object },
  },
};

export const BORROWER_DELETE = {
  name: 'BORROWER_DELETE',
  params: {
    borrowerId: { type: String },
  },
};
