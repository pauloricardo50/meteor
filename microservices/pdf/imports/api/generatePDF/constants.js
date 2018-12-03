import { PDF_TYPES } from 'core/api/constants';

export const TEMPLATES = {
  [PDF_TYPES.LOAN]: {
    name: 1,
    general: { purchaseType: 1, residenceType: 1 },
    borrowers: [
      {
        gender: 1,
        zipCode: { $or: 'sameAddress' },
        city: { $or: 'sameAddress' },
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

export const A4_HEIGHT = 297;
export const MARGIN_TOP = 20;
export const MARGIN_BOTTOM = 20;
export const MARGIN_SIDE = 15;
export const WIGGLE_ROOM = 2; // Required to make things fit on one page
export const CONTENT_HEIGHT = A4_HEIGHT - MARGIN_BOTTOM - MARGIN_TOP - WIGGLE_ROOM;
