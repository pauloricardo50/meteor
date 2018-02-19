import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import Loan from './Loan';

const styles = {
  createdAt: {
    marginBottom: 32,
  },
};

const SingleUserPage = (props) => {
  const { history, data, isLoading } = props;
  const user = data;

  if (isLoading || !user) return null;

  const loans = data.loansLink;

  return (
    <section className="mask1">
      <h1>{user.emails[0].address}</h1>
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
            borrowers={loan.borrowersLink}
            property={loan.propertyLink}
          />
        ))}
    </section>
  );
};

export default SingleUserPage;
