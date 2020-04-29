import React from 'react';
import { faHome } from '@fortawesome/pro-light-svg-icons/faHome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PropertyCardInfos = ({
  image,
  name,
  title,
  subtitle,
  isMobile,
  onClick,
  buttonLabel,
}) => (
  <div className="property-card-infos">
    {image ? (
      <img src={image} alt={name} />
    ) : (
      <FontAwesomeIcon icon={faHome} className="icon" />
    )}
    <div className="property-card-infos-description">
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </div>
  </div>
);

export default PropertyCardInfos;
