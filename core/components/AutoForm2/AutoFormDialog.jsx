// @flow
import React from 'react';
import { compose, withProps, withState } from 'recompose';
import MuiDialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import message from '../../utils/message';
import T from '../Translation';
import Button from '../Button';
import AutoForm, { CustomAutoField, SubmitField } from './AutoForm';

type AutoFormDialogProps = {};

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
  ...otherProps
}: AutoFormDialogProps) => {
  const AutoField = CustomAutoField(autoFieldProps);

  return (
    <>
      <Button {...buttonProps} onClick={() => setOpen(true)} />
      <MuiDialog
        disableBackdropClick={important}
        disableEscapeKeyDown={important}
        onClose={() => setOpen(false)}
        {...otherProps}
      >
        {title && <DialogTitle>{title}</DialogTitle>}
        <AutoForm schema={schema} model={model} onSubmit={onSubmit}>
          <DialogContent>
            {description && (
              <DialogContentText>{description}</DialogContentText>
            )}
            {schema._schemaKeys.map(key => (
              <AutoField name={key} key={key} />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} disabled={submitting}>
              <T id="general.cancel" />
            </Button>
            <SubmitField loading={submitting} raised primary>
              <T id="general.ok" />
            </SubmitField>
          </DialogActions>
        </AutoForm>
      </MuiDialog>
    </>
  );
};

export default compose(
  withState('open', 'setOpen', ({ open }) => !!open),
  withState('submitting', 'setSubmitting', false),
  withProps(({ onSubmit, setOpen, setSubmitting }) => ({
    onSubmit: (...args) => {
      setSubmitting(true);
      return onSubmit(...args)
        .then(() => {
          setOpen(false);
          message.success("C'est dans la boite !", 2);
        })
        .finally(() => setSubmitting(false));
    },
  })),
)(AutoFormDialog);
