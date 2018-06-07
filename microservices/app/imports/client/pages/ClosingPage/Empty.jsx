import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';

const Empty = () => (
  <h3 className="secondary text-center" style={{ padding: '40px 16px' }}>
    <T id="ClosingPage.empty" />
  </h3>
);

Empty.propTypes = {};

export default Empty;
