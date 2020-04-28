import React from 'react';

import Button from '../Button';
import DialogSimple from '../DialogSimple';
import { TranchePicker } from './TranchePicker';
import TranchePickerContainer from './TranchePickerContainer';

const tranchesAreValid = tranches => {
  const sum = tranches.reduce((total, { value }) => total + value, 0);
  // Ensure that values from 0.9995 are rounded to 1, (i.e. in case user wants 3x 33.33%)
  const sumIsOne = Math.round((sum + Number.EPSILON) * 1000) / 1000 === 1;
  const allTypesAreDefined = tranches.every(({ type }) => !!type);

  return sumIsOne && allTypesAreDefined;
};

const TranchePickerDialog = ({
  title,
  tranches,
  handleSave,
  disabled,
  ...props
}) => (
  <DialogSimple
    title={title}
    actions={handleClose => [
      <Button key="cancel" onClick={handleClose}>
        Annuler
      </Button>,
      <Button
        key="save"
        onClick={() => {
          handleSave(tranches);
          handleClose();
        }}
        disabled={disabled || !tranchesAreValid(tranches)}
      >
        Enregistrer
      </Button>,
    ]}
    label="Choisir tranches"
    primary
    raised={false}
  >
    <TranchePicker {...props} tranches={tranches} />
  </DialogSimple>
);

export default TranchePickerContainer(TranchePickerDialog);
