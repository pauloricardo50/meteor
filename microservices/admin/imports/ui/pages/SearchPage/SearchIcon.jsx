import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'core/components/Icon';

const SearchIcon = () => (
  <Link to="/search">
    <Icon type="search" />
  </Link>
);

export default SearchIcon;
