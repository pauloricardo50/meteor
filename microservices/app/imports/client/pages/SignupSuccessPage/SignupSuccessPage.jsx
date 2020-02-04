//      
import React from 'react';

import withMatchParam from 'core/containers/withMatchParam';
import T from 'core/components/Translation';
import AnimatedSuccess from 'core/components/AnimatedSuccess';

                                 

const SignupSuccessPage = ({ email }                        ) => (
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
