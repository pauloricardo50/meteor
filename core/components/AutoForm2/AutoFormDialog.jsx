import React, { useMemo } from 'react';
import pick from 'lodash/pick';
import { withState } from 'recompose';

import loadable from '../../utils/loadable';
import Button from '../Button';
import { CustomAutoField, makeCustomAutoField } from './AutoFormComponents';
import AutoFormDialogActions from './AutoFormDialogActions';
import AutoFormDialogContent from './AutoFormDialogContent';

const MuiDialog = loadable({
  loader: () => import('@material-ui/core/Dialog'),
});
const DialogTitle = loadable({
  loader: () => import('@material-ui/core/DialogTitle'),
});
const AutoForm = loadable({
  loader: () => import('./AutoForm'),
});

const getAutoFormProps = props =>
  pick(props, [
    'model',
    'onSuccessMessage',
    'placeholder',
    'schema',
    'showInlineError',
    'disabled',
    'onChangeModel',
    'onSubmitSuccess',
  ]);

export const AutoFormDialog = props => {
  const {
    autoFieldProps,
    buttonProps,
    children,
    description,
    disableActions = false,
    emptyDialog,
    important,
    layout,
    maxWidth = 'sm',
    noButton,
    onDelete,
    onOpen,
    onSubmit,
    renderAdditionalActions,
    setOpen,
    title,
    triggerComponent,
    deleteKeyword,
    ...otherProps
  } = props;
  // Never recompute this because it's really heavy
  const autoField = useMemo(() => {
    if (autoFieldProps) {
      return makeCustomAutoField(autoFieldProps);
    }
    return CustomAutoField;
  }, []);
  const schemaKeys = props.schema?._schemaKeys;

  const handleOpen = event => {
    if (event && event.stopPropagation) {
      event.stopPropagation();
      event.preventDefault();
    }
    setOpen(true);

    if (onOpen) {
      onOpen();
    }
  };
  const handleClose = event => {
    if (event && event.stopPropagation) {
      event.stopPropagation();
      event.preventDefault();
    }
    setOpen(false);
  };

  const wrappedOnSubmit = (...args) =>
    onSubmit(...args).then(() => setOpen(false));

  return (
    <>
      {triggerComponent
        ? triggerComponent(handleOpen)
        : !noButton && <Button {...buttonProps} onClick={handleOpen} />}
      <MuiDialog
        disableBackdropClick={important}
        disableEscapeKeyDown={important}
        onClose={handleClose}
        className="autoform-dialog"
        maxWidth={maxWidth}
        fullWidth
        onClick={e => {
          // Clicking on the dialog should not trigger a table row below it..
          e.stopPropagation();
        }}
        {...otherProps}
      >
        {title && <DialogTitle>{title}</DialogTitle>}
        <AutoForm {...getAutoFormProps(props)} onSubmit={wrappedOnSubmit}>
          <AutoFormDialogContent
            autoField={autoField}
            description={description}
            emptyDialog={emptyDialog}
            handleClose={handleClose}
            onSubmit={wrappedOnSubmit}
            layout={layout}
            schemaKeys={schemaKeys}
          >
            {children}
          </AutoFormDialogContent>
          <AutoFormDialogActions
            handleClose={handleClose}
            onSubmit={wrappedOnSubmit}
            renderAdditionalActions={renderAdditionalActions}
            disableActions={disableActions}
            onDelete={onDelete}
            deleteKeyword={deleteKeyword}
          />
        </AutoForm>
      </MuiDialog>
    </>
  );
};

export default withState(
  'open',
  'setOpen',
  ({ openOnMount }) => !!openOnMount,
)(AutoFormDialog);
