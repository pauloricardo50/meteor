// @flow
import React from 'react';

import Link from 'core/components/Link';
import useMedia from 'core/hooks/useMedia';
import UserReservation from 'core/components/PromotionPage/client/UserReservation';
import { PROMOTION_RESERVATION_STATUS } from 'core/api/constants';
import PropertyCardPromotionOptions from './PropertyCardPromotionOptions';
import PropertyCardInfos from './PropertyCardInfos';
import PropertyCardContainer from './PropertyCardContainer';

type PropertyCardProps = {
  buttonLabel: Object,
  image: String,
  name: String,
  address: String,
  additionalInfos: String,
  onClick: Function,
};

const PropertyCard = (props: PropertyCardProps) => {
  const {
    loan: { promotionOptions, promotionReservations },
    route,
  } = props;

  const isMobile = useMedia({ maxWidth: 1200 });

  return (
    <Link className="card1 card-hover property-card" to={route}>
      <div className="top">
        <PropertyCardInfos isMobile={isMobile} {...props} />
      </div>
      {promotionReservations.length > 0 ? (
        <UserReservation
          promotionReservation={
            promotionReservations.sort(({ status }) =>
              (status === PROMOTION_RESERVATION_STATUS.ACTIVE ? -1 : 0))[0]
          }
          progressVariant="text"
        />
      ) : (
        promotionOptions
        && promotionOptions.length > 0 && (
          <div className="bottom">
            <PropertyCardPromotionOptions {...props} />
          </div>
        )
      )}
    </Link>
  );
};

export default PropertyCardContainer(PropertyCard);
