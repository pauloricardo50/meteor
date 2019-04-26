import { Match } from 'meteor/check';

import { Method } from '../methods/methods';

export const sendEmail = new Method({
  name: 'sendEmail',
  params: {
    emailId: String,
    params: Object,
    userId: String,
  },
});

export const sendEmailToAddress = new Method({
  name: 'sendEmailToAddress',
  params: {
    address: String,
    emailId: String,
    name: Match.Maybe(String),
    params: Object,
  },
});
