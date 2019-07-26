// @flow
import React, { Component } from 'react';
import { compose, withProps, withState } from 'recompose';
import pick from 'lodash/pick';
import MuiDialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '../Button';
import AutoForm from './AutoForm';
import { makeCustomAutoField, CustomAutoField } from './AutoFormComponents';
import AutoFormDialogContent from './AutoFormDialogContent';
import AutoFormDialogActions from './AutoFormDialogActions';

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

export class AutoFormDialog extends Component<AutoFormDialogProps> {
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
      opened,
      renderAdditionalActions,
      setOpen,
      title,
      triggerComponent,
      disableActions = false,
      ...otherProps
    } = this.props;
    const handleOpen = (event) => {
      event.stopPropagation();
      event.preventDefault();
      setOpen(true);
    };
    const handleClose = (event) => {
      event.stopPropagation();
      event.preventDefault();
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
          maxWidth="sm"
          fullWidth
          onClick={(e) => {
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
  withState('open', 'setOpen', false),
  withProps(({ onSubmit, setOpen, onSuccessMessage }) => ({
    onSubmit: (...args) =>
      onSubmit(...args).then(() => {
        setOpen(false);
        import('../../utils/message').then(({ default: message }) => {
          message.success(
            onSuccessMessage
              ? typeof onSuccessMessage === 'function'
                ? onSuccessMessage(...args)
                : onSuccessMessage
              : "C'est dans la boite !",
            5,
          );
        });
      }),
  })),
)(AutoFormDialog);
