import React from 'react';
import PropTypes from 'prop-types';

import TopNav from 'core/components/TopNav';
import TopNavDrawer from './TopNavDrawer';

const AppTopNav = props =>
  <TopNav appChildren={navProps => <TopNavDrawer {...navProps} />} />;
AppTopNav.propTypes = {};

export default AppTopNav;
