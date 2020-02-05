//
import React from 'react';
import { TranchePicker } from './TranchePicker';
import DialogSimple from '../DialogSimple';
import Button from '../Button';
import TranchePickerContainer from './TranchePickerContainer';

const tranchesAreValid = tranches => {
  const sum = tranches.reduce((total, { value }) => total + value, 0);
  const sumIsOne = sum === 1;
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
