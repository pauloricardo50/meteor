// @flow
import React from 'react';
import cx from 'classnames';

import Button from 'core/components/Button';

type ButtonSwitchProps = {
  active: Boolean,
};

const ButtonSwitch = ({
  active,
  activeLabel,
  inactiveLabel,
  activeOnClick = () => {},
  inactiveOnClick = () => {},
  reverse = false,
}: ButtonSwitchProps) => (
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
