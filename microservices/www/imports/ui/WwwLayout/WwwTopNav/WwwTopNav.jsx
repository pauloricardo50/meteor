import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import WwwTopNavLinks from './WwwTopNavLinks';
import WwwTopNavLogo from './WwwTopNavLogo';

const VARIANTS = {
  BLUE: 'blue',
  WHITE: 'white',
  TRANSPARENT: 'transparent',
  GREY: 'grey',
};

const WwwTopNav = ({ variant }) => (
  <nav
    className={classnames({
      'www-top-nav': true,
      [variant]: true,
    })}
  >
    <span className="www-top-nav-content">
      <WwwTopNavLogo variant={variant} />
      <WwwTopNavLinks variant={variant} />
    </span>
  </nav>
);

WwwTopNav.propTypes = {
  variant: PropTypes.string,
};

WwwTopNav.defaultProps = {
  variant: VARIANTS.BLUE,
};

export { VARIANTS };
export default WwwTopNav;
