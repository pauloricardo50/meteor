// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { createRoute } from 'core/utils/routerUtils';

import UserPromotionOptionsTable from 'core/components/PromotionPage/client/UserPromotionOptionsTable';
import MapWithMarker from 'core/components/maps/MapWithMarker';
import { APP_PROMOTION_PAGE } from 'imports/startup/client/appRoutes';
import mergeFilesWithQuery from 'core/api/files/mergeFilesWithQuery';
import promotionFiles from 'core/api/promotions/queries/promotionFiles';
import cx from 'classnames';

type DashboardRecapPromotionProps = {
  loan: Object,
  promotion: Object,
};

const DashboardRecapPromotion = ({
  loan,
  promotion,
}: DashboardRecapPromotionProps) => {
  const { promotionImage = [] } = promotion.documents || {};

  return (
    <Link
      to={createRoute(APP_PROMOTION_PAGE, {
        ':loanId': loan._id,
        ':promotionId': promotion._id,
      })}
      className="dashboard-recap-promotion card1 card-hover"
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
      <UserPromotionOptionsTable
        promotion={promotion}
        loan={loan}
        isDashboardTable
      />
    </Link>
  );
};
export default mergeFilesWithQuery(
  promotionFiles,
  ({ promotion: { _id: promotionId } }) => ({ promotionId }),
  'promotion',
)(DashboardRecapPromotion);
