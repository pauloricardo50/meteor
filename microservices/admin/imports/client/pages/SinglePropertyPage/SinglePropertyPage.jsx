import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Recap from 'core/components/Recap';
import Valuation from 'core/components/Valuation';
import MapWithMarker from 'core/components/maps/MapWithMarker';
import { PropertyForm } from 'core/components/forms';
import { PROPERTY_CATEGORY } from 'core/api/constants';
import AdminProPropertyPage from './AdminProPropertyPage';
// import { ProPropertyPage } from 'core/components/ProPropertyPage/ProPropertyPage';
import LoanSummaryList from '../../components/LoanSummaryList';
import SinglePropertyPageContainer from './SinglePropertyPageContainer';
import SinglePropertyPageHeader from './SinglePropertyPageHeader';

export const getPropertyAddress = ({ address1, zipCode, city }) =>
  (address1 && zipCode && city ? `${address1}, ${zipCode} ${city}` : undefined);

const SinglePropertyPage = (props) => {
  const { property, displayLoans, className, loanResidenceType } = props;

  if (property.category === PROPERTY_CATEGORY.PRO) {
    return <AdminProPropertyPage property={property} />;
  }

  const { loans } = property;
  const address = getPropertyAddress(property);
  let residenceType = loanResidenceType;

  if (!loanResidenceType) {
    // On the SinglePropertyPage accessed through the sidenav, the loan
    // is not specifically defined, so use the residenceType of the first
    // loan instead
    // Warning: this might be false if multiple loans point to this property
    residenceType = loans && loans.length > 0 && loans[0].residenceType;
  }

  return (
    <section className={cx('single-property-page', className)}>
      <SinglePropertyPageHeader property={property} />
      {residenceType && (
        <Valuation property={property} loanResidenceType={residenceType} />
      )}
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
