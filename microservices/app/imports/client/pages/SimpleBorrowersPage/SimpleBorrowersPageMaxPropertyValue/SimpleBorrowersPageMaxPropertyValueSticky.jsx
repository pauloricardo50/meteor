// @flow
import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';

import DialogSimple from 'core/components/DialogSimple';

type SimpleBorrowersPageMaxPropertyValueStickyProps = {};

const SimpleBorrowersPageMaxPropertyValueSticky = (props: SimpleBorrowersPageMaxPropertyValueStickyProps) => (
  <DialogSimple
    renderTrigger={({ handleOpen }) => (
      <ButtonBase
        focusRipple
        className="simple-borrowers-page-max-property-value-sticky"
        onClick={handleOpen}
      >
        <h2>Calculer</h2>
      </ButtonBase>
    )}
    title="Hello my dude"
  >
    Yooo!
  </DialogSimple>
);

export default SimpleBorrowersPageMaxPropertyValueSticky;
