import React from 'react';

import T from 'core/components/Translation';

const VerificationValidated = () => (
  <article className="text-center animated fadeIn" style={{ margin: '40px 0' }}>
    <h1 className="success">
      <T id="VerificationPage.successTitle" /> <span className="fa fa-check" />
    </h1>
    <p className="description">
      <T id="VerificationPage.successDescription" />
    </p>
  </article>
);

VerificationValidated.propTypes = {};

export default VerificationValidated;
