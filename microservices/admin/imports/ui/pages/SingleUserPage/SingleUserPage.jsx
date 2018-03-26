import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import Loan from './Loan';
import SingleUserPageContainer from './SingleUserPageContainer';

const styles = {
  createdAt: {
    marginBottom: 32,
    clear: 'both',
  },
};

const SingleUserPage = (props) => {
  const { history, data, isLoading } = props;
  const user = data;

  if (isLoading || !user) return null;

  const { loans } = data;

  return (
    <section className="mask1 single-user-page">
      <h1>{user.emails[0].address}</h1>

      <ImpersonateLink userId={user._id} className="impersonate-link" />

      <p className="secondary" style={styles.createdAt}>
        Créé le {moment(user.createdAt).format('D MMM YY à HH:mm:ss')}
      </p>

      <h3>Demandes de prêt</h3>
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

export default SingleUserPageContainer(SingleUserPage);
