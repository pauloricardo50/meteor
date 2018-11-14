import { PDF_TYPES } from 'core/api/constants';

export const TEMPLATES = {
  [PDF_TYPES.ANONYMOUS_LOAN]: {
    name: 1,
    purchaseType: 1,
    residenceType: 1,
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
        propertyType: 1,
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
    user: {
      assignedEmployee: {
        name: 1,
        email: 1,
        phoneNumbers: [1],
      },
    },
  },
};
