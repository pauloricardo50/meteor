import pick from 'lodash/pick';
import { compose, withProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { proPromotion } from 'core/api/fragments';
import { appPromotion } from 'core/api/promotions/queries';
import PromotionPage from 'core/components/PromotionPage/client';
import { withPromotionPageContext } from 'core/components/PromotionPage/client/PromotionPageContext';
import withMatchParam from 'core/containers/withMatchParam';
import { createRoute } from 'core/utils/routerUtils';

import appRoutes from '../../../startup/client/appRoutes';
import withSimpleAppPage from '../../components/SimpleAppPage/SimpleAppPage';

const promotionFragment = {
  ...pick(proPromotion({ withFilteredLoan: true }), [
    'address',
    'address1',
    'agreementDuration',
    'canton',
    'city',
    'constructionTimeline',
    'contacts',
    'documents',
    'name',
    'status',
    'type',
    'zipCode',
    'signingDate',
    'country',
    'promotionLotGroups',
    'description',
    'externalUrl',
    'loans',
  ]),
  promotionLots: { _id: 1 },
};

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
      $body: promotionFragment,
    }),
    queryOptions: { single: true },
    dataName: 'promotion',
  }),
  withPromotionPageContext(),
  withProps(({ promotion, promotionId, loan }) => ({
    invitedByUser: getInvitedByUser({ promotion, promotionId, loan }),
    route: createRoute(appRoutes.APP_PROMOTION_PAGE.path, { loanId: loan._id }),
  })),
  withSimpleAppPage,
);

export default AppPromotionPageContainer(PromotionPage);
