import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import SingleUserPageContainer from './SingleUserPageContainer';
import SingleUserPageHeader from './SingleUserPageHeader';
import LoanSummaryList from '../../components/LoanSummaryList';

const SingleUserPage = ({ user, className, currentUser }) => {
  const { loans } = user;

  return (
    <section
      className={classnames('card1 card-top single-user-page', className)}
    >
      <SingleUserPageHeader user={user} currentUser={currentUser} />
      <LoanSummaryList loans={loans} userId={user._id} withAdder />
    </section>
  );
};

SingleUserPage.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object.isRequired,
};

SingleUserPage.defaultProps = {
  className: '',
};

export default SingleUserPageContainer(SingleUserPage);
