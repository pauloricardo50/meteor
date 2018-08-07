// @flow
import React from 'react';
import { TranchePicker } from './TranchePicker';
import DialogSimple from '../DialogSimple';
import Button from '../Button';
import TranchePickerContainer from './TranchePickerContainer';

type TranchePickerDialogProps = {};

const TranchePickerDialog = ({
  title,
  tranches,
  handleSave,
  ...props
}: TranchePickerDialogProps) => (
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
