import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

const LayoutNav = ({ siteTitle }) => (
  <nav className="layout-nav">
    <Link to="/">e-Potek</Link>
  </nav>
);

LayoutNav.propTypes = {
  siteTitle: PropTypes.string,
};

LayoutNav.defaultProps = {
  siteTitle: '',
};

export default LayoutNav;
