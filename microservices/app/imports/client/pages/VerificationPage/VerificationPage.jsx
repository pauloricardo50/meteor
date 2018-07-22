import PropTypes from 'prop-types';
import React, { Component } from 'react';

import track from 'core/utils/analytics';
import { requestLoanVerification } from 'core/api';
import Page from '../../components/Page';
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
      <Page id="verification">
        <section className="mask1 verification-page">{content}</section>
      </Page>
    );
  }
}

VerificationPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};
