import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Recap from 'core/components/Recap';
import Valuation from 'core/components/Valuation';
import MapWithMarker from 'core/components/maps/MapWithMarker';
import LoanSummaryList from '../../components/LoanSummaryList';
import SinglePropertyPageContainer from './SinglePropertyPageContainer';
import SinglePropertyPageHeader from './SinglePropertyPageHeader';

export const getPropertyAddress = ({ address1, zipCode, city }) =>
  (address1 && zipCode && city ? `${address1}, ${zipCode} ${city}` : undefined);

const SinglePropertyPage = ({
  property,
  displayLoans,
  className,
}) => {
  const { loans } = property;
  const address = getPropertyAddress(property);

  return (
    <section className={cx('single-property-page', className)}>
      <SinglePropertyPageHeader property={property} />
      <Valuation property={property} />
      <div className="property-recap">
        <Recap arrayName="property" property={property} />
      </div>
      {displayLoans && loans && <LoanSummaryList loans={loans} />}
      {address && (
        <div className="google-map">
          <MapWithMarker address={address} className="map" id={address} />
        </div>
      )}
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
