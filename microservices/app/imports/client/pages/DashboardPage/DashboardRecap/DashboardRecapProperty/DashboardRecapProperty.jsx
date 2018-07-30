import React from 'react';
import PropTypes from 'prop-types';

import { EXPERTISE_STATUS } from 'core/api/properties/propertyConstants';
import MapWithMarker from 'core/components/maps/MapWithMarker';
import Recap from 'core/components/Recap';
import { T, MetricArea } from 'core/components/Translation';
import { PropertyAdder, PropertyModifier } from 'core/components/PropertyForm';
import { toMoney } from 'core/utils/conversionFunctions';

const getPropertyAddressString = ({ address1, zipCode, city }) => `${address1}, ${zipCode} ${city}`;

export const getRecapArray = (property) => {
  const {
    landArea,
    insideArea,
    valuation: { status, min, max },
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
      value:
        status === EXPERTISE_STATUS.DONE ? (
          <p>
            {`CHF ${toMoney(min)} - ${toMoney(max)}`}
          </p>
        ) : (
          <T id={`property.expertiseStatus.${status}`} />
        ),
    },
  ];
};

const shouldDisplay = ({ address1, zipCode, city }) => address1 && city && zipCode;

const getContent = (property, loanId) => {
  // if (!property) {
  //   return <PropertyAdder loanId={loanId} />;
  // } else
  if (!shouldDisplay(property)) {
    return <PropertyModifier property={property} />;
  }
  console.log(getRecapArray(property));
  return (
    <React.Fragment>
      <MapWithMarker
        address={getPropertyAddressString(property)}
        className="map"
        options={{ zoom: 10 }}
        id={property._id}
      />
      <h3>
        <T id="Recap.property" />
      </h3>
      <Recap array={getRecapArray(property)} className="recap" />
    </React.Fragment>
  );
};

const DashboardRecapProperty = ({ property, loanId }) => (
  <div className="dashboard-recap-property card1">
    {getContent(property, loanId)}
  </div>
);

DashboardRecapProperty.propTypes = {
  property: PropTypes.object.isRequired,
  loanId: PropTypes.string,
};

export default DashboardRecapProperty;
