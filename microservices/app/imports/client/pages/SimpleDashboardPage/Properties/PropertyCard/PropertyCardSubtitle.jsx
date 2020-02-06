import React from 'react';
import cx from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';

import { RESIDENCE_TYPE } from 'core/api/constants';
import T, { Money } from 'core/components/Translation';
import Icon from 'core/components/Icon';
import { PROPERTY_CATEGORY } from 'imports/core/api/constants';

const PropertyCardSubtitle = ({
  maxPropertyValue,
  property,
  residenceType,
}) => {
  let isSolvent;

  if (
    maxPropertyValue &&
    maxPropertyValue.date &&
    maxPropertyValue.main &&
    maxPropertyValue.second &&
    residenceType
  ) {
    let max;
    if (residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE) {
      max = maxPropertyValue.main.max.propertyValue;
    } else if (residenceType === RESIDENCE_TYPE.SECOND_RESIDENCE) {
      max = maxPropertyValue.second.max.propertyValue;
    }

    if (max) {
      isSolvent = property.totalValue <= max;
    }
  }

  if (property.category !== PROPERTY_CATEGORY.PRO) {
    // Don't show solvency for non-PRO properties
    isSolvent = undefined;
  }

  return (
    <span className="flex-col property-card-subtitle">
      <Money value={property.totalValue} />
      {isSolvent !== undefined ? (
        <Tooltip
          title={
            <T
              id={`PropertyCardSubtitle.${
                isSolvent ? 'solvent' : 'nonSolvent'
              }.tooltip`}
            />
          }
        >
          <span className={cx({ error: !isSolvent, success: isSolvent })}>
            <T
              id={
                isSolvent
                  ? 'PropertyCardSubtitle.solvent'
                  : 'PropertyCardSubtitle.nonSolvent'
              }
            />
            &nbsp;
            <Icon type={isSolvent ? 'check' : 'close'} />
          </span>
        </Tooltip>
      ) : null}
    </span>
  );
};
export default PropertyCardSubtitle;
