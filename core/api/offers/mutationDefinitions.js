export const OFFER_INSERT = {
  name: 'OFFER_INSERT',
  params: {
    offer: { type: Object },
    userId: { type: String, optional: true },
    loanId: { type: String },
  },
};

export const OFFER_INSERT_ADMIN = {
  name: 'OFFER_INSERT_ADMIN',
  params: {
    offer: { type: Object },
    loan: { type: Object },
  },
};

export const OFFER_UPDATE = {
  name: 'OFFER_UPDATE',
  params: {
    offerId: { type: String },
    offer: { type: Object },
  },
};

export const OFFER_DELETE = {
  name: 'OFFER_DELETE',
  params: {
    offerId: { type: String },
  },
};
