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

export const ASSIGN_ADMIN_TO_USER = {
  name: 'ASSIGN_ADMIN_TO_USER',
  params: {
    userId: { type: String },
    adminId: { type: String },
  },
};

export const ASSIGN_ADMIN_TO_NEW_USER_TASK = {
  name: 'ASSIGN_ADMIN_TO_NEW_USER',
  params: {
    userId: { type: String },
    adminId: { type: String },
    taskId: { type: String },
    taskType: { type: String },
  },
};
