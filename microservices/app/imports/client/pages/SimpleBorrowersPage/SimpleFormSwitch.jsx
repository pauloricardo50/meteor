// @flow
import React from 'react';
import cx from 'classnames';

import Button from 'core/components/Button';

type SimpleFormSwitchProps = {
  simpleForm: Boolean,
  setSimpleForm: Function,
};

const SimpleFormSwitch = ({
  simpleForm,
  setSimpleForm,
}: SimpleFormSwitchProps) => (
  <div className="simple-form-switch">
    <Button
      onClick={() => setSimpleForm(true)}
      className={cx('switch', { active: simpleForm })}
    >
      Simple
    </Button>
    <Button
      onClick={() => setSimpleForm(false)}
      className={cx('switch', { active: !simpleForm })}
    >
      Avancé
    </Button>
  </div>
);

export default SimpleFormSwitch;
