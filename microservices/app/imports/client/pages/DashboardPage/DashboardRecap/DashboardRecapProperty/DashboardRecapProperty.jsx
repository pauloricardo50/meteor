import React from 'react';
import PropTypes from 'prop-types';

import MapWithMarker from 'core/components/maps/MapWithMarker';
import Recap from 'core/components/Recap';
import { T, MetricArea } from 'core/components/Translation';
import { PropertyAdder, PropertyModifier } from 'core/components/PropertyForm';

const getPropertyAddressString = ({ address1, zipCode, city }) =>
  `${address1}, ${zipCode} ${city}`;

const getRecapArray = (property) => {
  const {
    landArea,
    insideArea,
    expertise: { status },
  } = property;
  return [
    {
      subtitle: true,
      label: getPropertyAddressString(property),
      labelStyle: { marginTop: 0, marginBottom: 16, textAlign: 'left' },
      noIntl: true,
    },
    {
      label: 'Forms.insideArea',
      value: <MetricArea value={insideArea} />,
    },
    {
      label: 'Forms.landArea',
      value: <MetricArea value={landArea} />,
      hide: !landArea,
    },
    {
      label: 'property.expertise',
      value: <T id={`property.expertiseStatus.${status}`} />,
    },
  ];
};

const shouldDisplay = ({ address1, zipCode, city }) =>
  address1 && city && zipCode;

const getContent = (property, loanId) => {
  // if (!property) {
  //   return <PropertyAdder loanId={loanId} />;
  // } else
  if (!shouldDisplay(property)) {
    return <PropertyModifier loanId={loanId} property={property} />;
  }

  return (
    <React.Fragment>
      <MapWithMarker
        address={getPropertyAddressString(property)}
        className="map"
        options={{ zoom: 10 }}
      />
      <h3>
        <T id="Recap.property" />
      </h3>
      <Recap array={getRecapArray(property)} className="recap" />
    </React.Fragment>
  );
};

const DashboardRecapProperty = ({ loan: { property, _id: loanId } }) => (
  <div className="dashboard-recap-property card1">
    {getContent(property, loanId)}
  </div>
);

DashboardRecapProperty.propTypes = {
  loan: PropTypes.object.isRequired,
};

export default DashboardRecapProperty;
