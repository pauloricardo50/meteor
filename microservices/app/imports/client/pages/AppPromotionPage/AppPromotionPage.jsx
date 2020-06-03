import { compose, withProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { appPromotion } from 'core/api/promotions/queries';
import PromotionPage from 'core/components/PromotionPage/client';
import withMatchParam from 'core/containers/withMatchParam';
import { createRoute } from 'core/utils/routerUtils';

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
    deps: ({ promotionId, loan: { _id: loanId } }) => [promotionId, loanId],
    queryOptions: { single: true },
    dataName: 'promotion',
  }),
  withProps(({ promotion, promotionId, loan }) => ({
    invitedByUser: getInvitedByUser({ promotion, promotionId, loan }),
    route: createRoute(appRoutes.APP_PROMOTION_PAGE.path, { loanId: loan._id }),
  })),
  withSimpleAppPage,
);

export default AppPromotionPageContainer(PromotionPage);
