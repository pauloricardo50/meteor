import React from 'react';
import cx from 'classnames';

import Button from '../Button';

const ButtonSwitch = ({
  active,
  activeLabel,
  inactiveLabel,
  activeOnClick = () => {},
  inactiveOnClick = () => {},
  reverse = false,
}) => (
  <div className={cx('button-switch', { reverse })}>
    <Button
      onClick={inactiveOnClick}
      className={cx('switch', { active: !active })}
    >
      {inactiveLabel}
    </Button>
    <Button onClick={activeOnClick} className={cx('switch', { active })}>
      {activeLabel}
    </Button>
  </div>
);

export default ButtonSwitch;
