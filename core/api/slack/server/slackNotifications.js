import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import { LOANS_COLLECTION } from '../../loans/loanConstants';
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
  promotionName,
  assignedEmployee,
  proName,
  promotionId,
}) => {
  SlackService.notifyAssignee({
    currentUser,
    title: `Promotion ${promotionName}`,
    message: `Nouveau prospect de ${proName}. Suivre l'avancement et prendre contact.`,
    link: `${Meteor.settings.public.subdomains.admin}/promotions/${promotionId}`,
    assignee: assignedEmployee,
    notifyAlways: true,
  });
};

export const promotionLotReserved = ({
  currentUser,
  promotionLot,
  user: { name },
  loanId,
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
    loanId,
  });
};

export const promotionLotSold = ({
  currentUser,
  promotionLot,
  user: { name },
  loanId,
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
    loanId,
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
    loanId: collection === LOANS_COLLECTION ? docId : undefined,
  });
};

export const newLoan = ({ loanId, loanName, currentUser }) => {
  SlackService.notifyAssignee({
    currentUser,
    title: `Nouveau dossier: ${loanName}`,
    link: `${Meteor.settings.public.subdomains.admin}/loans/${loanId}`,
    loanId,
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

export const newPromotionReservation = ({
  currentUser,
  promotionLotName,
  promotionName,
  proName,
  promotionId,
  assignedEmployee,
  loanId,
}) => {
  SlackService.notifyAssignee({
    currentUser,
    title: `Promotion ${promotionName}`,
    message: `A fait une demande de réservation à ${proName} pour le lot ${promotionLotName}`,
    link: `${Meteor.settings.public.subdomains.admin}/promotions/${promotionId}`,
    assignee: assignedEmployee,
    notifyAlways: true,
    loanId,
  });
};

export const promotionAgreementUploaded = ({
  currentUser,
  promotionLotName,
  promotionName,
  promotionId,
  userName,
  assignedEmployee,
  startDate,
  expirationDate,
}) => {
  SlackService.notifyAssignee({
    currentUser,
    title: `Promotion ${promotionName}`,
    message: `A uploadé une convention de réservation pour ${userName} sur le lot ${promotionLotName}. Date de début: ${moment(
      startDate,
    ).format('D MMM YYYY')}, date d'expiration: ${moment(expirationDate).format(
      'D MMM YYYY',
    )}`,
    link: `${Meteor.settings.public.subdomains.admin}/promotions/${promotionId}`,
    assignee: assignedEmployee,
    notifyAlways: true,
  });
};
