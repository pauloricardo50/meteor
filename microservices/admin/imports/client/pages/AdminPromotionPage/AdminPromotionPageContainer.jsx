import { Meteor } from 'meteor/meteor';

import React from 'react';
import { compose } from 'recompose';
import omit from 'lodash/omit';

import { proPromotions } from 'core/api/promotions/queries';
import { withSmartQuery } from 'core/api';
import { proPromotion } from 'core/api/fragments';
import withMatchParam from 'core/containers/withMatchParam';
import { injectPromotionMetadata } from 'core/components/PromotionPage/client/PromotionMetadata';
import { ROLES } from 'core/api/constants';

const promotionFragment = {
  ...omit(proPromotion(), ['promotionLots']),
  promotionLots: { _id: 1, status: 1 },
};

export default compose(
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
      canModifyPromotion: true,
      canInviteCustomers: true,
      canManageDocuments: true,
      canSeeCustomers: true,
      canSeeUsers: true,
      canAddLots: true,
      canModifyLots: true,
      canRemoveLots: true,
      canAddPros: true,
      canRemovePromotion: Meteor.user().roles.includes(ROLES.DEV),
      canChangeTimeline: true,
    },
  }),
);
