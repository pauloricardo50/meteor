export const OFFER_INSERT = {
  name: 'OFFER_INSERT',
  params: {
    object: { type: Object },
    userId: { type: String, optional: true },
    loanId: { type: String },
  },
};

export const OFFER_UPDATE = {
  name: 'OFFER_UPDATE',
  params: {
    offerId: { type: String },
    object: { type: Object },
  },
};

export const OFFER_DELETE = {
  name: 'OFFER_DELETE',
  params: {
    offerId: { type: String },
  },
};
