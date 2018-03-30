import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import { T } from 'core/components/Translation';
import Loan from './Loan';
import SingleUserPageContainer from './SingleUserPageContainer';

const styles = {
  createdAt: {
    marginBottom: 32,
  },
};

const SingleUserPage = (props) => {
  const { history, data, isLoading } = props;
  const user = data;

  if (isLoading || !user) return null;

  const { loans } = data;
  const userCreatedAtFormatted = (
    <p className="secondary" style={styles.createdAt}>
      <T id="UsersTable.createdAt" />{' '}
      {moment(user.createdAt).format('D MMM YY à HH:mm:ss')}
    </p>
  );

  const userAssignedEmployee = user.assignedEmployee ? (
    <p>
      <T id="UsersTable.assignedTo" /> {user.assignedEmployee.emails[0].address}
    </p>
  ) : null;

  return (
    <section className="mask1">
      <h1>{user.emails[0].address}</h1>

      <ImpersonateLink user={user} className="impersonate-link" />

      {userCreatedAtFormatted}
      {userAssignedEmployee}
      <h3>
        <T id="collections.loans" />
      </h3>
      {loans &&
        loans.map(loan => (
          <Loan
            loan={loan}
            key={loan._id}
            history={history}
            borrowers={loan.borrowers}
            property={loan.property}
          />
        ))}
    </section>
  );
};

SingleUserPage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default SingleUserPageContainer(SingleUserPage);
