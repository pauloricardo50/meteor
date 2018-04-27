import React from 'react';
import PropTypes from 'prop-types';

import Loading from 'core/components/Loading';

import SingleUserPageContainer from './SingleUserPageContainer';
import SingleUserPageHeader from './SingleUserPageHeader';
import LoanSummaryList from '../../components/LoanSummaryList';

const SingleUserPage = ({ data: user, isLoading }) => {
  const { loans } = user;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="mask1 single-user-page">
      <SingleUserPageHeader user={user} />
      {loans && <LoanSummaryList loans={loans} />}
    </section>
  );
};

SingleUserPage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
};

export default SingleUserPageContainer(SingleUserPage);
