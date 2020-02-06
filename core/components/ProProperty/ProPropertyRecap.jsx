//
import React from 'react';

import { PROPERTY_TYPE } from 'core/api/constants';
import T from '../Translation';

const INFOS_TO_DISPLAY = {
  roomCount: { type: 'number' },
  insideArea: { type: 'area' },
  landArea: { type: 'area' },
  terraceArea: { type: 'area' },
  gardenArea: { type: 'area' },
  constructionYear: { type: 'number' },
};

const formatInfo = ({ property, key }) => {
  const { type } = INFOS_TO_DISPLAY[key];
  const value = property[key];

  switch (type) {
    case 'number':
      return value;
    case 'area':
      return `${value} m2`;
    default:
      return value;
  }
};

const ProPropertyRecap = ({ property }) => {
  const { propertyType, flatType, houseType } = property;
  return (
    <div className="pro-property-recap">
      {propertyType === PROPERTY_TYPE.HOUSE && houseType && (
        <div key="houseType">
          <h4>
            <T id="Forms.houseType" />
          </h4>
          <p>
            <T id={`Forms.houseType.${houseType}`} />
          </p>
        </div>
      )}
      {propertyType === PROPERTY_TYPE.FLAT && flatType && (
        <div key="flatType">
          <h4>
            <T id="Forms.flatType" />
          </h4>
          <p>
            <T id={`Forms.flatType.${flatType}`} />
          </p>
        </div>
      )}
      {Object.keys(property)
        .filter(key => Object.keys(INFOS_TO_DISPLAY).includes(key))
        .filter(key => property[key])
        .map(key => (
          <div key={key}>
            <h4>
              <T id={`Forms.variable.${key}`} />
            </h4>
            <p>{formatInfo({ property, key })}</p>
          </div>
        ))}
    </div>
  );
};

export default ProPropertyRecap;
