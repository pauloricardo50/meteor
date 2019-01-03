import { Match } from 'meteor/check';
import { Method } from '../methods/methods';

export const notifyAssignee = new Method({
  name: 'notifyAssignee',
  params: {
    message: Match.Optional(String),
    title: Match.Optional(String),
  },
});

export const logError = new Method({
  name: 'logError',
  params: {
    error: Match.Any,
    additionalData: Match.Any,
  },
});
