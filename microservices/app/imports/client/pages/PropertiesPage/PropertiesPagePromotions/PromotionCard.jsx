// @flow
import React from 'react';
import Link from 'core/components/Link';
import cx from 'classnames';

import { createRoute } from 'core/utils/routerUtils';
import StatusLabel from 'core/components/StatusLabel';
import { PROMOTIONS_COLLECTION, PROMOTION_STATUS } from 'core/api/constants';
import APP_ROUTES from '../../../../startup/client/appRoutes';

type PromotionCardProps = {
  promotion: Object,
  loanId: string,
};

const PromotionCard = ({ promotion, loanId }: PromotionCardProps) => {
  const { name, documents, status } = promotion;
  const { promotionImage = [] } = documents || {};

  return (
    <Link
      to={createRoute(APP_ROUTES.APP_PROMOTION_PAGE.path, {
        ':promotionId': promotion._id,
        ':loanId': loanId,
      })}
      className="card1 card-hover promotion-card"
      disabled={status !== PROMOTION_STATUS.OPEN}
    >
      <React.Fragment>
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
        <h2>
          <span>{name}</span>
          <StatusLabel status={status} collection={PROMOTIONS_COLLECTION} />
        </h2>
        <h3 className="secondary">{promotion.address}</h3>
      </React.Fragment>
    </Link>
  );
};

export default PromotionCard;
