import React from 'react';
import { compose } from 'recompose';

import { proPromotions } from 'core/api/promotions/queries';
import { withSmartQuery } from 'core/api';
import withMatchParam from 'core/containers/withMatchParam';
import { injectPromotionPermissions } from 'core/components/PromotionPage/client/PromotionPermissions';

export default compose(
  withMatchParam('promotionId'),
  Component => props => <Component {...props} key={props.promotionId} />,
  withSmartQuery({
    query: proPromotions,
    params: ({ promotionId }) => ({ _id: promotionId }),
    queryOptions: { reactive: false, single: true },
    dataName: 'promotion',
  }),
  injectPromotionPermissions({
    canModifyPromotion: true,
    canInviteCustomers: true,
    canManageDocuments: true,
    canSeeCustomers: true,
    canSeeUsers: true,
    canAddLots: true,
    canModifyLots: true,
    canRemoveLots: true,
  }),
);
