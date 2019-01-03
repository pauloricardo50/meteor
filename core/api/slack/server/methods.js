import { Meteor } from 'meteor/meteor';

import { notifyAssignee, logError } from '../methodDefinitions';
import UserService from '../../users/UserService';
import SlackService from '../SlackService';

notifyAssignee.setHandler(({ userId }, { message, title }) => {
  const user = UserService.get(userId);
  SlackService.notifyAssignee({
    currentUser: user,
    message,
    title: title || `Utilisateur ${user.name}`,
    link: `${Meteor.settings.public.subdomains.admin}/users/${userId}`,
  });
});

logError.setHandler((context, params) => {
  SlackService.sendError(params);
});
