import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from '../Button';
import { T } from '../Translation';
import Form from '.';

export default class DialogForm extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleClickOpen = () => this.setState({ open: true });

  handleClose = () => this.setState({ open: false });

  render() {
    const {
      button,
      title,
      description,
      form,
      formArray,
      onSubmit,
      initialValues,
      renderAdditionalActions,
      ...otherProps
    } = this.props;
    const { open } = this.state;

    return (
      <div>
        {React.cloneElement(button, { onClick: this.handleClickOpen })}
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          {title && <DialogTitle id="form-dialog-title">{title}</DialogTitle>}

          {description && (
            <DialogContent>
              <DialogContentText>{description}</DialogContentText>
            </DialogContent>
          )}

          <Form
            showButton={false}
            form={form}
            formArray={formArray}
            onSubmit={onSubmit}
            onSubmitSuccess={this.handleClose}
            initialValues={initialValues}
            FormWrapper={DialogContent}
            renderActions={({ handleSubmit, submitting }) => (
              <DialogActions>
                {renderAdditionalActions &&
                  renderAdditionalActions({ handleClose: this.handleClose })}

                <Button onClick={this.handleClose} disabled={submitting}>
                  <T id="general.cancel" />
                </Button>

                <Button primary onClick={handleSubmit} disabled={submitting}>
                  <T id="general.ok" />
                </Button>
              </DialogActions>
            )}
            {...otherProps}
          />
        </Dialog>
      </div>
    );
  }
}

DialogForm.propTypes = {
  button: PropTypes.node,
  title: PropTypes.node,
  description: PropTypes.node,
  form: PropTypes.string.isRequired,
  formArray: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  renderAdditionalActions: PropTypes.func,
};

DialogForm.defaultProps = {
  button: null,
  title: null,
  description: null,
  initialValues: undefined,
  renderAdditionalActions: undefined,
};
