import { compose, withProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { appPromotion } from 'core/api/promotions/queries';
import PromotionPage from 'core/components/PromotionPage/client';
import { withPromotionPageContext } from 'core/components/PromotionPage/client/PromotionPageContext';
import withMatchParam from 'core/containers/withMatchParam';
import { createRoute } from 'core/utils/routerUtils';

import appRoutes from '../../../startup/client/appRoutes';

const promotionFragment = {
  address: 1,
  address1: 1,
  agreementDuration: 1,
  assignedEmployee: { name: 1 },
  canton: 1,
  city: 1,
  constructionTimeline: 1,
  contacts: 1,
  country: 1,
  description: 1,
  documents: 1,
  externalUrl: 1,
  name: 1,
  promotionLotLinks: 1,
  signingDate: 1,
  status: 1,
  type: 1,
  users: {
    email: 1,
    name: 1,
    organisations: { name: 1 },
    phoneNumbers: 1,
    roles: 1,
  },
  zipCode: 1,
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
);

export default AppPromotionPageContainer(PromotionPage);
