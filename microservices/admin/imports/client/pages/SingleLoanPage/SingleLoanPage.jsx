import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import LoanTabs from './LoanTabs';
import SingleLoanPageContainer from './SingleLoanPageContainer';
import SingleLoanPageHeader from './SingleLoanPageHeader';
import SingleLoanPageTasks from './SingleLoanPageTasks';

const SingleLoanPage = props => {
  const { loan } = props;
  return (
    <section className="single-loan-page">
      <Helmet>
        <title>{loan.user ? loan.user.name : loan.name}</title>
      </Helmet>
      <SingleLoanPageHeader loan={loan} />
      <SingleLoanPageTasks loan={loan} />
      <LoanTabs {...props} />
    </section>
  );
};

SingleLoanPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default SingleLoanPageContainer(SingleLoanPage);
