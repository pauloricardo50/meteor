// @flow
import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import PropTypes from 'prop-types';

import AutoFormDialogChildren from './AutoFormDialogChildren';
import Button from '../Button';
import CustomSubmitField from './CustomSubmitField';
import T from '../Translation';
import { withState } from 'recompose';

type AutoFormDialogActionsProps = {
  handleClose: Function,
  onSubmit: Function,
  renderAdditionalActions?: boolean,
  disableActions: boolean,
  setDisableActions: Function,
};

const AutoFormDialogActions = (
  {
    handleClose,
    onSubmit,
    renderAdditionalActions,
    disableActions,
    setDisableActions,
  }: AutoFormDialogActionsProps,
  {
    uniforms: {
      state: { submitting },
    },
  },
) => {
  return (
    <DialogActions>
      <AutoFormDialogChildren
        renderFunc={() => (
          <Button onClick={handleClose} disabled={submitting || disableActions}>
            <T id="general.cancel" />
          </Button>
        )}
      />

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
        raised
        primary
        label={<T id="general.ok" />}
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

export default withState('disableActions', 'setDisableActions', false)(
  AutoFormDialogActions,
);
