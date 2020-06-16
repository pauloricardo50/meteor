import React from 'react';
import cx from 'classnames';
import { compose, withProps } from 'recompose';

import { PROMOTION_STATUS } from 'core/api/promotions/promotionConstants';
import Link from 'core/components/Link';
import { withPromotionPageContext } from 'core/components/PromotionPage/client/PromotionPageContext';
import UserPromotionOptionsTable from 'core/components/PromotionPage/client/UserPromotionOptionsTable';
import UserReservation from 'core/components/PromotionPage/client/UserReservation';
import Calculator from 'core/utils/Calculator';
import { createRoute } from 'core/utils/routerUtils';

import APP_ROUTES from '../../../../../startup/client/appRoutes';

const DashboardRecapPromotion = ({ loan, promotion }) => {
  const { status } = promotion;
  const { promotionImage = [] } = promotion.documents || {};

  return (
    <Link
      to={createRoute(APP_ROUTES.APP_PROMOTION_PAGE.path, {
        ':loanId': loan._id,
        ':promotionId': promotion._id,
      })}
      className="dashboard-recap-promotion card1 card-hover"
      disabled={status !== PROMOTION_STATUS.OPEN}
    >
      <span
        style={
          promotionImage.length > 0
            ? { backgroundImage: `url("${promotionImage[0].url}")` }
            : { background: 'transparent' }
        }
        className={cx('promotion-image', {
          'animated fadeIn': promotionImage.length > 0,
        })}
      />
      <h2 className="secondary">{promotion.name}</h2>
      {Calculator.hasActivePromotionOption({ loan }) ? (
        <UserReservation
          promotionOption={Calculator.getMostActivePromotionOption({ loan })}
          progressVariant="icon"
          loan={loan}
        />
      ) : (
        <UserPromotionOptionsTable loan={loan} isDashboardTable />
      )}
    </Link>
  );
};
export default compose(
  withProps(({ loan }) => ({ promotion: loan.promotions[0] })),
  withPromotionPageContext(),
)(DashboardRecapPromotion);
