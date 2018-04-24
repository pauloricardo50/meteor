import React from 'react';
import PropTypes from 'prop-types';

import LayoutError from 'core/components/ErrorBoundary/LayoutError';
import Loading from 'core/components/Loading';

import SingleUserPageContainer from './SingleUserPageContainer';
import SingleUserPageHeader from './SingleUserPageHeader';
import SingleUserPageLoans from './SingleUserPageLoans';

const SingleUserPage = ({ data: user, isLoading }) => {
  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <LayoutError errorDescription="missingDoc" displayReloadButton={false} />
    );
  }

  return (
    <section className="mask1 single-user-page">
      <SingleUserPageHeader user={user} />
      <SingleUserPageLoans user={user} />
    </section>
  );
};

SingleUserPage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
};

export default SingleUserPageContainer(SingleUserPage);
