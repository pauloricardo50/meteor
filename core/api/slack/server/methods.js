import { Meteor } from 'meteor/meteor';

import { notifyAssignee, logError, notifyOfUpload } from '../methodDefinitions';
import UserService from '../../users/server/UserService';
import SlackService from './SlackService';
import SecurityService from '../../security';
import { slackCurrentUserFragment } from './slackListeners';

notifyAssignee.setHandler((context, { message, title }) => {
  context.unblock();
  SecurityService.checkLoggedIn();
  const user = UserService.get(context.userId, slackCurrentUserFragment);
  SlackService.notifyAssignee({
    currentUser: user,
    message,
    title,
    link: `${Meteor.settings.public.subdomains.admin}/users/${context.userId}`,
  });
});

notifyOfUpload.setHandler((context, params) => {
  context.unblock();
  SecurityService.checkLoggedIn();
  const user = UserService.get(context.userId, slackCurrentUserFragment);
  SlackService.notifyOfUpload({ currentUser: user, ...params });
});

logError.setHandler((context, params) => {
  context.unblock();
  SlackService.sendError({ ...params, connection: context.connection });
});
