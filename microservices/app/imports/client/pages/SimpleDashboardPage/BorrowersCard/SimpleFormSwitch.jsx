import React from 'react';

import { loanUpdate } from 'core/api/loans/methodDefinitions';
import ButtonSwitch from 'core/components/ButtonSwitch';

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
