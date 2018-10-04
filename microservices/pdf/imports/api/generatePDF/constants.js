export const PDF_TYPES = {
  LOAN_BANK: 'LOAN_BANK',
};

export const PDF_ERRORS = {
  WRONG_TYPE: 'WRONG_TYPE',
};

export const LOAN_BANK_TEMPLATE = {
  name: 1,
  general: { purchaseType: 1, residenceType: 1 },
  borrowers: [
    {
      gender: 1,
      zipCode: 1,
      city: 1,
    },
  ],
  structure: {
    ownFunds: [1],
    property: {
      address1: 1,
      zipCode: 1,
      city: 1,
      valuation: {
        value: 1,
        max: 1,
        microlocation: { grade: 1 },
      },
    },
  },
  user: { assignedEmployee: 1 },
};
