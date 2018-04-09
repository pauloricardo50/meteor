import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from '../Button';
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
                <Button onClick={this.handleClose} disabled={submitting}>
                  Cancel
                </Button>
                <Button primary onClick={handleSubmit} disabled={submitting}>
                  OK
                </Button>
              </DialogActions>
            )}
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
};

DialogForm.defaultProps = {
  button: null,
  title: null,
  description: null,
  initialValues: undefined,
};
