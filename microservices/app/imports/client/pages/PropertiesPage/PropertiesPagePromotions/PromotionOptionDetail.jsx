// @flow
import React from 'react';
import { Link } from 'react-router-dom';

import { createRoute } from 'core/utils/routerUtils';
import T from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import { toMoney } from 'core/utils/conversionFunctions';
import { PROMOTION_LOTS_COLLECTION } from 'core/api/constants';
import { APP_PROMOTION_OPTION_PAGE } from '../../../../startup/client/appRoutes';

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
  const { value, status } = promotionLots[0];

  return (
    <Link
      to={createRoute(APP_PROMOTION_OPTION_PAGE, {
        loanId,
        promotionId: promotion._id,
        promotionOptionId,
      })}
      className="card1 card-hover promotion-option-detail"
    >
      <h2>
        <span>{name}</span>
        <StatusLabel status={status} collection={PROMOTION_LOTS_COLLECTION} />
      </h2>
      <h3 className="secondary">CHF {toMoney(value)}</h3>

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
