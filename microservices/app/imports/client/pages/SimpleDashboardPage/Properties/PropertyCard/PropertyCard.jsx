import React from 'react';

import Link from 'core/components/Link';
import UserReservation from 'core/components/PromotionPage/client/UserReservation';
import useMedia from 'core/hooks/useMedia';
import Calculator from 'core/utils/Calculator';

import PropertyCardContainer from './PropertyCardContainer';
import PropertyCardInfos from './PropertyCardInfos';
import PropertyCardPromotionOptions from './PropertyCardPromotionOptions';

const PropertyCard = props => {
  const { loan, route } = props;
  const { promotionOptions } = loan;

  const isMobile = useMedia({ maxWidth: 1200 });

  return (
    <Link className="card1 card-hover property-card" to={route}>
      <div className="top">
        <PropertyCardInfos isMobile={isMobile} {...props} />
      </div>
      {Calculator.hasActivePromotionOption({ loan }) ? (
        <>
          <hr />
          <UserReservation
            promotionOption={Calculator.getMostActivePromotionOption({
              loan,
            })}
            progressVariant="text"
            loan={loan}
            showDetailIcon
          />
        </>
      ) : (
        promotionOptions &&
        promotionOptions.length > 0 && (
          <div className="bottom">
            <PropertyCardPromotionOptions {...props} />
          </div>
        )
      )}
    </Link>
  );
};

export default PropertyCardContainer(PropertyCard);
