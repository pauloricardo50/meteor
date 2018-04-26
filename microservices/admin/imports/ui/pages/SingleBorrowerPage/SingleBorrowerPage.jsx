import React from 'react';
import PropTypes from 'prop-types';

import Loading from 'core/components/Loading';
import Recap from 'core/components/Recap';

import SingleBorrowerPageContainer from './SingleBorrowerPageContainer';
import SingleBorrowerPageHeader from './SingleBorrowerPageHeader';
import LoanSummaryList from '../../components/LoanSummaryList';

const SingleBorrowerPage = ({ data: borrower, isLoading }) => {
  if (isLoading) {
    return <Loading />;
  }

  const { loans } = borrower;

  return (
    <section className="mask1 single-borrower-page">
      <SingleBorrowerPageHeader borrower={borrower} />
      <div className="borrower-recap">
        <Recap arrayName="borrower" borrower={borrower} />
      </div>
      {loans && <LoanSummaryList loans={loans} />}
    </section>
  );
};

SingleBorrowerPage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
};

export default SingleBorrowerPageContainer(SingleBorrowerPage);
