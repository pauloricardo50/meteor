import PropTypes from 'prop-types';
import React, { Component } from 'react';

import ProcessPage from '/imports/ui/components/ProcessPage';
import track from 'core/utils/analytics';
import { requestLoanVerification } from 'core/api';

import VerificationStart from './VerificationStart';
import VerificationValidated from './VerificationValidated';
import VerificationFailed from './VerificationFailed';

export default class VerificationPage extends Component {
  handleClick = () => {
    requestLoanVerification
      .run({ loanId: this.props.loan._id })
      .then(() => track('requested verification'));
  };

  render() {
    const { loan, borrowers } = this.props;
    let content = null;
    const verification = loan.logic.verification;

    if (verification.validated === true) {
      content = <VerificationValidated />;
    } else if (verification.validated === false) {
      content = (
        <VerificationFailed
          verification={verification}
          onClick={this.handleClick}
        />
      );
    } else {
      content = (
        <VerificationStart
          verification={verification}
          loanId={loan._id}
          onClick={this.handleClick}
        />
      );
    }

    return (
      <ProcessPage
        {...this.props}
        stepNb={1}
        id="verification"
        showBottom={false}
      >
        <section className="mask1 verification-page">{content}</section>
      </ProcessPage>
    );
  }
}

VerificationPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};
