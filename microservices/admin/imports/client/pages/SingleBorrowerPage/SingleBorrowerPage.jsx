import React from 'react';
import PropTypes from 'prop-types';

import Recap from 'core/components/Recap';

import LoanSummaryList from '../../components/LoanSummaryList';
import SingleBorrowerPageContainer from './SingleBorrowerPageContainer';
import SingleBorrowerPageHeader from './SingleBorrowerPageHeader';

const SingleBorrowerPage = ({ borrower }) => {
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
  borrower: PropTypes.object.isRequired,
};

export default SingleBorrowerPageContainer(SingleBorrowerPage);
