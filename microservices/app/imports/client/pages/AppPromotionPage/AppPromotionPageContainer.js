import { compose, withProps } from 'recompose';
import appPromotion from 'core/api/promotions/queries/appPromotion';
import promotionFiles from 'core/api/promotions/queries/promotionFiles';
import { withSmartQuery } from 'core/api';
import withMatchParam from 'core/containers/withMatchParam';
import mergeFilesWithQuery from 'core/api/files/mergeFilesWithQuery';

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
  mergeFilesWithQuery(
    promotionFiles,
    ({ promotion: { _id: promotionId } }) => ({ promotionId }),
    'promotion',
  ),
  withProps(({ promotion, promotionId, loan }) => ({
    invitedByUser: getInvitedByUser({ promotion, promotionId, loan }),
  })),
);
