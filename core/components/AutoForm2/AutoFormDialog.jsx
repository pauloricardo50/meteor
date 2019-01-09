// @flow
import React from 'react';
import { compose, withProps, withState } from 'recompose';
import pick from 'lodash/pick';
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
import { makeCustomAutoField } from './AutoFormComponents';
import CustomAutoFields from './CustomAutoFields';
import CustomSubmitField from './CustomSubmitField';

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

const getAutoFormProps = props =>
  pick(props, [
    'model',
    'schema',
    'onSubmit',
    'placeholder',
    'showInlineError',
  ]);

export const AutoFormDialog = (props: AutoFormDialogProps) => {
  const {
    autoFieldProps,
    buttonProps,
    children,
    description,
    emptyDialog,
    important,
    noButton,
    onSubmit,
    opened,
    renderAdditionalActions,
    setOpen,
    submitting,
    title,
    triggerComponent,
    ...otherProps
  } = props;
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
        maxWidth="md"
        {...otherProps}
      >
        {title && <DialogTitle>{title}</DialogTitle>}
        <AutoForm {...getAutoFormProps(props)}>
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
            <CustomSubmitField
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
