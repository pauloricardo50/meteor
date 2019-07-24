// @flow
import React from 'react';

import Link from 'core/components/Link';
import useMedia from 'core/hooks/useMedia';
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
  const { loan, route } = props;

  const isMobile = useMedia({ maxWidth: 1200 });

  return (
    <Link className="card1 card-hover property-card" to={route}>
      <div className="top">
        <PropertyCardInfos isMobile={isMobile} {...props} />
      </div>
      {loan.promotionOptions && loan.promotionOptions.length > 0 && (
        <div className="bottom">
          <PropertyCardPromotionOptions {...props} />
        </div>
      )}
    </Link>
  );
};

export default PropertyCardContainer(PropertyCard);
