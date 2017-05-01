import PropTypes from 'prop-types';
import React from 'react';

const AdminSingleUserPage = props => {
  const user = props.users.find(user => user._id === props.match.params.userId);
  return (
    <section className="mask1">
      <h1>{user.emails[0].address}</h1>
    </section>
  );
};

AdminSingleUserPage.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.any).isRequired,
  // user: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AdminSingleUserPage;
