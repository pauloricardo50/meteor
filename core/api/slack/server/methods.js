import { Meteor } from 'meteor/meteor';

import { notifyAssignee, logError, notifyOfUpload } from '../methodDefinitions';
import UserService from '../../users/server/UserService';
import SlackService from './SlackService';
import SecurityService from '../../security';
import { fullUser } from 'core/api/fragments';

notifyAssignee.setHandler((context, { message, title }) => {
  context.unblock();
  SecurityService.checkLoggedIn();
  const user = UserService.get(context.userId, fullUser());
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
  const user = UserService.get(context.userId, fullUser());
  SlackService.notifyOfUpload({ currentUser: user, ...params });
});

logError.setHandler((context, params) => {
  context.unblock();
  SlackService.sendError({ ...params, connection: context.connection });
});
