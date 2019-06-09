// @flow
import React from 'react';

import PromotionUsersPage from 'core/components/PromotionUsersPage';
import Button from 'core/components/Button';
import T from 'core/components/Translation';
import { withSmartQuery } from 'core/api';
import { proPromotionLoans } from 'core/api/loans/queries';
import { compose } from 'recompose';
import withMatchParam from 'core/containers/withMatchParam';
import { createRoute } from 'imports/core/utils/routerUtils';
import ADMIN_ROUTES from '../../../startup/client/adminRoutes';

type AdminPromotionUsersPageProps = {};

const AdminPromotionUsersPage = (props: AdminPromotionUsersPageProps) => {
  const { promotionId } = props;
  return (
    <div>
      <Button
        raised
        primary
        link
        to={createRoute(ADMIN_ROUTES.ADMIN_PROMOTION_PAGE.path, {
          promotionId,
        })}
      >
        <T id="general.back" />
      </Button>
      <PromotionUsersPage canModify isAdmin {...props} />
    </div>
  );
};

export default compose(
  withMatchParam('promotionId'),
  withSmartQuery({
    query: proPromotionLoans,
    params: ({ promotionId }) => ({ promotionId }),
    queryOptions: { reactive: false },
    dataName: 'loans',
  }),
)(AdminPromotionUsersPage);
