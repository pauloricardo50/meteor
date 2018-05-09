import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Button from 'core/components/Button';
import { T } from 'core/components/Translation';
import TogglePoint, { TOGGLE_POINTS } from 'core/components/TogglePoint';

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
      <span className="left">
        <WwwTopNavLogo variant={variant} />
        <WwwTopNavLinks variant={variant} />
      </span>
      <span className="right">
        <TogglePoint id={TOGGLE_POINTS.STRIPPED_LITE_VERSION_UI}>
          <Button raised style={{ margin: 8 }}>
            <T id="general.login" />
          </Button>
        </TogglePoint>
      </span>
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
