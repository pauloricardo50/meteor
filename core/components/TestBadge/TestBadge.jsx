import React from 'react';

import colors from '../../config/colors';

const TestBadge = () => (
  <span
    className="status-label ml-8"
    style={{ backgroundColor: colors.warning }}
  >
    Test
  </span>
);

export default TestBadge;
