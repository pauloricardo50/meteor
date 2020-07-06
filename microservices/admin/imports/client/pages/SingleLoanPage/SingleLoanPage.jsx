import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import CollectionTasksDataTable from '../../components/TasksDataTable/CollectionTasksDataTable';
import UnsuccessfulReasonModal from '../../components/UnsuccessfulReasonModal/UnsuccessfulReasonModal';
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
        <CollectionTasksDataTable
          docId={loan._id}
          collection={loan._collection}
          className="single-loan-page-tasks card1 card-top"
        />
        <SingleLoanPageContacts loanId={loan._id} />
      </div>
      <LoanTabs {...props} />
      <UnsuccessfulReasonModal loan={loan} />
    </section>
  );
};

SingleLoanPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default SingleLoanPageContainer(SingleLoanPage);
