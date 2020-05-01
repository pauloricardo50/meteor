/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import './layout.scss';

import React from 'react';
import PropTypes from 'prop-types';

import LayoutFooter from './LayoutFooter';
import LayoutNav from './LayoutNav';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <LayoutNav />
      <main>{children}</main>
      <LayoutFooter />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
