import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { createRoute } from 'core/utils/routerUtils';

import { VALUATION_STATUS } from 'core/api/properties/propertyConstants';
import MapWithMarker from 'core/components/maps/MapWithMarker';
import Recap from 'core/components/Recap';
import { T, MetricArea } from 'core/components/Translation';
import { PropertyModifier } from 'core/components/PropertyForm';
import { toMoney } from 'core/utils/conversionFunctions';
import { PROPERTY_PAGE } from '../../../../../startup/client/appRoutes';
import SwitzerlandMap from 'core/components/maps/SwitzerlandMap';

const getPropertyAddressString = ({ address1, zipCode, city }) =>
  `${address1}, ${zipCode} ${city}`;

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
      value: (
        <MetricArea
          value={insideArea}
          placeholder={<T id="Forms.insideArea.recapPlaceholder" />}
        />
      ),
    },
    {
      label: 'Forms.landArea',
      value: <MetricArea value={landArea} />,
      hide: !landArea,
    },
    {
      label: 'property.expertise',
      value:
        status === VALUATION_STATUS.DONE ? (
          <p>{`CHF ${toMoney(min)} - ${toMoney(max)}`}</p>
        ) : (
          <T id={`property.expertiseStatus.${status}`} />
        ),
    },
  ];
};

const shouldDisplay = ({ address1, zipCode, city }) =>
  address1 && city && zipCode;

const getContent = (property, loanId) => {
  const canDisplayDetails = shouldDisplay(property, loanId);
  return (
    <React.Fragment>
      {canDisplayDetails ? (
        <MapWithMarker
          address={getPropertyAddressString(property)}
          className="map"
          options={{ zoom: 10 }}
          id={property._id}
        />
      ) : (
          <SwitzerlandMap className="map" />
      )}
      <h3>
        <T id="Recap.property" />
      </h3>
      {canDisplayDetails ? (
        <Recap array={getRecapArray(property)} className="recap" />
      ) : (
        <span className="dashboard-recap-property-modifier">
          <PropertyModifier property={property} />
        </span>
      )}
    </React.Fragment>
  );
};

const DashboardRecapProperty = ({ property, loanId }) => (
  <Link
    to={createRoute(PROPERTY_PAGE, {
      ':propertyId': property._id,
      ':loanId': loanId,
    })}
    className="dashboard-recap-property card1 card-hover"
  >
    {getContent(property, loanId)}
  </Link>
);

DashboardRecapProperty.propTypes = {
  loanId: PropTypes.string,
  property: PropTypes.object.isRequired,
};

export default DashboardRecapProperty;
