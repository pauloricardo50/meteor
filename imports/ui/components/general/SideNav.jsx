import React from 'react';

import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';

import FinanceWidget from '/imports/ui/components/general/FinanceWidget.jsx';

const SideNav = () => (
  <nav className="side-nav hidden-xs">

    <a href="/">
      <img src="img/logo_black.svg" alt="e-Potek" width="160px" style={{ paddingLeft: 20, paddingRight: 20 }} />
    </a>

    <a href="/main">
      <ul>
        <li><h5 className="active bold"><span className="fa fa-home active" />  Rue des Alouettes 12</h5></li>
        <li className="secondary">CHF 1'152'000</li>
      </ul>
    </a>

    <FinanceWidget />

  </nav>
);

export default SideNav;
