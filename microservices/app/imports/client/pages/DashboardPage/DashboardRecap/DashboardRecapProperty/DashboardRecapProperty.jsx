import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Link from 'core/components/Link';
import { createRoute } from 'core/utils/routerUtils';
import { VALUATION_STATUS } from 'core/api/properties/propertyConstants';
import MapWithMarker from 'core/components/maps/MapWithMarker';
import Recap from 'core/components/Recap';
import { T, MetricArea } from 'core/components/Translation';
import { PropertyModifier } from 'core/components/PropertyForm';
import { toMoney } from 'core/utils/conversionFunctions';
import SwitzerlandMap from 'core/components/maps/SwitzerlandMap';
import ROUTES from '../../../../../startup/client/appRoutes';
import DashboardRecapPropertyEmpty from './DashboardRecapPropertyEmpty';

const getPropertyAddressString = ({ address1, zipCode, city }) =>
  `${address1}, ${zipCode} ${city}`;

export const getRecapArray = (property) => {
  const {
    landArea,
    insideArea,
    value,
    valuation: { status, min, max },
  } = property;
  return [
    {
      label: 'Forms.value',
      value: toMoney(value),
      hide: !value,
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
    // {
    //   label: 'property.expertise',
    //   value:
    //     status === VALUATION_STATUS.DONE ? (
    //       <p>{`CHF ${toMoney(min)} - ${toMoney(max)}`}</p>
    //     ) : (
    //       <T id={`property.expertiseStatus.${status}`} />
    //     ),
    // },
  ];
};

const shouldDisplay = ({ address1, zipCode, city }) =>
  address1 && city && zipCode;

const getContent = (property, loanId, growRecap) => {
  const canDisplayDetails = shouldDisplay(property, loanId);
  const propertyAddress = getPropertyAddressString(property);
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
      <h3 className="dashboard-recap-property-title">
        {canDisplayDetails ? propertyAddress : <T id="Recap.property" />}
      </h3>
      {canDisplayDetails ? (
        <Recap
          array={getRecapArray(property)}
          className={cx('recap', { large: growRecap })}
        />
      ) : (
        <span className="dashboard-recap-property-modifier">
          <PropertyModifier property={property} />
        </span>
      )}
    </React.Fragment>
  );
};

const DashboardRecapProperty = ({ property, loanId, growRecap }) => {
  // Documents are merged into property, so check if the _id is defined
  if (!property || !property._id) {
    return <DashboardRecapPropertyEmpty loanId={loanId} />;
  }

  return (
    <Link
      to={createRoute(ROUTES.PROPERTY_PAGE.path, {
        ':propertyId': property._id,
        ':loanId': loanId,
      })}
      className="dashboard-recap-property card1 card-hover"
      onClick={(event) => {
        // Do this to prevent the link from triggering if a form is submitted
        // in the propertyModifier
        // This hack skips the link in react-router
        // https://github.com/ReactTraining/react-router/blob/0853628daff26a809e5384f352fada57753fc1c3/packages/react-router-dom/modules/Link.js#L7
        if (event.target.type === 'submit') {
          event.metaKey = true;
        }
      }}
    >
      {getContent(property, loanId, growRecap)}
    </Link>
  );
};

DashboardRecapProperty.propTypes = {
  loanId: PropTypes.string,
  property: PropTypes.object.isRequired,
};

export default DashboardRecapProperty;
