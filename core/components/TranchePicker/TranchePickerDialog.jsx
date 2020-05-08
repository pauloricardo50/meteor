import React from 'react';

import { toMoney } from '../../utils/conversionFunctions';
import Button from '../Button';
import DialogSimple from '../DialogSimple';
import T from '../Translation';
import { TranchePicker } from './TranchePicker';
import TranchePickerContainer from './TranchePickerContainer';
import { checkTranches } from './tranchePickerHelpers';

const TranchePickerDialog = ({
  title,
  tranches,
  handleSave,
  disabled,
  wantedLoan,
  ...props
}) => {
  const tranchesAreValid = checkTranches(tranches, wantedLoan);
  return (
    <DialogSimple
      title={title || <T id="TranchePicker.title" />}
      text={
        <span
          className="description mb-16"
          style={{ maxWidth: '300px', display: 'block' }}
        >
          <T id="TranchePicker.description" />
        </span>
      }
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
          disabled={disabled || !tranchesAreValid}
        >
          Enregistrer
        </Button>,
      ]}
      label="Choisir tranches"
      primary
      raised={false}
    >
      <TranchePicker {...props} wantedLoan={wantedLoan} tranches={tranches} />
      {!tranchesAreValid && (
        <span className="error">
          Vos tranches doivent s'additionner à CHF {toMoney(wantedLoan)}
        </span>
      )}
    </DialogSimple>
  );
};

export default TranchePickerContainer(TranchePickerDialog);
