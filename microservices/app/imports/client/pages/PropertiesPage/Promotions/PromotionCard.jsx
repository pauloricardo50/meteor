// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { createRoute } from 'core/utils/routerUtils';
import { APP_PROMOTION_PAGE } from 'imports/startup/client/appRoutes';
import promotionFiles from 'core/api/promotions/queries/promotionFiles';
import mergeFilesWithQuery from 'core/api/files/mergeFilesWithQuery';

type PromotionCardProps = {
  promotion: Object,
  loanId: string,
};

const PromotionCard = ({ promotion, loanId }: PromotionCardProps) => {
  const { name, documents } = promotion;
  const { promotionImage = [{ url: '/img/placeholder.png' }] } = documents || {};
  
  return (
    <Link
      to={createRoute(APP_PROMOTION_PAGE, {
        ':promotionId': promotion._id,
        ':loanId': loanId,
      })}
      className="card1 card-hover promotion-card"
    >
      <React.Fragment>
        <span
          style={{ backgroundImage: `url(${promotionImage[0].url})` }}
          className="promotion-image"
        />
        <h2>{name}</h2>
        <h3 className="secondary">{promotion.address}</h3>
      </React.Fragment>
    </Link>
  );
};

export default mergeFilesWithQuery(
  promotionFiles,
  ({ promotion: { _id: promotionId } }) => ({ promotionId }),
  'promotion',
)(PromotionCard);
