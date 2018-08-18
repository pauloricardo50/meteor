import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Button from 'core/components/Button';
import Dialog from 'core/components/Material/Dialog';
import T from 'core/components/Translation';
import { loanUpdate } from 'core/api';
import { LOAN_STATUS } from 'core/api/constants';

export default class AcceptClosingModal extends Component {
  constructor(props) {
    super(props);

    const { loan } = props;
    const { status, logic } = loan;
    const openClosingModal = status === LOAN_STATUS.DONE && !logic.acceptedClosing;

    this.state = { open: openClosingModal };
  }

  handleConfirm = (event) => {
    event.preventDefault();
    const {
      loan: { _id: loanId },
    } = this.props;

    loanUpdate
      .run({
        object: { 'logic.acceptedClosing': true },
        loanId,
      })
      .then(() => this.setState({ open: false }));
  };

  render() {
    const { open } = this.state;
    const {
      loan: { _id: loanId },
    } = this.props;
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
        open={open}
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
        <h2 className="text-center">{loanId}</h2>
      </Dialog>
    );
  }
}

AcceptClosingModal.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  open: PropTypes.bool,
};

AcceptClosingModal.defaultProps = {
  open: false,
};
