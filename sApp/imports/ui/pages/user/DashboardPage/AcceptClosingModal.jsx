import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import Button from '/imports/ui/components/general/Button';
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
      'updateRequest',
      { 'logic.acceptedClosing': true },
      this.props.loanRequest._id,
      () => {
        this.setState({ open: false });
      },
      {
        title: 'Formidable',
        message: `<h4 class="bert">Profitez bien de ${this.props.loanRequest
          .name}</h4>`,
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
        <h2 className="text-center">{this.props.loanRequest._id}</h2>
      </Dialog>
    );
  }
}

AcceptClosingModal.propTypes = {
  open: PropTypes.bool,
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

AcceptClosingModal.defaultProps = {
  open: false,
};
