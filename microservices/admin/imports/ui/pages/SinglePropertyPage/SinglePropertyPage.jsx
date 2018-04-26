import React from 'react';
import PropTypes from 'prop-types';

import Loading from 'core/components/Loading';
import Recap from 'core/components/Recap';

import LoanSummaryList from '../../components/LoanSummaryList';
import SinglePropertyPageContainer from './SinglePropertyPageContainer';
import SinglePropertyPageHeader from './SinglePropertyPageHeader';

const SinglePropertyPage = ({ data: property, isLoading, displayLoans }) => {
  if (isLoading) {
    return <Loading />;
  }

  const { loans } = property;

  return (
    <section className="mask1 single-property-page">
      <SinglePropertyPageHeader property={property} />
      <div className="property-recap">
        <Recap arrayName="property" property={property} />
      </div>
      {displayLoans && loans && <LoanSummaryList loans={loans} />}
    </section>
  );
};

SinglePropertyPage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  displayLoans: PropTypes.bool,
};

SinglePropertyPage.defaultProps = {
  displayLoans: true,
};

export default SinglePropertyPageContainer(SinglePropertyPage);
