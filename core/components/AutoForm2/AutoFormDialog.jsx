import React, { Component } from 'react';
// import MuiDialog from '@material-ui/core/Dialog';
// import DialogTitle from '@material-ui/core/DialogTitle';
import pick from 'lodash/pick';
import { compose, withProps, withState } from 'recompose';

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
    'onSubmit',
    'onSuccessMessage',
    'placeholder',
    'schema',
    'showInlineError',
    'disabled',
    'onChangeModel',
    'onSubmitSuccess',
  ]);

export class AutoFormDialog extends Component {
  constructor(props) {
    super(props);
    const { autoFieldProps } = props;

    if (autoFieldProps) {
      this.autoField = makeCustomAutoField(autoFieldProps);
    } else {
      this.autoField = CustomAutoField;
    }
  }

  render() {
    const {
      autoFieldProps,
      buttonProps,
      children,
      description,
      emptyDialog,
      important,
      noButton,
      onSubmit,
      renderAdditionalActions,
      setOpen,
      title,
      triggerComponent,
      disableActions = false,
      layout,
      maxWidth = 'sm',
      onOpen,
      ...otherProps
    } = this.props;
    const schemaKeys = this.props.schema._schemaKeys;

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
          <AutoForm {...getAutoFormProps(this.props)}>
            <AutoFormDialogContent
              autoField={this.autoField}
              description={description}
              emptyDialog={emptyDialog}
              handleClose={handleClose}
              onSubmit={onSubmit}
              layout={layout}
              schemaKeys={schemaKeys}
            >
              {children}
            </AutoFormDialogContent>
            <AutoFormDialogActions
              handleClose={handleClose}
              onSubmit={onSubmit}
              renderAdditionalActions={renderAdditionalActions}
              disableActions={disableActions}
            />
          </AutoForm>
        </MuiDialog>
      </>
    );
  }
}

export default compose(
  withState('open', 'setOpen', ({ openOnMount }) => !!openOnMount),
  withProps(({ onSubmit, setOpen }) => ({
    onSubmit: (...args) => onSubmit(...args).then(() => setOpen(false)),
  })),
)(AutoFormDialog);
