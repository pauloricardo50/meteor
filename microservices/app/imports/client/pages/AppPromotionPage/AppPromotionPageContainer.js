import { compose, withProps } from 'recompose';

import { appPromotion } from 'core/api/promotions/queries';
import { withSmartQuery } from 'core/api';
import withMatchParam from 'core/containers/withMatchParam';
import withSimpleAppPage from '../../components/SimpleAppPage/SimpleAppPage';

const getInvitedByUser = ({ promotion, promotionId, loan }) => {
  const { promotions = [] } = loan;
  const { $metadata = {} } = promotions.find(({ _id }) => _id === promotionId) || {};
  const { invitedBy } = $metadata;
  const { users = [] } = promotion;
  return users.find(({ _id }) => _id === invitedBy);
};

export default compose(
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
  })),
  withSimpleAppPage,
);
