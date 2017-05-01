import PropTypes from 'prop-types';
import React from 'react';

const AdminSingleUserPage = props => {
  return (
    <section className="mask1">
      <h1>{props.user.emails[0].address}</h1>
    </section>
  );
};

AdminSingleUserPage.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.any),
  borrowers: PropTypes.arrayOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any).isRequired,
};

AdminSingleUserPage.defaultProps = {
  loanRequest: [],
  borrowers: [],
};

export default AdminSingleUserPage;
