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

const AdminNav = ({ currentURL }) => (
  <nav className="side-nav">

    <a href="/">
      <img src="/img/logo_black.svg" alt="e-Potek" style={styles.logo} />
    </a>

    <div style={styles.dropdown} className="text-center">
      <AdminActionsDropdown />
    </div>

    <ul className="side-nav-list">
      <li>
        <a href="/admin" className={currentURL === '/admin' && 'active-link'}>
          <span className="icon fa fa-home fa-2x" />
          <h5>Home</h5>
        </a>
      </li>
      <li>
        <a
          href="/admin/users"
          className={currentURL === '/admin/users' && 'active-link'}
        >
          <span className="icon fa fa-users fa-2x" />
          <h5>Utilisateurs</h5>
        </a>
      </li>
      <li>
        <a
          href="/admin/requests"
          className={currentURL === '/admin/requests' && 'active-link'}
        >
          <span className="icon fa fa-files-o fa-2x" />
          <h5>Demandes de Prêt</h5>
        </a>
      </li>
    </ul>

  </nav>
);

AdminNav.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any),
  currentURL: PropTypes.string.isRequired,
};

export default AdminNav;
