import React from 'react';
import { compose, withProps } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { proPromotionLot } from 'core/api/promotionLots/queries';
import withMatchParam from 'core/containers/withMatchParam';
import {
  isAllowedToManagePromotionDocuments,
  isAllowedToSeePromotionCustomers,
  isAllowedToModifyPromotionLots,
  isAllowedToRemovePromotionLots,
} from 'core/api/security/clientSecurityHelpers';

const makePermissions = props => ({
  canManageDocuments: isAllowedToManagePromotionDocuments(props),
  canSeeCustomers: isAllowedToSeePromotionCustomers(props),
  canModifyLots: isAllowedToModifyPromotionLots(props),
  canRemoveLots: isAllowedToRemovePromotionLots(props),
});

export default compose(
  withMatchParam(['promotionLotId', 'promotionId']),
  // The whole page is pretty heavy to load, so refresh the page on URL change
  Component => props => <Component {...props} key={props.promotionLotId} />,
  withSmartQuery({
    query: proPromotionLot,
    params: ({ promotionLotId }) => ({ promotionLotId }),
    queryOptions: { reactive: false, single: true },
    dataName: 'promotionLot',
  }),
  withProps(({ currentUser, promotionLot }) => {
    const { promotion } = promotionLot;
    return makePermissions({ currentUser, promotion });
  }),
);
