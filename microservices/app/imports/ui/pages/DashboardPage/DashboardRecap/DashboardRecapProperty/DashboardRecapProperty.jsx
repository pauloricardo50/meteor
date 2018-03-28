import React from 'react';
import PropTypes from 'prop-types';

import MapWithMarker from 'core/components/maps/MapWithMarker';
import Recap from 'core/components/Recap';
import { T } from 'core/components/Translation';

const getPropertyAddressString = ({ address1, zipCode, city }) =>
  `${address1}, ${zipCode} ${city}`;

const getRecapArray = (property) => {
  const { landArea, insideArea, expertise: { status } } = property;
  return [
    {
      title: true,
      label: 'Recap.property',
      labelStyle: {
        marginTop: 0,
      },
    },
    {
      subtitle: true,
      label: getPropertyAddressString(property),
      labelStyle: {
        marginTop: 0,
        marginBottom: 16,
      },
    },

    {
      label: 'Forms.insideArea',
      value: (
        <span>
          {insideArea} m<sup>2</sup>
        </span>
      ),
    },
    {
      label: 'Forms.landArea',
      value: (
        <span>
          {landArea} m<sup>2</sup>
        </span>
      ),
      hide: !landArea,
    },
    {
      label: 'property.expertise',
      value: <T id={`property.expertiseStatus.${status}`} />,
    },
  ];
};

const DashboardRecapProperty = (props) => {
  const { property } = props;
  return (
    <div className="dashboard-recap-property card1">
      <MapWithMarker
        address={getPropertyAddressString(property)}
        className="map"
      />
      <Recap array={getRecapArray(property)} className="recap" />
    </div>
  );
};

DashboardRecapProperty.propTypes = {
  property: PropTypes.object.isRequired,
};

export default DashboardRecapProperty;
