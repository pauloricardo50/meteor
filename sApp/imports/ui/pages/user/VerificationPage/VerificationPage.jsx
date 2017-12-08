import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import { isDemo } from '/imports/js/helpers/browserFunctions';
import ProcessPage from '/imports/ui/components/general/ProcessPage';
import track from '/imports/js/helpers/analytics';

import VerificationStart from './VerificationStart';
import VerificationValidated from './VerificationValidated';
import VerificationFailed from './VerificationFailed';

export default class VerificationPage extends Component {
  handleClick = () => {
    if (isDemo()) {
      const object = {};
      object['logic.verification.validated'] = true;
      cleanMethod('updateRequest', object, this.props.loanRequest._id);
    } else {
      cleanMethod(
        'requestVerification',
        null,
        this.props.loanRequest._id,
      ).then(() => track('requested verification', {}));
    }
  };

  render() {
    const { loanRequest } = this.props;
    let content = null;
    const verification = loanRequest.logic.verification;

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
          requestId={loanRequest._id}
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
        <section className="mask1">{content}</section>
      </ProcessPage>
    );
  }
}

VerificationPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
