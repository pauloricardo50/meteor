import PropTypes from 'prop-types';
import React from 'react';

import moment from 'moment';

import Request from './Request';

const AdminSingleUserPage = ({
  user,
  loanRequests,
  borrowers,
  history,
  properties,
}) => (
  <section className="mask1">
    <h1>{user.emails[0].address}</h1>
    <p className="secondary" style={{ marginBottom: 32 }}>
      Créé le {moment(user.createdAt).format('D MMM YY à HH:mm:ss')}
    </p>

    <h3>Demandes de prêt</h3>
    {loanRequests.map(request => (
      <Request
        loanRequest={request}
        key={request._id}
        history={history}
        borrowers={borrowers.filter(b => request.borrowers.indexOf(b._id) >= 0)}
        property={properties.find(p => p._id === request.property)}
      />
    ))}
  </section>
);

AdminSingleUserPage.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.any),
  borrowers: PropTypes.arrayOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  properties: PropTypes.arrayOf(PropTypes.object).isRequired,
};

AdminSingleUserPage.defaultProps = {
  loanRequests: [],
  borrowers: [],
};

export default AdminSingleUserPage;
