// @flow
import React from 'react';

import PromotionUsersPage from 'core/components/PromotionUsersPage';
import Button from 'core/components/Button';
import T from 'core/components/Translation';
import { withSmartQuery } from 'core/api';
import proLoans from 'core/api/loans/queries/proLoans';
import { compose } from 'recompose';
import withMatchParam from 'core/containers/withMatchParam';
import { createRoute } from 'imports/core/utils/routerUtils';
import { PRO_PROMOTION_PAGE } from 'imports/startup/client/proRoutes';

type ProPromotionUsersPageProps = {};

const ProPromotionUsersPage = ({
  promotionId,
  ...props
}: ProPromotionUsersPageProps) => (
  <div>
    <Button
      raised
      primary
      link
      to={createRoute(PRO_PROMOTION_PAGE, { promotionId })}
    >
      <T id="general.back" />
    </Button>
    <PromotionUsersPage {...props} />
  </div>
);

export default compose(
  withMatchParam('promotionId'),
  withSmartQuery({
    query: proLoans,
    params: ({ promotionId }) => ({ promotionId }),
    queryOptions: { reactive: false },
    dataName: 'loans',
  }),
)(ProPromotionUsersPage);
