import React from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation';

import ClosingItem from './ClosingItem';

// put all valid status at the end
const stepSorter = (a, b) => (a.status === 'valid' ? -1 : 0);

const Content = ({ steps, loanRequest }) => (
  <div className="description flex-col">
    <p style={{ marginBottom: 32 }}>
      <T id="ClosingPage.description" />
    </p>

    {steps
      .sort(stepSorter)
      .map((step, i) => (
        <ClosingItem step={step} loanRequest={loanRequest} key={i} />
      ))}
  </div>
);

Content.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Content;
