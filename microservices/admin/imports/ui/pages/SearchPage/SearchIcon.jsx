import React from 'react';
import { Link } from 'react-router-dom';
import IconButton from 'core/components/IconButton';

const SearchIcon = () => (
  <Link to="/search">
    <IconButton type="search" />
  </Link>
);

export default SearchIcon;
