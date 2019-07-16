// @flow
import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/pro-light-svg-icons/faHome';

import Button from 'core/components/Button';

type PropertyCardInfosProps = {
  image: String,
  name: String,
  title: String,
  subtitle: String,
};

const PropertyCardInfos = ({
  image,
  name,
  title,
  subtitle,
  isMobile,
  onClick,
  buttonLabel,
}: PropertyCardInfosProps) => (
  <div className="property-card-infos">
    {image ? (
      <img src={image} alt={name} />
    ) : (
      <FontAwesomeIcon icon={faHome} className="icon" />
    )}
    <div className="property-card-infos-description">
      <h3>{title}</h3>
      <p>{subtitle}</p>
      {!isMobile && (
        <div className="property-card-actions">
          <Button className="button" onClick={onClick} secondary raised>
            {buttonLabel}
          </Button>
        </div>
      )}
    </div>
  </div>
);

export default PropertyCardInfos;
