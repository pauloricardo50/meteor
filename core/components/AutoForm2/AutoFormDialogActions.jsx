import React, { useState } from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import PropTypes from 'prop-types';
import { withState } from 'recompose';

import Button from '../Button';
import T from '../Translation';
import AutoFormDialogChildren from './AutoFormDialogChildren';
import CustomSubmitField from './CustomSubmitField';

const enhanceOnDelete = ({
  onDelete,
  setDisableActions,
  handleClose,
  setDeleting,
}) => (...args) => {
  const confirmed = window.confirm('Êtes-vous sûr?');

  if (!confirmed) {
    return;
  }

  setDeleting(true);
  setDisableActions(true);
  return onDelete(...args)
    .then(result => {
      handleClose();
      return result;
    })
    .finally(result => {
      setDisableActions(false);
      setDeleting(false);
      return result;
    });
};

const AutoFormDialogActions = (
  {
    handleClose,
    onSubmit,
    renderAdditionalActions,
    disableActions,
    setDisableActions,
    onDelete,
  },
  {
    uniforms: {
      state: { submitting },
    },
  },
) => {
  const [deleting, setDeleting] = useState(false);
  return (
    <DialogActions>
      <Button onClick={handleClose} disabled={submitting || disableActions}>
        <T id="general.cancel" />
      </Button>

      {onDelete && (
        <Button
          onClick={enhanceOnDelete({
            onDelete,
            setDisableActions,
            handleClose,
            setDeleting,
          })}
          disabled={submitting || disableActions}
          error
          outlined
          loading={deleting}
        >
          <T id="general.remove" />
        </Button>
      )}

      {renderAdditionalActions && (
        <AutoFormDialogChildren
          renderFunc={renderAdditionalActions}
          closeDialog={handleClose}
          onSubmit={onSubmit}
          setDisableActions={setDisableActions}
          disabled={submitting || disableActions}
        />
      )}
      <CustomSubmitField
        setDisableActions={setDisableActions}
        disableActions={disableActions}
      />
    </DialogActions>
  );
};
AutoFormDialogActions.contextTypes = {
  uniforms: PropTypes.shape({
    state: PropTypes.shape({
      submitting: PropTypes.bool.isRequired,
    }).isRequired,
  }),
};

export default withState(
  'disableActions',
  'setDisableActions',
  ({ disableActions }) => !!disableActions,
)(AutoFormDialogActions);
