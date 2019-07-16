// @flow
import React from 'react';
import cx from 'classnames';

import Button from 'core/components/Button';
import { loanUpdate } from 'core/api/methods/index';

type SimpleFormSwitchProps = {
  simpleForm: Boolean,
};

const SimpleFormSwitch = ({ simpleForm, loanId }: SimpleFormSwitchProps) => (
  <div className="simple-form-switch">
    <Button
      onClick={() =>
        loanUpdate.run({ loanId, object: { simpleBorrowersForm: true } })
      }
      className={cx('switch', { active: simpleForm })}
    >
      Simple
    </Button>
    <Button
      onClick={() =>
        loanUpdate.run({ loanId, object: { simpleBorrowersForm: false } })
      }
      className={cx('switch', { active: !simpleForm })}
    >
      Avancé
    </Button>
  </div>
);

export default SimpleFormSwitch;
