// @flow
import React from 'react';
import cx from 'classnames';

import ButtonSwitch from 'core/components/ButtonSwitch';
import { loanUpdate } from 'core/api/methods/index';

type SimpleFormSwitchProps = {
  simpleForm: Boolean,
};

const SimpleFormSwitch = ({ simpleForm, loanId }: SimpleFormSwitchProps) => (
  <ButtonSwitch
    active={simpleForm}
    activeLabel="Simple"
    activeOnClick={() =>
      loanUpdate.run({ loanId, object: { simpleBorrowersForm: true } })
    }
    inactiveLabel="Avancé"
    inactiveOnClick={() =>
      loanUpdate.run({ loanId, object: { simpleBorrowersForm: false } })
    }
    reverse
  />
);

export default SimpleFormSwitch;
