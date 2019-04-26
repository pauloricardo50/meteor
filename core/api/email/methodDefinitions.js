import { Match } from 'meteor/check';

import { Method } from '../methods/methods';

export const sendEmail = new Method({
  name: 'sendEmail',
  params: {
    bccUserIds: Match.Maybe([String]),
    emailId: String,
    params: Object,
    userId: String,
  },
});

export const sendEmailToAddress = new Method({
  name: 'sendEmailToAddress',
  params: {
    address: String,
    bccUserIds: Match.Maybe(Array),
    emailId: String,
    name: Match.Maybe(String),
    params: Object,
  },
});
