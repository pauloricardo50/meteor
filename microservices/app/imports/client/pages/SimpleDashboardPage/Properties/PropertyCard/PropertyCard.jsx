// @flow
import React from 'react';
import Button from 'core/components/Button';

import PropertyCardContainer from './PropertyCardContainer';
import PropertyCardInfos from './PropertyCardInfos';
import PropertyCardToggle from './PropertyCardToggle';
import PropertyCardPromotionOptions from './PropertyCardPromotionOptions';

type PropertyCardProps = {
  buttonLabel: Object,
  image: String,
  name: String,
  address: String,
  additionalInfos: String,
  onClick: Function,
};

const PropertyCard = (props: PropertyCardProps) => {
  const { buttonLabel, onClick } = props;
  console.log('props:', props);

  return (
    <div className="card1 property-card">
      <div className="top">
        <PropertyCardInfos {...props} />
        <div className="property-card-actions">
          <Button className="button" onClick={onClick} secondary raised>
            {buttonLabel}
          </Button>
          <PropertyCardToggle {...props} />
        </div>
      </div>
      <div className="bottom">
        <PropertyCardPromotionOptions {...props} />
      </div>
    </div>
  );
};

export default PropertyCardContainer(PropertyCard);
