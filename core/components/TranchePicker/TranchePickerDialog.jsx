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
    error,
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
              error: error === 'sumIsNotEqualToWantedLoan',
              success: status === 'ok',
            })}
          >
            {toMoney(sum)}
          </span>
          &nbsp;/&nbsp;<span className="secondary">{toMoney(wantedLoan)}</span>
          &nbsp;
          <small>
            <T id="general.distributed" />
          </small>
        </h2>
        <TranchePicker {...props} wantedLoan={wantedLoan} tranches={tranches} />
        {status === 'error' &&
          (error === 'sumIsNotEqualToWantedLoan' ? (
            <span className="error">
              <T
                id="TranchePicker.error.sumIsNotEqualToWantedLoan"
                values={{ wantedLoan: <Money value={wantedLoan} /> }}
              />
            </span>
          ) : (
            <span className="error">
              <T id="TranchePicker.error.general" />
            </span>
          ))}
      </div>
    </DialogSimple>
  );
};

export default TranchePickerContainer(TranchePickerDialog);
