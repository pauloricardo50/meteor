// @flow
import React from 'react';
import Button from 'core/components/Button';

import PropertyCardContainer from './PropertyCardContainer';
import PropertyCardInfos from './PropertyCardInfos';

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

  return (
    <div className="card1 property-card">
      <PropertyCardInfos {...props} />
      <Button className="button" onClick={onClick} secondary raised>
        {buttonLabel}
      </Button>
    </div>
  );
};

export default PropertyCardContainer(PropertyCard);
