import React, { useState } from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import PropTypes from 'prop-types';
import { withState } from 'recompose';

import Button from '../Button';
import T from '../Translation';
import AutoFormDialogChildren from './AutoFormDialogChildren';
import AutoFormDialogDelete from './AutoFormDialogDelete';
import CustomSubmitField from './CustomSubmitField';

const AutoFormDialogActions = (
  {
    handleClose,
    onSubmit,
    renderAdditionalActions,
    disableActions,
    setDisableActions,
    onDelete,
    deleteKeyword,
    noCancel,
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
      {!noCancel && (
        <Button onClick={handleClose} disabled={submitting || disableActions}>
          <T id="general.cancel" />
        </Button>
      )}

      {onDelete && (
        <AutoFormDialogDelete
          disabled={submitting || disableActions}
          handleClose={handleClose}
          loading={deleting}
          onDelete={onDelete}
          toggleDeleting={v => {
            setDeleting(v);
            setDisableActions(v);
          }}
          deleteKeyword={deleteKeyword}
        />
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
        keepLoading
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
