import React from 'react';
import cx from 'classnames';

import { toMoney } from '../../utils/conversionFunctions';
import Button from '../Button';
import DialogSimple from '../DialogSimple';
import T, { Money } from '../Translation';
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
  const {
    status,
    errors,
    additionalData: { sum },
  } = checkTranches(tranches, wantedLoan);

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
          <T id="general.cancel" />
        </Button>,
        <Button
          key="save"
          onClick={() => {
            handleSave(tranches);
            handleClose();
          }}
          disabled={disabled || status === 'error'}
        >
          <T id="general.save" />
        </Button>,
      ]}
      label={<T id="TranchePicker.label" />}
      primary
      raised={false}
    >
      <div className="flex-col center">
        <h2>
          <span
            className={cx({
              error: errors.includes('sumIsNotEqualToWantedLoan'),
              success: status === 'ok',
            })}
          >
            {toMoney(sum)}
          </span>
          &nbsp;/&nbsp;<span className="secondary">{toMoney(wantedLoan)}</span>
          &nbsp;
          <small>
            <T defaultMessage="répartis" />
          </small>
        </h2>
        <TranchePicker {...props} wantedLoan={wantedLoan} tranches={tranches} />
        {status === 'error' &&
          (errors.includes('allTypesAreNotDefined') ? (
            <span className="error">
              <T defaultMessage="Une de vos tranches n'est pas définie correctement" />
            </span>
          ) : (
            <span className="error">
              <T
                values={{ wantedLoan: <Money value={wantedLoan} /> }}
                defaultMessage="Vos tranches doivent s'additioner à {wantedLoan}"
              />
            </span>
          ))}
      </div>
    </DialogSimple>
  );
};

export default TranchePickerContainer(TranchePickerDialog);
