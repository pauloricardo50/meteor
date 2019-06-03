// @flow
import React from 'react';
import { compose, withProps } from 'recompose';

import proPromotionLoans from 'core/api/loans/queries/proPromotionLoans';
import { isAllowedToModifyPromotion } from 'core/api/security/clientSecurityHelpers';
import { withSmartQuery } from 'core/api';
import PromotionUsersPage from 'core/components/PromotionUsersPage';
import Button from 'core/components/Button';
import T from 'core/components/Translation';
import withMatchParam from 'core/containers/withMatchParam';
import { createRoute } from 'core/utils/routerUtils';
import PRO_ROUTES from '../../../startup/client/proRoutes';

type ProPromotionUsersPageProps = {};

const ProPromotionUsersPage = (props: ProPromotionUsersPageProps) => {
  const { promotionId } = props;
  return (
    <div>
      <Button
        raised
        primary
        link
        to={createRoute(PRO_ROUTES.PRO_PROMOTION_PAGE.path, { promotionId })}
      >
        <T id="general.back" />
      </Button>
      <PromotionUsersPage {...props} />
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
  withProps(({ loans, currentUser }) => {
    const promotion = loans
      && loans.length > 0
      && loans[0].promotions
      && loans[0].promotions.length > 0
      && loans[0].promotions[0];
    return {
      canModify:
        promotion && isAllowedToModifyPromotion({ promotion, currentUser }),
    };
  }),
)(ProPromotionUsersPage);
