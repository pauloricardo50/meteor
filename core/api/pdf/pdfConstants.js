export const PDF_TYPES = {
  LOAN: 'LOAN',
};

export const TEMPLATES = {
  [PDF_TYPES.LOAN]: {
    name: 1,
    purchaseType: 1,
    residenceType: 1,
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

export const A4_HEIGHT = 295;
export const MARGIN_TOP = 10;
export const MARGIN_BOTTOM = 15;
export const MARGIN_SIDE = 15;
export const WIGGLE_ROOM = 2; // Required to make things fit on one page
export const CONTENT_HEIGHT =
  A4_HEIGHT - MARGIN_BOTTOM - MARGIN_TOP - WIGGLE_ROOM;
export const BORDER_BLUE = '#213875';
export const BORDER_GREY = '#DEE2E6';
