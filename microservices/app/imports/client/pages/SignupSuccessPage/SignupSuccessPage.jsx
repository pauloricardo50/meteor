import React from 'react';

import AnimatedSuccess from 'core/components/AnimatedSuccess';
import T from 'core/components/Translation';
import withMatchParam from 'core/containers/withMatchParam';

const SignupSuccessPage = ({ email }) => (
  <div className="signup-success animated fadeIn">
    <div className="card1 card-top">
      <AnimatedSuccess />

      <h3 className="text-center">
        <T id="SignupSuccessPage.title" values={{ email }} />
      </h3>
      <h4 className="text-center secondary">
        <T id="SignupSuccessPage.description" />
      </h4>
    </div>
  </div>
);

export default withMatchParam('email')(SignupSuccessPage);
