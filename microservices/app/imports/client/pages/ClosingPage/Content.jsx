import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import { CLOSING_STEPS_STATUS } from 'core/api/constants';

import ClosingItem from './ClosingItem';

// put all valid status at the end
const stepSorter = a => (a.status === CLOSING_STEPS_STATUS.VALID ? -1 : 0);

const Content = ({ steps, loan, disabled }) => (
  <div className="description flex-col">
    <p style={{ marginBottom: 32 }}>
      <T id="ClosingPage.description" />
    </p>

    {steps
      .sort(stepSorter)
      .map((step, i) => (
        <ClosingItem step={step} loan={loan} key={i} disabled={disabled} />
      ))}
  </div>
);

Content.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.object).isRequired,
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  disabled: PropTypes.bool,
};

export default Content;
