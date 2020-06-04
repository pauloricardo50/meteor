import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import pick from 'lodash/pick';
import { compose, withProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { proPromotion } from 'core/api/fragments';
import { proPromotions } from 'core/api/promotions/queries';
import { ROLES } from 'core/api/users/userConstants';
import PromotionPage from 'core/components/PromotionPage/client';
import { injectPromotionMetadata } from 'core/components/PromotionPage/client/PromotionMetadata';
import withMatchParam from 'core/containers/withMatchParam';

import ADMIN_ROUTES from '../../../startup/client/adminRoutes';

const promotionFragment = {
  ...pick(proPromotion(), [
    'address',
    'address1',
    'agreementDuration',
    'canton',
    'city',
    'constructionTimeline',
    'contacts',
    'documents',
    'lenderOrganisation',
    'name',
    'status',
    'type',
    'users',
    'zipCode',
    'signingDate',
    'country',
    'promotionLotGroups',
    'assignedEmployee',
    'description',
    'externalUrl',
    'promotionLoan',
    'authorizationStatus',
    'projectStatus',
    'isTest',
    'loans',
  ]),
  promotionLots: {
    status: 1,
    name: 1,
    value: 1,
    properties: {
      landValue: 1,
      constructionValue: 1,
      additionalMargin: 1,
      value: 1,
    },
    lots: { value: 1 },
    promotionLotGroupIds: 1,
  },
};

const AdminPromotionPageContainer = compose(
  withMatchParam('promotionId'),
  Component => props => <Component {...props} key={props.promotionId} />,
  withSmartQuery({
    query: proPromotions,
    params: ({ promotionId }) => ({
      _id: promotionId,
      $body: promotionFragment,
    }),
    queryOptions: { reactive: false, single: true },
    dataName: 'promotion',
  }),
  injectPromotionMetadata({
    permissions: {
      canAddLots: true,
      canAddPros: true,
      canChangeTimeline: true,
      canInviteCustomers: true,
      canLinkAssignee: true,
      canLinkLender: true,
      canLinkLoan: true,
      canManageDocuments: true,
      canModifyLots: true,
      canModifyPromotion: true,
      canModifyStatus: true,
      canRemoveLots: true,
      canRemovePromotion: Roles.userIsInRole(Meteor.user(), ROLES.DEV),
      canSeeCustomers: true,
      canSeeManagement: true,
      canSeeUsers: true,
      canModifyAdminNote: true,
      canManageProUsers: true,
    },
  }),
  withProps({ route: ADMIN_ROUTES.ADMIN_PROMOTION_PAGE.path }),
);

export default AdminPromotionPageContainer(PromotionPage);
