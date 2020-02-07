import React from 'react';

import ButtonSwitch from 'core/components/ButtonSwitch';
import { loanUpdate } from 'core/api/methods/index';

const SimpleFormSwitch = ({ simpleForm, loanId }) => (
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
