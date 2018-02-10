import React from 'react';

import { T } from 'core/components/Translation';

const VerificationRequested = () => (
  <div
    className="animated fadeIn secondary flex center"
    style={{ padding: '40px 0' }}
  >
    <T id="VerificationRequested.description" />
  </div>
);

VerificationRequested.propTypes = {};

export default VerificationRequested;
