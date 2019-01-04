// @flow
import React from 'react';
import { compose, withProps, withState } from 'recompose';
import MuiDialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ErrorsField from 'uniforms-material/ErrorsField';

import message from '../../utils/message';
import T from '../Translation';
import Button from '../Button';
import AutoForm from './AutoForm';
import { makeCustomAutoField, SubmitField } from './AutoFormComponents';
import CustomAutoFields from './CustomAutoFields';

type AutoFormDialogProps = {
  schema: Object,
  model?: Object,
  onSubmit: Function,
  buttonProps: Object,
  setOpen: Function,
  description?: React.Node,
  title?: React.Node,
  important?: Boolean,
  autoFieldProps?: Object,
  submitting: Boolean,
  opened: Boolean,
  renderAdditionalActions?: Function,
  children?: React.Node,
  triggerComponent?: Function,
  emptyDialog?: Boolean,
  noButton?: Boolean,
};

export const AutoFormDialog = ({
  schema,
  model,
  onSubmit,
  buttonProps,
  setOpen,
  description,
  title,
  important,
  autoFieldProps,
  submitting,
  opened,
  renderAdditionalActions,
  children,
  triggerComponent,
  emptyDialog,
  noButton,
  ...otherProps
}: AutoFormDialogProps) => {
  const AutoField = makeCustomAutoField(autoFieldProps);
  const handleOpen = (event) => {
    event.preventDefault();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <>
      {triggerComponent
        ? triggerComponent(handleOpen)
        : !noButton && <Button {...buttonProps} onClick={handleOpen} />}
      <MuiDialog
        disableBackdropClick={important}
        disableEscapeKeyDown={important}
        onClose={() => setOpen(false)}
        className="autoform-dialog"
        {...otherProps}
      >
        {title && <DialogTitle>{title}</DialogTitle>}
        <AutoForm schema={schema} model={model} onSubmit={onSubmit}>
          <DialogContent>
            {description && (
              <DialogContentText>{description}</DialogContentText>
            )}
            {!emptyDialog && <CustomAutoFields autoField={AutoField} />}
            <ErrorsField />
            {children
              && children({
                closeDialog: handleClose,
                submitting,
                onSubmit,
              })}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={submitting}>
              <T id="general.cancel" />
            </Button>
            {renderAdditionalActions
              && renderAdditionalActions({
                closeDialog: handleClose,
                submitting,
                onSubmit,
              })}
            <SubmitField
              loading={submitting}
              raised
              primary
              label={<T id="general.ok" />}
            />
          </DialogActions>
        </AutoForm>
      </MuiDialog>
    </>
  );
};

export default compose(
  withState('open', 'setOpen', false),
  withState('submitting', 'setSubmitting', false),
  withProps(({ onSubmit, setOpen, setSubmitting, onSuccessMessage }) => ({
    onSubmit: (...args) => {
      setSubmitting(true);
      return onSubmit(...args)
        .then(() => {
          setOpen(false);
          message.success(
            onSuccessMessage
              ? typeof onSuccessMessage === 'function'
                ? onSuccessMessage(...args)
                : onSuccessMessage
              : "C'est dans la boite !",
            5,
          );
        })
        .finally(() => setSubmitting(false));
    },
  })),
)(AutoFormDialog);
