import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import FinanceWidget from '/imports/ui/components/general/FinanceWidget.jsx';
import ProjectChart from '/imports/ui/components/charts/ProjectChart.jsx';

const styles = {
  logo: {
    // width: 160,
    maxHeight: 25,
    paddingLeft: 20,
    paddingRight: 20,
  },
};

export default class AdminNav extends Component {

  render() {
    return (
      <nav className="side-nav">

        <a href="/">
          <img src="/img/logo_black.svg" alt="e-Potek"  style={styles.logo} />
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
  }
}

AdminNav.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any),
  currentURL: PropTypes.string.isRequired,
};
