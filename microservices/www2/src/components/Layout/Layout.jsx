/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';

import './layout.scss';
import LayoutNav from './LayoutNav';
import LayoutFooter from './LayoutFooter';

const Layout = ({ children, pageContext }) => {
  const { i18n } = pageContext;

  return (
    <div className="layout">
      <LayoutNav />
      <main>{children}</main>
      <LayoutFooter i18n={i18n} />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
