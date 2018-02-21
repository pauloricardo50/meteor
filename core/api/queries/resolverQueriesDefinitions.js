// This is prbably a query
export const DOES_USER_EXIST = {
  name: 'DOES_USER_EXIST',
  params: {
    email: { type: String },
  },
};

// This is not a query, nor a mutation..?
export const SEND_VERIFICATION_LINK = {
  name: 'SEND_VERIFICATION_LINK',
  params: {
    userId: { type: String, optional: true },
  },
};
