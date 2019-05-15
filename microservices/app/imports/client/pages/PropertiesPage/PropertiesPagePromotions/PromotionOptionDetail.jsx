// @flow
import React from 'react';
import Link from 'core/components/Link';

import { createRoute } from 'core/utils/routerUtils';
import T from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import { toMoney } from 'core/utils/conversionFunctions';
import { PROMOTION_LOTS_COLLECTION } from 'core/api/constants';
import ROUTES from '../../../../startup/client/appRoutes';

type PromotionOptionDetailProps = {};

const PromotionOptionDetail = ({
  promotionOption,
  loanId,
}: PromotionOptionDetailProps) => {
  const {
    _id: promotionOptionId,
    name,
    promotionLots,
    promotion,
    priority,
  } = promotionOption;
  const { value, reducedStatus } = promotionLots[0];

  return (
    <Link
      to={createRoute(ROUTES.APP_PROMOTION_OPTION_PAGE.path, {
        loanId,
        promotionId: promotion._id,
        promotionOptionId,
      })}
      className="card1 card-hover promotion-option-detail"
    >
      <h2>
        <span>{name}</span>
        <StatusLabel
          status={reducedStatus}
          collection={PROMOTION_LOTS_COLLECTION}
        />
      </h2>
      <h3 className="secondary">
        CHF
        {toMoney(value)}
      </h3>

      <h1>
        <T
          id="PromotionOptionDetail.priority"
          values={{ priority: priority + 1 }}
        />
      </h1>
    </Link>
  );
};

export default PromotionOptionDetail;
