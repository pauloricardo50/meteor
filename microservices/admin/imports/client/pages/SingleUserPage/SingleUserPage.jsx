import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { ROLES } from 'core/api/constants';
import SingleUserPageContainer from './SingleUserPageContainer';
import SingleUserPageHeader from './SingleUserPageHeader';
import LoanSummaryList from '../../components/LoanSummaryList';

const SingleUserPage = ({ user, className, currentUser }) => {
  const { loans } = user;
  const isUser = currentUser.roles.includes(ROLES.USER);

  return (
    <section
      className={classnames('card1 card-top single-user-page', className)}
    >
      <SingleUserPageHeader user={user} currentUser={currentUser} />
      {isUser
        || (loans
          && loans.length > 0 && (
          <LoanSummaryList loans={loans} userId={user._id} withAdder />
        ))}
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
