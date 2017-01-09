import React, { PropTypes } from 'react';


const styles = {
  logo: {
    // width: 160,
    maxHeight: 25,
    paddingLeft: 20,
    paddingRight: 20,
  },
};

const AdminNav = () => (
  <nav className="side-nav">

    <a href="/">
      <img src="/img/logo_black.svg" alt="e-Potek" style={styles.logo} />
    </a>

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
