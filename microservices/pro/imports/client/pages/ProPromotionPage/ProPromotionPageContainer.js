import { compose, withProps } from 'recompose';
import proPromotion from 'core/api/promotions/queries/proPromotion';
import promotionFiles from 'core/api/promotions/queries/promotionFiles';
import { withSmartQuery } from 'core/api';
import withMatchParam from 'core/containers/withMatchParam';
import mergeFilesWithQuery from 'core/api/files/mergeFilesWithQuery';
import {
  isAllowedToModifyPromotion,
  isAllowedToInviteCustomersToPromotion,
  isAllowedToManagePromotionDocuments,
  isAllowedToSeePromotionCustomers,
  isAllowedToAddLotsToPromotion,
  isAllowedToModifyPromotionLots,
  isAllowedToRemovePromotionLots,
} from 'core/api/security/clientSecurityHelpers';

const makePermissions = props => ({
  canModifyPromotion: isAllowedToModifyPromotion(props),
  canInviteCustomers: isAllowedToInviteCustomersToPromotion(props),
  canManageDocuments: isAllowedToManagePromotionDocuments(props),
  canSeeCustomers: isAllowedToSeePromotionCustomers(props),
  canAddLots: isAllowedToAddLotsToPromotion(props),
  canModifyLots: isAllowedToModifyPromotionLots(props),
  canRemoveLots: isAllowedToRemovePromotionLots(props),
});

export default compose(
  withMatchParam('promotionId'),
  withSmartQuery({
    query: proPromotion,
    params: ({ promotionId }) => ({ promotionId }),
    queryOptions: { reactive: false, single: true },
    dataName: 'promotion',
  }),
  mergeFilesWithQuery(
    promotionFiles,
    ({ promotion: { _id: promotionId } }) => ({ promotionId }),
    'promotion',
  ),
  withProps(makePermissions),
);
