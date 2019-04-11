// @flow
import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/pro-light-svg-icons/faHome';

type PropertyCardInfosProps = {
  image: String,
  name: String,
  address: String,
  additionalInfos: String,
};

const PropertyCardInfos = ({
  image,
  name,
  address,
  additionalInfos,
}: PropertyCardInfosProps) => (
  <div className="property-card-infos">
    {image ? (
      <img src={image} alt={name} />
    ) : (
      <FontAwesomeIcon icon={faHome} className="icon" />
    )}
    <div className="property-card-infos-description">
      <h3>{name}</h3>
      <p>{address}</p>
      {additionalInfos && <p>{additionalInfos}</p>}
    </div>
  </div>
);

export default PropertyCardInfos;
