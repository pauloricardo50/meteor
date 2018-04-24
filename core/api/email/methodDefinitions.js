import { Method } from '../methods/methods';

export const sendEmail = new Method({
  name: 'sendEmail',
  params: {
    emailId: String,
    userId: String,
    params: Object,
  },
});

export const sendEmailToAddress = new Method({
  name: 'sendEmailToAddress',
  params: {
    emailId: String,
    address: String,
    params: Object,
  },
});
