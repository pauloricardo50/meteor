export const DOES_USER_EXIST = {
  name: 'DOES_USER_EXIST',
  params: {
    email: { type: String },
  },
};

export const SEND_VERIFICATION_LINK = {
  name: 'SEND_VERIFICATION_LINK',
  params: {
    userId: { type: String, optional: true },
  },
};

export const CREATE_USER = {
  name: 'USER_INSERT',
  params: {
    user: { type: Object },
    userId: { type: String, optional: true },
  },
};

export const USER_UPDATE = {
  name: 'USER_UPDATE',
  params: {
    userId: { type: String },
    object: { type: Object },
  },
};

export const USER_REMOVE = {
  name: 'USER_REMOVE',
  params: {
    userId: { type: String },
  },
};
