// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { createRoute } from 'core/utils/routerUtils';

import UserPromotionOptionsTable from 'core/components/PromotionPage/client/UserPromotionOptionsTable';
import MapWithMarker from 'core/components/maps/MapWithMarker';
import { APP_PROMOTION_PAGE } from 'imports/startup/client/appRoutes';

type DashboardRecapPromotionProps = {};

const DashboardRecapPromotion = ({ loan }: DashboardRecapPromotionProps) => {
  const promotion = loan.promotions[0];
  return (
    <Link
      to={createRoute(APP_PROMOTION_PAGE, {
        ':loanId': loan._id,
        ':promotionId': promotion._id,
      })}
      className="dashboard-recap-promotion card1 card-hover"
    >
      <MapWithMarker
        address={promotion.address}
        className="map"
        options={{ zoom: 10 }}
        id={promotion._id}
      />
      <UserPromotionOptionsTable
        promotion={loan.promotions[0]}
        loan={loan}
        isDashboardTable
      />
    </Link>
  );
};

export default DashboardRecapPromotion;
