import React from 'react';

import IconButton from 'core/components/IconButton';
import Link from 'core/components/Link';
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
          src="/img/logo_square_white.svg"
          alt="e-Potek"
          className="logo logo-home"
        />
      </Link>
      <span className="epotek font-size-3 ml-8 mr-16">e-Potek</span>
    </div>
  );
};

export default SideNavHeader;
