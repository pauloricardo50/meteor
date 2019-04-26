// @flow
import React from 'react';
import Link from 'core/components/Link';
import { createRoute } from 'core/utils/routerUtils';

import UserPromotionOptionsTable from 'core/components/PromotionPage/client/UserPromotionOptionsTable';
import { APP_PROMOTION_PAGE } from 'imports/startup/client/appRoutes';
import cx from 'classnames';
import { PROMOTION_STATUS } from 'core/api/constants';

type DashboardRecapPromotionProps = {
  loan: Object,
  promotion: Object,
};

const DashboardRecapPromotion = ({
  loan,
  promotion,
}: DashboardRecapPromotionProps) => {
  const { status } = promotion;
  const { promotionImage = [] } = promotion.documents || {};

  return (
    <Link
      to={createRoute(APP_PROMOTION_PAGE, {
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
      <UserPromotionOptionsTable
        promotion={promotion}
        loan={loan}
        isDashboardTable
      />
    </Link>
  );
};
export default DashboardRecapPromotion;
