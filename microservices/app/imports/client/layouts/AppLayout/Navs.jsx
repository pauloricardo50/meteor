import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AppTopNav from './AppTopNav';
import PermanentSideNav from './PermanentSideNav';

const Navs = props => {
  const { shouldShowSideNav } = props;
  const [open, setOpen] = useState(false);

  const handleToggle = nextState =>
    typeof nextState === 'boolean'
      ? setOpen(nextState)
      : setOpen(prev => !prev);

  return (
    <div className="navs">
      <AppTopNav
        shouldShowSideNav={shouldShowSideNav}
        toggleDrawer={handleToggle}
      />

      <div className="permanent-side-nav">
        {shouldShowSideNav && (
          <PermanentSideNav
            open={open}
            closeDrawer={() => handleToggle(false)}
            {...props}
          />
        )}
      </div>
    </div>
  );
};

Navs.propTypes = {
  shouldShowSideNav: PropTypes.bool.isRequired,
};

export default Navs;
