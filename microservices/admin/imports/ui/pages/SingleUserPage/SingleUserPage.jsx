import React from 'react';
import PropTypes from 'prop-types';

import SingleUserPageContainer from './SingleUserPageContainer';
import SingleUserPageHeader from './SingleUserPageHeader';
import SingleUserPageLoans from './SingleUserPageLoans';

const SingleUserPage = (props) => {
  const { data, isLoading } = props;
  const user = data;

  if (isLoading || !user) return null;

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
