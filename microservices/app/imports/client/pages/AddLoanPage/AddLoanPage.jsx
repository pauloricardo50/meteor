import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import Button from 'core/components/Button';
import T from 'core/components/Translation';
import { setUserToLoan } from 'core/api';

import './AddLoanPage.scss';

class AddLoanPage extends Component {
  handleYes = () => {
    const {
      match: {
        params: { loanId },
      },
    } = this.props;

    setUserToLoan
      .run({ loanId })
      .then(() => this.props.history.push(`/loans/${loanId}`))
      // Show an error, here data is lost if something went wrong
      .catch(() => this.props.history.push('/'));
  };

  handleNo = () =>
    Meteor.logout(() =>
      this.props.history.push(`/login?path=/add-loan/${this.props.match.params.loanId}`));

  render() {
    const {
      currentUser: { emails },
    } = this.props;

    return (
      <section id="add-loan-page">
        <h3>
          Voulez vous ajouter cette nouvelle demande de prêt au compte{' '}
          {emails[0].address}?
        </h3>
        <div className="buttons">
          <Button raised primary onClick={this.handleYes}>
            <T id="general.yes" />
          </Button>
          <Button raised onClick={this.handleNo}>
            <T id="AddLoanPage.logIntoOtherAccount" />
          </Button>
        </div>
      </section>
    );
  }
}

AddLoanPage.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AddLoanPage;
