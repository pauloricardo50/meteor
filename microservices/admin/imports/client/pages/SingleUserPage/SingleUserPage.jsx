import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import SingleUserPageContainer from './SingleUserPageContainer';
import SingleUserPageHeader from './SingleUserPageHeader';
import LoanSummaryList from '../../components/LoanSummaryList';

const SingleUserPage = ({ user, className }) => {
  const { loans } = user;

  return (
    <section className={classnames('mask1', 'single-user-page', className)}>
      <SingleUserPageHeader user={user} />
      {loans && <LoanSummaryList loans={loans} userId={user._id} />}
    </section>
  );
};

SingleUserPage.propTypes = {
  user: PropTypes.object.isRequired,
  className: PropTypes.string,
};

SingleUserPage.defaultProps = {
  className: '',
};

export default SingleUserPageContainer(SingleUserPage);
