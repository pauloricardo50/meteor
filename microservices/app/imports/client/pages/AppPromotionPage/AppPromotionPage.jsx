import { compose, withProps } from 'recompose';

import { appPromotion } from 'core/api/promotions/queries';
import { withSmartQuery } from 'core/api';
import withMatchParam from 'core/containers/withMatchParam';
import { createRoute } from 'core/utils/routerUtils';
import PromotionPage from 'core/components/PromotionPage/client';
import appRoutes from '../../../startup/client/appRoutes';
import withSimpleAppPage from '../../components/SimpleAppPage/SimpleAppPage';

const getInvitedByUser = ({ promotion, promotionId, loan }) => {
  const { promotions = [] } = loan;
  const { $metadata = {} } =
    promotions.find(({ _id }) => _id === promotionId) || {};
  const { invitedBy } = $metadata;
  const { users = [] } = promotion;
  return users.find(({ _id }) => _id === invitedBy);
};

const AppPromotionPageContainer = compose(
  withMatchParam('promotionId'),
  withSmartQuery({
    query: appPromotion,
    params: ({ promotionId, loan: { _id: loanId } }) => ({
      promotionId,
      loanId,
    }),
    queryOptions: { reactive: false, single: true },
    dataName: 'promotion',
  }),
  withProps(({ promotion, promotionId, loan }) => ({
    invitedByUser: getInvitedByUser({ promotion, promotionId, loan }),
    route: createRoute(appRoutes.APP_PROMOTION_PAGE.path, { loanId: loan._id }),
  })),
  withSimpleAppPage,
);

export default AppPromotionPageContainer(PromotionPage);
