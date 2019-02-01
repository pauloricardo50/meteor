import { Meteor } from 'meteor/meteor';

import { notifyAssignee, logError, notifyOfUpload } from '../methodDefinitions';
import UserService from '../../users/server/UserService';
import SlackService from './SlackService';
import SecurityService from '../../security';

notifyAssignee.setHandler(({ userId }, { message, title }) => {
  SecurityService.checkLoggedIn();
  const user = UserService.get(userId);
  SlackService.notifyAssignee({
    currentUser: user,
    message,
    title: title || `Utilisateur ${user.name}`,
    link: `${Meteor.settings.public.subdomains.admin}/users/${userId}`,
  });
});

notifyOfUpload.setHandler(({ userId }, params) => {
  SecurityService.checkLoggedIn();
  const user = UserService.get(userId);
  SlackService.notifyOfUpload({ currentUser: user, ...params });
});

logError.setHandler((context, params) => {
  SlackService.sendError(params);
});
