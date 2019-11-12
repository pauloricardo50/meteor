import { Meteor } from 'meteor/meteor';

import SlackService from './SlackService';

export const referralOnlyNotification = ({ currentUser, user }) => {
  const { _id: userId, firstName, lastName } = user;
  SlackService.notifyAssignee({
    currentUser,
    link: `${Meteor.settings.public.subdomains.admin}/users/${userId}`,
    title: `${firstName} ${lastName} a été invité sur e-Potek en referral uniquement`,
  });
};

export const propertyInviteNotification = ({ currentUser, property, user }) => {
  const { _id: userId, firstName, lastName } = user;
  const { address1 } = property;

  SlackService.notifyAssignee({
    currentUser,
    link: `${Meteor.settings.public.subdomains.admin}/users/${userId}`,
    title: `${firstName} ${lastName} a été invité au bien immo "${address1}"`,
  });
};

export const promotionInviteNotification = ({
  currentUser,
  promotion: { name, assignedEmployee, _id: promotionId },
  user,
}) => {
  const { firstName, lastName, email } = user;

  SlackService.notifyAssignee({
    currentUser,
    title: `Promotion ${name}`,
    message: `${firstName} ${lastName} a été invité! ${email}`,
    link: `${Meteor.settings.public.subdomains.admin}/promotions/${promotionId}`,
    assignee: assignedEmployee,
    notifyAlways: true,
  });
};

export const promotionLotReserved = ({
  currentUser,
  promotionLot,
  user: { name },
}) => {
  const {
    name: lotName,
    promotion: { name: promotionName, assignedEmployee, _id: promotionId },
  } = promotionLot;

  SlackService.notifyAssignee({
    currentUser,
    title: `Promotion ${promotionName}`,
    message: `Le lot ${lotName} a été réservé pour ${name}`,
    link: `${Meteor.settings.public.subdomains.admin}/promotions/${promotionId}`,
    assignee: assignedEmployee,
    notifyAlways: true,
  });
};

export const promotionLotSold = ({
  currentUser,
  promotionLot,
  user: { name },
}) => {
  const {
    name: lotName,
    promotion: { name: promotionName, assignedEmployee, _id: promotionId },
  } = promotionLot;

  SlackService.notifyAssignee({
    currentUser,
    title: `Promotion ${promotionName}`,
    message: `Le lot ${lotName} a été vendu à ${name}`,
    link: `${Meteor.settings.public.subdomains.admin}/promotions/${promotionId}`,
    assignee: assignedEmployee,
    notifyAlways: true,
  });
};

export const updateWatcherNotification = ({
  user,
  title,
  collection,
  docId,
  message,
}) => {
  SlackService.notifyAssignee({
    currentUser: user,
    title,
    link: `${Meteor.settings.public.subdomains.admin}/${collection}/${docId}`,
    message,
  });
};

export const newLoan = ({ loanId, loanName, currentUser }) => {
  SlackService.notifyAssignee({
    currentUser,
    title: `Nouveau dossier: ${loanName}`,
    link: `${Meteor.settings.public.subdomains.admin}/loans/${loanId}`,
  });
};

export const newUser = ({ loans, currentUser, suffix }) => {
  SlackService.notifyAssignee({
    currentUser,
    title: `Nouveau compte utilisateur! ${
      loans.length ? `(dossier ${loans[0].name})` : ''
    } ${suffix}`,
    link: `${Meteor.settings.public.subdomains.admin}/users/${currentUser._id}`,
  });
};
