// @flow
import React from 'react';

import withMatchParam from 'core/containers/withMatchParam';
import T from 'core/components/Translation';
import AnimatedSuccess from 'core/components/AnimatedSuccess';

type SignupSuccessPageProps = {};

const SignupSuccessPage = ({ email }: SignupSuccessPageProps) => (
  <div className="signup-success">
    <div className="card1 card-top">
      <AnimatedSuccess />

      <h3>
        <T id="SignupSuccessPage.title" values={{ email }} />
      </h3>
      <h4 className="secondary">
        <T id="SignupSuccessPage.description" />
      </h4>
    </div>
  </div>
);

export default withMatchParam('email')(SignupSuccessPage);
