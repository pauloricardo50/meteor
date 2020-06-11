import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import { PROPERTY_CATEGORY } from 'core/api/properties/propertyConstants';
import { PropertyForm } from 'core/components/forms';
import MapWithMarker from 'core/components/maps/MapWithMarker';
import Recap from 'core/components/Recap';

import LoanSummaryList from '../../components/LoanSummaryList';
import AdminProPropertyPage from './AdminProPropertyPage';
import SinglePropertyPageContainer from './SinglePropertyPageContainer';
import SinglePropertyPageHeader from './SinglePropertyPageHeader';

export const getPropertyAddress = ({ address1, zipCode, city }) =>
  address1 && zipCode && city ? `${address1}, ${zipCode} ${city}` : undefined;

const SinglePropertyPage = props => {
  const { property, displayLoans, className, loanId } = props;

  if (property.category === PROPERTY_CATEGORY.PRO) {
    return <AdminProPropertyPage property={property} />;
  }

  const { loans } = property;
  const address = getPropertyAddress(property);

  return (
    <section className={cx('single-property-page', className)}>
      <SinglePropertyPageHeader property={property} loanId={loanId} />
      <div className="property-recap">
        <Recap arrayName="property" property={property} />
      </div>
      {displayLoans && loans && <LoanSummaryList loans={loans} />}
      {address && (
        <div className="google-map">
          <MapWithMarker address={address} className="map" id={address} />
        </div>
      )}

      <PropertyForm property={property} />
    </section>
  );
};

SinglePropertyPage.propTypes = {
  className: PropTypes.string,
  displayLoans: PropTypes.bool,
  property: PropTypes.object.isRequired,
};

SinglePropertyPage.defaultProps = {
  displayLoans: true,
  className: '',
};

export default SinglePropertyPageContainer(SinglePropertyPage);
