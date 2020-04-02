import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';

import CollectionTasksTable from '../../components/TasksTable/CollectionTasksTable';
import LoanTabs from './LoanTabs';
import SingleLoanPageContacts from './SingleLoanPageContacts';
import SingleLoanPageContainer from './SingleLoanPageContainer';
import SingleLoanPageHeader from './SingleLoanPageHeader';

const SingleLoanPage = props => {
  const { loan } = props;
  return (
    <section className="single-loan-page">
      <Helmet>
        <title>{loan.user ? loan.user.name : loan.name}</title>
      </Helmet>
      <SingleLoanPageHeader loan={loan} />
      <div className="single-loan-page-sub-header">
        <CollectionTasksTable
          doc={loan}
          collection={LOANS_COLLECTION}
          withTaskInsert
          withQueryTaskInsert
          className="single-loan-page-tasks card1 card-top"
        />
        <SingleLoanPageContacts loanId={loan._id} />
      </div>
      <LoanTabs {...props} />
    </section>
  );
};

SingleLoanPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default SingleLoanPageContainer(SingleLoanPage);
