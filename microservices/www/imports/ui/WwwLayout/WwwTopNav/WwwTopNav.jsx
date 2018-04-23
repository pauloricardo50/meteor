import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import Button from 'core/components/Button';
import { T } from 'core/components/Translation';
import TogglePoint, { TOGGLE_POINTS } from 'core/components/TogglePoint';

const VARIANTS = {
  BLUE: 'blue',
  WHITE: 'white',
  TRANSPARENT: 'transparent',
};

const WwwTopNav = ({ variant }) => (
  <nav
    className={classnames({
      'www-top-nav': true,
      [variant]: true,
    })}
  >
    <Link to="/" className="logo">
      <img
        src={
          variant === VARIANTS.BLUE
            ? '/img/logo_white.svg'
            : '/img/logo_black.svg'
        }
        alt="e-Potek"
      />
    </Link>
    <TogglePoint id={TOGGLE_POINTS.LITE_VERSION_OFF}>
      <Button raised style={{ margin: 8 }}>
        <T id="general.login" />
      </Button>
    </TogglePoint>
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
