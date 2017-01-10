import React, { PropTypes } from 'react';


import AdminActionsDropdown from './AdminActionsDropdown.jsx';

const styles = {
  logo: {
    // width: 160,
    maxHeight: 25,
    paddingLeft: 20,
    paddingRight: 20,
  },
  dropdown: {
    // margin: 'auto',
    marginTop: 20,
    marginBottom: 20,
  },
};

const AdminNav = () => (
  <nav className="side-nav">

    <a href="/">
      <img src="/img/logo_black.svg" alt="e-Potek" style={styles.logo} />
    </a>

    <div style={styles.dropdown} className="text-center">
      <AdminActionsDropdown />
    </div>

    <a href="/admin" className="admin-nav-link">
      <span className="fa fa-home fa-2x" />
      Home
    </a>

    <a href="/admin/users" className="admin-nav-link">
      <span className="fa fa-users fa-2x" />
      Utilisateurs
    </a>

    <a href="/admin/requests" className="admin-nav-link">
      <span className="fa fa-files-o fa-2x" />
      Demandes de Prêt
    </a>

  </nav>
);

AdminNav.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any),
  currentURL: PropTypes.string.isRequired,
};

export default AdminNav;
