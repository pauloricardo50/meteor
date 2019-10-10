// @flow
import React from 'react';
import Link from 'core/components/Link';
import { createRoute } from 'core/utils/routerUtils';

import UserPromotionOptionsTable from 'core/components/PromotionPage/client/UserPromotionOptionsTable';
import UserReservation from 'core/components/PromotionPage/client/UserReservation';
import APP_ROUTES from 'imports/startup/client/appRoutes';
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
  const { promotionReservations = [] } = loan;
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
      {promotionReservations.length > 0 ? (
        <UserReservation
          promotionReservation={promotionReservations[0]}
          progressVariant="label"
        />
      ) : (
        <UserPromotionOptionsTable
          promotion={promotion}
          loan={loan}
          isDashboardTable
        />
      )}
    </Link>
  );
};
export default DashboardRecapPromotion;
