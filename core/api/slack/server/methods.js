import { Meteor } from 'meteor/meteor';

import SecurityService from '../../security';
import UserService from '../../users/server/UserService';
import { logError, notifyAssignee, notifyOfUpload } from '../methodDefinitions';
import { slackCurrentUserFragment } from './slackListeners';
import SlackService from './SlackService';

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
