import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

import PromotionService from '../PromotionService';
import { PROMOTION_TYPES, PROMOTION_STATUS } from '../promotionConstants';
import UserService from '../../users/UserService';
import { ROLES } from '../../users/userConstants';

const DEMO_PROMOTION = {
  name: 'Demo promotion',
  type: PROMOTION_TYPES.SHARE,
  status: PROMOTION_STATUS.OPEN,
  address1: 'Rue du Pré 4',
  zipCode: 1400,
  city: 'Yverdon-les-Bains',
};

export const createPromotionDemoUser = () => {
  console.log('Creating promotion demo user...');
  const userId = Accounts.createUser({
    email: 'demo-promotion@epotek.ch',
    password: '123456',
  });

  UserService.update({
    userId,
    object: { firstName: 'Marc', lastName: 'Dubois' },
  });

  return userId;
};

export const createPromotionDemoOwner = () => {
  console.log('Creating promotion demo owner...');
  const ownerId = Accounts.createUser({
    email: 'demo-promotion-owner@epotek.ch',
    password: '123456',
  });

  Roles.setUserRoles(ownerId, ROLES.PRO);

  UserService.update({
    userId: ownerId,
    object: { firstName: 'Jean', lastName: 'Duvoisin' },
  });

  return ownerId;
};

export const createPromotionDemoViewer = () => {
  console.log('Creating promotion demo viewer...');
  const viewerId = Accounts.createUser({
    email: 'demo-promotion-viewer@epotek.ch',
    password: '123456',
  });

  Roles.setUserRoles(viewerId, ROLES.PRO);

  UserService.update({
    userId: viewerId,
    object: { firstName: 'Marie', lastName: 'Lemarchand' },
  });

  return viewerId;
};

export const createPromotionDemo = () => {
  console.log('Creating promotion demo...');
  const ownerId = createPromotionDemoOwner();
  const promotionId = PromotionService.insert({
    promotion: DEMO_PROMOTION,
    userId: ownerId,
  });
  const viewerId = createPromotionDemoViewer();
  console.log('Adding demo viewer to promotion...');
  PromotionService.update({
    promotionId,
    object: { userLinks: [{ _id: viewerId }] },
    operator: '$push',
  });
  const userId = createPromotionDemoUser();
};
