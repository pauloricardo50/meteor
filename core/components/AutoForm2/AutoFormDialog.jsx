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
import AutoForm, { makeCustomAutoField, SubmitField } from './AutoForm';

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
  renderAdditionalActions,
  children,
  ...otherProps
}: AutoFormDialogProps) => {
  const AutoField = makeCustomAutoField(autoFieldProps);

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
            {children
              && children({
                closeDialog: () => setOpen(false),
                submitting,
                onSubmit,
              })}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} disabled={submitting}>
              <T id="general.cancel" />
            </Button>
            {renderAdditionalActions
              && renderAdditionalActions({
                closeDialog: () => setOpen(false),
                submitting,
                onSubmit,
              })}
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
  withState('open', 'setOpen', false),
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
