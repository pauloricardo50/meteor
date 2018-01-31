import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cleanMethod from 'core/api/cleanMethods';

import Button from 'core/components/Button';
import Dialog from 'core/components/Material/Dialog';

import { T } from 'core/components/Translation';

export default class AcceptClosingModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: this.props.open,
    };
  }

  handleConfirm = (event) => {
    event.preventDefault();

    cleanMethod(
      'updateLoan',
      {
        object: { 'logic.acceptedClosing': true },
        id: this.props.loan._id,
      },
      () => this.setState({ open: false }),
      {
        title: 'Formidable',
        message: `<h4 class="bert">Profitez bien de ${
          this.props.loan.name
        }</h4>`,
      },
    );
  };

  render() {
    const button = (
      <Button
        raised
        label="Fantastique"
        secondary
        onClick={this.handleConfirm}
        autoFocus
      />
    );

    return (
      <Dialog
        title={<T id="AcceptClosingModal.title" />}
        actions={button}
        important
        open={this.state.open}
      >
        <div className="text-center" style={{ marginBottom: 20 }}>
          <span className="fa fa-birthday-cake fa-5x active" />
        </div>
        <p className="secondary">
          <T id="AcceptClosingModal.description" />
        </p>
        <br />
        <p className="secondary">
          <T id="AcceptClosingModal.description2" />
        </p>
        <h2 className="text-center">{this.props.loan._id}</h2>
      </Dialog>
    );
  }
}

AcceptClosingModal.propTypes = {
  open: PropTypes.bool,
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

AcceptClosingModal.defaultProps = {
  open: false,
};
