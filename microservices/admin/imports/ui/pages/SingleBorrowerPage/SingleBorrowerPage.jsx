import React from 'react';
import PropTypes from 'prop-types';

import Loading from 'core/components/Loading';
import Recap from 'core/components/Recap';

import SingleBorrowerPageContainer from './SingleBorrowerPageContainer';
import SingleBorrowerPageHeader from './SingleBorrowerPageHeader';
import LoanSummaryList from '../../components/LoanSummaryList';

const SingleBorrowerPage = ({ data: borrower, isLoading }) => {
  const { loans } = borrower;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="mask1 single-user-page">
      <SingleBorrowerPageHeader borrower={borrower} />
      {loans && <LoanSummaryList loans={loans} />}
      <Recap arrayName="borrower" borrower={borrower} />
    </section>
  );
};

SingleBorrowerPage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
};

export default SingleBorrowerPageContainer(SingleBorrowerPage);
