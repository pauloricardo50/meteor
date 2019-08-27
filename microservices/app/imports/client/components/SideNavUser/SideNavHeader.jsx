import React from 'react';

import Link from 'core/components/Link';
import IconButton from 'core/components/IconButton';
import useMedia from 'core/hooks/useMedia';

const SideNavHeader = ({ closeDrawer }) => {
  const isMobile = useMedia({ maxWidth: 768 });

  return (
    <div className="top-bar side-nav-header">
      {isMobile && (
        <IconButton
          className="drawer-toggle"
          type="menu"
          onClick={closeDrawer}
        />
      )}
      <Link to="/">
        <img
          src="/img/logo_square_black.svg"
          alt="e-Potek"
          className="logo logo-home"
        />
      </Link>
    </div>
  );
};

export default SideNavHeader;
