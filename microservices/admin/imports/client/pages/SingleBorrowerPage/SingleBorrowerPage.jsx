import React from 'react';
import PropTypes from 'prop-types';

import { BorrowerForm } from 'core/components/forms';
import Recap from 'core/components/Recap';

import LoanSummaryList from '../../components/LoanSummaryList';
import SingleBorrowerPageContainer from './SingleBorrowerPageContainer';
import SingleBorrowerPageHeader from './SingleBorrowerPageHeader';

const SingleBorrowerPage = ({ borrower }) => {
  const { loans } = borrower;

  return (
    <section className="card1 card-top single-borrower-page">
      <SingleBorrowerPageHeader borrower={borrower} />
      <div className="borrower-recap">
        <Recap arrayName="borrower" borrower={borrower} />
      </div>
      {loans && <LoanSummaryList loans={loans} />}
      <h2>Formulaires</h2>
      <BorrowerForm borrower={borrower} />
    </section>
  );
};

SingleBorrowerPage.propTypes = {
  borrower: PropTypes.object.isRequired,
};

export default SingleBorrowerPageContainer(SingleBorrowerPage);
