import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import T from 'core/components/Translation';
import IconButton from 'core/components/IconButton';

const DrawerHeader = ({ showButton, onClick }) => (
  <div className="top-bar drawer-header">
    <Link to="/">
      <img
        src="/img/logo_square_black.svg"
        alt="e-Potek"
        className="logo logo-home"
      />
    </Link>
    {showButton && (
      <IconButton
        onClick={onClick}
        style={{
          top: 8,
          right: 8,
          position: 'absolute',
          zIndex: 100,
        }}
        type="close"
        tooltip={<T id="general.close" />}
        tooltipPlacement="bottom-start"
      />
    )}
  </div>
);

DrawerHeader.propTypes = {
  onClick: PropTypes.func,
  showButton: PropTypes.bool,
};

DrawerHeader.defaultProps = {
  showButton: false,
  onClick: undefined,
};

export default DrawerHeader;
